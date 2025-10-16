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

  const url = isDev
    ? 'http://localhost:3005' // Your Next.js dev server
    : `file://${path.join(__dirname, '../renderer/out/index.html')}`;

  win.loadURL(url);

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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
