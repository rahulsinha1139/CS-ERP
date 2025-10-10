/**
 * Invoice PDF Viewer Component
 * Integrates with PDF engine for invoice generation and display
 * Now includes automatic attachment merging
 */

import React, { useState, useEffect, useCallback } from 'react';
import { pragnyaPDFEngine } from '../../lib/pdf-engine-pragnya';
import { PDFMerger } from '../../lib/pdf-merger';
import { api } from '@/utils/api';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, Eye, Send, Loader2 } from 'lucide-react';
import { InvoiceStatus } from '@prisma/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface InvoicePDFViewerProps {
  invoice: {
    id: string;
    number: string;
    issueDate: Date;
    dueDate?: Date;
    status: InvoiceStatus;
    grandTotal: number;
    placeOfSupply?: string;
    notes?: string;
    terms?: string;
    customer: {
      name: string;
      email?: string;
      address?: string;
      gstin?: string;
      stateCode?: string;
      phone?: string;
    };
    company: {
      name: string;
      address: string;
      gstin: string;
      email: string;
      phone: string;
      website?: string;
      logo?: string;
      pan?: string;
      bankName?: string;
      accountNumber?: string;
      ifscCode?: string;
      upiId?: string;
    };
    lines: Array<{
      description: string;
      quantity: number;
      rate: number;
      gstRate: number;
      amount: number;
    }>;
    taxBreakdown: {
      subtotal: number;
      cgstAmount: number;
      sgstAmount: number;
      igstAmount: number;
      totalTax: number;
    };
  };
  onEmailSent?: () => void;
}

