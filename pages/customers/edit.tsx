/**
 * Edit Customer Page - Update existing customer
 * Route: /customers/edit?id=<customer-id>
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuraLayout } from '@/components/ui/aura-layout';
import CustomerForm from '@/components/customers/customer-form';
import { api } from '@/utils/api';
import { Loader2 } from 'lucide-react';

export default function EditCustomerPage() {
  const router = useRouter();
  const { id } = router.query;
  const customerId = typeof id === 'string' ? id : '';

  // Fetch customer data
  const { data: customer, isLoading, error } = api.customer.getById.useQuery(
    { id: customerId },
    { enabled: !!customerId }
  );

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Customers", href: "/customers" },
    { label: customer?.name || "Edit Customer" }
  ];

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading... - CS ERP Professional Suite</title>
        </Head>
        <AuraLayout
          title="Loading Customer"
          breadcrumbs={breadcrumbs}
          userEmail="Mrs. Pragnya Pradhan"
          userName="pragnya@pradhanassociates.com"
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading customer data...</span>
          </div>
        </AuraLayout>
      </>
    );
  }

  if (error || !customer) {
    return (
      <>
        <Head>
          <title>Error - CS ERP Professional Suite</title>
        </Head>
        <AuraLayout
          title="Error"
          breadcrumbs={breadcrumbs}
          userEmail="Mrs. Pragnya Pradhan"
          userName="pragnya@pradhanassociates.com"
        >
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Customer Not Found</h2>
            <p className="text-gray-600 mb-4">Unable to load customer data</p>
            <button
              onClick={() => router.push('/customers')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Customers
            </button>
          </div>
        </AuraLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit {customer.name} - CS ERP Professional Suite</title>
        <meta name="description" content={`Edit customer ${customer.name}`} />
      </Head>

      <AuraLayout
        title={`Edit ${customer.name}`}
        subtitle="Update customer information"
        breadcrumbs={breadcrumbs}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <div className="max-w-4xl mx-auto py-6">
          <CustomerForm
            customerId={customerId}
            initialData={{
              id: customer.id,
              name: customer.name,
              email: customer.email || '',
              phone: customer.phone || '',
              address: customer.address || '',
              gstin: customer.gstin || '',
              stateCode: customer.stateCode || '',
              creditLimit: customer.creditLimit || 0,
              creditDays: customer.creditDays || 30,
              whatsappNumber: customer.whatsappNumber || '',
            }}
            onCancel={() => router.push(`/customers/${customerId}`)}
            onSuccess={(customerId) => {
              // Redirect to customer details page on success
              router.push(`/customers/${customerId}`);
            }}
          />
        </div>
      </AuraLayout>
    </>
  );
}
