/**
 * Invoice Attachments Component
 * File upload, display, and management for invoice attachments
 * Integrates with Supabase Storage and attachment API router
 */

import React, { useState } from 'react';
import { api } from '@/utils/api';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, FileText, Download, Loader2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface InvoiceAttachmentsProps {
  invoiceId: string;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function InvoiceAttachments({ invoiceId }: InvoiceAttachmentsProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');

  const utils = api.useUtils();

  // Fetch attachments
  const { data: attachments, isLoading } = api.attachment.getByInvoiceId.useQuery({
    invoiceId,
  });

  // Create attachment mutation
  const createAttachment = api.attachment.create.useMutation({
    onSuccess: () => {
      utils.attachment.getByInvoiceId.invalidate({ invoiceId });
      setSelectedFile(null);
      setFileDescription('');
      setUploadError(null);
    },
    onError: (error) => {
      setUploadError(error.message);
    },
  });

  // Delete attachment mutation
  const deleteAttachment = api.attachment.delete.useMutation({
    onSuccess: async (data) => {
      // Delete file from Supabase Storage
      if (data.storagePath) {
        await supabase.storage
          .from('invoice-attachments')
          .remove([data.storagePath]);
      }
      utils.attachment.getByInvoiceId.invalidate({ invoiceId });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed');
      return;
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size must be less than 15MB');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Generate unique file path
      const timestamp = Date.now();
      const fileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${invoiceId}/${timestamp}_${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoice-attachments')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('invoice-attachments')
        .getPublicUrl(filePath);

      // Save attachment metadata to database
      await createAttachment.mutateAsync({
        invoiceId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        storagePath: uploadData.path,
        storageUrl: urlData.publicUrl,
        description: fileDescription.trim() || undefined,
        displayOrder: (attachments?.length || 0) + 1,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return;
    await deleteAttachment.mutateAsync({ id: attachmentId });
  };

  const handleDownload = async (attachment: {
    id: string;
    fileName: string;
    storagePath: string;
    fileSize: number;
  }) => {
    try {
      const { data, error } = await supabase.storage
        .from('invoice-attachments')
        .download(attachment.storagePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload PDF Attachment</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                disabled={uploading}
                className="flex-1"
              />
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileDescription('');
                    setUploadError(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              PDF files only, max 15MB
            </p>
          </div>

          {selectedFile && (
            <div className="space-y-2">
              <Label htmlFor="file-description">Description (Optional)</Label>
              <Input
                id="file-description"
                type="text"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="e.g., Supporting invoice, Bill copy, Receipt"
                disabled={uploading}
              />
            </div>
          )}

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}
        </div>

        {/* Attachments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : attachments && attachments.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Uploaded Files ({attachments.length})
            </h3>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.fileName}
                      </p>
                      {attachment.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {attachment.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB •
                        Uploaded {formatDate(attachment.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(attachment.id)}
                      disabled={deleteAttachment.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleteAttachment.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No attachments uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
