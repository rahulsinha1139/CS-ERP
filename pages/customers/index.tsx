/**
 * Customers List Page - Main customer listing with search and filters
 * Route: /customers
 */

import React, { Suspense, lazy } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/dashboard-layout'

// Lazy load the customer list component for better performance
const CustomerList = lazy(() => import('@/components/customers/customer-list'))

// Loading component for better UX
const CustomerListSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm animate-pulse">
      <div className="flex justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-40"></div>
      </div>
    </div>

    {/* Search skeleton */}
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200/50">
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-xl w-20 animate-pulse"></div>
      </div>
    </div>

    {/* Customer cards skeleton */}
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50 animate-pulse">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
              <div className="flex gap-4 mb-4">
                <div className="h-8 bg-gray-200 rounded-lg w-32"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-28"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-36"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function CustomersPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Customers - CS ERP</title>
        <meta name="description" content="Manage your customers with complete invoice and payment tracking" />
      </Head>

      <DashboardLayout
        title="Customers"
        subtitle="Manage your customers with complete invoice and payment tracking"
      >
        <Suspense fallback={<CustomerListSkeleton />}>
          <CustomerList
            onCustomerSelect={(customerId) => {
              router.push(`/customers/${customerId}`)
            }}
            selectable={true}
          />
        </Suspense>
      </DashboardLayout>
    </>
  )
}