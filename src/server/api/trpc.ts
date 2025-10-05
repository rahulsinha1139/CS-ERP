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
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
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
  // For now, we'll use a simple company ID
  // This will be replaced with proper authentication
  return createInnerTRPCContext({
    companyId: '001',
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

// Performance tracking middleware for Mrs. Pradhan's practice insights
const performanceTrackingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();

  const result = await next();

  const durationMs = Date.now() - start;

  // Log performance insights only for slow queries (>1s) or in development when PERF_LOG=true
  if (durationMs > 1000 || process.env.PERF_LOG === 'true') {
    console.log(`🎯 Practice API Performance: ${type}.${path} - ${durationMs}ms`);
  }

  // Future: Store in performance tracking system for dashboard insights
  // This will help Mrs. Pradhan understand which operations are slowest

  return result;
});

export const publicProcedure = t.procedure.use(performanceTrackingMiddleware);

/**
 * Middleware to check if the user is authenticated.
 * Rejects the request with an 'UNAUTHORIZED' error if the user is not signed in.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  // For single-user CS practice, we'll simulate session presence
  // In future: integrate with NextAuth.js session validation
  const mockSession = {
    user: {
      id: '001',
      email: 'admin@cspractice.com',
      name: 'Mrs. Pradhan',
      companyId: '001'
    }
  };

  if (!mockSession || !mockSession.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // Infers the session as non-nullable to downstream procedures
      session: { ...mockSession, user: mockSession.user },
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged-in users, use this. It verifies
 * the session is valid and guarantees ctx.session.user is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

// Company-scoped procedure with performance tracking
export const companyProcedure = t.procedure
  .use(performanceTrackingMiddleware)
  .use(
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
