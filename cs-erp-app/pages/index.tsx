/**
 * Main Dashboard Page - CS ERP Application
 * Fully functional with tRPC integration and real-time data
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuraLayout } from '@/components/ui/aura-layout';
import { AuraButton } from '@/components/ui/aura-button';
import DashboardOverview from '@/components/dashboard/dashboard-overview';

interface DashboardPageProps {
  // Future: server-side props for dashboard data
  [key: string]: never; // Explicitly empty interface
}

// Icons for buttons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const CustomersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

export default function DashboardPage(_props: DashboardPageProps) {
  const router = useRouter();

  const breadcrumbs = [
    { label: "Dashboard" }
  ]

  const headerActions = (
    <div className="flex items-center space-x-3">
      <AuraButton
        variant="secondary"
        size="sm"
        icon={<CustomersIcon />}
        onClick={() => router.push('/customers')}
      >
        View Customers
      </AuraButton>
      <AuraButton
        variant="primary"
        icon={<PlusIcon />}
        onClick={() => router.push('/invoices/new')}
      >
        New Invoice
      </AuraButton>
    </div>
  )

  return (
    <>
      <Head>
        <title>Dashboard - CS ERP Professional Suite</title>
        <meta name="description" content="Professional ERP solution for Company Secretary practice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuraLayout
        title="Professional Dashboard"
        subtitle="Business overview and key metrics for Mrs. Pragnya Pradhan's CS practice"
        breadcrumbs={breadcrumbs}
        headerActions={headerActions}
        userEmail="Mrs. Pragnya Pradhan"
        userName="pragnya@pradhanassociates.com"
      >
        <DashboardOverview />
      </AuraLayout>
    </>
  );
}