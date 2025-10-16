// src/utils/api.ts

import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type AppRouter } from "@/server/api/root";
import superjson from "superjson";

// Check if running in Electron
const isElectron = typeof window !== "undefined" && (window as any).electronTRPC !== undefined;

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const api = createTRPCNext<AppRouter>({
  config() {
    // Dynamic import to avoid bundling issues
    let transportLink;

    if (isElectron && typeof window !== "undefined") {
      // Use Electron IPC transport
      const { ipcLink } = require("trpc-electron/renderer");
      transportLink = ipcLink({
        transformer: superjson,
      });
    } else {
      // Use HTTP transport for web browser
      transportLink = httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
      });
    }

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        transportLink,
      ],
    };
  },
  ssr: false,
  transformer: superjson,
});
