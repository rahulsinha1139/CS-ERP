/**
 * Service Templates Router
 * Professional CS practice service management with custom fields support
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { idGenerator } from "@/lib/id-generator";
import { CS_SERVICE_TEMPLATES } from "@/lib/service-template-definitions";
import { Prisma } from "@prisma/client";

// Custom field definition schema
const customFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'textarea', 'checkbox', 'currency']),
  required: z.boolean(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  options: z.array(z.string()).optional(),
  defaultValue: z.any().optional(),
  validation: z.object({
    pattern: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    message: z.string().optional(),
  }).optional(),
  group: z.string().optional(),
});

export const serviceRouter = createTRPCRouter({
  // Get all service templates with custom fields
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.serviceTemplate.findMany({
      where: { companyId: ctx.companyId },
      orderBy: { name: 'asc' },
    });

    return templates;
  }),

  // Get service template by ID with custom fields
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.serviceTemplate.findFirst({
        where: {
          id: input.id,
          companyId: ctx.companyId,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Service template not found',
        });
      }

      return template;
    }),

  // Legacy getTemplates (for backward compatibility)
  // Returns mock data for invoice form dropdown until migration complete
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
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
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().optional(),
      defaultRate: z.number().positive('Rate must be positive'),
      gstRate: z.number().min(0).max(30, 'GST rate must be between 0 and 30'),
      hsnSac: z.string().optional(),
      category: z.string().optional(),
      customFields: z.array(customFieldSchema).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.serviceTemplate.create({
        data: {
          id: idGenerator.serviceTemplate(),
          name: input.name,
          description: input.description || null,
          defaultRate: input.defaultRate,
          gstRate: input.gstRate,
          hsnSac: input.hsnSac || null,
          category: input.category || null,
          customFields: input.customFields ? (input.customFields as Prisma.InputJsonValue) : Prisma.JsonNull,
          companyId: ctx.companyId!,
        },
      });

      return template;
    }),

  // Update service template with custom fields
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      defaultRate: z.number().positive().optional(),
      gstRate: z.number().min(0).max(30).optional(),
      hsnSac: z.string().optional(),
      category: z.string().optional(),
      customFields: z.array(customFieldSchema).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existing = await ctx.db.serviceTemplate.findFirst({
        where: { id: input.id, companyId: ctx.companyId },
      });

      if (!existing) {
        throw new TRPCError({
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
            ? (updateData.customFields as Prisma.InputJsonValue)
            : undefined,
        },
      });

      return template;
    }),

  // Delete service template
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existing = await ctx.db.serviceTemplate.findFirst({
        where: { id: input.id, companyId: ctx.companyId },
      });

      if (!existing) {
        throw new TRPCError({
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
  initializePredefinedTemplates: protectedProcedure
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

      for (const template of CS_SERVICE_TEMPLATES) {
        const created = await ctx.db.serviceTemplate.create({
          data: {
            id: idGenerator.serviceTemplate(),
            name: template.name,
            description: template.description || null,
            defaultRate: template.defaultRate,
            gstRate: template.gstRate,
            hsnSac: template.hsnSac || null,
            category: template.category || null,
            customFields: template.customFields as unknown as Prisma.InputJsonValue,
            companyId: ctx.companyId!,
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
  getTemplatesWithCustomFields: protectedProcedure
    .query(async ({ ctx }) => {
      const templates = await ctx.db.serviceTemplate.findMany({
        where: {
          companyId: ctx.companyId,
          customFields: { not: Prisma.JsonNull },
        },
        orderBy: { name: 'asc' },
      });

      return templates;
    }),

  // Get custom fields for a specific template
  getCustomFields: protectedProcedure
    .input(z.object({ templateId: z.string() }))
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
        throw new TRPCError({
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
