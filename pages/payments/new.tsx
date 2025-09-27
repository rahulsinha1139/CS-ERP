/**
 * New Payment Page - CS ERP Application
 * Record new payments with invoice reconciliation
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { api } from '@/lib/trpc-client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PaymentMethod } from '@prisma/client';

interface PaymentFormData {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference: string;
  notes: string;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const { invoiceId } = router.query;

  const [formData, setFormData] = useState<PaymentFormData>({
    invoiceId: (invoiceId as string) || '',
    amount: 0,
    paymentMethod: PaymentMethod.UPI,
    paymentDate: new Date(),
    reference: '',
    notes: ''
  });

  // Fetch invoices for selection
  const { data: invoices, isLoading: invoicesLoading } = api.invoice.getPayableInvoices.useQuery();

  // Get selected invoice details
  const { data: selectedInvoice } = api.invoice.getById.useQuery(
    { id: formData.invoiceId },
    { enabled: !!formData.invoiceId }
  );

  // Payment creation mutation
  const createPaymentMutation = api.payment.create.useMutation({
    onSuccess: (payment) => {
      router.push('/payments');
    },
    onError: (error) => {
      console.error('Payment creation failed:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.invoiceId || !formData.amount) {
      return;
    }

    await createPaymentMutation.mutateAsync({
      invoiceId: formData.invoiceId,
      amount: formData.amount,
      method: formData.paymentMethod,
      paymentDate: formData.paymentDate,
      reference: formData.reference,
      notes: formData.notes
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const paymentMethods = [
    { value: PaymentMethod.UPI, label: 'UPI' },
    { value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer' },
    { value: PaymentMethod.CHEQUE, label: 'Cheque' },
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.CARD, label: 'Card' },
    { value: PaymentMethod.DIGITAL_WALLET, label: 'Digital Wallet' },
    { value: PaymentMethod.CRYPTOCURRENCY, label: 'Cryptocurrency' }
  ];

  const remainingAmount = selectedInvoice
    ? selectedInvoice.grandTotal - (selectedInvoice.paidAmount || 0)
    : 0;

  return (
    <>
      <Head>
        <title>Record Payment - CS ERP Professional Suite</title>
        <meta name="description" content="Record a new payment for your CS practice" />
      </Head>

      <DashboardLayout
        title="Record New Payment"
        subtitle="Track received payments and update invoice status"
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createPaymentMutation.isLoading || !formData.invoiceId || !formData.amount}
              className="bg-success-500 hover:bg-success-600 disabled:bg-neutral-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {createPaymentMutation.isLoading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        }
      >
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h2>

              {/* Invoice Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Invoice <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.invoiceId}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      invoiceId: e.target.value,
                      amount: 0 // Reset amount when invoice changes
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                    required
                  >
                    <option value="">Select an invoice...</option>
                    {invoices?.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.customer?.name} - {formatCurrency(invoice.remainingAmount)} remaining
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Invoice Summary */}
                {selectedInvoice && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900">Invoice Summary</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Customer:</span> {selectedInvoice.customer?.name}
                      </div>
                      <div>
                        <span className="text-blue-700">Total Amount:</span> {formatCurrency(selectedInvoice.grandTotal)}
                      </div>
                      <div>
                        <span className="text-blue-700">Paid Amount:</span> {formatCurrency(selectedInvoice.paidAmount || 0)}
                      </div>
                      <div>
                        <span className="text-blue-700">Remaining:</span> {formatCurrency(remainingAmount)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={remainingAmount || undefined}
                      value={formData.amount || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        amount: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {remainingAmount > 0 && formData.amount > remainingAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      Amount cannot exceed remaining balance of {formatCurrency(remainingAmount)}
                    </p>
                  )}
                  {remainingAmount > 0 && (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, amount: remainingAmount }))}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        Full Amount ({formatCurrency(remainingAmount)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, amount: remainingAmount / 2 }))}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        Half Amount ({formatCurrency(remainingAmount / 2)})
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate.toISOString().split('T')[0]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      paymentDate: new Date(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                    required
                  />
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                    placeholder="Transaction ID, Cheque number, etc."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-success-500"
                    placeholder="Additional notes about this payment..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPaymentMutation.isLoading || !formData.invoiceId || !formData.amount}
                className="px-6 py-2 bg-success-500 hover:bg-success-600 disabled:bg-neutral-300 text-white rounded-lg transition-colors"
              >
                {createPaymentMutation.isLoading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
}