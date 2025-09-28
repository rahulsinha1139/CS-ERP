/**
 * Customer API Router - Enhanced Version
 * Comprehensive customer management with invoice/payment aggregation
 * Priority: Client requirement for linked invoices and payment status
 */

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

// Validation schemas
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'totalBilled']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().optional(),
  stateCode: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  creditDays: z.number().min(0).optional(),
  whatsappNumber: z.string().optional(),
  preferredLanguage: z.string().default('en'),
  timezone: z.string().default('Asia/Kolkata'),
});

// Utility functions for financial calculations
function calculatePaymentStatus(grandTotal: number, paidAmount: number) {
  if (paidAmount >= grandTotal) {
    return 'PAID';
  } else if (paidAmount > 0) {
    return 'PARTIALLY_PAID';
  } else {
    return 'UNPAID';
  }
}

function calculateOutstandingAmount(grandTotal: number, paidAmount: number) {
  return Math.max(0, grandTotal - paidAmount);
}

export const customerRouter = createTRPCRouter({
  // Get all customers with financial summary
  getAll: publicProcedure
    .input(paginationSchema.optional())
    .query(async ({ ctx, input = {} }) => {
      const { page, limit, search, sortBy, sortOrder } = input;
      const offset = ((page || 1) - 1) * (limit || 20);

      // Build where clause for search
      const whereClause: any = {
        companyId: ctx.companyId,
      };

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { gstin: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Build order by clause
      let orderBy: any;
      if (sortBy === 'totalBilled') {
        // This will need aggregation, handle separately
        orderBy = { createdAt: sortOrder };
      } else {
        const validFields = ['name', 'email', 'createdAt'] as const;
        type ValidField = (typeof validFields)[number];
        const field = validFields.includes(sortBy as ValidField) ? sortBy as ValidField : 'createdAt';
        orderBy = { [field]: sortOrder };
      }

      // Optimized for Mrs. Pradhan's practice: Use aggregation queries instead of fetching all data
      const [customers, totalCount] = await Promise.all([
        ctx.db.customer.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            gstin: true,
            stateCode: true,
            creditLimit: true,
            creditDays: true,
            whatsappNumber: true,
            preferredLanguage: true,
            timezone: true,
            createdAt: true,
            updatedAt: true,
            companyId: true,
          },
          orderBy,
          skip: offset,
          take: limit || 20,
        }),
        ctx.db.customer.count({ where: whereClause }),
      ]);

      // Get financial summaries with optimized aggregation queries
      const customerIds = customers.map(c => c.id);

      const [invoiceAggregates, paymentTotals, overdueCounts] = await Promise.all([
        // Aggregate invoice data
        ctx.db.invoice.groupBy({
          by: ['customerId'],
          where: { customerId: { in: customerIds } },
          _sum: {
            grandTotal: true,
            paidAmount: true,
          },
          _count: {
            id: true,
          },
        }),

        // Aggregate payment data (direct payments, not through invoices)
        ctx.db.payment.groupBy({
          by: ['customerId'],
          where: { customerId: { in: customerIds } },
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
        }),

        // Count overdue invoices - simplified approach for Mrs. Pradhan's practice
        customerIds.length > 0 ?
          ctx.db.invoice.findMany({
            where: {
              customerId: { in: customerIds },
              dueDate: { lt: new Date() },
              status: { not: 'PAID' },
            },
            select: {
              customerId: true,
            },
          }) : [],
      ]);

      // Create lookup maps for efficient data joining
      const invoiceMap = new Map(invoiceAggregates.map(agg => [
        agg.customerId,
        {
          totalBilled: agg._sum.grandTotal || 0,
          totalPaidViaInvoices: agg._sum.paidAmount || 0,
          totalInvoices: agg._count.id || 0,
        }
      ]));

      const paymentMap = new Map(paymentTotals.map(agg => [
        agg.customerId,
        {
          totalDirectPayments: agg._sum.amount || 0,
          totalPayments: agg._count.id || 0,
        }
      ]));

      // Create overdue count map from invoice list
      const overdueMap = new Map<string, number>();
      overdueCounts.forEach(invoice => {
        const current = overdueMap.get(invoice.customerId) || 0;
        overdueMap.set(invoice.customerId, current + 1);
      });

      // Enhance customers with optimized financial summaries
      const enhancedCustomers = customers.map((customer) => {
        const invoiceData = invoiceMap.get(customer.id) || { totalBilled: 0, totalPaidViaInvoices: 0, totalInvoices: 0 };
        const paymentData = paymentMap.get(customer.id) || { totalDirectPayments: 0, totalPayments: 0 };
        const overdueCount = overdueMap.get(customer.id) || 0;

        const totalBilled = invoiceData.totalBilled;
        const totalPaid = invoiceData.totalPaidViaInvoices + paymentData.totalDirectPayments;
        const totalOutstanding = Math.max(0, totalBilled - totalPaid);

        return {
          ...customer,
          financialSummary: {
            totalInvoices: invoiceData.totalInvoices,
            totalPayments: paymentData.totalPayments,
            totalBilled: Math.round(totalBilled * 100) / 100,
            totalPaid: Math.round(totalPaid * 100) / 100,
            totalOutstanding: Math.round(totalOutstanding * 100) / 100,
            paidInvoices: Math.max(0, invoiceData.totalInvoices - overdueCount),
            pendingInvoices: overdueCount,
            overdueInvoices: overdueCount,
            // Note: Last payment date would require additional query - optimize later if needed
            lastPaymentDate: null,
          },
        };
      });

      return {
        customers: enhancedCustomers,
        pagination: {
          total: totalCount,
          page: page || 1,
          pages: Math.ceil(totalCount / (limit || 20)),
          totalPages: Math.ceil(totalCount / (limit || 20)),
          totalCount,
        },
      };
    }),

  // Get customer by ID with complete financial dashboard
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
        include: {
          invoices: {
            include: {
              payments: {
                orderBy: { paymentDate: 'desc' },
              },
              lines: true,
            },
            orderBy: { issueDate: 'desc' },
          },
          payments: {
            include: {
              invoice: {
                select: {
                  number: true,
                  issueDate: true,
                },
              },
            },
            orderBy: { paymentDate: 'desc' },
          },
          recurringContracts: {
            where: { status: 'ACTIVE' },
          },
          complianceItems: {
            where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
            orderBy: { dueDate: 'asc' },
          },
          _count: {
            select: {
              invoices: true,
              payments: true,
              documents: true,
            },
          },
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }

      // Calculate comprehensive financial metrics
      const invoicesWithStatus = customer.invoices.map((invoice) => {
        const paymentStatus = calculatePaymentStatus(invoice.grandTotal, invoice.paidAmount);
        const outstandingAmount = calculateOutstandingAmount(invoice.grandTotal, invoice.paidAmount);
        const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && outstandingAmount > 0;

        return {
          ...invoice,
          paymentStatus,
          outstandingAmount: Math.round(outstandingAmount * 100) / 100,
          isOverdue: !!isOverdue,
          daysPastDue: isOverdue
            ? Math.floor((new Date().getTime() - new Date(invoice.dueDate!).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
        };
      });

      const totalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
      const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const totalOutstanding = totalBilled - totalPaid;

      const paidInvoices = invoicesWithStatus.filter(inv => inv.paymentStatus === 'PAID').length;
      const partiallyPaidInvoices = invoicesWithStatus.filter(inv => inv.paymentStatus === 'PARTIALLY_PAID').length;
      const unpaidInvoices = invoicesWithStatus.filter(inv => inv.paymentStatus === 'UNPAID').length;
      const overdueInvoices = invoicesWithStatus.filter(inv => inv.isOverdue).length;

      // Payment history timeline
      const paymentHistory = customer.payments.map((payment) => ({
        ...payment,
        type: 'PAYMENT' as const,
        date: payment.paymentDate,
        description: `Payment for Invoice ${payment.invoice.number}`,
      }));

      const invoiceHistory = customer.invoices.map((invoice) => ({
        id: invoice.id,
        type: 'INVOICE' as const,
        date: invoice.issueDate,
        amount: invoice.grandTotal,
        description: `Invoice ${invoice.number} created`,
        status: invoice.status,
      }));

      const timeline = [...paymentHistory, ...invoiceHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20); // Last 20 activities

      return {
        ...customer,
        invoices: invoicesWithStatus,
        financialSummary: {
          totalInvoices: customer._count.invoices,
          totalBilled: Math.round(totalBilled * 100) / 100,
          totalPaid: Math.round(totalPaid * 100) / 100,
          totalOutstanding: Math.round(totalOutstanding * 100) / 100,
          paidInvoices,
          partiallyPaidInvoices,
          unpaidInvoices,
          overdueInvoices,
          averageInvoiceValue: customer._count.invoices > 0
            ? Math.round((totalBilled / customer._count.invoices) * 100) / 100
            : 0,
          paymentRate: totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 10000) / 100 : 0,
          lastPaymentDate: customer.payments[0]?.paymentDate,
          lastInvoiceDate: customer.invoices[0]?.issueDate,
        },
        timeline,
      };
    }),

  // Get customer invoices with payment status
  getInvoices: publicProcedure
    .input(z.object({
      customerId: z.string(),
      status: z.enum(['ALL', 'PAID', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID']).default('ALL'),
    }))
    .query(async ({ ctx, input }) => {
      let whereClause: any = {
        customerId: input.customerId,
        companyId: ctx.companyId,
      };

      const invoices = await ctx.db.invoice.findMany({
        where: whereClause,
        include: {
          payments: {
            orderBy: { paymentDate: 'desc' },
          },
          lines: true,
        },
        orderBy: { issueDate: 'desc' },
      });

      // Add payment status and outstanding calculations
      const enhancedInvoices = invoices
        .map((invoice) => {
          const paymentStatus = calculatePaymentStatus(invoice.grandTotal, invoice.paidAmount);
          const outstandingAmount = calculateOutstandingAmount(invoice.grandTotal, invoice.paidAmount);
          const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && outstandingAmount > 0;

          return {
            ...invoice,
            paymentStatus,
            outstandingAmount: Math.round(outstandingAmount * 100) / 100,
            isOverdue: !!isOverdue,
            daysPastDue: isOverdue
              ? Math.floor((new Date().getTime() - new Date(invoice.dueDate!).getTime()) / (1000 * 60 * 60 * 24))
              : 0,
          };
        })
        .filter((invoice) => {
          // Apply status filter after enhancement
          if (input.status === 'ALL') return true;
          if (input.status === 'OVERDUE') return invoice.isOverdue;
          return invoice.paymentStatus === input.status;
        });

      return enhancedInvoices;
    }),

  // Get simple customer list for forms/dropdowns
  getList: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      console.log('🔍 Customer.getList Debug:', {
        companyId: ctx.companyId,
        companyIdType: typeof ctx.companyId
      });

      const customers = await ctx.db.customer.findMany({
        where: { companyId: ctx.companyId },
        select: {
          id: true,
          name: true,
          email: true,
          gstin: true,
          stateCode: true,
        },
        orderBy: { name: 'asc' },
      });

      console.log('🔍 Customer.getList Results:', {
        count: customers.length,
        customers: customers.map(c => ({ id: c.id, name: c.name }))
      });

      return customers;
    }),

  // Create new customer
  create: publicProcedure
    .input(createCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.create({
        data: {
          ...input,
          companyId: ctx.companyId!,
        },
      });

      return customer;
    }),

  // Update customer
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: createCustomerSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.update({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
        data: input.data,
      });

      return customer;
    }),

  // Get top customers by revenue
  getTopCustomers: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      period: z.enum(['7d', '30d', '90d', '1y', 'all']).default('all'),
    }))
    .query(async ({ ctx, input }) => {
      let dateFilter: any = {};
      const now = new Date();

      switch (input.period) {
        case '7d':
          dateFilter.issueDate = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
          break;
        case '30d':
          dateFilter.issueDate = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case '90d':
          dateFilter.issueDate = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
          break;
        case '1y':
          dateFilter.issueDate = { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
          break;
      }

      const customers = await ctx.db.customer.findMany({
        where: {
          companyId: ctx.companyId,
          invoices: {
            some: dateFilter,
          },
        },
        include: {
          invoices: {
            where: dateFilter,
            select: {
              grandTotal: true,
              paidAmount: true,
            },
          },
        },
      });

      // Calculate revenue and sort
      const customersWithRevenue = customers
        .map((customer) => {
          const totalRevenue = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
          const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

          return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalPaid: Math.round(totalPaid * 100) / 100,
            totalOutstanding: Math.round((totalRevenue - totalPaid) * 100) / 100,
            invoiceCount: customer.invoices.length,
          };
        })
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, input.limit);

      return customersWithRevenue;
    }),
});
