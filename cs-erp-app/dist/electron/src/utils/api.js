"use strict";
// src/utils/api.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const client_1 = require("@trpc/client");
const next_1 = require("@trpc/next");
const superjson_1 = __importDefault(require("superjson"));
// Check if running in Electron
const isElectron = typeof window !== "undefined" && window.electronTRPC !== undefined;
const getBaseUrl = () => {
    if (typeof window !== "undefined")
        return ""; // browser should use relative url
    if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
exports.api = (0, next_1.createTRPCNext)({
    config() {
        // Dynamic import to avoid bundling issues
        let transportLink;
        if (isElectron && typeof window !== "undefined") {
            // Use Electron IPC transport
            const { ipcLink } = require("trpc-electron/renderer");
            transportLink = ipcLink({
                transformer: superjson_1.default,
            });
        }
        else {
            // Use HTTP transport for web browser
            transportLink = (0, client_1.httpBatchLink)({
                url: `${getBaseUrl()}/api/trpc`,
                transformer: superjson_1.default,
            });
        }
        return {
            links: [
                (0, client_1.loggerLink)({
                    enabled: (opts) => process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                transportLink,
            ],
        };
    },
    ssr: false,
    transformer: superjson_1.default,
});
