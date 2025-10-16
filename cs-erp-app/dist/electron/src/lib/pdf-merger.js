"use strict";
/**
 * PDF Merger Utility
 * Merges multiple invoice PDFs and attachments into a single consolidated PDF
 * Uses pdf-lib for browser-side PDF manipulation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFMerger = void 0;
exports.downloadConsolidatedInvoice = downloadConsolidatedInvoice;
const pdf_lib_1 = require("pdf-lib");
class PDFMerger {
    /**
     * Merge multiple PDF sources into a single PDF
     * @param sources - Array of PDF sources (blobs, URLs, or array buffers)
     * @param options - Merge options
     * @returns Merged PDF as Blob
     */
    static async mergePDFs(sources, options) {
        try {
            // Create a new PDF document
            const mergedPdf = await pdf_lib_1.PDFDocument.create();
            // Add cover page if requested
            if (options?.addCoverPage) {
                await this.addCoverPage(mergedPdf, {
                    title: options.coverPageTitle || 'Consolidated Invoice Package',
                    subtitle: options.coverPageSubtitle || '',
                });
            }
            // Process each source PDF
            for (const source of sources) {
                try {
                    const pdfBytes = await this.loadPDFBytes(source);
                    const sourcePdf = await pdf_lib_1.PDFDocument.load(pdfBytes, {
                        ignoreEncryption: true
                    });
                    // Copy all pages from source PDF
                    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
                    // Add all copied pages to merged PDF
                    copiedPages.forEach((page) => {
                        mergedPdf.addPage(page);
                    });
                }
                catch (error) {
                    console.error(`Failed to merge PDF from source:`, error);
                    // Continue with other PDFs even if one fails
                }
            }
            // Save the merged PDF
            const mergedPdfBytes = await mergedPdf.save();
            // Convert to Blob (convert Uint8Array to regular array first)
            const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
            return blob;
        }
        catch (error) {
            console.error('PDF merge error:', error);
            throw new Error('Failed to merge PDFs. Please try again.');
        }
    }
    /**
     * Load PDF bytes from various source types
     */
    static async loadPDFBytes(source) {
        switch (source.type) {
            case 'blob':
                return await source.data.arrayBuffer();
            case 'url':
                const response = await fetch(source.data);
                if (!response.ok) {
                    throw new Error(`Failed to fetch PDF from URL: ${source.data}`);
                }
                return await response.arrayBuffer();
            case 'arraybuffer':
                return source.data;
            default:
                throw new Error(`Unsupported PDF source type: ${source.type}`);
        }
    }
    /**
     * Add a cover page to the PDF
     */
    static async addCoverPage(pdf, options) {
        const page = pdf.addPage([595.28, 841.89]); // A4 size in points
        const { width, height } = page.getSize();
        // Add title
        page.drawText(options.title, {
            x: 50,
            y: height - 100,
            size: 24,
        });
        // Add subtitle if provided
        if (options.subtitle) {
            page.drawText(options.subtitle, {
                x: 50,
                y: height - 140,
                size: 14,
            });
        }
        // Add generation date
        const dateStr = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        page.drawText(`Generated on: ${dateStr}`, {
            x: 50,
            y: height - 180,
            size: 12,
        });
    }
    /**
     * Download merged PDF with custom filename
     */
    static downloadPDF(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    /**
     * Helper: Merge invoice PDFs with attachments
     * This is the primary method for quarterly invoicing
     */
    static async mergeInvoicePackage(invoicePDFs, attachmentPDFs, options) {
        // Build cover page subtitle
        const periodText = options.periodStart && options.periodEnd
            ? `Period: ${options.periodStart.toLocaleDateString('en-IN')} - ${options.periodEnd.toLocaleDateString('en-IN')}`
            : '';
        const subtitle = [
            options.customerName ? `Customer: ${options.customerName}` : '',
            periodText,
            `Invoices: ${invoicePDFs.length}`,
            attachmentPDFs.length > 0 ? `Attachments: ${attachmentPDFs.length}` : '',
        ]
            .filter(Boolean)
            .join('\n');
        // Combine all PDFs
        const allPDFs = [
            ...invoicePDFs.map((blob) => ({ type: 'blob', data: blob })),
            ...attachmentPDFs.map((blob) => ({ type: 'blob', data: blob })),
        ];
        return await this.mergePDFs(allPDFs, {
            addCoverPage: true,
            coverPageTitle: options.packageName,
            coverPageSubtitle: subtitle,
        });
    }
}
exports.PDFMerger = PDFMerger;
/**
 * Utility function: Merge and download invoice package
 * Use this in UI components for one-click consolidated PDF download
 */
async function downloadConsolidatedInvoice(invoicePDFs, attachmentPDFs, options) {
    try {
        const mergedPDF = await PDFMerger.mergeInvoicePackage(invoicePDFs, attachmentPDFs, options);
        const filename = options.filename ||
            `${options.packageName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
        PDFMerger.downloadPDF(mergedPDF, filename);
    }
    catch (error) {
        console.error('Failed to download consolidated invoice:', error);
        throw error;
    }
}
