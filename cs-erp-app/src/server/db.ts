import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Serverless-optimized Prisma client configuration
// CRITICAL: DATABASE_URL must include 'pgbouncer=true' parameter to disable prepared statements
export const db =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Prevent connection pooling exhaustion in serverless
if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
}

// Force disconnect on serverless function completion to prevent stale connections
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await db.$disconnect();
  });
}
