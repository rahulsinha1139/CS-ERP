/**
 * New Invoice Page
 * Create new invoices with full business logic integration
 */

import React from 'react';
import { useRouter } from 'next/router';
import InvoiceForm from '@/components/invoices/invoice-form';
import { AuraCard, AuraCardContent } from '@/components/ui/aura-card';
import { AuraButton } from '@/components/ui/aura-button';
import { ArrowLeft } from 'lucide-react';

export default function NewInvoicePage() {
  const router = useRouter();
  const { customerId } = router.query;

  const handleSuccess = (invoice: { id: string }) => {
    // Navigate to invoice detail page or back to list
    router.push(`/invoices/${invoice.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <AuraButton
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </AuraButton>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
          <p className="text-gray-600">Generate a new invoice with GST calculations</p>
        </div>
      </div>

      {/* Invoice Form */}
      <AuraCard>
        <AuraCardContent className="p-6">
          <InvoiceForm
            initialCustomerId={customerId as string}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </AuraCardContent>
      </AuraCard>
    </div>
  );
}