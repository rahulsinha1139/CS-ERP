/**
 * Individual Customer Page - Complete customer dashboard with invoice repository
 * Route: /customers/[id]
 */

import React, { Suspense, lazy } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/dashboard-layout'

// Lazy load the customer dashboard for better performance
const ModernCustomerDashboard = lazy(() => import('@/components/customers/customer-dashboard-modern'))

// Loading skeleton for customer dashboard
const CustomerDashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Header skeleton */}
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>

    {/* Content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 h-96 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 h-64 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-28 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

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
        <Suspense fallback={<CustomerDashboardSkeleton />}>
          <ModernCustomerDashboard
            customerId={id}
            onBack={() => router.push('/customers')}
          />
        </Suspense>
      </DashboardLayout>
    </>
  )
}