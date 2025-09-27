/**
 * Main Dashboard Page - CS ERP Application
 * Fully functional with tRPC integration and real-time data
 */

import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import DashboardLayout from '@/components/layout/dashboard-layout';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import { api } from '@/lib/trpc-client';

interface DashboardPageProps {
  // Add any server-side props if needed
}

export default function DashboardPage(props: DashboardPageProps) {
  return (
    <>
      <Head>
        <title>Dashboard - CS ERP Professional Suite</title>
        <meta name="description" content="Professional ERP solution for Company Secretary practice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DashboardLayout
        title="Dashboard"
        subtitle="Business overview and key metrics for your CS practice"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/invoices/new'}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Invoice
            </button>
            <button
              onClick={() => window.location.href = '/system-test'}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              System Test
            </button>
          </div>
        }
      >
        <DashboardOverview />
      </DashboardLayout>
    </>
  );
}