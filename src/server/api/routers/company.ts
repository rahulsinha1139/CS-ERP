/**
 * Company Router
 * Professional company management for CS practice
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Helper function to get current company data
const getCurrentCompanyData = () => {
  return {
    id: 1,
    legalName: "Excellence CS Practice LLP",
    tradeName: "Excellence CS",
    gstin: "27AABCE1234F1Z5",
    stateCode: "27",
    address: {
      line1: "Office No. 404, Business Center",
      line2: "Baner Road, Pune",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      country: "India"
    },
    contact: {
      email: "info@excellencecs.com",
      phone: "+91-9876543210",
      website: "https://excellencecs.com"
    },
    registration: {
      coi: "LLP-123456",
      incorporationDate: new Date("2020-01-15"),
      registrationNumber: "LLPIN-AAE-1234"
    },
    settings: {
      invoicePrefix: "ECS",
      invoiceSequence: 1001,
      paymentTerms: "NET_30",
      lateFeePenalty: 2.5,
      currency: "INR",
      timezone: "Asia/Kolkata",
      fiscalYearStart: "2024-04-01",
      gstRegistrationDate: new Date("2020-02-01"),
      digitalSignature: true,
      autoBackup: true
    },
    branding: {
      primaryColor: "#1e40af",
      accentColor: "#059669",
      logoUrl: "/assets/logo-excellence-cs.svg",
      tagline: "Excellence in Company Secretarial Practice"
    }
  };
};

export const companyRouter = createTRPCRouter({
  // Get all companies
  getAll: publicProcedure.query(async ({ ctx }) => {
    return [];
  }),

  // Get current company (for CS practice)
  getCurrent: publicProcedure.query(async ({ ctx }) => {
    return getCurrentCompanyData();
  }),

  // Get company by ID (with fallback)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (input.id === 1) {
        return getCurrentCompanyData();
      }
      return null;
    }),

  // Update company settings
  updateSettings: publicProcedure
    .input(z.object({
      invoicePrefix: z.string().optional(),
      paymentTerms: z.string().optional(),
      lateFeePenalty: z.number().optional(),
      currency: z.string().optional(),
      timezone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, this would update the database
      const current = getCurrentCompanyData();
      return {
        ...current,
        settings: {
          ...current.settings,
          ...input
        }
      };
    }),

  // Get company settings
  getSettings: publicProcedure.query(async ({ ctx }) => {
    const company = getCurrentCompanyData();
    return company.settings;
  }),

  // Update company branding
  updateBranding: publicProcedure
    .input(z.object({
      primaryColor: z.string().optional(),
      accentColor: z.string().optional(),
      logoUrl: z.string().optional(),
      tagline: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // In production, this would update the database
      const current = getCurrentCompanyData();
      return {
        ...current,
        branding: {
          ...current.branding,
          ...input
        }
      };
    }),

  // Get company branding
  getBranding: publicProcedure.query(async ({ ctx }) => {
    const company = getCurrentCompanyData();
    return company.branding;
  })
});