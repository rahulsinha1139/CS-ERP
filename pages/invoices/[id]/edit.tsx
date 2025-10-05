/**
 * Edit Invoice Page
 * Edit existing invoices with pre-populated data
 */

import React from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import InvoiceForm from '@/components/invoices/invoice-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditInvoicePage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: invoice, isLoading } = api.invoice.getById.useQuery(
    { id: id as string },
    { enabled: !!id }
  );

  const handleSuccess = (updatedInvoice: { id: string }) => {
    // Navigate back to invoice detail page
    router.push(`/invoices/${updatedInvoice.id}`);
  };

  const handleCancel = () => {
    router.back();
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
        <p className="text-gray-600 mb-4">The invoice you&apos;re trying to edit doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/invoices')}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Edit Invoice {invoice.number}
          </h1>
          <p className="text-gray-600">Modify invoice details and line items</p>
        </div>
      </div>

      {/* Invoice Form */}
      <Card>
        <CardContent className="p-6">
          <InvoiceForm
            invoiceId={invoice.id}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}