/**
 * Individual Customer Page - Complete customer dashboard with invoice repository
 * Route: /customers/[id]
 */

import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/dashboard-layout'
import ModernCustomerDashboard from '@/components/customers/customer-dashboard-modern'

export default function CustomerPage() {
  const router = useRouter()
  const { id } = router.query

  // Ensure ID is available
  if (!id || typeof id !== 'string') {
    return (
      <DashboardLayout title="Loading Customer">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we load the customer information.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>Customer Details - CS ERP</title>
        <meta name="description" content="View customer details, invoices, and payment history" />
      </Head>

      <DashboardLayout>
        <ModernCustomerDashboard
          customerId={id}
          onBack={() => router.push('/customers')}
        />
      </DashboardLayout>
    </>
  )
}