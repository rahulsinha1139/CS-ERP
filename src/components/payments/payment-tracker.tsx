/**
 * Payment Tracker Component
 * Advanced payment tracking with invoice linking and reconciliation
 */

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/utils/api';
import { useAppStore } from '../../store/app-store';
import { AuraCard, AuraCardContent, AuraCardHeader, AuraCardTitle } from '../ui/aura-card';
import { AuraButton } from '../ui/aura-button';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Plus, Search, Filter, CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';

const paymentFormSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  amount: z.number().min(0.01, 'Amount must be positive'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'CHEQUE', 'UPI', 'CARD']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentTrackerProps {
  customerId?: string;
  invoiceId?: string;
}

const PaymentTracker = React.memo(function PaymentTracker({ customerId, invoiceId }: PaymentTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    fromDate: '',
    toDate: '',
  });
  const addNotification = useAppStore(state => state.addNotification);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      invoiceId: invoiceId || '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'BANK_TRANSFER',
    },
  });

  // Data fetching
  const { data: payments, isLoading, refetch } = api.payment.getAll.useQuery({
    customerId,
    invoiceId,
    filters: filters.status ? { status: filters.status as 'PENDING' | 'PAID' | 'FAILED' } : undefined,
  });

  const { data: unpaidInvoices } = api.invoice.getUnpaid.useQuery();

  const { data: paymentStats } = api.payment.getStats.useQuery({
    customerId,
  });

  // Mutations
  const recordPaymentMutation = api.payment.create.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Payment Recorded',
        message: 'Payment has been recorded successfully',
      });
      form.reset();
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        title: 'Recording Failed',
        message: error.message,
      });
    },
  });

  const onSubmit = useCallback((data: PaymentFormData) => {
    recordPaymentMutation.mutate({
      ...data,
      paymentDate: new Date(data.paymentDate),
      amount: Number(data.amount),
    });
  }, [recordPaymentMutation]);

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const getMethodIcon = (method: string) => {
    const icons = {
      CASH: '💵',
      BANK_TRANSFER: '🏦',
      CHEQUE: '📝',
      UPI: '📱',
      CARD: '💳',
    };
    return icons[method as keyof typeof icons] || '💰';
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Payment Tracking</h2>
          <p className="text-gray-600">Monitor and record customer payments</p>
        </div>
        <AuraButton onClick={() => setShowForm(!showForm)} variant="primary" icon={<Plus className="h-4 w-4" />}>
          Record Payment
        </AuraButton>
      </div>

      {/* Payment Stats */}
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
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </AuraCardContent>
          </AuraCard>

          <AuraCard>
            <AuraCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(paymentStats.thisMonth)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </AuraCardContent>
          </AuraCard>

          <AuraCard>
            <AuraCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Days</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {paymentStats.averageDays}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-gray-600" />
              </div>
            </AuraCardContent>
          </AuraCard>
        </div>
      )}

      {/* Payment Form */}
      {showForm && (
        <AuraCard>
          <AuraCardHeader>
            <AuraCardTitle>Record New Payment</AuraCardTitle>
          </AuraCardHeader>
          <AuraCardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice *</label>
                  <select
                    {...form.register('invoiceId')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Invoice</option>
                    {unpaidInvoices?.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.number} - {invoice.customer.name} - {formatCurrency(invoice.grandTotal - (invoice.paidAmount || 0))}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.invoiceId && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.invoiceId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amount *</label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register('amount', { valueAsNumber: true })}
                    error={form.formState.errors.amount?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Date *</label>
                  <Input
                    type="date"
                    {...form.register('paymentDate')}
                    error={form.formState.errors.paymentDate?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method *</label>
                  <select
                    {...form.register('method')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Reference Number</label>
                  <Input
                    {...form.register('reference')}
                    placeholder="Transaction reference"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Input
                    {...form.register('notes')}
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={recordPaymentMutation.isPending}
                  className="flex-1"
                >
                  {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </AuraCardContent>
        </AuraCard>
      )}

      {/* Filters */}
      <AuraCard>
        <AuraCardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filters.method}
              onChange={(e) => setFilters(prev => ({ ...prev, method: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Methods</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </AuraCardContent>
      </AuraCard>

      {/* Payment History */}
      <AuraCard>
        <AuraCardHeader>
          <AuraCardTitle>Payment History</AuraCardTitle>
        </AuraCardHeader>
        <AuraCardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">Date</th>
                  <th className="text-left p-3 font-medium text-gray-600">Invoice</th>
                  <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left p-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left p-3 font-medium text-gray-600">Method</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-blue-600">
                        {payment.invoice.number}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{payment.invoice.customer.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{getMethodIcon(payment.method)}</span>
                        <span className="text-sm">{payment.method}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600 text-sm">
                      {payment.reference || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AuraCardContent>
      </AuraCard>
    </div>
  );
});

export default PaymentTracker;