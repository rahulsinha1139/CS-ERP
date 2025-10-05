/**
 * tRPC API Handler for Next.js
 * This endpoint handles all tRPC requests
 */

import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter, type AppRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

// Export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
          );
        }
      : undefined,
});

// Export type definition of API for client
export type { AppRouter };