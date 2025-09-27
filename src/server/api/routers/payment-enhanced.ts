/**
 * Enhanced Payment Router for CS ERP
 * Integrates advanced payment reconciliation, analytics, and automation
 * Following Asymm optimization patterns
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, companyProcedure } from "../trpc";
import { db } from "../../db";

// Import enhanced engines
import {
  paymentReconciliationEngine,
  paymentUtils,
  type PaymentRecord,
  type InvoiceRecord,
  type BankStatementEntry,
  PaymentMethod,
  PaymentStatus,
  ReconciliationStatus,
} from "../../../lib/payment-reconciliation-engine";

// Input validation schemas
const createPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentDate: z.date(),
  method: z.nativeEnum(PaymentMethod),
  reference: z.string().optional(),
  notes: z.string().optional(),
  bankReference: z.string().optional(),
  upiTransactionId: z.string().optional(),
  processingFee: z.number().optional(),
});

const bulkCreatePaymentsSchema = z.object({
  payments: z.array(createPaymentSchema).min(1, "At least one payment required"),
  validateDuplicates: z.boolean().default(true),
});

const reconcilePaymentsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  includePartialMatches: z.boolean().default(true),
  useFuzzyMatching: z.boolean().default(true),
  tolerance: z.number().positive().default(0.01),
  maxProcessingTime: z.number().positive().default(30000),
});

const importBankStatementSchema = z.object({
  bankEntries: z.array(z.object({
    date: z.date(),
    amount: z.number(),
    type: z.enum(['CREDIT', 'DEBIT']),
    description: z.string(),
    reference: z.string(),
    balance: z.number(),
    accountNumber: z.string(),
  })),
  autoReconcile: z.boolean().default(true),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

const paymentAnalyticsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  customerId: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  includeProjections: z.boolean().default(false),
});

const predictPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  includeFactors: z.boolean().default(true),
});

export const enhancedPaymentRouter = createTRPCRouter({
  // Create single payment with validation
  createPayment: companyProcedure
    .input(createPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { invoiceId, amount, paymentDate, method, reference, notes, bankReference, upiTransactionId, processingFee } = input;

      try {
        // Validate invoice exists and belongs to company
        const invoice = await db.invoice.findUnique({
          where: { id: invoiceId, companyId },
          include: { customer: true },
        });

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found',
          });
        }

        // Validate payment amount
        const remainingAmount = invoice.grandTotal - invoice.paidAmount;
        if (amount > remainingAmount + 0.01) { // Allow 1 paisa tolerance
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Payment amount (${amount}) exceeds remaining balance (${remainingAmount})`,
          });
        }

        // Check for duplicate payments
        const existingPayment = await db.payment.findFirst({
          where: {
            invoiceId,
            amount,
            paymentDate,
            method,
            reference: reference || undefined,
          },
        });

        if (existingPayment) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Duplicate payment detected',
          });
        }

        // Calculate processing fee if not provided
        const calculatedProcessingFee = processingFee ?? paymentUtils.calculateProcessingFee(amount, method);

        // Create payment record
        const payment = await db.payment.create({
          data: {
            invoiceId,
            customerId: invoice.customerId,
            companyId,
            amount,
            paymentDate,
            method,
            reference: reference || paymentUtils.generatePaymentReference(),
            notes,
            status: PaymentStatus.COMPLETED,
          },
        });

        // Update invoice paid amount
        const newPaidAmount = invoice.paidAmount + amount;
        let newStatus = invoice.status;

        if (newPaidAmount >= invoice.grandTotal) {
          newStatus = 'PAID';
        } else if (newPaidAmount > 0) {
          newStatus = 'PARTIALLY_PAID';
        }

        await db.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
        });

        return {
          payment,
          updatedInvoiceStatus: newStatus,
          remainingAmount: invoice.grandTotal - newPaidAmount,
          processingFee: calculatedProcessingFee,
        };

      } catch (error) {
        console.error('Payment creation failed:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create payment',
        });
      }
    }),

  // Bulk create payments with validation
  bulkCreatePayments: companyProcedure
    .input(bulkCreatePaymentsSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { payments, validateDuplicates } = input;

      try {
        const results: Array<any> = [];
        const failures: Array<{paymentData: any; error: string}> = [];

        // Process payments in batches to avoid overwhelming the database
        const BATCH_SIZE = 10;
        for (let i = 0; i < payments.length; i += BATCH_SIZE) {
          const batch = payments.slice(i, i + BATCH_SIZE);

          const batchPromises = batch.map(async (paymentData) => {
            try {
              const result = await enhancedPaymentRouter
                .createCaller(ctx)
                .createPayment(paymentData);

              results.push(result);
            } catch (error) {
              failures.push({
                paymentData,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          });

          await Promise.allSettled(batchPromises);
        }

        return {
          total: payments.length,
          successful: results.length,
          failed: failures.length,
          results,
          failures,
        };

      } catch (error) {
        console.error('Bulk payment creation failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process bulk payments',
        });
      }
    }),

  // Advanced payment reconciliation
  reconcilePayments: companyProcedure
    .input(reconcilePaymentsSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { startDate, endDate, includePartialMatches, useFuzzyMatching, tolerance, maxProcessingTime } = input;

      try {
        // Fetch payments and invoices for reconciliation
        const whereClause: any = { companyId };

        if (startDate && endDate) {
          whereClause.createdAt = {
            gte: startDate,
            lte: endDate,
          };
        }

        const [payments, invoices] = await Promise.all([
          db.payment.findMany({
            where: whereClause,
            include: {
              customer: { select: { name: true } },
              invoice: { select: { number: true } },
            },
          }),
          db.invoice.findMany({
            where: {
              companyId,
              status: { in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] },
            },
            include: {
              customer: { select: { name: true } },
            },
          }),
        ]);

        // Convert to reconciliation engine format
        const paymentRecords: PaymentRecord[] = payments.map(p => ({
          id: p.id,
          amount: p.amount,
          paymentDate: p.paymentDate,
          method: p.method as PaymentMethod,
          reference: p.reference || undefined,
          customerName: p.customer.name,
          invoiceNumber: p.invoice?.number,
          bankReference: p.reference || undefined,
          metadata: {
            customerId: p.customerId,
            invoiceId: p.invoiceId,
          },
        }));

        const invoiceRecords: InvoiceRecord[] = invoices.map(inv => ({
          id: inv.id,
          number: inv.number,
          customerId: inv.customerId,
          customerName: inv.customer.name,
          grandTotal: inv.grandTotal,
          paidAmount: inv.paidAmount,
          remainingAmount: inv.grandTotal - inv.paidAmount,
          dueDate: inv.dueDate || undefined,
          status: inv.status,
        }));

        // Run reconciliation
        const reconciliationResult = await paymentReconciliationEngine.reconcilePayments(
          paymentRecords,
          invoiceRecords,
          {
            tolerance,
            includePartialMatches,
            useFuzzyMatching,
            maxProcessingTime,
          }
        );

        // Store reconciliation results in database
        const reconciliationLogPromises = reconciliationResult.matches.map(async (match) => {
          // This would typically be stored in a reconciliation_logs table
          // For now, we'll just return the results
          return match;
        });

        await Promise.all(reconciliationLogPromises);

        return {
          ...reconciliationResult,
          processingTimeMs: Math.round(reconciliationResult.processingTime),
        };

      } catch (error) {
        console.error('Payment reconciliation failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Reconciliation failed',
        });
      }
    }),

  // Import and reconcile bank statement
  importBankStatement: companyProcedure
    .input(importBankStatementSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { bankEntries, autoReconcile, dateRange } = input;

      try {
        // Fetch payments for the date range
        const paymentsWhere: any = { companyId };

        if (dateRange) {
          paymentsWhere.paymentDate = {
            gte: dateRange.start,
            lte: dateRange.end,
          };
        }

        const payments = await db.payment.findMany({
          where: paymentsWhere,
          include: {
            customer: { select: { name: true } },
            invoice: { select: { number: true } },
          },
        });

        const paymentRecords: PaymentRecord[] = payments.map(p => ({
          id: p.id,
          amount: p.amount,
          paymentDate: p.paymentDate,
          method: p.method as PaymentMethod,
          reference: p.reference || undefined,
          bankReference: p.reference || undefined,
        }));

        const bankStatementEntries: BankStatementEntry[] = bankEntries.map((entry, index) => ({
          id: `bank_${index}`,
          date: entry.date,
          amount: entry.amount,
          type: entry.type,
          description: entry.description,
          reference: entry.reference,
          balance: entry.balance,
          accountNumber: entry.accountNumber,
        }));

        let reconciliationResults = null;

        if (autoReconcile) {
          reconciliationResults = await paymentReconciliationEngine.reconcileBankStatement(
            bankStatementEntries,
            paymentRecords,
            { dateRange, amountTolerance: 0.01 }
          );
        }

        return {
          imported: bankEntries.length,
          reconciled: reconciliationResults?.matches.length || 0,
          unmatched: {
            bankEntries: reconciliationResults?.unmatchedBankEntries.length || bankEntries.length,
            payments: reconciliationResults?.unmatchedPayments.length || 0,
          },
          matches: reconciliationResults?.matches || [],
        };

      } catch (error) {
        console.error('Bank statement import failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to import bank statement',
        });
      }
    }),

  // Advanced payment analytics
  getPaymentAnalytics: companyProcedure
    .input(paymentAnalyticsSchema)
    .query(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { startDate, endDate, customerId, paymentMethod, includeProjections } = input;

      try {
        // Build where clause for filtering
        const whereClause: any = { companyId };

        if (startDate && endDate) {
          whereClause.paymentDate = {
            gte: startDate,
            lte: endDate,
          };
        }

        if (customerId) {
          whereClause.customerId = customerId;
        }

        if (paymentMethod) {
          whereClause.method = paymentMethod;
        }

        // Fetch payments and invoices
        const [payments, invoices] = await Promise.all([
          db.payment.findMany({
            where: whereClause,
            include: {
              customer: { select: { name: true } },
              invoice: { select: { number: true, dueDate: true, grandTotal: true } },
            },
          }),
          db.invoice.findMany({
            where: {
              companyId,
              ...(customerId && { customerId }),
            },
            include: {
              customer: { select: { name: true } },
            },
          }),
        ]);

        // Convert to analytics engine format
        const paymentRecords: PaymentRecord[] = payments.map(p => ({
          id: p.id,
          amount: p.amount,
          paymentDate: p.paymentDate,
          method: p.method as PaymentMethod,
          reference: p.reference || undefined,
          customerName: p.customer.name,
          invoiceNumber: p.invoice?.number,
        }));

        const invoiceRecords: InvoiceRecord[] = invoices.map(inv => ({
          id: inv.id,
          number: inv.number,
          customerId: inv.customerId,
          customerName: inv.customer.name,
          grandTotal: inv.grandTotal,
          paidAmount: inv.paidAmount,
          remainingAmount: inv.grandTotal - inv.paidAmount,
          dueDate: inv.dueDate || undefined,
          status: inv.status,
        }));

        // Generate analytics
        const analytics = await paymentReconciliationEngine.generatePaymentAnalytics(
          paymentRecords,
          invoiceRecords,
          startDate && endDate ? { start: startDate, end: endDate } : undefined
        );

        // Add additional business metrics
        const totalReceivables = invoices.reduce((sum, inv) => sum + (inv.grandTotal - inv.paidAmount), 0);
        const averageInvoiceValue = invoices.length > 0 ? invoices.reduce((sum, inv) => sum + inv.grandTotal, 0) / invoices.length : 0;

        // Collection efficiency
        const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length;
        const collectionEfficiency = invoices.length > 0 ? (paidInvoices / invoices.length) * 100 : 0;

        return {
          ...analytics,
          businessMetrics: {
            totalReceivables,
            averageInvoiceValue,
            collectionEfficiency: Math.round(collectionEfficiency * 100) / 100,
            totalInvoices: invoices.length,
            paidInvoices,
          },
        };

      } catch (error) {
        console.error('Payment analytics failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate payment analytics',
        });
      }
    }),

  // Predict payment probability
  predictPayment: companyProcedure
    .input(predictPaymentSchema)
    .query(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { invoiceId, includeFactors } = input;

      try {
        // Get invoice details
        const invoice = await db.invoice.findUnique({
          where: { id: invoiceId, companyId },
          include: { customer: true },
        });

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found',
          });
        }

        // Get customer's payment history
        const customerPayments = await db.payment.findMany({
          where: {
            customerId: invoice.customerId,
            status: PaymentStatus.COMPLETED,
          },
          include: {
            invoice: { select: { number: true, dueDate: true } },
          },
          orderBy: { paymentDate: 'desc' },
          take: 20, // Last 20 payments
        });

        // Get similar invoices from this customer
        const similarInvoices = await db.invoice.findMany({
          where: {
            customerId: invoice.customerId,
            companyId,
            status: { in: ['PAID', 'PARTIALLY_PAID', 'OVERDUE'] },
          },
          orderBy: { createdAt: 'desc' },
          take: 50, // Last 50 invoices
        });

        // Convert to prediction engine format
        const historicalPayments: PaymentRecord[] = customerPayments.map(p => ({
          id: p.id,
          amount: p.amount,
          paymentDate: p.paymentDate,
          method: p.method as PaymentMethod,
          invoiceNumber: p.invoice?.number,
        }));

        const historicalInvoices: InvoiceRecord[] = similarInvoices.map(inv => ({
          id: inv.id,
          number: inv.number,
          customerId: inv.customerId,
          customerName: invoice.customer.name,
          grandTotal: inv.grandTotal,
          paidAmount: inv.paidAmount,
          remainingAmount: inv.grandTotal - inv.paidAmount,
          dueDate: inv.dueDate || undefined,
          status: inv.status,
        }));

        // Generate prediction
        const prediction = await paymentReconciliationEngine.predictPaymentProbability(
          invoiceId,
          {
            customerPayments: historicalPayments,
            similarInvoices: historicalInvoices,
          }
        );

        return {
          ...prediction,
          invoice: {
            number: invoice.number,
            amount: invoice.grandTotal,
            dueDate: invoice.dueDate,
            daysUntilDue: invoice.dueDate ? Math.ceil((invoice.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null,
          },
          customer: {
            name: invoice.customer.name,
            totalInvoices: similarInvoices.length,
            totalPayments: customerPayments.length,
            paymentHistory: includeFactors ? {
              averagePaymentDelay: prediction.factors.find(f => f.factor === 'Average Delay')?.description || 'N/A',
              paymentRate: prediction.factors.find(f => f.factor === 'Payment History')?.description || 'N/A',
            } : undefined,
          },
        };

      } catch (error) {
        console.error('Payment prediction failed:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to predict payment',
        });
      }
    }),

  // Get payment summary for dashboard
  getPaymentSummary: companyProcedure
    .input(z.object({
      period: z.enum(['TODAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR']).default('MONTH'),
    }))
    .query(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { period } = input;

      try {
        // Calculate date range based on period
        const now = new Date();
        const periodStart = new Date();

        switch (period) {
          case 'TODAY':
            periodStart.setHours(0, 0, 0, 0);
            break;
          case 'WEEK':
            periodStart.setDate(now.getDate() - 7);
            break;
          case 'MONTH':
            periodStart.setMonth(now.getMonth() - 1);
            break;
          case 'QUARTER':
            periodStart.setMonth(now.getMonth() - 3);
            break;
          case 'YEAR':
            periodStart.setFullYear(now.getFullYear() - 1);
            break;
        }

        // Fetch payment data
        const [payments, overdueInvoices] = await Promise.all([
          db.payment.findMany({
            where: {
              companyId,
              paymentDate: {
                gte: periodStart,
                lte: now,
              },
            },
          }),
          db.invoice.findMany({
            where: {
              companyId,
              dueDate: { lt: now },
              status: { in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] },
            },
          }),
        ]);

        // Calculate metrics
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

        const overdueCount = overdueInvoices.length;
        const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.grandTotal - inv.paidAmount), 0);

        // Payment method breakdown
        const methodBreakdown = payments.reduce((acc, payment) => {
          const method = payment.method;
          if (!acc[method]) {
            acc[method] = { count: 0, amount: 0 };
          }
          acc[method].count += 1;
          acc[method].amount += payment.amount;
          return acc;
        }, {} as Record<string, { count: number; amount: number }>);

        return {
          period,
          totalPayments,
          totalAmount,
          averagePayment,
          overdueCount,
          overdueAmount,
          methodBreakdown,
          recentPayments: payments
            .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
            .slice(0, 5)
            .map(p => ({
              id: p.id,
              amount: p.amount,
              method: p.method,
              paymentDate: p.paymentDate,
              reference: p.reference,
            })),
        };

      } catch (error) {
        console.error('Payment summary failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get payment summary',
        });
      }
    }),
});