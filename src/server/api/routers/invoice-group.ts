/**
 * Invoice Group API Router
 * Handles quarterly consolidated invoicing, invoice grouping, and PDF merging
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { idGenerator } from '@/lib/id-generator';

export const invoiceGroupRouter = createTRPCRouter({
  /**
   * Create a new invoice group
   */
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      customerId: z.string().uuid().optional(),
      groupType: z.string().default('QUARTERLY'),
      periodStart: z.date().optional(),
      periodEnd: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.db.invoiceGroup.create({
        data: {
          id: idGenerator.generate(),
          companyId: ctx.companyId!,
          customerId: input.customerId,
          name: input.name,
          description: input.description,
          groupType: input.groupType,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          totalAmount: 0,
          invoiceCount: 0,
        },
        include: {
          customer: true,
          invoices: {
            include: {
              customer: true,
              lines: true,
            },
          },
        },
      });

      return group;
    }),

  /**
   * List all invoice groups with pagination
   */
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      customerId: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;

      const whereClause = {
        companyId: ctx.companyId,
        ...(input.customerId && { customerId: input.customerId }),
      };

      const [groups, totalCount] = await ctx.db.$transaction([
        ctx.db.invoiceGroup.findMany({
          where: whereClause,
          include: {
            customer: true,
            invoices: {
              select: {
                id: true,
                number: true,
                grandTotal: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: input.limit,
        }),
        ctx.db.invoiceGroup.count({ where: whereClause }),
      ]);

      return {
        groups,
        totalCount,
        currentPage: input.page,
        totalPages: Math.ceil(totalCount / input.limit),
      };
    }),

  /**
   * Get single invoice group by ID with all invoices and attachments
   */
  getById: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const group = await ctx.db.invoiceGroup.findUnique({
        where: { id: input.id },
        include: {
          customer: true,
          company: true,
          invoices: {
            include: {
              customer: true,
              lines: true,
              attachments: true,
              company: true,
            },
            orderBy: { issueDate: 'asc' },
          },
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice group not found',
        });
      }

      if (group.companyId !== ctx.companyId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      return group;
    }),

  /**
   * Add invoice to a group
   */
  addInvoice: protectedProcedure
    .input(z.object({
      groupId: z.string().uuid(),
      invoiceId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify group ownership
      const group = await ctx.db.invoiceGroup.findFirst({
        where: {
          id: input.groupId,
          companyId: ctx.companyId,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice group not found',
        });
      }

      // Verify invoice ownership
      const invoice = await ctx.db.invoice.findFirst({
        where: {
          id: input.invoiceId,
          companyId: ctx.companyId,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice not found',
        });
      }

      // Check if invoice is already in a group
      if (invoice.invoiceGroupId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invoice is already part of another group',
        });
      }

      // Add invoice to group
      await ctx.db.invoice.update({
        where: { id: input.invoiceId },
        data: { invoiceGroupId: input.groupId },
      });

      // Update group totals
      const updatedGroup = await ctx.db.invoiceGroup.update({
        where: { id: input.groupId },
        data: {
          totalAmount: { increment: invoice.grandTotal },
          invoiceCount: { increment: 1 },
        },
        include: {
          invoices: {
            include: {
              customer: true,
              lines: true,
            },
          },
        },
      });

      return updatedGroup;
    }),

  /**
   * Remove invoice from a group
   */
  removeInvoice: protectedProcedure
    .input(z.object({
      groupId: z.string().uuid(),
      invoiceId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify group ownership
      const group = await ctx.db.invoiceGroup.findFirst({
        where: {
          id: input.groupId,
          companyId: ctx.companyId,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice group not found',
        });
      }

      // Verify invoice
      const invoice = await ctx.db.invoice.findFirst({
        where: {
          id: input.invoiceId,
          invoiceGroupId: input.groupId,
          companyId: ctx.companyId,
        },
      });

      if (!invoice) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice not found in this group',
        });
      }

      // Remove invoice from group
      await ctx.db.invoice.update({
        where: { id: input.invoiceId },
        data: { invoiceGroupId: null },
      });

      // Update group totals
      const updatedGroup = await ctx.db.invoiceGroup.update({
        where: { id: input.groupId },
        data: {
          totalAmount: { decrement: invoice.grandTotal },
          invoiceCount: { decrement: 1 },
        },
        include: {
          invoices: {
            include: {
              customer: true,
              lines: true,
            },
          },
        },
      });

      return updatedGroup;
    }),

  /**
   * Delete invoice group (only if empty)
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.db.invoiceGroup.findFirst({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
        include: {
          invoices: true,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice group not found',
        });
      }

      if (group.invoices.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete group with invoices. Remove all invoices first.',
        });
      }

      await ctx.db.invoiceGroup.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Update invoice group metadata
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      periodStart: z.date().optional(),
      periodEnd: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.db.invoiceGroup.findFirst({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice group not found',
        });
      }

      const { id, ...updateData } = input;

      const updatedGroup = await ctx.db.invoiceGroup.update({
        where: { id: input.id },
        data: updateData,
        include: {
          customer: true,
          invoices: {
            include: {
              customer: true,
              lines: true,
            },
          },
        },
      });

      return updatedGroup;
    }),
});
