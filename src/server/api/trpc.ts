/**
 * tRPC Server Configuration
 * Enterprise-grade API setup with authentication, validation, and error handling
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

/**
 * 1. CONTEXT
 */
interface CreateContextOptions {
  companyId?: string;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    db,
    companyId: opts.companyId,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  // For now, we'll use a default company ID
  // This will be replaced with proper authentication
  return createInnerTRPCContext({
    companyId: 'default-company',
  });
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE HELPERS
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Company-scoped procedure (temporary implementation)
export const companyProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    // Ensure we have a company context
    if (!ctx.companyId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Company context required'
      });
    }

    return next({
      ctx: {
        ...ctx,
        companyId: ctx.companyId,
      },
    });
  })
);
