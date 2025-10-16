"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const main_1 = require("trpc-electron/main");
// Import the tRPC router
const root_1 = require("../src/server/api/root");
const trpc_1 = require("../src/server/api/trpc");
const file_storage_1 = require("../src/lib/file-storage");
// Default admin user for Electron single-user mode
const ADMIN_USER = {
    id: 'user_admin_001',
    email: 'admin@pragnyapradhan.com',
    companyId: 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b', // Actual UUID from database
    name: 'Pragnya Pradhan',
};
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js'), // Note: it will be .js after compilation
        },
    });
    const url = electron_is_dev_1.default
        ? 'http://localhost:3005' // Your Next.js dev server
        : `file://${path_1.default.join(__dirname, '../renderer/out/index.html')}`;
    win.loadURL(url);
    if (electron_is_dev_1.default) {
        win.webContents.openDevTools();
    }
    return win;
}
// Set up tRPC IPC handler
electron_1.app.whenReady().then(async () => {
    // Initialize file storage directories
    await file_storage_1.fileStorage.initialize();
    console.log('✅ File storage initialized');
    // Create window first to get instance
    const mainWindow = createWindow();
    // Create tRPC IPC handler for Electron
    (0, main_1.createIPCHandler)({
        router: root_1.appRouter,
        windows: [mainWindow],
        createContext: async () => {
            // For Electron single-user mode, automatically authenticate as admin
            // This eliminates the need for login in desktop app
            return {
                db: trpc_1.db,
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
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
