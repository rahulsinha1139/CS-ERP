/**
 * Invoice Management Page
 * Main interface for invoice CRUD operations with real-time calculations
 */

import React, { useState, memo, useCallback, useMemo } from 'react';
import { api } from '../../src/lib/trpc-client';
import { useAppStore } from '../../src/store/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { formatCurrency, formatDate } from '../../src/lib/utils';
import { Plus, Search, Filter, Download, Send } from 'lucide-react';

interface InvoiceFilters {
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  customerId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export default function InvoicesPage() {
  const [filters, setFilters] = useState<InvoiceFilters>({});
  const [page, setPage] = useState(1);
  const addNotification = useAppStore(state => state.addNotification);

  // tRPC queries with optimized caching
  const {
    data: invoicesData,
    isLoading,
    refetch
  } = (api as any).invoice.getAll.useQuery({
    page,
    limit: 20,
    filters,
    sortBy: 'issueDate',
    sortOrder: 'desc'
  }, {
    staleTime: 1000 * 60 * 3, // 3 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    keepPreviousData: true, // Keep previous data while fetching new
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic refetching
  });

  const {
    data: invoiceStats,
    isLoading: statsLoading
  } = (api as any).invoice.getStats.useQuery({}, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });


  // Mutations
  const sendInvoiceMutation = (api as any).invoice.send.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Invoice Sent',
        message: 'Invoice has been sent successfully'
      });
      refetch();
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Send Failed',
        message: error.message
      });
    }
  });

  const deleteInvoiceMutation = (api as any).invoice.delete.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Invoice Deleted',
        message: 'Invoice has been deleted successfully'
      });
      refetch();
    }
  });

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await sendInvoiceMutation.mutateAsync({
        id: invoiceId,
        generatePdf: true,
        sendEmail: true
      });
    } catch (error) {
      // Error handled in mutation
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your invoices and billing</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => window.location.href = '/invoices/new'}
        >
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      {!statsLoading && invoiceStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoiceStats.totalInvoices}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  📄
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(invoiceStats.totalRevenue)}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  💰
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(invoiceStats.outstandingAmount)}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  ⏰
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {invoiceStats.overdueInvoices}
                  </p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  ⚠️
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value as any || undefined
              }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Invoice #</th>
                  <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left p-3 font-medium text-gray-600">Issue Date</th>
                  <th className="text-left p-3 font-medium text-gray-600">Due Date</th>
                  <th className="text-left p-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoicesData?.invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <span className="font-medium text-blue-600">
                        {invoice.number}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{invoice.customer.name}</p>
                        {invoice.customer.gstin && (
                          <p className="text-sm text-gray-500">
                            GSTIN: {invoice.customer.gstin}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      {formatDate(invoice.issueDate)}
                    </td>
                    <td className="p-3 text-gray-600">
                      {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        {invoice.status === 'DRAFT' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSendInvoice(invoice.id)}
                            disabled={sendInvoiceMutation.isLoading}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
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
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, invoicesData.pagination.totalCount)} of {invoicesData.pagination.totalCount} invoices
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {page} of {invoicesData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === invoicesData.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}