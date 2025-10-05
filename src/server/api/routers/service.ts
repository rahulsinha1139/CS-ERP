/**
 * Service Templates Router
 * Professional CS practice service management
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const serviceRouter = createTRPCRouter({
  // Get all service templates
  getAll: protectedProcedure.query(async ({ ctx: _ctx }) => {
    return [];
  }),

  // Get service templates (alias for getAll for backward compatibility)
  getTemplates: protectedProcedure.query(async ({ ctx: _ctx }) => {
    // Professional CS service templates
    return [
      {
        id: 1,
        name: "ROC Annual Filing",
        description: "Annual filing for registrar of companies",
        baseAmount: 2500,
        gstRate: 18,
        hsn: "9983",
        category: "compliance"
      },
      {
        id: 2,
        name: "Company Incorporation",
        description: "Complete company incorporation service",
        baseAmount: 15000,
        gstRate: 18,
        hsn: "9983",
        category: "incorporation"
      },
      {
        id: 3,
        name: "Board Resolution Drafting",
        description: "Professional board resolution drafting",
        baseAmount: 1500,
        gstRate: 18,
        hsn: "9983",
        category: "legal"
      },
      {
        id: 4,
        name: "AGM Compliance",
        description: "Annual general meeting compliance service",
        baseAmount: 3500,
        gstRate: 18,
        hsn: "9983",
        category: "compliance"
      },
      {
        id: 5,
        name: "Share Certificate",
        description: "Share certificate preparation and issuance",
        baseAmount: 500,
        gstRate: 18,
        hsn: "9983",
        category: "documentation"
      }
    ];
  }),

  // Get service by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: _ctx, input }) => {
      // Professional CS service templates (avoiding circular reference)
      const templates = [
        { id: 1, name: "ROC Annual Filing", description: "Annual filing for registrar of companies", baseAmount: 2500, gstRate: 18, hsn: "9983", category: "compliance" },
        { id: 2, name: "Company Incorporation", description: "Complete company incorporation service", baseAmount: 15000, gstRate: 18, hsn: "9983", category: "incorporation" },
        { id: 3, name: "Board Resolution Drafting", description: "Professional board resolution drafting", baseAmount: 1500, gstRate: 18, hsn: "9983", category: "legal" },
        { id: 4, name: "AGM Compliance", description: "Annual general meeting compliance service", baseAmount: 3500, gstRate: 18, hsn: "9983", category: "compliance" },
        { id: 5, name: "Share Certificate", description: "Share certificate preparation and issuance", baseAmount: 500, gstRate: 18, hsn: "9983", category: "documentation" }
      ];
      return templates.find(t => t.id === input.id) || null;
    }),

  // Create new service template
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string(),
      baseAmount: z.number().positive(),
      gstRate: z.number().min(0).max(30),
      hsn: z.string(),
      category: z.string()
    }))
    .mutation(async ({ ctx: _ctx, input }) => {
      // In production, this would save to database
      return {
        id: Math.floor(Math.random() * 1000),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }),
});