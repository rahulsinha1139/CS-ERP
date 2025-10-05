/**
 * Invoice Detail Page
 * View and manage individual invoice with PDF integration
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import { useAppStore } from '@/store/app-store';
import InvoicePDFViewer from '@/components/invoices/invoice-pdf-viewer';
import PaymentTracker from '@/components/payments/payment-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Send, Trash2, DollarSign } from 'lucide-react';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState<'details' | 'pdf' | 'payments'>('details');
  const addNotification = useAppStore(state => state.addNotification);

  const { data: invoice, isLoading } = api.invoice.getById.useQuery(
    { id: id as string },
    { enabled: !!id && typeof window !== 'undefined' } // Only run on client with valid ID
  );

  const { data: company } = api.company.getCurrent.useQuery(undefined, {
    enabled: typeof window !== 'undefined', // Only run on client
  });

  const sendInvoiceMutation = api.invoice.send.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Invoice Sent',
        message: 'Invoice has been sent successfully',
      });
    },
  });

  const deleteInvoiceMutation = api.invoice.delete.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Invoice Deleted',
        message: 'Invoice has been deleted successfully',
      });
      router.push('/invoices');
    },
  });

  const handleSendInvoice = () => {
    if (invoice) {
      sendInvoiceMutation.mutate({
        id: invoice.id,
        generatePdf: true,
        sendEmail: true,
      });
    }
  };

  const handleDeleteInvoice = () => {
    if (invoice && confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoiceMutation.mutate({ id: invoice.id });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SENT: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
        <p className="text-gray-600 mb-4">The invoice you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/invoices')}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  // Transform invoice data for PDF viewer
  const pdfInvoiceData = {
    ...invoice,
    company: company || {
      name: 'Your Company',
      address: '',
      gstin: '',
      email: '',
      phone: '',
    },
    taxBreakdown: {
      subtotal: invoice.subtotal,
      cgstAmount: invoice.cgstAmount,
      sgstAmount: invoice.sgstAmount,
      igstAmount: invoice.igstAmount,
      totalTax: invoice.totalTax,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Invoice {invoice.number}
            </h1>
            <p className="text-gray-600">
              {invoice.customer.name} • {formatDate(invoice.issueDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {invoice.status === 'DRAFT' && (
            <Button
              size="sm"
              onClick={handleSendInvoice}
              disabled={sendInvoiceMutation.isPending}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Invoice
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteInvoice}
            disabled={deleteInvoiceMutation.isPending}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(invoice.grandTotal)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(invoice.paidAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(invoice.grandTotal - invoice.paidAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'details', label: 'Invoice Details' },
            { key: 'pdf', label: 'PDF View' },
            { key: 'payments', label: 'Payments' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="ml-2 font-medium">{invoice.number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="ml-2">{formatDate(invoice.issueDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Due Date:</span>
                  <span className="ml-2">{invoice.dueDate ? formatDate(invoice.dueDate) : 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Place of Supply:</span>
                  <span className="ml-2">{invoice.placeOfSupply || 'Not specified'}</span>
                </div>
              </div>
              {invoice.notes && (
                <div>
                  <span className="text-gray-600 text-sm">Notes:</span>
                  <p className="mt-1 text-sm">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{invoice.customer.name}</h4>
                {invoice.customer.gstin && (
                  <p className="text-sm text-gray-600">GSTIN: {invoice.customer.gstin}</p>
                )}
                {invoice.customer.email && (
                  <p className="text-sm text-gray-600">Email: {invoice.customer.email}</p>
                )}
                {invoice.customer.phone && (
                  <p className="text-sm text-gray-600">Phone: {invoice.customer.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-600">Description</th>
                      <th className="text-left p-3 font-medium text-gray-600">Qty</th>
                      <th className="text-left p-3 font-medium text-gray-600">Rate</th>
                      <th className="text-left p-3 font-medium text-gray-600">GST %</th>
                      <th className="text-left p-3 font-medium text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lines.map((line, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{line.description}</td>
                        <td className="p-3">{line.quantity}</td>
                        <td className="p-3">{formatCurrency(line.rate)}</td>
                        <td className="p-3">{line.gstRate}%</td>
                        <td className="p-3 font-medium">{formatCurrency(line.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.cgstAmount > 0 && (
                    <div className="flex justify-between">
                      <span>CGST:</span>
                      <span className="font-medium">{formatCurrency(invoice.cgstAmount)}</span>
                    </div>
                  )}
                  {invoice.sgstAmount > 0 && (
                    <div className="flex justify-between">
                      <span>SGST:</span>
                      <span className="font-medium">{formatCurrency(invoice.sgstAmount)}</span>
                    </div>
                  )}
                  {invoice.igstAmount > 0 && (
                    <div className="flex justify-between">
                      <span>IGST:</span>
                      <span className="font-medium">{formatCurrency(invoice.igstAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">{formatCurrency(invoice.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'pdf' && (
        <InvoicePDFViewer
          invoice={pdfInvoiceData as unknown as Parameters<typeof InvoicePDFViewer>[0]['invoice']}
          onEmailSent={() => addNotification({
            type: 'success',
            title: 'Email Sent',
            message: 'Invoice has been emailed to customer',
          })}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentTracker
          invoiceId={invoice.id}
          customerId={invoice.customerId}
        />
      )}
    </div>
  );
}