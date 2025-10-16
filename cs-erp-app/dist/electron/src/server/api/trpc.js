"use strict";
/**
 * tRPC Server Configuration
 * Enterprise-grade API setup with authentication, validation, and error handling
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyProcedure = exports.protectedProcedure = exports.publicProcedure = exports.createTRPCRouter = exports.createTRPCContext = exports.db = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const auth_1 = require("@/lib/auth");
// Initialize Prisma client
const globalForPrisma = globalThis;
exports.db = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.db;
const createInnerTRPCContext = (opts) => {
    return {
        db: exports.db,
        companyId: opts.companyId,
        req: opts.req,
        res: opts.res,
    };
};
const createTRPCContext = async (opts) => {
    // Get session from iron-session (real authentication)
    // Pass req and res for Pages Router compatibility
    const session = await (0, auth_1.getSession)(opts.req, opts.res);
    return createInnerTRPCContext({
        companyId: session?.companyId,
        req: opts.req,
        res: opts.res,
    });
};
exports.createTRPCContext = createTRPCContext;
/**
 * 2. INITIALIZATION
 */
const t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
/**
 * 3. ROUTER & PROCEDURE HELPERS
 */
exports.createTRPCRouter = t.router;
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
exports.publicProcedure = t.procedure.use(performanceTrackingMiddleware);
/**
 * Middleware to check if the user is authenticated.
 * Rejects the request with an 'UNAUTHORIZED' error if the user is not signed in.
 */
const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
    // Get real session from iron-session (pass req/res from context)
    const session = await (0, auth_1.getSession)(ctx.req, ctx.res);
    if (!session || !session.isAuthenticated) {
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // Infers the session as non-nullable to downstream procedures
            session: {
                user: {
                    id: session.userId,
                    email: session.email,
                    companyId: session.companyId,
                },
            },
            companyId: session.companyId,
            req: ctx.req,
            res: ctx.res,
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
exports.protectedProcedure = t.procedure.use(enforceUserIsAuthed);
// Company-scoped procedure with performance tracking
exports.companyProcedure = t.procedure
    .use(performanceTrackingMiddleware)
    .use(t.middleware(async ({ ctx, next }) => {
    // Ensure we have a company context
    if (!ctx.companyId) {
        throw new server_1.TRPCError({
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
}));
