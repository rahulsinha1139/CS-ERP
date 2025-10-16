"use strict";
// Preload script for Electron
// This file runs before the web page is loaded
// Exposes IPC functionality to the renderer process for tRPC
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("trpc-electron/main");
process.once('loaded', () => {
    // Expose tRPC IPC functionality to the renderer process
    (0, main_1.exposeElectronTRPC)();
});
