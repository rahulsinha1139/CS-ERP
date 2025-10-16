"use strict";
/**
 * Service Templates Router
 * Professional CS practice service management with custom fields support
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const id_generator_1 = require("@/lib/id-generator");
const service_template_definitions_1 = require("@/lib/service-template-definitions");
const client_1 = require("@prisma/client");
// Custom field definition schema
const customFieldSchema = zod_1.z.object({
    name: zod_1.z.string(),
    label: zod_1.z.string(),
    type: zod_1.z.enum(['text', 'number', 'date', 'select', 'textarea', 'checkbox', 'currency']),
    required: zod_1.z.boolean(),
    placeholder: zod_1.z.string().optional(),
    helpText: zod_1.z.string().optional(),
    options: zod_1.z.array(zod_1.z.string()).optional(),
    defaultValue: zod_1.z.any().optional(),
    validation: zod_1.z.object({
        pattern: zod_1.z.string().optional(),
        minLength: zod_1.z.number().optional(),
        maxLength: zod_1.z.number().optional(),
        min: zod_1.z.number().optional(),
        max: zod_1.z.number().optional(),
        message: zod_1.z.string().optional(),
    }).optional(),
    group: zod_1.z.string().optional(),
});
exports.serviceRouter = (0, trpc_1.createTRPCRouter)({
    // Get all service templates with custom fields
    getAll: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        const templates = await ctx.db.serviceTemplate.findMany({
            where: { companyId: ctx.companyId },
            orderBy: { name: 'asc' },
        });
        return templates;
    }),
    // Get service template by ID with custom fields
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ ctx, input }) => {
        const template = await ctx.db.serviceTemplate.findFirst({
            where: {
                id: input.id,
                companyId: ctx.companyId,
            },
        });
        if (!template) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Service template not found',
            });
        }
        return template;
    }),
    // Legacy getTemplates (for backward compatibility)
    // Returns mock data for invoice form dropdown until migration complete
    getTemplates: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        const templates = await ctx.db.serviceTemplate.findMany({
            where: { companyId: ctx.companyId },
            orderBy: { name: 'asc' },
        });
        // If no templates in DB, return mock data
        if (templates.length === 0) {
            return [
                {
                    id: 'mock-1',
                    name: "ROC Annual Filing",
                    description: "Annual filing for registrar of companies",
                    defaultRate: 2500,
                    gstRate: 18,
                    hsnSac: "9983",
                    category: "compliance"
                },
                {
                    id: 'mock-2',
                    name: "Company Incorporation",
                    description: "Complete company incorporation service",
                    defaultRate: 15000,
                    gstRate: 18,
                    hsnSac: "9983",
                    category: "incorporation"
                },
                {
                    id: 'mock-3',
                    name: "Board Resolution Drafting",
                    description: "Professional board resolution drafting",
                    defaultRate: 1500,
                    gstRate: 18,
                    hsnSac: "9983",
                    category: "legal"
                },
                {
                    id: 'mock-4',
                    name: "AGM Compliance",
                    description: "Annual general meeting compliance service",
                    defaultRate: 3500,
                    gstRate: 18,
                    hsnSac: "9983",
                    category: "compliance"
                },
                {
                    id: 'mock-5',
                    name: "Share Certificate",
                    description: "Share certificate preparation and issuance",
                    defaultRate: 500,
                    gstRate: 18,
                    hsnSac: "9983",
                    category: "documentation"
                }
            ];
        }
        return templates;
    }),
    // Create new service template with custom fields
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        description: zod_1.z.string().optional(),
        defaultRate: zod_1.z.number().positive('Rate must be positive'),
        gstRate: zod_1.z.number().min(0).max(30, 'GST rate must be between 0 and 30'),
        hsnSac: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        customFields: zod_1.z.array(customFieldSchema).optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        const template = await ctx.db.serviceTemplate.create({
            data: {
                id: id_generator_1.idGenerator.serviceTemplate(),
                name: input.name,
                description: input.description || null,
                defaultRate: input.defaultRate,
                gstRate: input.gstRate,
                hsnSac: input.hsnSac || null,
                category: input.category || null,
                customFields: input.customFields ? input.customFields : client_1.Prisma.JsonNull,
                companyId: ctx.companyId,
            },
        });
        return template;
    }),
    // Update service template with custom fields
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        defaultRate: zod_1.z.number().positive().optional(),
        gstRate: zod_1.z.number().min(0).max(30).optional(),
        hsnSac: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        customFields: zod_1.z.array(customFieldSchema).optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const existing = await ctx.db.serviceTemplate.findFirst({
            where: { id: input.id, companyId: ctx.companyId },
        });
        if (!existing) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Service template not found',
            });
        }
        const { id, ...updateData } = input;
        const template = await ctx.db.serviceTemplate.update({
            where: { id },
            data: {
                ...updateData,
                customFields: updateData.customFields
                    ? updateData.customFields
                    : undefined,
            },
        });
        return template;
    }),
    // Delete service template
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ ctx, input }) => {
        // Verify ownership
        const existing = await ctx.db.serviceTemplate.findFirst({
            where: { id: input.id, companyId: ctx.companyId },
        });
        if (!existing) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Service template not found',
            });
        }
        await ctx.db.serviceTemplate.delete({
            where: { id: input.id },
        });
        return { success: true };
    }),
    // Initialize pre-defined CS service templates
    initializePredefinedTemplates: trpc_1.protectedProcedure
        .mutation(async ({ ctx }) => {
        const existingCount = await ctx.db.serviceTemplate.count({
            where: { companyId: ctx.companyId },
        });
        // Only initialize if no templates exist
        if (existingCount > 0) {
            return {
                message: 'Templates already initialized',
                created: 0,
                existing: existingCount,
            };
        }
        // Create all pre-defined templates
        const createdTemplates = [];
        for (const template of service_template_definitions_1.CS_SERVICE_TEMPLATES) {
            const created = await ctx.db.serviceTemplate.create({
                data: {
                    id: id_generator_1.idGenerator.serviceTemplate(),
                    name: template.name,
                    description: template.description || null,
                    defaultRate: template.defaultRate,
                    gstRate: template.gstRate,
                    hsnSac: template.hsnSac || null,
                    category: template.category || null,
                    customFields: template.customFields,
                    companyId: ctx.companyId,
                },
            });
            createdTemplates.push(created);
        }
        return {
            message: `Initialized ${createdTemplates.length} CS service templates`,
            created: createdTemplates.length,
            templates: createdTemplates,
        };
    }),
    // Get templates with custom fields definitions only
    getTemplatesWithCustomFields: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        const templates = await ctx.db.serviceTemplate.findMany({
            where: {
                companyId: ctx.companyId,
                customFields: { not: client_1.Prisma.JsonNull },
            },
            orderBy: { name: 'asc' },
        });
        return templates;
    }),
    // Get custom fields for a specific template
    getCustomFields: trpc_1.protectedProcedure
        .input(zod_1.z.object({ templateId: zod_1.z.string() }))
        .query(async ({ ctx, input }) => {
        const template = await ctx.db.serviceTemplate.findFirst({
            where: {
                id: input.templateId,
                companyId: ctx.companyId,
            },
            select: {
                id: true,
                name: true,
                customFields: true,
            },
        });
        if (!template) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Service template not found',
            });
        }
        return {
            templateId: template.id,
            templateName: template.name,
            customFields: template.customFields || [],
        };
    }),
});
