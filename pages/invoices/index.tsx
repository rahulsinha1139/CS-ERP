/**
 * Invoice Management Page
 * Main interface for invoice CRUD operations with real-time calculations
 * MIGRATED TO AURA DESIGN SYSTEM
 */

import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { api } from "@/utils/api";
import { useAppStore } from '@/store/app-store';
import { AuraLayout } from '@/components/ui/aura-layout';
import { AuraButton } from '@/components/ui/aura-button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Download, Send, Eye, FolderOpen } from 'lucide-react';
import { PDFEngine } from '@/lib/pdf-engine';

interface InvoiceFilters {
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  customerId?: string;
  fromDate?: Date;
  toDate?: Date;
}

// Icons for Aura buttons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

export default function InvoicesPage() {
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [page, setPage] = useState(1);
  const addNotification = useAppStore(state => state.addNotification);

  // tRPC queries with optimized caching
  const {
    data: invoicesData,
    isLoading,
    refetch
  } = api.invoice.getAll.useQuery({
    page,
    limit: 20,
    filters
  }, {
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic refetching
  });

  const {
    data: invoiceStats,
    isLoading: statsLoading
  } = api.invoice.getStats.useQuery({}, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });


  // Mutations
  const sendInvoiceMutation = api.invoice.send.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Invoice Sent',
        message: 'Invoice has been sent successfully'
      });
      refetch();
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Send Failed',
        message: error.message || 'Unknown error occurred'
      });
    }
  });

  // Delete mutation available but not currently used in UI
  // const deleteInvoiceMutation = api.invoice.delete.useMutation({
  //   onSuccess: () => {
  //     addNotification({
  //       type: 'success',
  //       title: 'Invoice Deleted',
  //       message: 'Invoice has been deleted successfully'
  //     });
  //     refetch();
  //   }
  // });

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoiceMutation.mutateAsync({
        id: invoiceId,
        generatePdf: true,
        sendEmail: true
      });
    } catch {
      // Error handled in mutation
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    window.location.href = `/invoices/${invoiceId}`;
  };

  const handleDownloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      addNotification({
        type: 'info',
        title: 'Generating PDF',
        message: 'Please wait while we generate your invoice...'
      });

      // Fetch full invoice data
      const response = await fetch(`/api/trpc/invoice.getById?input=${encodeURIComponent(JSON.stringify({ id: invoiceId }))}`);
      const result = await response.json();
      const invoice = result.result.data;

      // Fetch company data
      const companyResponse = await fetch('/api/trpc/company.getCurrent');
      const companyResult = await companyResponse.json();
      const company = companyResult.result.data || {
        name: 'Your Company',
        address: '',
        gstin: '',
        email: '',
        phone: ''
      };

      // Transform data for PDF engine
      const pdfData = {
        company: {
          name: company.name || 'Your Company',
          address: company.address || '',
          gstin: company.gstin || '',
          email: company.email || '',
          phone: company.phone || '',
          website: company.website || '',
          logo: company.logo || undefined,
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
          issueDate: new Date(invoice.issueDate),
          dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
          placeOfSupply: invoice.placeOfSupply,
          status: invoice.status,
          currency: 'INR',
          notes: invoice.notes,
          terms: invoice.terms,
        },
        lineItems: invoice.lines.map((line: any) => ({
          description: line.description,
          quantity: line.quantity,
          rate: line.rate,
          taxableValue: line.quantity * line.rate,
          cgst: (line.quantity * line.rate * line.gstRate) / 200,
          sgst: (line.quantity * line.rate * line.gstRate) / 200,
          igst: invoice.igstAmount > 0 ? (line.quantity * line.rate * line.gstRate) / 100 : 0,
          lineTotal: line.amount,
          gstRate: line.gstRate,
          hsnSac: line.hsnSac || '',
          // Custom service columns support
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
          subtotal: invoice.subtotal,
          cgstAmount: invoice.cgstAmount,
          sgstAmount: invoice.sgstAmount,
          igstAmount: invoice.igstAmount,
          totalTax: invoice.totalTax,
          taxableValue: invoice.subtotal,
          grandTotal: invoice.grandTotal,
          isInterstate: invoice.igstAmount > 0,
        },
        branding: {
          primaryColor: '#1e40af',
          accentColor: '#3b82f6',
          logoPosition: 'left' as const,
          showWatermark: invoice.status === 'SENT',
        },
        paymentDetails: company.bankName ? {
          bankName: company.bankName,
          accountNumber: company.accountNumber || '',
          ifscCode: company.ifscCode || '',
          upiId: company.upiId || '',
        } : undefined,
      };

      // Generate PDF
      const pdfEngine = PDFEngine.getInstance();
      const pdfBlob = await pdfEngine.generatePDFBlob(pdfData);

      // Trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'PDF Downloaded',
        message: `Invoice ${invoiceNumber} has been downloaded successfully`
      });
    } catch (error) {
      console.error('Download error:', error);
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download invoice. Please try viewing the invoice instead.'
      });
    }
  };

  // Memoize status color calculation
  const getStatusColor = useCallback((status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SENT: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  }, []);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Invoices" }
  ]

  const headerActions = (
    <div className="flex items-center space-x-3">
      <AuraButton
        variant="secondary"
        icon={<FolderOpen className="h-4 w-4" />}
        onClick={() => window.location.href = '/invoice-groups'}
      >
        Invoice Groups
      </AuraButton>
      <AuraButton
        variant="primary"
        icon={<PlusIcon />}
        onClick={() => window.location.href = '/invoices/new'}
      >
        Create Invoice
      </AuraButton>
    </div>
  )

  if (isLoading) {
    return (
      <AuraLayout
        title="Invoice Management"
        subtitle="Manage your invoices and billing for Mrs. Pragnya Pradhan's CS practice"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aura-blue-primary"></div>
        </div>
      </AuraLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Invoices - CS ERP Professional Suite</title>
        <meta name="description" content="Manage invoices and billing for your CS practice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuraLayout
        title="Invoice Management"
        subtitle="Manage your invoices and billing for Mrs. Pragnya Pradhan's CS practice"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <div className="space-y-6">
          {/* Stats Cards */}
          {!statsLoading && invoiceStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Total Invoices</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {invoiceStats.totalInvoices}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-aura-blue-primary/10 rounded-full flex items-center justify-center">
                    📄
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Total Revenue</p>
                    <p className="text-2xl font-bold text-aura-success">
                      {formatCurrency(invoiceStats.totalRevenue)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-aura-success/10 rounded-full flex items-center justify-center">
                    💰
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Outstanding</p>
                    <p className="text-2xl font-bold text-aura-error">
                      {formatCurrency(invoiceStats.outstandingAmount)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-aura-error/10 rounded-full flex items-center justify-center">
                    ⏰
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Overdue</p>
                    <p className="text-2xl font-bold text-aura-warning">
                      {invoiceStats.overdueInvoices}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-aura-warning/10 rounded-full flex items-center justify-center">
                    ⚠️
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-professional">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:ring-2 focus:ring-aura-blue-primary focus:border-aura-blue-primary"
                />
              </div>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: (e.target.value as InvoiceFilters['status']) || undefined
                }))}
                className="px-3 py-2 border border-border-primary rounded-lg focus:ring-2 focus:ring-aura-blue-primary focus:border-aura-blue-primary"
              >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <AuraButton variant="secondary" size="sm" icon={<FilterIcon />}>
                More Filters
              </AuraButton>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-professional">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-text-primary">Recent Invoices</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left p-3 font-medium text-text-secondary">Invoice #</th>
                      <th className="text-left p-3 font-medium text-text-secondary">Customer</th>
                      <th className="text-left p-3 font-medium text-text-secondary">Issue Date</th>
                      <th className="text-left p-3 font-medium text-text-secondary">Due Date</th>
                      <th className="text-left p-3 font-medium text-text-secondary">Amount</th>
                      <th className="text-left p-3 font-medium text-text-secondary">Status</th>
                      <th className="text-left p-3 font-medium text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesData?.invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-border-primary hover:bg-surface-secondary transition-colors">
                        <td className="p-3">
                          <span className="font-medium text-aura-blue-primary">
                            {invoice.number}
                          </span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-text-primary">{invoice.customer.name}</p>
                            {invoice.customer.gstin && (
                              <p className="text-sm text-text-tertiary">
                                GSTIN: {invoice.customer.gstin}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-text-secondary">
                          {formatDate(invoice.issueDate)}
                        </td>
                        <td className="p-3 text-text-secondary">
                          {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-text-primary">
                            {formatCurrency(invoice.grandTotal)}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <AuraButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                              onClick={() => handleViewInvoice(invoice.id)}
                              title="View Invoice"
                            >
                              <Eye className="h-4 w-4 text-black" />
                            </AuraButton>
                            <AuraButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                              onClick={() => handleDownloadInvoice(invoice.id, invoice.number)}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4 text-black" />
                            </AuraButton>
                            {invoice.status === 'DRAFT' && (
                              <AuraButton
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                                onClick={() => handleSendInvoice(invoice.id)}
                                isLoading={sendInvoiceMutation.isPending}
                                title="Send Invoice"
                              >
                                <Send className="h-4 w-4 text-purple-600" />
                              </AuraButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {invoicesData && invoicesData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-text-secondary">
                    Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, invoicesData.pagination.totalCount)} of {invoicesData.pagination.totalCount} invoices
                  </p>
                  <div className="flex items-center gap-2">
                    <AuraButton
                      variant="secondary"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </AuraButton>
                    <span className="px-3 py-1 text-sm text-text-secondary">
                      Page {page} of {invoicesData.pagination.totalPages}
                    </span>
                    <AuraButton
                      variant="secondary"
                      size="sm"
                      disabled={page === invoicesData.pagination.totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </AuraButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AuraLayout>
    </>
  );
}