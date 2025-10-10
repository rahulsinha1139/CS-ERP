/**
 * New Customer Page - Create a new customer
 * Route: /customers/new
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuraLayout } from '@/components/ui/aura-layout';
import CustomerForm from '@/components/customers/customer-form';

export default function NewCustomerPage() {
  const router = useRouter();

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Customers", href: "/customers" },
    { label: "New Customer" }
  ];

  return (
    <>
      <Head>
        <title>New Customer - CS ERP Professional Suite</title>
        <meta name="description" content="Create a new customer" />
      </Head>

      <AuraLayout
        title="Create New Customer"
        subtitle="Add a new customer to your CS practice management system"
        breadcrumbs={breadcrumbs}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <div className="max-w-4xl mx-auto py-6">
          <CustomerForm
            onCancel={() => router.push('/customers')}
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
