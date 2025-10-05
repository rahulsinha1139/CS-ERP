import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';
import { PaymentMethod, type Prisma } from "@prisma/client";
import { idGenerator } from "@/lib/id-generator";

const createPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.nativeEnum(PaymentMethod),
  paymentDate: z.date(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const paymentRouter = createTRPCRouter({
  // Get all payments
  getAll: protectedProcedure
    .input(z.object({
      customerId: z.string().optional(),
      invoiceId: z.string().optional(),
      filters: z.object({
        status: z.string().optional(),
      }).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        return [];
      }

      const whereClause: Prisma.PaymentWhereInput = {
        invoice: {
          companyId: ctx.companyId,
          ...(input?.customerId && { customerId: input.customerId }),
        },
        ...(input?.invoiceId && { invoiceId: input.invoiceId }),
      };

      try {
        const payments = await ctx.db.payment.findMany({
          where: whereClause,
          include: {
            invoice: {
              include: {
                customer: true,
              },
            },
          },
          orderBy: { paymentDate: 'desc' },
          take: 100,
        });

        return payments;
      } catch (error) {
        console.error('Payment query error:', error);
        return [];
      }
    }),

  // Create new payment
  create: protectedProcedure
    .input(createPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      try {
        // Verify invoice exists and belongs to company
        const invoice = await ctx.db.invoice.findUnique({
          where: {
            id: input.invoiceId,
            companyId: ctx.companyId,
          },
          include: { customer: true },
        });

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found',
          });
        }

        // Create payment
        const payment = await ctx.db.payment.create({
          data: {
            id: idGenerator.payment(),
            invoiceId: input.invoiceId,
            customerId: invoice.customerId,
            companyId: ctx.companyId,
            amount: input.amount,
            method: input.method,
            paymentDate: input.paymentDate,
            reference: input.reference,
            notes: input.notes,
            status: 'COMPLETED',
          },
          include: {
            invoice: {
              include: {
                customer: true,
              },
            },
          },
        });

        // Update invoice paid amount
        const currentPaidAmount = invoice.paidAmount || 0;
        const newPaidAmount = currentPaidAmount + input.amount;

        await ctx.db.invoice.update({
          where: { id: input.invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: newPaidAmount >= invoice.grandTotal ? 'PAID' :
                    newPaidAmount > 0 ? 'PARTIALLY_PAID' : 'SENT',
          },
        });

        return payment;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Payment creation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create payment',
        });
      }
    }),

  // Get payment statistics
  getStats: protectedProcedure
    .input(z.object({
      customerId: z.string().optional(),
      dateRange: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        return {
          totalReceived: 0,
          outstanding: 0,
          thisMonth: 0,
          averageDays: 0,
        };
      }

      try {
        // Calculate basic payment stats
        const paymentsResult = await ctx.db.payment.aggregate({
          where: {
            invoice: {
              companyId: ctx.companyId,
              customerId: input?.customerId,
            },
          },
          _sum: {
            amount: true,
          },
          _count: true,
        });

        const invoicesResult = await ctx.db.invoice.aggregate({
          where: {
            companyId: ctx.companyId,
            customerId: input?.customerId,
          },
          _sum: {
            grandTotal: true,
            paidAmount: true,
          },
        });

        const totalReceived = paymentsResult._sum.amount || 0;
        const totalBilled = invoicesResult._sum.grandTotal || 0;
        const totalPaid = invoicesResult._sum.paidAmount || 0;
        const outstanding = totalBilled - totalPaid;

        const outstandingCount = await ctx.db.invoice.count({
          where: {
            companyId: ctx.companyId,
            customerId: input?.customerId,
            status: { in: ['SENT', 'OVERDUE', 'PARTIALLY_PAID'] },
          },
        });

        return {
          totalReceived,
          outstanding,
          outstandingCount,
          thisMonth: totalReceived, // Simplified for now
          averageDays: 0, // Would need more complex calculation
          receivedCount: paymentsResult._count,
        };
      } catch (error) {
        console.error('Payment stats error:', error);
        return {
          totalReceived: 0,
          outstanding: 0,
          thisMonth: 0,
          averageDays: 0,
        };
      }
    }),

  // Get recent payments
  getRecent: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        return [];
      }

      try {
        const payments = await ctx.db.payment.findMany({
          where: {
            invoice: {
              companyId: ctx.companyId,
            },
          },
          include: {
            invoice: {
              include: {
                customer: true,
              },
            },
          },
          orderBy: { paymentDate: 'desc' },
          take: input?.limit || 10,
        });

        return payments;
      } catch (error) {
        console.error('Recent payments error:', error);
        return [];
      }
    }),
});
