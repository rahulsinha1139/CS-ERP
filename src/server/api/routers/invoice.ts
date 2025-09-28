/**
 * Invoice API Router
 * Handles all invoice-related operations with proper validation and business logic
 */

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// Validation schemas
const createInvoiceSchema = z.object({
  customerId: z.string(),
  issueDate: z.date(),
  dueDate: z.date().optional(),
  lines: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    rate: z.number().positive(),
    gstRate: z.number().min(0).max(100),
    hsnSac: z.string().optional(),
    serviceTemplateId: z.string().optional(),
    isReimbursement: z.boolean().default(false),
  })),
  placeOfSupply: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  filters: z.object({
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED']).optional(),
    customerId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    search: z.string().optional(),
  }).optional(),
}).optional();

// Utility functions
function calculateInvoiceAmounts(lines: any[], customerStateCode?: string, companyStateCode?: string) {
  let subtotal = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  const isInterstate = customerStateCode !== companyStateCode;

  for (const line of lines) {
    const amount = line.quantity * line.rate;
    subtotal += amount;

    const taxAmount = (amount * line.gstRate) / 100;

    if (isInterstate) {
      igstAmount += taxAmount;
    } else {
      cgstAmount += taxAmount / 2;
      sgstAmount += taxAmount / 2;
    }
  }

  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = subtotal + totalTax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstAmount: Math.round(sgstAmount * 100) / 100,
    igstAmount: Math.round(igstAmount * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

function generateInvoiceNumber(prefix = 'INV', year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const timestamp = Date.now();
  return `${prefix}-${currentYear}-${timestamp.toString().slice(-6)}`;
}

export const invoiceRouter = createTRPCRouter({
  // Get all invoices with pagination and filters
  getAll: publicProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page = 1, limit = 20, filters } = input || {};
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {
        companyId: ctx.companyId,
      };

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.customerId) {
        whereClause.customerId = filters.customerId;
      }

      if (filters?.startDate || filters?.endDate) {
        whereClause.issueDate = {};
        if (filters.startDate) {
          whereClause.issueDate.gte = filters.startDate;
        }
        if (filters.endDate) {
          whereClause.issueDate.lte = filters.endDate;
        }
      }

      if (filters?.search) {
        whereClause.OR = [
          { number: { contains: filters.search, mode: 'insensitive' } },
          { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      const [invoices, total] = await Promise.all([
        ctx.db.invoice.findMany({
          where: whereClause,
          include: {
            customer: true,
            lines: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        ctx.db.invoice.count({ where: whereClause }),
      ]);

      return {
        invoices,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          totalPages: Math.ceil(total / limit),
          totalCount: total,
        },
      };
    }),

  // Get invoice by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUnique({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
        include: {
          customer: true,
          company: true,
          lines: {
            include: {
              serviceTemplate: true,
            },
          },
          payments: true,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice not found',
        });
      }

      return invoice;
    }),

  // Create new invoice
  create: publicProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      // Debug logging
      console.log('🔍 Invoice Create Debug:', {
        customerId: input.customerId,
        companyId: ctx.companyId,
        customerIdType: typeof input.customerId,
        companyIdType: typeof ctx.companyId
      });

      // Get customer and company for tax calculations
      const [customer, company] = await Promise.all([
        ctx.db.customer.findUnique({
          where: {
            id: input.customerId,
            companyId: ctx.companyId, // Company scoped security check
          }
        }),
        ctx.db.company.findUnique({ where: { id: ctx.companyId } }),
      ]);

      console.log('🔍 Lookup Results:', {
        customerFound: !!customer,
        companyFound: !!company,
        customerName: customer?.name,
        companyName: company?.name
      });

      if (!customer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }

      if (!company) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Company not found',
        });
      }

      // Calculate amounts
      const amounts = calculateInvoiceAmounts(
        input.lines,
        customer.stateCode || undefined,
        company.stateCode || undefined
      );

      // Generate invoice number
      const invoiceNumber = generateInvoiceNumber('INV', input.issueDate.getFullYear());

      // Generate next invoice ID in simple format (001, 002, 003...)
      const lastInvoice = await ctx.db.invoice.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true }
      });

      const nextIdNumber = lastInvoice
        ? parseInt(lastInvoice.id) + 1
        : 1;
      const nextId = nextIdNumber.toString().padStart(3, '0');

      console.log('🔍 ID Generation Debug:', {
        lastInvoice,
        nextIdNumber,
        nextId,
        nextIdType: typeof nextId
      });

      // Validate ID generation
      if (!nextId || typeof nextId !== 'string' || nextId.trim() === '') {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to generate invoice ID. nextId: ${nextId}`,
        });
      }

      // Create invoice with lines
      const invoice = await ctx.db.invoice.create({
        data: {
          id: nextId,
          number: invoiceNumber,
          customerId: input.customerId,
          companyId: ctx.companyId!,
          issueDate: input.issueDate,
          dueDate: input.dueDate,
          placeOfSupply: input.placeOfSupply,
          notes: input.notes,
          terms: input.terms,
          ...amounts,
          lines: {
            create: input.lines.map(line => ({
              description: line.description,
              quantity: line.quantity,
              rate: line.rate,
              amount: line.quantity * line.rate,
              gstRate: line.gstRate,
              hsnSac: line.hsnSac,
              isReimbursement: line.isReimbursement,
              serviceTemplateId: line.serviceTemplateId,
            })),
          },
        },
        include: {
          customer: true,
          lines: true,
        },
      });

      return invoice;
    }),

  // Get invoice statistics
  getStats: publicProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const whereClause: any = {
        companyId: ctx.companyId,
      };

      if (input?.startDate || input?.endDate) {
        whereClause.issueDate = {};
        if (input.startDate) {
          whereClause.issueDate.gte = input.startDate;
        }
        if (input.endDate) {
          whereClause.issueDate.lte = input.endDate;
        }
      }

      const [
        totalInvoices,
        totalRevenue,
        paidInvoices,
        sentInvoices,
        overdueInvoices,
      ] = await Promise.all([
        ctx.db.invoice.count({ where: whereClause }),
        ctx.db.invoice.aggregate({
          where: whereClause,
          _sum: { grandTotal: true },
        }),
        ctx.db.invoice.count({
          where: { ...whereClause, status: 'PAID' },
        }),
        ctx.db.invoice.count({
          where: { ...whereClause, status: 'SENT' },
        }),
        ctx.db.invoice.count({
          where: { ...whereClause, status: 'OVERDUE' },
        }),
      ]);

      const revenue = totalRevenue._sum.grandTotal || 0;
      const averageInvoiceValue = totalInvoices > 0 ? revenue / totalInvoices : 0;

      return {
        totalInvoices,
        totalRevenue: Math.round(revenue * 100) / 100,
        paidInvoices,
        pendingInvoices: sentInvoices,
        overdueInvoices,
        averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
        outstandingAmount: Math.round(revenue * 100) / 100,
        monthlyRevenue: Math.round(revenue * 100) / 100,
      };
    }),

  // Send invoice
  send: publicProcedure
    .input(z.object({
      id: z.string(),
      generatePdf: z.boolean().default(true),
      sendEmail: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.update({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
        data: {
          status: 'SENT',
        },
        include: {
          customer: true,
          lines: true,
        },
      });

      return {
        invoice,
        pdfGenerated: input.generatePdf,
        emailSent: input.sendEmail && !!invoice.customer.email,
      };
    }),

  // Delete invoice
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.invoice.delete({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
      });

      return { success: true };
    }),

  // Get unpaid invoices
  getUnpaid: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.invoice.findMany({
        where: {
          companyId: ctx.companyId,
          status: { in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] },
        },
        include: {
          customer: true,
        },
        orderBy: { issueDate: 'desc' },
        take: input?.limit || 10,
      });
    }),

  // Get overdue invoices
  getOverdue: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      const now = new Date();

      return await ctx.db.invoice.findMany({
        where: {
          companyId: ctx.companyId,
          status: { in: ['SENT', 'PARTIALLY_PAID'] },
          dueDate: { lt: now },
        },
        include: {
          customer: true,
        },
        orderBy: { dueDate: 'asc' },
        take: input?.limit || 10,
      });
    }),

  // Alias for getAll (for frontend compatibility)
  list: publicProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      // Just call getAll with the same logic
      const { page = 1, limit = 20, filters } = input || {};
      const offset = (page - 1) * limit;

      const whereClause: any = {
        companyId: ctx.companyId,
      };

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.customerId) {
        whereClause.customerId = filters.customerId;
      }

      if (filters?.startDate || filters?.endDate) {
        whereClause.issueDate = {};
        if (filters.startDate) {
          whereClause.issueDate.gte = filters.startDate;
        }
        if (filters.endDate) {
          whereClause.issueDate.lte = filters.endDate;
        }
      }

      if (filters?.search) {
        whereClause.OR = [
          { number: { contains: filters.search, mode: 'insensitive' } },
          { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      const [invoices, total] = await Promise.all([
        ctx.db.invoice.findMany({
          where: whereClause,
          include: {
            customer: true,
            lines: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        ctx.db.invoice.count({ where: whereClause }),
      ]);

      return {
        invoices,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          totalPages: Math.ceil(total / limit),
          totalCount: total,
        },
      };
    }),

  // Get simple invoice list for payment forms
  getPayableInvoices: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      const invoices = await ctx.db.invoice.findMany({
        where: {
          companyId: ctx.companyId,
          status: {
            in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID']
          }
        },
        select: {
          id: true,
          number: true,
          grandTotal: true,
          paidAmount: true,
          issueDate: true,
          dueDate: true,
          customer: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: { issueDate: 'desc' },
        take: 100, // Reasonable limit for dropdown
      });

      return invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.number,
        customer: invoice.customer,
        totalAmount: invoice.grandTotal,
        paidAmount: invoice.paidAmount || 0,
        remainingAmount: invoice.grandTotal - (invoice.paidAmount || 0),
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      }));
    }),
});
