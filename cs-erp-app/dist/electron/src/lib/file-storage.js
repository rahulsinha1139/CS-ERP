"use strict";
/**
 * File Storage Engine for Document Management
 * Handles file uploads, storage, and retrieval with security
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUtils = exports.fileStorage = exports.FileStorageEngine = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
class FileStorageEngine {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
        this.allowedMimeTypes = new Set([
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv',
        ]);
    }
    static getInstance() {
        if (!FileStorageEngine.instance) {
            FileStorageEngine.instance = new FileStorageEngine();
        }
        return FileStorageEngine.instance;
    }
    /**
     * Initialize storage directories
     */
    async initialize() {
        await this.ensureDirectoryExists(this.uploadDir);
        await this.ensureDirectoryExists(path_1.default.join(this.uploadDir, 'documents'));
        await this.ensureDirectoryExists(path_1.default.join(this.uploadDir, 'invoices'));
        await this.ensureDirectoryExists(path_1.default.join(this.uploadDir, 'temp'));
    }
    /**
     * Store uploaded file
     */
    async storeFile(buffer, originalName, mimetype, category = 'documents', _uploadedBy) {
        try {
            // Validate file
            const validation = this.validateFile(buffer, originalName, mimetype);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }
            // Generate unique filename
            const fileId = this.generateFileId();
            const extension = path_1.default.extname(originalName);
            const filename = `${fileId}${extension}`;
            const filePath = path_1.default.join(this.uploadDir, category, filename);
            // Ensure directory exists
            await this.ensureDirectoryExists(path_1.default.dirname(filePath));
            // Write file
            await fs_1.promises.writeFile(filePath, buffer);
            return {
                success: true,
                fileId,
                filename,
                size: buffer.length,
                mimetype,
                path: filePath,
            };
        }
        catch (_error) {
            return {
                success: false,
                error: _error instanceof Error ? _error.message : 'Unknown error',
            };
        }
    }
    /**
     * Retrieve file
     */
    async getFile(fileId, category = 'documents') {
        try {
            // Find file by ID (we need to search for the extension)
            const categoryDir = path_1.default.join(this.uploadDir, category);
            const files = await fs_1.promises.readdir(categoryDir);
            const targetFile = files.find(file => file.startsWith(fileId));
            if (!targetFile) {
                return null;
            }
            const filePath = path_1.default.join(categoryDir, targetFile);
            return await fs_1.promises.readFile(filePath);
        }
        catch (error) {
            console.error('Error retrieving file:', error);
            return null;
        }
    }
    /**
     * Delete file
     */
    async deleteFile(fileId, category = 'documents') {
        try {
            const categoryDir = path_1.default.join(this.uploadDir, category);
            const files = await fs_1.promises.readdir(categoryDir);
            const targetFile = files.find(file => file.startsWith(fileId));
            if (!targetFile) {
                return false;
            }
            const filePath = path_1.default.join(categoryDir, targetFile);
            await fs_1.promises.unlink(filePath);
            return true;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    /**
     * Get file info
     */
    async getFileInfo(fileId, category = 'documents') {
        try {
            const categoryDir = path_1.default.join(this.uploadDir, category);
            const files = await fs_1.promises.readdir(categoryDir);
            const targetFile = files.find(file => file.startsWith(fileId));
            if (!targetFile) {
                return { exists: false };
            }
            const filePath = path_1.default.join(categoryDir, targetFile);
            const stats = await fs_1.promises.stat(filePath);
            return {
                exists: true,
                size: stats.size,
                filename: targetFile,
                path: filePath,
            };
        }
        catch (_error) {
            return { exists: false };
        }
    }
    /**
     * Clean up temporary files older than specified age
     */
    async cleanupTempFiles(olderThanHours = 24) {
        try {
            const tempDir = path_1.default.join(this.uploadDir, 'temp');
            const files = await fs_1.promises.readdir(tempDir);
            const cutoffTime = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));
            let deletedCount = 0;
            for (const file of files) {
                const filePath = path_1.default.join(tempDir, file);
                const stats = await fs_1.promises.stat(filePath);
                if (stats.mtime < cutoffTime) {
                    await fs_1.promises.unlink(filePath);
                    deletedCount++;
                }
            }
            return deletedCount;
        }
        catch (error) {
            console.error('Error cleaning up temp files:', error);
            return 0;
        }
    }
    /**
     * Validate file before storage
     */
    validateFile(buffer, filename, mimetype) {
        // Check file size
        if (buffer.length > this.maxFileSize) {
            return {
                valid: false,
                error: `File size exceeds limit of ${this.maxFileSize} bytes`,
            };
        }
        // Check MIME type
        if (!this.allowedMimeTypes.has(mimetype)) {
            return {
                valid: false,
                error: `File type ${mimetype} is not allowed`,
            };
        }
        // Check filename
        if (!filename || filename.length > 255) {
            return {
                valid: false,
                error: 'Invalid filename',
            };
        }
        // Check for dangerous file extensions
        const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
        const extension = path_1.default.extname(filename).toLowerCase();
        if (dangerousExtensions.includes(extension)) {
            return {
                valid: false,
                error: 'File type not allowed for security reasons',
            };
        }
        return { valid: true };
    }
    /**
     * Generate unique file ID
     */
    generateFileId() {
        const timestamp = Date.now().toString(36);
        const random = (0, crypto_1.randomBytes)(8).toString('hex');
        return `${timestamp}_${random}`;
    }
    /**
     * Ensure directory exists
     */
    async ensureDirectoryExists(dirPath) {
        try {
            await fs_1.promises.access(dirPath);
        }
        catch {
            await fs_1.promises.mkdir(dirPath, { recursive: true });
        }
    }
    /**
     * Get storage statistics
     */
    async getStorageStats() {
        const categories = ['documents', 'invoices', 'temp'];
        const stats = {
            totalFiles: 0,
            totalSize: 0,
            categorySizes: {},
        };
        for (const category of categories) {
            const categoryDir = path_1.default.join(this.uploadDir, category);
            try {
                const files = await fs_1.promises.readdir(categoryDir);
                let categorySize = 0;
                for (const file of files) {
                    const filePath = path_1.default.join(categoryDir, file);
                    const fileStat = await fs_1.promises.stat(filePath);
                    categorySize += fileStat.size;
                }
                stats.categorySizes[category] = {
                    files: files.length,
                    size: categorySize,
                };
                stats.totalFiles += files.length;
                stats.totalSize += categorySize;
            }
            catch (_error) {
                stats.categorySizes[category] = { files: 0, size: 0 };
            }
        }
        return stats;
    }
}
exports.FileStorageEngine = FileStorageEngine;
// Export singleton instance
exports.fileStorage = FileStorageEngine.getInstance();
// Utility functions
exports.fileUtils = {
    /**
     * Format file size for display
     */
    formatFileSize: (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0)
            return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },
    /**
     * Get file icon based on MIME type
     */
    getFileIcon: (mimetype) => {
        const iconMap = {
            'application/pdf': '📄',
            'image/jpeg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🖼️',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'text/plain': '📋',
            'text/csv': '📊',
        };
        return iconMap[mimetype] || '📎';
    },
    /**
     * Check if file is an image
     */
    isImage: (mimetype) => {
        return mimetype.startsWith('image/');
    },
    /**
     * Generate secure filename
     */
    sanitizeFilename: (filename) => {
        return filename
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 100);
    },
};
