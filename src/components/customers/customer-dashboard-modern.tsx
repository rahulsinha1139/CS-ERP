/**
 * Modern Customer Dashboard - Beautiful UI with Enhanced UX
 * Features: Gradient cards, animations, glassmorphism, modern spacing
 */

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/lib/trpc-client'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import CustomerForm from './customer-form'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Send,
  Building,
  Activity,
} from 'lucide-react'

interface CustomerDashboardProps {
  customerId: string
  onBack?: () => void
}

export default function ModernCustomerDashboard({ customerId, onBack }: CustomerDashboardProps) {
  const router = useRouter()
  const [invoiceFilter, _setInvoiceFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'OVERDUE' | 'PARTIALLY_PAID'>('ALL')

  // Check if this is a new customer creation
  const isNewCustomer = customerId === 'new'

  // Fetch customer details (only if not creating new)
  const { data: customer, isLoading, error } = api.customer.getById.useQuery({
    id: customerId,
  }, {
    enabled: !isNewCustomer, // Only fetch if not creating new customer
  })

  // Fetch filtered invoices (only if not creating new)
  const { data: _invoices = [] } = api.customer.getInvoices.useQuery({
    customerId,
    status: invoiceFilter,
  }, {
    enabled: !isNewCustomer, // Only fetch if not creating new customer
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  // Format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl"></div>
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/3"></div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 h-40"></div>
            ))}
          </div>

          {/* Content area skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-96"></div>
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-96"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle new customer creation
  if (isNewCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-0 shadow-lg rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Create New Customer
              </h1>
              <p className="text-slate-600 mt-2">Add a new customer to your database</p>
            </div>
          </div>

          {/* Customer Creation Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-8">
            <CustomerForm
              onCancel={onBack}
              onSuccess={() => router.push('/customers')}
            />
          </Card>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Customer Not Found</h2>
          <p className="text-slate-600 mb-8">The customer you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button
            onClick={onBack || (() => router.back())}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const { financialSummary } = customer

  if (!financialSummary) {
    return <div className="p-6 text-center text-slate-500">Financial data not available</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Sticky Header with Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack || (() => router.back())}
                className="flex items-center gap-2 hover:bg-slate-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-blue-100">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{customer.name}</h1>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    <p className="text-slate-600 font-medium">Enterprise Client Dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-slate-50 transition-all duration-200 shadow-sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <FileText className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Enhanced Financial Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-0 overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 border-0 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300">
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="text-green-100 text-sm font-medium">+12.5%</div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {formatCurrency(financialSummary.totalBilled)}
                </p>
                <p className="text-green-100 text-sm font-medium">Total Billed</p>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 border-0 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-blue-100 text-sm font-medium">+8.2%</div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {formatCurrency(financialSummary.totalPaid)}
                </p>
                <p className="text-blue-100 text-sm font-medium">Total Paid</p>
              </div>
            </div>
          </Card>

          <Card className={`p-0 overflow-hidden border-0 shadow-2xl transform hover:scale-105 transition-all duration-300 ${
            financialSummary.totalOutstanding > 0
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600 hover:shadow-red-500/25'
              : 'bg-gradient-to-br from-slate-500 via-slate-600 to-gray-600 hover:shadow-slate-500/25'
          }`}>
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className={`text-sm font-medium ${
                  financialSummary.totalOutstanding > 0 ? 'text-red-100' : 'text-slate-100'
                }`}>
                  {financialSummary.totalOutstanding > 0 ? 'Pending' : 'Clear'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {formatCurrency(financialSummary.totalOutstanding)}
                </p>
                <p className={`text-sm font-medium ${
                  financialSummary.totalOutstanding > 0 ? 'text-red-100' : 'text-slate-100'
                }`}>Outstanding</p>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 border-0 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-purple-100 text-sm font-medium">Active</div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {financialSummary.totalInvoices}
                </p>
                <p className="text-purple-100 text-sm font-medium">Total Invoices</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Customer Details & Invoice List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information Card */}
          <Card className="p-0 overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border-0 shadow-xl">
            <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Customer Information</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {customer.email && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">Email Address</p>
                    <p className="font-semibold text-slate-900">{customer.email}</p>
                  </div>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">Phone Number</p>
                    <p className="font-semibold text-slate-900">{customer.phone}</p>
                  </div>
                </div>
              )}

              {customer.address && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">Address</p>
                    <p className="font-semibold text-slate-900">{customer.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">Customer Since</p>
                  <p className="font-semibold text-slate-900">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Invoice Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Invoice Overview</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-700">{financialSummary.paidInvoices}</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{financialSummary.pendingInvoices}</p>
                  <p className="text-sm text-amber-600">Pending</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-red-700">{financialSummary.overdueInvoices}</p>
                  <p className="text-sm text-red-600">Overdue</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{financialSummary.paymentRate || 0}%</p>
                  <p className="text-sm text-blue-600">Payment Rate</p>
                </div>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-slate-500" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Invoice Details</h4>
                <p className="text-slate-600">Detailed invoice management coming soon</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}