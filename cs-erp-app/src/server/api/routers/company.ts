/**
 * Company Router
 * Professional company management for CS practice
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
  getAll: protectedProcedure.query(async () => {
    return [];
  }),

  // Get current company (for CS practice)
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    // Fetch actual company from database using the session's companyId
    const company = await ctx.db.company.findFirst({
      where: {
        id: ctx.session.user.companyId,
      },
    });

    // Return company data with all fields needed for PDF generation
    if (company) {
      return {
        id: company.id,
        name: company.name || 'PRAGNYA PRADHAN & ASSOCIATES',
        email: company.email || 'pragnyap.pradhan@gmail.com',
        phone: company.phone || '+91 9953457413',
        address: company.address || '46, LGF, JOR BAGH, New Delhi-110003',
        gstin: company.gstin || '',
        stateCode: company.stateCode || '07',
        pan: company.pan || 'AMEPP4323R',
        website: company.website || '',
        logo: company.logo || '/images/company-logo.png',
      };
    }

    // Fallback to Pragnya Pradhan's details if company not found
    return {
      id: ctx.session.user.companyId,
      name: 'PRAGNYA PRADHAN & ASSOCIATES',
      email: 'pragnyap.pradhan@gmail.com',
      phone: '+91 9953457413',
      address: '46, LGF, JOR BAGH, New Delhi-110003',
      gstin: '',
      stateCode: '07',
      pan: 'AMEPP4323R',
      website: '',
      logo: '/images/company-logo.png',
    };
  }),

  // Get company by ID (with fallback)
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (input.id === 1) {
        return getCurrentCompanyData();
      }
      return null;
    }),

  // Update company settings
  updateSettings: protectedProcedure
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
  getSettings: protectedProcedure.query(async () => {
    const company = getCurrentCompanyData();
    return company.settings;
  }),

  // Update company branding
  updateBranding: protectedProcedure
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
  getBranding: protectedProcedure.query(async () => {
    const company = getCurrentCompanyData();
    return company.branding;
  })
});