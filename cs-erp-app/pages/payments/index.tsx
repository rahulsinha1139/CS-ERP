/**
 * Payments Management Page
 * Central hub for payment tracking and reconciliation
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { api } from "@/utils/api";
import { AuraLayout } from '@/components/ui/aura-layout';
import PaymentTracker from '@/components/payments/payment-tracker';
import { AuraCard, AuraCardContent } from '@/components/ui/aura-card';
import { AuraButton } from '@/components/ui/aura-button';
import { AuraSelect } from '@/components/ui/aura-select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DollarSign, Clock, AlertCircle, Download, Filter } from 'lucide-react';

export default function PaymentsPage() {
  // Filters will be implemented in future enhancement
  // const [filters, setFilters] = useState({
  //   status: '',
  //   method: '',
  //   fromDate: '',
  //   toDate: '',
  // });
  const [dateRange, setDateRange] = useState('thisMonth');

  const { data: paymentStats, isLoading: statsLoading } = api.payment.getStats.useQuery({
    dateRange,
  });

  const { data: recentPayments } = api.payment.getRecent.useQuery({
    limit: 10,
  });

  const { data: overdueInvoices } = api.invoice.getOverdue.useQuery({});

  const handleExportPayments = () => {
    // This would trigger an export functionality
    console.log('Exporting payments...');
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Payments" }
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <AuraButton
        variant="primary"
        onClick={() => window.location.href = '/payments/new'}
        icon={<DollarSign className="h-4 w-4" />}
      >
        Record Payment
      </AuraButton>
      <AuraButton variant="secondary" onClick={handleExportPayments} icon={<Download className="h-4 w-4" />}>
        Export
      </AuraButton>
      <AuraButton variant="secondary" icon={<Filter className="h-4 w-4" />}>
        Advanced Filters
      </AuraButton>
    </div>
  );

  if (statsLoading) {
    return (
      <AuraLayout
        title="Payment Management"
        subtitle="Track payments, reconcile accounts, and manage cash flow"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuraLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Payments - CS ERP Professional Suite</title>
        <meta name="description" content="Track payments and reconcile accounts" />
      </Head>

      <AuraLayout
        title="Payment Management"
        subtitle="Track payments, reconcile accounts, and manage cash flow for Mrs. Pragnya Pradhan's CS practice"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <div className="space-y-6">

      {/* Date Range Selector */}
      <AuraCard>
        <AuraCardContent className="p-6">
          <div className="flex items-center gap-4">
            <AuraSelect
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Period"
              icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="all">All Time</option>
            </AuraSelect>
          </div>
        </AuraCardContent>
      </AuraCard>

      {/* Payment Statistics */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AuraCard>
            <AuraCardContent className="p-6">
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
            </AuraCardContent>
          </AuraCard>

          <AuraCard>
            <AuraCardContent className="p-6">
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
            </AuraCardContent>
          </AuraCard>

          <AuraCard>
            <AuraCardContent className="p-6">
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
            </AuraCardContent>
          </AuraCard>


        </div>
      )}

      {/* Quick Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <AuraCard>
          <AuraCardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
            <div className="space-y-3">
              {recentPayments?.map((payment) => (
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
          </AuraCardContent>
        </AuraCard>

        {/* Overdue Invoices */}
        <AuraCard>
          <AuraCardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Overdue Invoices
            </h3>
            <div className="space-y-3">
              {overdueInvoices?.map((invoice) => (
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
          </AuraCardContent>
        </AuraCard>
      </div>

      {/* Main Payment Tracker */}
      <PaymentTracker />
        </div>
      </AuraLayout>
    </>
  );
}