/**
 * New Invoice Page
 * Create new invoices with full business logic integration
 */

import React from 'react';
import { useRouter } from 'next/router';
import InvoiceForm from '../../src/components/invoices/invoice-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewInvoicePage() {
  const router = useRouter();

  const handleSuccess = (invoice: any) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Invoice</h1>
          <p className="text-gray-600">Generate a new invoice with GST calculations</p>
        </div>
      </div>

      {/* Invoice Form */}
      <Card>
        <CardContent className="p-6">
          <InvoiceForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}