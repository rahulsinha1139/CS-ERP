
/**
 * Customers List Page - Main customer listing with search and filters
 * Route: /customers
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuraLayout } from '@/components/ui/aura-layout';
import { AuraButton } from '@/components/ui/aura-button';
import CustomerList from '@/components/customers/customer-list';

// Icons for Aura buttons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default function CustomersPage() {
  const router = useRouter();

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Customers" }
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <AuraButton
        variant="primary"
        icon={<PlusIcon />}
        onClick={() => router.push('/customers/new')}
      >
        Add Customer
      </AuraButton>
    </div>
  );

  return (
    <>
      <Head>
        <title>Customers - CS ERP Professional Suite</title>
        <meta name="description" content="Manage your customers with complete invoice and payment tracking" />
      </Head>

      <AuraLayout
        title="Customer Management"
        subtitle="Manage your customers with complete invoice and payment tracking for Mrs. Pragnya Pradhan's CS practice"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <CustomerList
          onCustomerSelect={(customerId) => {
            router.push(`/customers/${customerId}`)
          }}
          selectable={true}
        />
      </AuraLayout>
    </>
  );
}
