/**
 * Customers List Page - Main customer listing with search and filters
 * Route: /customers
 */

import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/dashboard-layout'
import CustomerList from '@/components/customers/customer-list'

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
        <CustomerList
          onCustomerSelect={(customerId) => {
            router.push(`/customers/${customerId}`)
          }}
          selectable={true}
        />
      </DashboardLayout>
    </>
  )
}