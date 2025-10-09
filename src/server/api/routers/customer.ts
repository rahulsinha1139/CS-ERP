/**
 * Customer API Router - Enhanced Version
 * Comprehensive customer management with invoice/payment aggregation
 * Priority: Client requirement for linked invoices and payment status
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import { idGenerator } from '@/lib/id-generator';

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
  // Comprehensive CS Practice Fields
  pan: z.string().optional(),
  cin: z.string().optional(),
  din: z.string().optional(),
  incorporationDate: z.date().optional(),
  industry: z.string().optional(),
  contactPerson: z.string().optional(),
  designation: z.string().optional(),
  companyType: z.string().optional(),
  registeredOffice: z.string().optional(),
  website: z.string().optional(),
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
  // Get all customers with financial summary - OPTIMIZED VERSION
  getAll: protectedProcedure // Apply security
    .input(paginationSchema.optional())
    .query(async ({ ctx, input = {} }) => {
      const { page = 1, limit = 20, search, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      const whereClause: Prisma.CustomerWhereInput = { companyId: ctx.companyId };
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Fetch aggregated data and total count in parallel
      const [customers, totalCount] = await ctx.db.$transaction([
        ctx.db.customer.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            createdAt: true,
            _count: {
              select: { invoices: true },
            },
            invoices: {
              select: {
                grandTotal: true,
                paidAmount: true,
                status: true,
                dueDate: true,
              },
            },
          },
          orderBy: { [sortBy || 'name']: sortOrder || 'asc' },
          skip: offset,
          take: limit,
        }),
        ctx.db.customer.count({ where: whereClause }),
      ]);

      // Process the aggregated data
      const enhancedCustomers = customers.map((customer) => {
        const totalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const overdueInvoices = customer.invoices.filter(
          (inv) => inv.dueDate && new Date(inv.dueDate) < new Date() && inv.status !== 'PAID'
        ).length;

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          createdAt: customer.createdAt,
          financialSummary: {
            totalInvoices: customer._count.invoices,
            totalBilled,
            totalPaid,
            totalOutstanding: totalBilled - totalPaid,
            overdueInvoices,
          },
        };
      });

      return {
        customers: enhancedCustomers,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
        },
      };
    }),

  // Get customer by ID with complete financial dashboard
  getById: protectedProcedure
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
  getInvoices: protectedProcedure
    .input(z.object({
      customerId: z.string(),
      status: z.enum(['ALL', 'PAID', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID']).default('ALL'),
    }))
    .query(async ({ ctx, input }) => {
      const whereClause: Prisma.InvoiceWhereInput = {
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
  getList: protectedProcedure
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
  create: protectedProcedure
    .input(createCustomerSchema)
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.create({
        data: {
          id: idGenerator.customer(), // ✅ UUID v4 - No race conditions
          ...input,
          companyId: ctx.companyId!,
        },
      });

      return customer;
    }),

  // Update customer
  update: protectedProcedure
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
  getTopCustomers: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      period: z.enum(['7d', '30d', '90d', '1y', 'all']).default('all'),
    }))
    .query(async ({ ctx, input }) => {
      const dateFilter: Prisma.InvoiceWhereInput = {};
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

  // HIGH-PERFORMANCE: Get all customers with server-side calculated summaries only
  getAllWithSummary: protectedProcedure
    .input(paginationSchema.optional())
    .query(async ({ ctx, input = {} }) => {
      const { page = 1, limit = 20, search, sortBy, sortOrder } = input;
      const offset = (page - 1) * limit;

      const whereClause: Prisma.CustomerWhereInput = { companyId: ctx.companyId };
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      // PERFORMANCE OPTIMIZATION: Use aggregation queries instead of fetching full data
      const [customers, totalCount] = await ctx.db.$transaction([
        // Fetch only customer details with aggregated invoice data
        ctx.db.customer.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            gstin: true,
            createdAt: true,
            // Server-side aggregation for performance
            _count: { select: { invoices: true } },
            invoices: {
              select: {
                grandTotal: true,
                paidAmount: true,
                status: true,
                dueDate: true,
                issueDate: true,
              },
            },
          },
          orderBy: { [sortBy || 'name']: sortOrder || 'asc' },
          skip: offset,
          take: limit,
        }),
        ctx.db.customer.count({ where: whereClause }),
      ]);

      // SERVER-SIDE CALCULATION: Process all financial metrics in memory
      const optimizedCustomers = customers.map((customer) => {
        // Calculate all metrics server-side to minimize data transfer
        const totalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        const totalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        const totalOutstanding = totalBilled - totalPaid;

        // Advanced calculations
        const paidInvoices = customer.invoices.filter(inv => inv.paidAmount >= inv.grandTotal).length;
        const partiallyPaidInvoices = customer.invoices.filter(
          inv => inv.paidAmount > 0 && inv.paidAmount < inv.grandTotal
        ).length;
        const unpaidInvoices = customer.invoices.filter(inv => inv.paidAmount === 0).length;

        // Overdue calculation
        const overdueInvoices = customer.invoices.filter(inv =>
          inv.dueDate &&
          new Date(inv.dueDate) < new Date() &&
          inv.paidAmount < inv.grandTotal
        ).length;

        // Performance metrics
        const paymentRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;
        const averageInvoiceValue = customer._count.invoices > 0 ? totalBilled / customer._count.invoices : 0;

        // Recent activity
        const recentInvoices = customer.invoices
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, 3);

        const lastInvoiceDate = recentInvoices[0]?.issueDate;
        const hasRecentActivity = lastInvoiceDate &&
          (new Date().getTime() - new Date(lastInvoiceDate).getTime()) < (30 * 24 * 60 * 60 * 1000); // 30 days

        // CRITICAL: Return only customer details + calculated summary object
        // NO invoice arrays sent to client for performance
        return {
          // Core customer data
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          gstin: customer.gstin,
          createdAt: customer.createdAt,

          // Pre-calculated financial summary (replaces invoice arrays)
          summary: {
            // Basic metrics
            totalInvoices: customer._count.invoices,
            totalBilled: Math.round(totalBilled * 100) / 100,
            totalPaid: Math.round(totalPaid * 100) / 100,
            totalOutstanding: Math.round(totalOutstanding * 100) / 100,

            // Status breakdown
            paidInvoices,
            partiallyPaidInvoices,
            unpaidInvoices,
            overdueInvoices,

            // Performance indicators
            paymentRate: Math.round(paymentRate * 100) / 100,
            averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,

            // Activity indicators
            lastInvoiceDate,
            hasRecentActivity,

            // Risk assessment
            riskLevel: overdueInvoices > 2 ? 'HIGH' :
                      totalOutstanding > averageInvoiceValue * 2 ? 'MEDIUM' : 'LOW',
          },
        };
      });

      return {
        customers: optimizedCustomers,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
        },
      };
    }),
});
