/**
 * Invoice Group Detail Page
 * Manage individual invoice group - add/remove invoices, generate PDF
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuraLayout } from '@/components/ui/aura-layout';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Loader2, Plus, X, FileText, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PDFMerger } from '@/lib/pdf-merger';
import { PDFEngine } from '@/lib/pdf-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InvoiceGroupDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [generating, setGenerating] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');

  const utils = api.useUtils();

  // Fetch group data
  const { data: group, isLoading } = api.invoiceGroup.getById.useQuery(
    { id: id as string },
    { enabled: !!id }
  );

  // Fetch available invoices (not in any group)
  const { data: availableInvoices } = api.invoice.list.useQuery(
    { page: 1, limit: 100 },
    { enabled: showAddInvoice }
  );

  // Add invoice mutation
  const addInvoice = api.invoiceGroup.addInvoice.useMutation({
    onSuccess: () => {
      utils.invoiceGroup.getById.invalidate({ id: id as string });
      setShowAddInvoice(false);
      setSelectedInvoiceId('');
    },
  });

  // Remove invoice mutation
  const removeInvoice = api.invoiceGroup.removeInvoice.useMutation({
    onSuccess: () => {
      utils.invoiceGroup.getById.invalidate({ id: id as string });
    },
  });

  const handleGenerateConsolidatedPDF = async () => {
    if (!group) return;

    setGenerating(true);

    try {
      // Generate PDFs for each invoice
      const invoicePDFs: Blob[] = [];
      const pdfEngine = PDFEngine.getInstance();

      for (const invoice of group.invoices) {
        const pdfData = {
          company: {
            name: invoice.company?.name || group.company.name,
            address: invoice.company?.address || group.company.address || '',
            gstin: invoice.company?.gstin || group.company.gstin || '',
            email: invoice.company?.email || group.company.email || '',
            phone: invoice.company?.phone || group.company.phone || '',
            website: invoice.company?.website || group.company.website || '',
          },
          customer: {
            name: invoice.customer.name,
            gstin: invoice.customer.gstin || '',
            address: invoice.customer.address || '',
            stateCode: invoice.customer.stateCode || '',
            email: invoice.customer.email || '',
            phone: invoice.customer.phone || '',
          },
          invoice: {
            number: invoice.number,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate || undefined,
            placeOfSupply: invoice.placeOfSupply || undefined,
            notes: invoice.notes || undefined,
            terms: invoice.terms || undefined,
            currency: 'INR',
            status: invoice.status,
          },
          lineItems: invoice.lines.map((line) => {
            const taxableValue = line.amount;
            const isInterstate = invoice.igstAmount > 0;
            const cgst = isInterstate ? 0 : (taxableValue * line.gstRate) / 200;
            const sgst = isInterstate ? 0 : (taxableValue * line.gstRate) / 200;
            const igst = isInterstate ? (taxableValue * line.gstRate) / 100 : 0;
            const lineTotal = taxableValue + cgst + sgst + igst;

            return {
              description: line.description,
              quantity: line.quantity,
              rate: line.rate,
              taxableValue,
              cgst,
              sgst,
              igst,
              lineTotal,
              gstRate: line.gstRate,
              hsnSac: line.hsnSac || undefined,
            };
          }),
          totals: {
            subtotal: invoice.subtotal,
            taxableValue: invoice.subtotal,
            cgstAmount: invoice.cgstAmount,
            sgstAmount: invoice.sgstAmount,
            igstAmount: invoice.igstAmount,
            totalTax: invoice.totalTax,
            grandTotal: invoice.grandTotal,
            isInterstate: invoice.igstAmount > 0,
          },
        };

        const pdfBlob = await pdfEngine.generatePDFBlob(pdfData);
        invoicePDFs.push(pdfBlob);
      }

      // Collect all attachment PDFs
      const attachmentPDFs: Blob[] = [];

      for (const invoice of group.invoices) {
        if (invoice.attachments && invoice.attachments.length > 0) {
          for (const attachment of invoice.attachments) {
            try {
              const { data, error } = await supabase.storage
                .from('invoice-attachments')
                .download(attachment.storagePath);

              if (!error && data) {
                attachmentPDFs.push(data);
              }
            } catch (error) {
              console.error('Failed to download attachment:', error);
            }
          }
        }
      }

      // Merge all PDFs
      const mergedPDF = await PDFMerger.mergeInvoicePackage(
        invoicePDFs,
        attachmentPDFs,
        {
          packageName: group.name,
          customerName: group.customer?.name,
          periodStart: group.periodStart || undefined,
          periodEnd: group.periodEnd || undefined,
        }
      );

      // Download merged PDF
      const filename = `${group.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      PDFMerger.downloadPDF(mergedPDF, filename);
    } catch (error) {
      console.error('Failed to generate consolidated PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddInvoice = async () => {
    if (!selectedInvoiceId || !id) return;

    await addInvoice.mutateAsync({
      groupId: id as string,
      invoiceId: selectedInvoiceId,
    });
  };

  const handleRemoveInvoice = async (invoiceId: string) => {
    if (!id) return;
    if (!confirm('Remove this invoice from the group?')) return;

    await removeInvoice.mutateAsync({
      groupId: id as string,
      invoiceId,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h2>
        <Button onClick={() => router.push('/invoice-groups')}>
          Back to Invoice Groups
        </Button>
      </div>
    );
  }

  const unassignedInvoices = availableInvoices?.invoices.filter(
    (inv) => !inv.invoiceGroupId
  ) || [];

  return (
    <AuraLayout>
      <Head>
        <title>{group.name} | Invoice Groups | CS ERP</title>
      </Head>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/invoice-groups')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              {group.description && (
                <p className="text-gray-600 mt-1">{group.description}</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleGenerateConsolidatedPDF}
            disabled={generating || group.invoiceCount === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Consolidated PDF
              </>
            )}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-3xl font-bold text-blue-600">{group.invoiceCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(group.totalAmount)}
              </p>
            </CardContent>
          </Card>
          {group.periodStart && (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Period Start</p>
                <p className="text-lg font-semibold">{formatDate(group.periodStart)}</p>
              </CardContent>
            </Card>
          )}
          {group.periodEnd && (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Period End</p>
                <p className="text-lg font-semibold">{formatDate(group.periodEnd)}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoices in Group ({group.invoices.length})</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddInvoice(!showAddInvoice)}
                className="flex items-center gap-2"
              >
                {showAddInvoice ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Invoice
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Invoice Form */}
            {showAddInvoice && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Invoice
                  </label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => setSelectedInvoiceId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">-- Select an invoice --</option>
                    {unassignedInvoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.number} - {invoice.customer?.name} - {formatCurrency(invoice.grandTotal)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddInvoice}
                    disabled={!selectedInvoiceId || addInvoice.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addInvoice.isPending ? 'Adding...' : 'Add to Group'}
                  </Button>
                </div>
              </div>
            )}

            {/* Invoices List */}
            {group.invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No invoices in this group yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Click &quot;Add Invoice&quot; to start building your consolidated package
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {group.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-gray-900">{invoice.number}</p>
                        <span className="text-sm text-gray-600">
                          {invoice.customer.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{formatDate(invoice.issueDate)}</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(invoice.grandTotal)}
                        </span>
                        {invoice.attachments && invoice.attachments.length > 0 && (
                          <span className="text-blue-600">
                            {invoice.attachments.length} attachment{invoice.attachments.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveInvoice(invoice.id)}
                        disabled={removeInvoice.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuraLayout>
  );
}
