"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
// Serverless-optimized Prisma client configuration
// CRITICAL: DATABASE_URL must include 'pgbouncer=true' parameter to disable prepared statements
exports.db = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
// Prevent connection pooling exhaustion in serverless
if (process.env.NODE_ENV !== 'production') {
    global.prisma = exports.db;
}
// Force disconnect on serverless function completion to prevent stale connections
if (process.env.NODE_ENV === 'production') {
    process.on('beforeExit', async () => {
        await exports.db.$disconnect();
    });
}
