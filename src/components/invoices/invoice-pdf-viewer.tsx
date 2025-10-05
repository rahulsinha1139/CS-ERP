/**
 * Invoice PDF Viewer Component
 * Integrates with PDF engine for invoice generation and display
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PDFEngine } from '../../lib/pdf-engine';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, Eye, Send, Loader2 } from 'lucide-react';

interface InvoicePDFViewerProps {
  invoice: {
    id: string;
    number: string;
    issueDate: Date;
    dueDate?: Date;
    status: string;
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

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Transform invoice data to match PDF engine expected format
      const pdfData = {
        company: {
          name: invoice.company?.name || 'Company Name',
          address: invoice.company?.address || '',
          gstin: invoice.company?.gstin || '',
          email: invoice.company?.email || '',
          phone: invoice.company?.phone || '',
          website: invoice.company?.website || '',
          logo: invoice.company?.logo || undefined,
        },
        customer: {
          name: invoice.customer.name,
          gstin: invoice.customer.gstin,
          address: invoice.customer.address || '',
          stateCode: invoice.customer.stateCode || '',
          email: invoice.customer.email,
          phone: invoice.customer.phone,
        },
        invoice: {
          number: invoice.number,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          placeOfSupply: invoice.placeOfSupply,
          status: invoice.status,
          currency: 'INR',
          notes: invoice.notes,
          terms: invoice.terms,
        },
        lineItems: invoice.lines.map((line) => ({
          description: line.description,
          quantity: line.quantity,
          rate: line.rate,
          taxableValue: line.quantity * line.rate,
          cgst: (line.quantity * line.rate * line.gstRate) / 200, // Half of GST for CGST
          sgst: (line.quantity * line.rate * line.gstRate) / 200, // Half of GST for SGST
          igst: invoice.taxBreakdown.igstAmount > 0 ? (line.quantity * line.rate * line.gstRate) / 100 : 0,
          lineTotal: line.amount,
          gstRate: line.gstRate,
          hsnSac: (line as { hsnSac?: string }).hsnSac || '',
        })),
        totals: {
          ...invoice.taxBreakdown,
          taxableValue: invoice.taxBreakdown.subtotal,
          grandTotal: invoice.grandTotal,
          isInterstate: invoice.taxBreakdown.igstAmount > 0,
        },
        branding: {
          primaryColor: '#1e40af',
          accentColor: '#3b82f6',
          logoPosition: 'left',
          showWatermark: invoice.status === 'SENT',
        },
        paymentDetails: invoice.company?.bankName ? {
          bankName: invoice.company.bankName,
          accountNumber: invoice.company.accountNumber || '',
          ifscCode: invoice.company.ifscCode || '',
          upiId: invoice.company.upiId || '',
        } : undefined,
      };

      const pdfEngine = PDFEngine.getInstance();
      const pdfBlob = await pdfEngine.generatePDFBlob(pdfData);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [invoice]);

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