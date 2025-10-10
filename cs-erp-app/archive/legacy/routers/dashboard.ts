/**
 * Dashboard tRPC Router
 * Handles main dashboard metrics and analytics
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = createTRPCRouter({
  /**
   * Get dashboard metrics - overview of business performance
   */
  getMetrics: publicProcedure
    .input(z.object({
      dateRange: z.enum(['thisWeek', 'thisMonth', 'thisQuarter', 'thisYear']).default('thisMonth'),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      const now = new Date();
      let startDate: Date;

      // Calculate date range
      switch (input?.dateRange || 'thisMonth') {
        case 'thisWeek':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'thisQuarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      // Get comprehensive business metrics
      const [
        totalRevenue,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalCustomers,
        totalPayments,
        totalCompliances,
        pendingCompliances,
        overdueCompliances,
      ] = await Promise.all([
        // Revenue metrics
        ctx.db.invoice.aggregate({
          where: {
            companyId: ctx.companyId,
            issueDate: { gte: startDate },
          },
          _sum: { grandTotal: true },
        }),

        // Invoice metrics
        ctx.db.invoice.count({
          where: {
            companyId: ctx.companyId,
            issueDate: { gte: startDate },
          },
        }),
        ctx.db.invoice.count({
          where: {
            companyId: ctx.companyId,
            status: 'PAID',
            issueDate: { gte: startDate },
          },
        }),
        ctx.db.invoice.count({
          where: {
            companyId: ctx.companyId,
            status: { in: ['SENT', 'PARTIALLY_PAID'] },
            issueDate: { gte: startDate },
          },
        }),
        ctx.db.invoice.count({
          where: {
            companyId: ctx.companyId,
            status: 'OVERDUE',
            issueDate: { gte: startDate },
          },
        }),

        // Customer metrics
        ctx.db.customer.count({
          where: {
            companyId: ctx.companyId,
            createdAt: { gte: startDate },
          },
        }),

        // Payment metrics
        ctx.db.payment.aggregate({
          where: {
            companyId: ctx.companyId,
            paymentDate: { gte: startDate },
          },
          _sum: { amount: true },
        }),

        // Compliance metrics
        ctx.db.complianceItem.count({
          where: {
            companyId: ctx.companyId,
            createdAt: { gte: startDate },
          },
        }),
        ctx.db.complianceItem.count({
          where: {
            companyId: ctx.companyId,
            status: 'PENDING',
            dueDate: { gte: startDate },
          },
        }),
        ctx.db.complianceItem.count({
          where: {
            companyId: ctx.companyId,
            status: 'OVERDUE',
            dueDate: { lt: now },
          },
        }),
      ]);

      const revenue = totalRevenue._sum.grandTotal || 0;
      const paymentsReceived = totalPayments._sum.amount || 0;
      const outstandingAmount = revenue - paymentsReceived;

      // Calculate collection rate
      const collectionRate = revenue > 0 ? (paymentsReceived / revenue) * 100 : 0;

      // Calculate average invoice value
      const averageInvoiceValue = totalInvoices > 0 ? revenue / totalInvoices : 0;

      return {
        // Financial metrics
        totalRevenue: Math.round(revenue * 100) / 100,
        paymentsReceived: Math.round(paymentsReceived * 100) / 100,
        outstandingAmount: Math.round(outstandingAmount * 100) / 100,
        collectionRate: Math.round(collectionRate * 100) / 100,
        averageInvoiceValue: Math.round(averageInvoiceValue * 100) / 100,

        // Invoice metrics
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,

        // Customer metrics
        totalCustomers,

        // Compliance metrics
        totalCompliances,
        pendingCompliances,
        overdueCompliances,

        // Period info
        dateRange: input?.dateRange || 'thisMonth',
        startDate,
        endDate: now,
      };
    }),
});
