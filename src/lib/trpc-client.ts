/**
 * Real tRPC Client Configuration
 * Replaces the mock implementation with actual API calls
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';

import { type AppRouter } from '../server/api/root';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCReact<AppRouter>();

/** Performance-optimized React Query configuration */
export const performanceQueryConfig = {
  staleTime: {
    // Static data (rarely changes)
    customers: 15 * 60 * 1000,        // 15 minutes
    companies: 30 * 60 * 1000,        // 30 minutes
    services: 30 * 60 * 1000,         // 30 minutes

    // Dynamic data (changes frequently)
    invoices: 3 * 60 * 1000,          // 3 minutes
    payments: 2 * 60 * 1000,          // 2 minutes
    dashboard: 1 * 60 * 1000,         // 1 minute

    // Real-time data
    compliance: 30 * 1000,            // 30 seconds
  },
  cacheTime: 30 * 60 * 1000,          // 30 minutes background cache
  refetchOnWindowFocus: false,         // Reduce unnecessary requests
  retry: 1,                           // Faster failure handling
};

/** tRPC configuration for Next.js */
export const trpcClientConfig = {
  /**
   * Transformer used for data de-serialization from the server.
   */
  transformer: superjson,

  /**
   * Links used to determine request flow from client to server.
   */
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      // Performance optimization: batch multiple requests
      maxURLLength: 2083,
    }),
  ],
};