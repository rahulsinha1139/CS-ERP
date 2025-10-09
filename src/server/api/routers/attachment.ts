/**
 * Attachment API Router
 * Handles file uploads and management for invoice attachments
 */

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { idGenerator } from '@/lib/id-generator';

export const attachmentRouter = createTRPCRouter({
  // Get all attachments for an invoice
  getByInvoiceId: protectedProcedure
    .input(z.object({ invoiceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const attachments = await ctx.db.invoiceAttachment.findMany({
        where: { invoiceId: input.invoiceId },
        orderBy: { displayOrder: 'asc' },
      });

      return attachments;
    }),

  // Create attachment record (after file upload to Supabase)
  create: protectedProcedure
    .input(z.object({
      invoiceId: z.string().uuid(),
      fileName: z.string(),
      fileSize: z.number(),
      fileType: z.string(),
      storagePath: z.string(),
      storageUrl: z.string(),
      description: z.string().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify invoice exists and belongs to user's company
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

      const attachment = await ctx.db.invoiceAttachment.create({
        data: {
          id: idGenerator.invoiceAttachment(),
          invoiceId: input.invoiceId,
          fileName: input.fileName,
          fileSize: input.fileSize,
          fileType: input.fileType,
          storagePath: input.storagePath,
          storageUrl: input.storageUrl,
          description: input.description,
          displayOrder: input.displayOrder ?? 0,
          uploadedBy: ctx.session?.user?.email ?? 'system',
        },
      });

      return attachment;
    }),

  // Delete attachment
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Get attachment with invoice to verify ownership
      const attachment = await ctx.db.invoiceAttachment.findUnique({
        where: { id: input.id },
        include: { invoice: true },
      });

      if (!attachment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attachment not found',
        });
      }

      if (attachment.invoice.companyId !== ctx.companyId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      // Delete from database (Supabase storage deletion handled separately)
      await ctx.db.invoiceAttachment.delete({
        where: { id: input.id },
      });

      return { success: true, storagePath: attachment.storagePath };
    }),

  // Update attachment metadata
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      description: z.string().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const attachment = await ctx.db.invoiceAttachment.findUnique({
        where: { id: input.id },
        include: { invoice: true },
      });

      if (!attachment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Attachment not found',
        });
      }

      if (attachment.invoice.companyId !== ctx.companyId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      const updated = await ctx.db.invoiceAttachment.update({
        where: { id: input.id },
        data: {
          description: input.description,
          displayOrder: input.displayOrder,
        },
      });

      return updated;
    }),
});
