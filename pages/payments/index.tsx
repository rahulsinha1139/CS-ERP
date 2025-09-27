/**
 * Payments Management Page
 * Central hub for payment tracking and reconciliation
 */

import React, { useState } from 'react';
import { api } from '../../src/lib/trpc-client';
import { useAppStore } from '../../src/store/app-store';
import PaymentTracker from '../../src/components/payments/payment-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { formatCurrency, formatDate } from '../../src/lib/utils';
import { DollarSign, TrendingUp, Clock, AlertCircle, Download, Filter } from 'lucide-react';

export default function PaymentsPage() {
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    fromDate: '',
    toDate: '',
  });
  const [dateRange, setDateRange] = useState('thisMonth');

  const { data: paymentStats, isLoading: statsLoading } = (api as any).payment.getStats.useQuery({
    dateRange,
  });

  const { data: recentPayments } = (api as any).payment.getRecent.useQuery({
    limit: 10,
  });

  const { data: overdueInvoices } = (api as any).invoice.getOverdue.useQuery({});

  const handleExportPayments = () => {
    // This would trigger an export functionality
    console.log('Exporting payments...');
  };

  if (statsLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track payments, reconcile accounts, and manage cash flow</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPayments} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600">Period:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Received</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(paymentStats.totalReceived)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {paymentStats.receivedCount} payments
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(paymentStats.outstanding)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {paymentStats.outstandingCount} invoices
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Collection</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {paymentStats.averageDays} days
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment cycle
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {paymentStats.growthRate > 0 ? '+' : ''}{paymentStats.growthRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    vs last period
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments?.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.invoice.customer.name}</p>
                    <p className="text-sm text-gray-600">
                      Invoice {payment.invoice.number} • {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-gray-500">{payment.method}</p>
                  </div>
                </div>
              ))}
              {(!recentPayments || recentPayments.length === 0) && (
                <p className="text-gray-500 text-center py-4">No recent payments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Overdue Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueInvoices?.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.customer.name}</p>
                    <p className="text-sm text-gray-600">
                      Invoice {invoice.number} • Due: {formatDate(invoice.dueDate!)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{formatCurrency(invoice.grandTotal - invoice.paidAmount)}</p>
                    <p className="text-xs text-red-500">
                      {Math.ceil((new Date().getTime() - new Date(invoice.dueDate!).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                    </p>
                  </div>
                </div>
              ))}
              {(!overdueInvoices || overdueInvoices.length === 0) && (
                <p className="text-gray-500 text-center py-4">No overdue invoices</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Payment Tracker */}
      <PaymentTracker />
    </div>
  );
}