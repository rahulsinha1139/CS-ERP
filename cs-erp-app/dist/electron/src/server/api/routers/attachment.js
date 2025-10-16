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
const file_storage_1 = require("@/lib/file-storage");
exports.attachmentRouter = (0, trpc_1.createTRPCRouter)({
    // Upload file and create attachment record
    upload: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        invoiceId: zod_1.z.string().uuid(),
        fileName: zod_1.z.string(),
        fileData: zod_1.z.string(), // Base64 encoded file data
        fileType: zod_1.z.string(),
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
        // Decode base64 file data
        const buffer = Buffer.from(input.fileData, 'base64');
        // Store file locally
        const uploadResult = await file_storage_1.fileStorage.storeFile(buffer, input.fileName, input.fileType, 'invoices', ctx.session?.user?.email ?? 'system');
        if (!uploadResult.success) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: uploadResult.error || 'File upload failed',
            });
        }
        // Create database record
        const attachment = await ctx.db.invoiceAttachment.create({
            data: {
                id: id_generator_1.idGenerator.invoiceAttachment(),
                invoiceId: input.invoiceId,
                fileName: input.fileName,
                fileSize: uploadResult.size,
                fileType: input.fileType,
                storagePath: uploadResult.fileId, // Store the file ID for retrieval
                storageUrl: `local://${uploadResult.fileId}`, // Mark as local storage
                description: input.description,
                displayOrder: input.displayOrder ?? 0,
                uploadedBy: ctx.session?.user?.email ?? 'system',
            },
        });
        return attachment;
    }),
    // Download file
    download: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string().uuid() }))
        .query(async ({ ctx, input }) => {
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
        // Retrieve file from local storage
        const fileBuffer = await file_storage_1.fileStorage.getFile(attachment.storagePath, 'invoices');
        if (!fileBuffer) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'File not found in storage',
            });
        }
        // Return file data as base64
        return {
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            fileSize: attachment.fileSize,
            fileData: fileBuffer.toString('base64'),
        };
    }),
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
        // Delete file from local storage
        await file_storage_1.fileStorage.deleteFile(attachment.storagePath, 'invoices');
        // Delete from database
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
