// Preload script for Electron
// This file runs before the web page is loaded
// Exposes IPC functionality to the renderer process for tRPC

import { contextBridge } from 'electron';
import { exposeElectronTRPC } from 'trpc-electron/main';

process.once('loaded', () => {
  // Expose tRPC IPC functionality to the renderer process
  exposeElectronTRPC();
});
