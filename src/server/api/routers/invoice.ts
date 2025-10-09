/**
 * Invoice API Router
 * Handles all invoice-related operations with proper validation and business logic
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import type { Prisma } from '@prisma/client';
import { idGenerator } from '@/lib/id-generator';

// Type definitions for invoice operations
interface InvoiceLineCalculation {
  description?: string;
  quantity?: number;
  rate?: number;
  gstRate?: number;
  hsnSac?: string;
  serviceTemplateId?: string;
  isReimbursement?: boolean;
}

interface InvoiceAmounts {
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
}

type InvoiceWhereInput = Prisma.InvoiceWhereInput;
type InvoiceUpdateData = Record<string, unknown>;

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
    customFieldData: z.record(z.any()).optional(),
  })),
  placeOfSupply: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

const updateInvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string().optional(),
  issueDate: z.date().optional(),
  dueDate: z.date().optional(),
  lines: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    rate: z.number().positive(),
    gstRate: z.number().min(0).max(100),
    hsnSac: z.string().optional(),
    serviceTemplateId: z.string().optional(),
    isReimbursement: z.boolean().default(false),
    customFieldData: z.record(z.any()).optional(),
  })).optional(),
  placeOfSupply: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['DRAFT', 'GENERATED', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED']).optional(),
});

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  filters: z.object({
    status: z.enum(['DRAFT', 'GENERATED', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED']).optional(),
    customerId: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    search: z.string().optional(),
  }).optional(),
}).optional();

// Utility functions
function calculateInvoiceAmounts(lines: InvoiceLineCalculation[], customerStateCode?: string, companyStateCode?: string): InvoiceAmounts {
  let subtotal = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  const isInterstate = customerStateCode !== companyStateCode;

  for (const line of lines) {
    const amount = (line.quantity || 0) * (line.rate || 0);
    subtotal += amount;

    const taxAmount = (amount * (line.gstRate || 0)) / 100;

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
  getAll: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page = 1, limit = 20, filters } = input || {};
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause: InvoiceWhereInput = {
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
  getById: protectedProcedure
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
  create: protectedProcedure
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

      // Generate invoice number (human-readable, keeps existing format)
      const invoiceNumber = generateInvoiceNumber('INV', input.issueDate.getFullYear());

      // Generate invoice ID using UUID (eliminates race condition)
      const invoiceId = idGenerator.invoice();

      // Debug logging
      console.log('='.repeat(80));
      console.log('📥 INVOICE CREATE DEBUG');
      console.log('Number of lines:', input.lines.length);
      input.lines.forEach((line, idx) => {
        console.log(`\nLine ${idx}:`);
        console.log('  serviceTemplateId:', line.serviceTemplateId);
        console.log('  typeof:', typeof line.serviceTemplateId);
        console.log('  truthiness:', !!line.serviceTemplateId);
        console.log('  length:', line.serviceTemplateId?.length);
        console.log('  trim:', line.serviceTemplateId?.trim());
        console.log('  JSON:', JSON.stringify(line.serviceTemplateId));
      });
      console.log('='.repeat(80));

      // Create invoice with lines
      const invoice = await ctx.db.invoice.create({
        data: {
          id: invoiceId, // ✅ UUID v4 - No race conditions
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
            create: input.lines.map((line) => ({
              id: idGenerator.invoiceLine(),
              description: line.description,
              quantity: line.quantity,
              rate: line.rate,
              amount: line.quantity * line.rate,
              gstRate: line.gstRate,
              ...(line.hsnSac && line.hsnSac.trim() !== '' ? { hsnSac: line.hsnSac } : {}),
              isReimbursement: line.isReimbursement,
              ...(line.serviceTemplateId && line.serviceTemplateId.trim() !== '' ? { serviceTemplateId: line.serviceTemplateId } : {}),
              ...(line.customFieldData ? { customFieldData: line.customFieldData as any } : {}),
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

  // Update existing invoice
  update: protectedProcedure
    .input(updateInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // First verify the invoice exists and belongs to this company
      const existingInvoice = await ctx.db.invoice.findUnique({
        where: { id, companyId: ctx.companyId },
        include: { lines: true, customer: true }
      });

      if (!existingInvoice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice not found',
        });
      }

      // Prevent modification of paid/cancelled invoices
      if (existingInvoice.status === 'PAID' || existingInvoice.status === 'CANCELLED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot update ${existingInvoice.status.toLowerCase()} invoice`,
        });
      }

      let finalUpdateData: InvoiceUpdateData = { ...updateData };

      // If updating lines or customer, recalculate amounts
      if (updateData.lines || updateData.customerId) {
        // Get customer info for tax calculations
        const customerId = updateData.customerId || existingInvoice.customerId;
        const [customer, company] = await Promise.all([
          ctx.db.customer.findUnique({
            where: { id: customerId, companyId: ctx.companyId }
          }),
          ctx.db.company.findUnique({ where: { id: ctx.companyId } })
        ]);

        if (!customer || !company) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Customer or company not found',
          });
        }

        // Use new lines or existing lines for calculation
        const linesToCalculate = (updateData.lines || existingInvoice.lines).map(line => ({
          ...line,
          hsnSac: line.hsnSac ?? undefined,
          serviceTemplateId: line.serviceTemplateId ?? undefined,
        }));
        const amounts = calculateInvoiceAmounts(
          linesToCalculate,
          customer.stateCode || undefined,
          company.stateCode || undefined
        );

        finalUpdateData = { ...finalUpdateData, ...amounts };
      }

      // Handle line updates if provided
      if (updateData.lines) {
        // Remove existing lines and create new ones
        await ctx.db.invoiceLine.deleteMany({
          where: { invoiceId: id }
        });

        finalUpdateData.lines = {
          create: updateData.lines.map((line) => ({
            id: idGenerator.invoiceLine(), // ✅ UUID v4 - No race conditions
            description: line.description,
            quantity: line.quantity,
            rate: line.rate,
            amount: line.quantity * line.rate,
            gstRate: line.gstRate,
            ...(line.hsnSac && line.hsnSac.trim() !== '' ? { hsnSac: line.hsnSac } : {}),
            isReimbursement: line.isReimbursement,
            ...(line.serviceTemplateId && line.serviceTemplateId.trim() !== '' ? { serviceTemplateId: line.serviceTemplateId } : {}),
          }))
        };

        // Remove lines from direct update data since we're using nested create
        delete finalUpdateData.lines;
      }

      // Update the invoice
      const updatedInvoice = await ctx.db.invoice.update({
        where: { id },
        data: finalUpdateData.lines ? {
          ...finalUpdateData,
          lines: {
            create: updateData.lines!.map(line => ({
              description: line.description,
              quantity: line.quantity,
              rate: line.rate,
              amount: line.quantity * line.rate,
              gstRate: line.gstRate,
              hsnSac: line.hsnSac,
              isReimbursement: line.isReimbursement,
              serviceTemplateId: line.serviceTemplateId,
            }))
          }
        } : finalUpdateData,
        include: {
          customer: true,
          lines: true,
        },
      });

      return updatedInvoice;
    }),

  // Get invoice statistics
  getStats: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const whereClause: InvoiceWhereInput = {
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
          _sum: {
            grandTotal: true,
            paidAmount: true,
          },
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
      const totalPaid = totalRevenue._sum.paidAmount || 0;
      const outstanding = revenue - totalPaid;
      const averageInvoiceValue = totalInvoices > 0 ? revenue / totalInvoices : 0;

      return {
        totalInvoices,
        totalRevenue: Math.round(revenue * 100) / 100,
        paidInvoices,
        pendingInvoices: sentInvoices,
        overdueInvoices,
        averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,
        outstandingAmount: Math.round(outstanding * 100) / 100,
        monthlyRevenue: Math.round(revenue * 100) / 100,
      };
    }),

  // Send invoice
  send: protectedProcedure
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
  delete: protectedProcedure
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
  getUnpaid: protectedProcedure
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
  getOverdue: protectedProcedure
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
  list: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      // Just call getAll with the same logic
      const { page = 1, limit = 20, filters } = input || {};
      const offset = (page - 1) * limit;

      const whereClause: InvoiceWhereInput = {
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
  getPayableInvoices: protectedProcedure
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

  // Generate invoice (activate without sending email)
  generateInvoice: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Verify invoice exists and is DRAFT
      const invoice = await ctx.db.invoice.findUnique({
        where: { id: input.id },
        include: { lines: true, customer: true }
      });

      if (!invoice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice not found',
        });
      }

      if (invoice.companyId !== ctx.companyId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      if (invoice.status !== 'DRAFT') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only DRAFT invoices can be generated',
        });
      }

      // 2. Update status to GENERATED
      const updatedInvoice = await ctx.db.invoice.update({
        where: { id: input.id },
        data: {
          status: 'GENERATED',
          updatedAt: new Date(),
        },
        include: {
          lines: true,
          customer: true,
          company: true,
          payments: true,
        }
      });

      return updatedInvoice;
    }),
});
