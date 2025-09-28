/**
 * Mock Customer API Router - Temporary for development
 * Uses mock data service instead of database for immediate functionality
 */

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import MockDataService from '../../../lib/mock-data';

// Validation schemas
const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'totalBilled']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().optional(),
  stateCode: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  creditDays: z.number().min(0).optional(),
  whatsappNumber: z.string().optional(),
  preferredLanguage: z.string().default('en'),
  timezone: z.string().default('Asia/Kolkata'),
});

export const customerMockRouter = createTRPCRouter({
  // Get all customers with financial summary
  getAll: publicProcedure
    .input(paginationSchema.optional())
    .query(async ({ input = {} }) => {
      const { search } = input;

      let result = MockDataService.getAllCustomers();

      // Apply search filter
      if (search) {
        result.customers = result.customers.filter(customer =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email?.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone?.includes(search) ||
          customer.gstin?.toLowerCase().includes(search.toLowerCase())
        );
      }

      return result;
    }),

  // Get customer by ID with complete financial dashboard
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const customer = MockDataService.getCustomerById(input.id);
        return customer;
      } catch (_error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Customer not found',
        });
      }
    }),

  // Get customer invoices with payment status
  getInvoices: publicProcedure
    .input(z.object({
      customerId: z.string(),
      status: z.enum(['ALL', 'PAID', 'UNPAID', 'OVERDUE', 'PARTIALLY_PAID']).default('ALL'),
    }))
    .query(async ({ input }) => {
      const invoices = MockDataService.getInvoicesByCustomer(input.customerId, input.status);
      return invoices;
    }),

  // Get simple customer list for forms/dropdowns
  getList: publicProcedure
    .query(async () => {
      const customers = MockDataService.getCustomerList();
      return customers;
    }),

  // Create new customer
  create: publicProcedure
    .input(createCustomerSchema)
    .mutation(async ({ input }) => {
      const customer = MockDataService.createCustomer(input);
      return customer;
    }),

  // Update customer (mock implementation)
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: createCustomerSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      // For now, just return success - would update mock data in real implementation
      return { id: input.id, ...input.data };
    }),

  // Get top customers by revenue
  getTopCustomers: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      period: z.enum(['7d', '30d', '90d', '1y', 'all']).default('all'),
    }))
    .query(async ({ input }) => {
      const topCustomers = MockDataService.getTopCustomers(input.limit);
      return topCustomers;
    }),
});