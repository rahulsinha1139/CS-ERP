/**
 * Invoice Group Manager Component
 * Create and manage invoice groups for quarterly consolidated invoicing
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Download, Loader2, FileText, Trash2, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PDFMerger } from '@/lib/pdf-merger';
import { PDFEngine } from '@/lib/pdf-engine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface InvoiceGroupManagerProps {
  customerId?: string;
}

export function InvoiceGroupManager({ customerId }: InvoiceGroupManagerProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    periodStart: '',
    periodEnd: '',
  });

  const utils = api.useUtils();

  // Fetch invoice groups
  const { data: groupsData, isLoading } = api.invoiceGroup.list.useQuery({
    page: 1,
    limit: 50,
    customerId,
  });

  // Create group mutation
  const createGroup = api.invoiceGroup.create.useMutation({
    onSuccess: () => {
      utils.invoiceGroup.list.invalidate();
      setShowCreateForm(false);
      setFormData({ name: '', description: '', periodStart: '', periodEnd: '' });
    },
  });

  // Delete group mutation
  const deleteGroup = api.invoiceGroup.delete.useMutation({
    onSuccess: () => {
      utils.invoiceGroup.list.invalidate();
    },
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    await createGroup.mutateAsync({
      name: formData.name,
      description: formData.description || undefined,
      customerId,
      groupType: 'QUARTERLY',
      periodStart: formData.periodStart ? new Date(formData.periodStart) : undefined,
      periodEnd: formData.periodEnd ? new Date(formData.periodEnd) : undefined,
    });
  };

  const handleGenerateConsolidatedPDF = async (groupId: string) => {
    setGenerating(true);

    try {
      // Fetch full group data with invoices and attachments
      const group = await utils.client.invoiceGroup.getById.query({ id: groupId });

      if (!group || !group.invoices.length) {
        alert('No invoices in this group');
        return;
      }

      // Generate PDFs for each invoice
      const invoicePDFs: Blob[] = [];
      const pdfEngine = PDFEngine.getInstance();

      for (const invoice of group.invoices) {
        // Transform invoice data for PDF engine
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const groups = groupsData?.groups || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Groups</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {showCreateForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Group
            </>
          )}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Invoice Group</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Q4 2024 Invoices"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea
                  id="group-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Consolidated invoices for Q4 2024"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period-start">Period Start</Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period-end">Period End</Label>
                  <Input
                    id="period-end"
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createGroup.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createGroup.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Group'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No invoice groups yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Create a group to consolidate multiple invoices into one PDF package
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{group.name}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {group.invoiceCount} invoices
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                )}

                {group.customer && (
                  <div className="text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="ml-2 font-medium">{group.customer.name}</span>
                  </div>
                )}

                {(group.periodStart || group.periodEnd) && (
                  <div className="text-sm text-gray-600">
                    {group.periodStart && formatDate(group.periodStart)}
                    {group.periodStart && group.periodEnd && ' - '}
                    {group.periodEnd && formatDate(group.periodEnd)}
                  </div>
                )}

                <div className="text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="ml-2 font-bold text-blue-600">
                    {formatCurrency(group.totalAmount)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/invoice-groups/${group.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGenerateConsolidatedPDF(group.id)}
                      disabled={generating || group.invoiceCount === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this group?')) {
                          deleteGroup.mutate({ id: group.id });
                        }
                      }}
                      disabled={deleteGroup.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