export default function InvoicePDFViewer({ invoice, onEmailSent }: InvoicePDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attachments for this invoice
  const { data: attachments } = api.attachment.getByInvoiceId.useQuery({
    invoiceId: invoice.id,
  });

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Helper function to convert number to words (simplified for Indian rupees)
      const numberToWords = (num: number): string => {
        if (num === 0) return 'Zero Rupees Only';

        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        const convertTwoDigit = (n: number): string => {
          if (n < 10) return ones[n];
          if (n >= 10 && n < 20) return teens[n - 10];
          return tens[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + ones[n % 10] : '');
        };

        const convertThreeDigit = (n: number): string => {
          const hundred = Math.floor(n / 100);
          const remainder = n % 100;
          let result = hundred > 0 ? ones[hundred] + ' Hundred' : '';
          if (remainder > 0) {
            result += (result ? ' ' : '') + convertTwoDigit(remainder);
          }
          return result;
        };

        const crore = Math.floor(num / 10000000);
        const lakh = Math.floor((num % 10000000) / 100000);
        const thousand = Math.floor((num % 100000) / 1000);
        const remainder = num % 1000;

        let words = '';
        if (crore > 0) words += convertTwoDigit(crore) + ' Crore ';
        if (lakh > 0) words += convertTwoDigit(lakh) + ' Lakh ';
        if (thousand > 0) words += convertTwoDigit(thousand) + ' Thousand ';
        if (remainder > 0) words += convertThreeDigit(remainder);

        return words.trim() + ' Rupees Only';
      };

      // DEBUG: Check what we're receiving
      console.log('🔍 PDF Generation Debug:');
      console.log('  Invoice ID:', invoice.id);
      console.log('  Invoice Number:', invoice.number);
      console.log('  Lines count:', invoice.lines?.length || 0);
      console.log('  Lines data:', JSON.stringify(invoice.lines, null, 2));

      // Transform invoice data to match Pragnya PDF engine format
      const pdfData = {
        company: {
          name: invoice.company?.name || 'PRAGNYA PRADHAN & ASSOCIATES',
          subtitle: 'PRACTICING COMPANY SECRETARIES',
          address: invoice.company?.address || '',
          email: invoice.company?.email || '',
          phone: invoice.company?.phone || '',
          pan: invoice.company?.pan || '',
          logo: invoice.company?.logo || '/images/company-logo.png',
        },
        customer: {
          name: invoice.customer.name,
          address: invoice.customer.address || '',
          city: '', // Extract from address if needed
          pin: '', // Extract from address if needed
          pan: invoice.customer.pan,
          gstin: invoice.customer.gstin,
        },
        invoice: {
          number: invoice.number,
          issueDate: invoice.issueDate,
          notes: invoice.notes || undefined,
        },
        lineItems: invoice.lines.map((line: any) => ({
          description: line.description,
          amount: line.amount,
          // Custom service columns support - ENHANCED!
          serviceType: line.serviceType,
          details: line.serviceData?.rows || undefined,
          subtotals: line.serviceData ? {
            govtFees: line.serviceData.totalGovtFees,
            professionalFees: line.serviceData.totalProfessionalFees,
            totalFees: line.serviceData.totalFees,
            totalHours: line.serviceData.totalHours,
            totalPages: line.serviceData.totalPages,
            totalDocuments: line.serviceData.totalDocuments,
          } : undefined,
        })),
        totals: {
          grandTotal: invoice.grandTotal,
          amountInWords: numberToWords(Math.round(invoice.grandTotal)),
        },
        signature: {
          proprietorName: 'Pragnya Parimita Pradhan',
          designation: 'Proprietor',
        },
      };

      const invoicePdfBlob = await pragnyaPDFEngine.generatePDFBlob(pdfData);

      // If there are attachments, merge them with the invoice PDF
      if (attachments && attachments.length > 0) {
        console.log(`🔗 Merging ${attachments.length} attachments with invoice PDF`);

        // Download all attachment PDFs from Supabase
        const attachmentBlobs: Blob[] = [];
        for (const attachment of attachments) {
          try {
            const { data, error } = await supabase.storage
              .from('invoice-attachments')
              .download(attachment.storagePath);

            if (!error && data) {
              attachmentBlobs.push(data);
              console.log(`✅ Downloaded attachment: ${attachment.fileName}`);
            } else {
              console.error(`❌ Failed to download ${attachment.fileName}:`, error);
            }
          } catch (err) {
            console.error(`❌ Error downloading ${attachment.fileName}:`, err);
          }
        }

        // Merge invoice PDF with attachments
        if (attachmentBlobs.length > 0) {
          const mergedBlob = await PDFMerger.mergePDFs([
            { type: 'blob', data: invoicePdfBlob },
            ...attachmentBlobs.map(blob => ({ type: 'blob' as const, data: blob })),
          ]);

          console.log(`✅ Successfully merged invoice with ${attachmentBlobs.length} attachments`);

          const url = URL.createObjectURL(mergedBlob);
          setPdfUrl(url);
        } else {
          // No attachments could be downloaded, use original invoice PDF
          const url = URL.createObjectURL(invoicePdfBlob);
          setPdfUrl(url);
        }
      } else {
        // No attachments, use original invoice PDF
        const url = URL.createObjectURL(invoicePdfBlob);
        setPdfUrl(url);
      }
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [invoice, attachments]);

  useEffect(() => {
    generatePDF();
  }, [generatePDF]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Invoice-${invoice.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEmailSend = async () => {
    if (!invoice.customer.email) {
      setError('Customer email not available');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // This would typically call the email engine through tRPC
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onEmailSent?.();
    } catch (err) {
      setError('Failed to send email. Please try again.');
      console.error('Email send error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handlePreview = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Invoice PDF - {invoice.number}</span>
          <div className="flex items-center gap-2">
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={!pdfUrl}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!pdfUrl}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                {invoice.customer.email && (
                  <Button
                    size="sm"
                    onClick={handleEmailSend}
                    disabled={!pdfUrl || isSending}
                    className="flex items-center gap-2"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send Email
                  </Button>
                )}
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {isGenerating ? (
          <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600">Generating PDF...</p>
            </div>
          </div>
        ) : pdfUrl ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-96"
              title={`Invoice ${invoice.number} PDF`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Unable to load PDF preview</p>
              <Button variant="outline" onClick={generatePDF}>
                Retry Generation
              </Button>
            </div>
          </div>
        )}

        {pdfUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Invoice Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2 font-medium">{invoice.customer.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <span className="ml-2 font-medium">₹{invoice.grandTotal.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Issue Date:</span>
                <span className="ml-2">{invoice.issueDate.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2">{invoice.status}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}