import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { createIPCHandler } from 'trpc-electron/main';

// Import the tRPC router
import { appRouter } from '../src/server/api/root';
import { db } from '../src/server/api/trpc';
import { fileStorage } from '../src/lib/file-storage';

// Default admin user for Electron single-user mode
const ADMIN_USER = {
  id: 'user_admin_001',
  email: 'admin@pragnyapradhan.com',
  companyId: 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b', // Actual UUID from database
  name: 'Pragnya Pradhan',
};

// Start Next.js server in production
let nextServer: any = null;

async function startNextServer() {
  if (isDev) return; // Use dev server in development

  // In production, use the standalone server
  // Standalone server is at .next/standalone/cs-erp-app/server.js
  const { spawn } = require('child_process');

  const standalonePath = path.join(__dirname, '../../.next/standalone/cs-erp-app/server.js');

  console.log('🚀 Starting standalone Next.js server...');
  console.log('📁 Server path:', standalonePath);

  // Spawn the standalone server as a child process
  const serverProcess = spawn('node', [standalonePath], {
    env: {
      ...process.env,
      PORT: '3005',
      HOSTNAME: 'localhost',
    },
    stdio: 'inherit',
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start Next.js server:', error);
  });

  // Wait for server to be ready
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('✅ Next.js standalone server started on http://localhost:3005');
      resolve();
    }, 2000); // Give it 2 seconds to start
  });
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Note: it will be .js after compilation
    },
  });

  // Always use localhost - Next.js server runs in both dev and prod
  win.loadURL('http://localhost:3005');

  if (isDev) {
    win.webContents.openDevTools();
  }

  return win;
}

// Set up tRPC IPC handler
app.whenReady().then(async () => {
  // Initialize file storage directories
  await fileStorage.initialize();
  console.log('✅ File storage initialized');

  // Start Next.js server in production mode
  await startNextServer();

  // Create window first to get instance
  const mainWindow = createWindow();

  // Create tRPC IPC handler for Electron
  createIPCHandler({
    router: appRouter,
    windows: [mainWindow],
    createContext: async () => {
      // For Electron single-user mode, automatically authenticate as admin
      // This eliminates the need for login in desktop app
      return {
        db,
        companyId: ADMIN_USER.companyId,
        session: {
          user: {
            id: ADMIN_USER.id,
            email: ADMIN_USER.email,
            companyId: ADMIN_USER.companyId,
          },
        },
        req: null,
        res: null,
      };
    },
  });
});

app.on('window-all-closed', () => {
  // Close Next.js server
  if (nextServer) {
    nextServer.close();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
