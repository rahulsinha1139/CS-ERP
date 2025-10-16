"use strict";
/**
 * Attachment API Router
 * Handles file uploads and management for invoice attachments
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const id_generator_1 = require("@/lib/id-generator");
exports.attachmentRouter = (0, trpc_1.createTRPCRouter)({
    // Get all attachments for an invoice
    getByInvoiceId: trpc_1.protectedProcedure
        .input(zod_1.z.object({ invoiceId: zod_1.z.string().uuid() }))
        .query(async ({ ctx, input }) => {
        const attachments = await ctx.db.invoiceAttachment.findMany({
            where: { invoiceId: input.invoiceId },
            orderBy: { displayOrder: 'asc' },
        });
        return attachments;
    }),
    // Create attachment record (after file upload to Supabase)
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        invoiceId: zod_1.z.string().uuid(),
        fileName: zod_1.z.string(),
        fileSize: zod_1.z.number(),
        fileType: zod_1.z.string(),
        storagePath: zod_1.z.string(),
        storageUrl: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        displayOrder: zod_1.z.number().optional(),
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
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Invoice not found',
            });
        }
        const attachment = await ctx.db.invoiceAttachment.create({
            data: {
                id: id_generator_1.idGenerator.invoiceAttachment(),
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
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
        // Get attachment with invoice to verify ownership
        const attachment = await ctx.db.invoiceAttachment.findUnique({
            where: { id: input.id },
            include: { invoice: true },
        });
        if (!attachment) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Attachment not found',
            });
        }
        if (attachment.invoice.companyId !== ctx.companyId) {
            throw new server_1.TRPCError({
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
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        description: zod_1.z.string().optional(),
        displayOrder: zod_1.z.number().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const attachment = await ctx.db.invoiceAttachment.findUnique({
            where: { id: input.id },
            include: { invoice: true },
        });
        if (!attachment) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Attachment not found',
            });
        }
        if (attachment.invoice.companyId !== ctx.companyId) {
            throw new server_1.TRPCError({
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
