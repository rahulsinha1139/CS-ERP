/**
 * File Storage Engine for Document Management
 * Handles file uploads, storage, and retrieval with security
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

export interface FileUploadResult {
  success: boolean;
  fileId?: string;
  filename?: string;
  size?: number;
  mimetype?: string;
  path?: string;
  error?: string;
}

export interface StoredFile {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export class FileStorageEngine {
  private static instance: FileStorageEngine;
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: Set<string>;

  private constructor() {
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

  static getInstance(): FileStorageEngine {
    if (!FileStorageEngine.instance) {
      FileStorageEngine.instance = new FileStorageEngine();
    }
    return FileStorageEngine.instance;
  }

  /**
   * Initialize storage directories
   */
  async initialize(): Promise<void> {
    await this.ensureDirectoryExists(this.uploadDir);
    await this.ensureDirectoryExists(path.join(this.uploadDir, 'documents'));
    await this.ensureDirectoryExists(path.join(this.uploadDir, 'invoices'));
    await this.ensureDirectoryExists(path.join(this.uploadDir, 'temp'));
  }

  /**
   * Store uploaded file
   */
  async storeFile(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
    category: 'documents' | 'invoices' | 'temp' = 'documents',
    _uploadedBy: string
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(buffer, originalName, mimetype);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique filename
      const fileId = this.generateFileId();
      const extension = path.extname(originalName);
      const filename = `${fileId}${extension}`;
      const filePath = path.join(this.uploadDir, category, filename);

      // Ensure directory exists
      await this.ensureDirectoryExists(path.dirname(filePath));

      // Write file
      await fs.writeFile(filePath, buffer);

      return {
        success: true,
        fileId,
        filename,
        size: buffer.length,
        mimetype,
        path: filePath,
      };

    } catch (_error) {
      return {
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error',
      };
    }
  }

  /**
   * Retrieve file
   */
  async getFile(fileId: string, category: 'documents' | 'invoices' | 'temp' = 'documents'): Promise<Buffer | null> {
    try {
      // Find file by ID (we need to search for the extension)
      const categoryDir = path.join(this.uploadDir, category);
      const files = await fs.readdir(categoryDir);

      const targetFile = files.find(file => file.startsWith(fileId));
      if (!targetFile) {
        return null;
      }

      const filePath = path.join(categoryDir, targetFile);
      return await fs.readFile(filePath);

    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileId: string, category: 'documents' | 'invoices' | 'temp' = 'documents'): Promise<boolean> {
    try {
      const categoryDir = path.join(this.uploadDir, category);
      const files = await fs.readdir(categoryDir);

      const targetFile = files.find(file => file.startsWith(fileId));
      if (!targetFile) {
        return false;
      }

      const filePath = path.join(categoryDir, targetFile);
      await fs.unlink(filePath);
      return true;

    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(fileId: string, category: 'documents' | 'invoices' | 'temp' = 'documents'): Promise<{
    exists: boolean;
    size?: number;
    filename?: string;
    path?: string;
  }> {
    try {
      const categoryDir = path.join(this.uploadDir, category);
      const files = await fs.readdir(categoryDir);

      const targetFile = files.find(file => file.startsWith(fileId));
      if (!targetFile) {
        return { exists: false };
      }

      const filePath = path.join(categoryDir, targetFile);
      const stats = await fs.stat(filePath);

      return {
        exists: true,
        size: stats.size,
        filename: targetFile,
        path: filePath,
      };

    } catch (_error) {
      return { exists: false };
    }
  }

  /**
   * Clean up temporary files older than specified age
   */
  async cleanupTempFiles(olderThanHours: number = 24): Promise<number> {
    try {
      const tempDir = path.join(this.uploadDir, 'temp');
      const files = await fs.readdir(tempDir);
      const cutoffTime = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000));

      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(tempDir, file);
        const stats = await fs.stat(filePath);

        if (stats.mtime < cutoffTime) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      return deletedCount;

    } catch (error) {
      console.error('Error cleaning up temp files:', error);
      return 0;
    }
  }

  /**
   * Validate file before storage
   */
  private validateFile(buffer: Buffer, filename: string, mimetype: string): {
    valid: boolean;
    error?: string;
  } {
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
    const extension = path.extname(filename).toLowerCase();
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
  private generateFileId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(8).toString('hex');
    return `${timestamp}_${random}`;
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    categorySizes: Record<string, { files: number; size: number }>;
  }> {
    const categories = ['documents', 'invoices', 'temp'];
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      categorySizes: {} as Record<string, { files: number; size: number }>,
    };

    for (const category of categories) {
      const categoryDir = path.join(this.uploadDir, category);
      try {
        const files = await fs.readdir(categoryDir);
        let categorySize = 0;

        for (const file of files) {
          const filePath = path.join(categoryDir, file);
          const fileStat = await fs.stat(filePath);
          categorySize += fileStat.size;
        }

        stats.categorySizes[category] = {
          files: files.length,
          size: categorySize,
        };

        stats.totalFiles += files.length;
        stats.totalSize += categorySize;

      } catch (_error) {
        stats.categorySizes[category] = { files: 0, size: 0 };
      }
    }

    return stats;
  }
}

// Export singleton instance
export const fileStorage = FileStorageEngine.getInstance();

// Utility functions
export const fileUtils = {
  /**
   * Format file size for display
   */
  formatFileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get file icon based on MIME type
   */
  getFileIcon: (mimetype: string): string => {
    const iconMap: Record<string, string> = {
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
  isImage: (mimetype: string): boolean => {
    return mimetype.startsWith('image/');
  },

  /**
   * Generate secure filename
   */
  sanitizeFilename: (filename: string): string => {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100);
  },
};