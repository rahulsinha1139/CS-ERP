/**
 * Customer List Page - Clickable customers with search/filter
 * Priority: Client requirement for accessible customer invoices/payments
 */

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { api } from '@/utils/api';
import { AuraButton } from '../ui/aura-button'
import { AuraCard, AuraCardContent } from '../ui/aura-card'
import { AuraInput } from '../ui/aura-input'
import { AuraSelect } from '../ui/aura-select'
import { AuraLoadingCard } from '../ui/aura-components'
import {
  Users,
  Search,
  Filter,
  Plus,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

interface CustomerListProps {
  onCustomerSelect?: (customerId: string) => void
  selectable?: boolean
}

const CustomerList = React.memo(function CustomerList({ onCustomerSelect, selectable = true }: CustomerListProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt' | 'totalBilled'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search for better performance
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1) // Reset to first page on search
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [search])

  // HIGH-PERFORMANCE: Fetch customers with optimized server-side summaries
  const { data: customersData, isLoading, error, refetch } = api.customer.getAllWithSummary.useQuery({
    page: currentPage,
    limit: 20,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  }, {
    // Enable automatic refetching when data changes
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
  })

  const customers = customersData?.customers || []
  const pagination = customersData?.pagination

  // Handle customer selection - memoized for better performance
  const handleCustomerClick = useCallback((customerId: string) => {
    if (onCustomerSelect) {
      onCustomerSelect(customerId)
    } else if (selectable) {
      router.push(`/customers/${customerId}`)
    }
  }, [onCustomerSelect, selectable, router])

  // Create customer navigation - memoized
  const handleCreateCustomer = useCallback(() => {
    router.push('/customers/new')
  }, [router])

  // Format currency - memoized
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }, [])

  // Get status color
  const getStatusColor = (outstandingAmount: number, overdueInvoices: number) => {
    if (overdueInvoices > 0) return 'text-red-600 bg-red-50'
    if (outstandingAmount > 0) return 'text-blue-600 bg-blue-50'
    return 'text-green-600 bg-green-50'
  }

  // Get status text
  const getStatusText = (outstandingAmount: number, overdueInvoices: number) => {
    if (overdueInvoices > 0) return `${overdueInvoices} Overdue`
    if (outstandingAmount > 0) return 'Outstanding'
    return 'Good Standing'
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load customers</h2>
        <p className="text-gray-600 mb-4">There was an error loading the customer list.</p>
        <AuraButton onClick={() => refetch()}>Try Again</AuraButton>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-sm opacity-20"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
                Customer Directory
              </h1>
              <p className="text-gray-600 font-medium">
                {pagination ? `${pagination.total} active customers` : 'Loading customer data...'}              </p>
            </div>
          </div>

          <AuraButton
            variant="primary"
            icon={<Plus className="h-5 w-5" />}
            onClick={handleCreateCustomer}
            className="px-6 py-3"
          >
            Add New Customer
          </AuraButton>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <AuraCard className="bg-white/80 backdrop-blur-sm">
        <AuraCardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <AuraInput
                placeholder="Search customers by name, email, phone, or GSTIN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search className="h-5 w-5" />}
                className="bg-gray-50/50 py-3"
              />
            </div>

            <div className="flex gap-3">
              <AuraSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                icon={<Filter className="h-4 w-4" />}
                className="min-w-[160px] py-3 bg-gray-50/50"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="createdAt">Sort by Date Added</option>
                <option value="totalBilled">Sort by Revenue</option>
              </AuraSelect>

              <AuraButton
                variant="secondary"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3"
              >
                {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
              </AuraButton>
            </div>
          </div>
        </AuraCardContent>
      </AuraCard>

      {/* Customer List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <AuraLoadingCard key={i} className="p-6 h-32" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {search ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {search
              ? 'Try adjusting your search terms to find what you\'re looking for.'
              : 'Get started by adding your first customer to the system.'}
          </p>
          {!search && (
            <AuraButton variant="primary" onClick={handleCreateCustomer}>Add Your First Customer</AuraButton>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => {
            // OPTIMIZED: Use pre-calculated summary from server
            const { summary } = customer

            // Handle missing summary (safety check)
            if (!summary) {
              return null
            }

            const statusColor = getStatusColor(summary.totalOutstanding, summary.overdueInvoices)
            const statusText = getStatusText(summary.totalOutstanding, summary.overdueInvoices)

            return (
              <AuraCard
                key={customer.id}
                className={`group relative transition-all duration-300 ease-out transform hover:scale-[1.02] hover:-translate-y-1 ${
                  summary.overdueInvoices > 0
                    ? 'bg-gradient-to-br from-red-50/50 via-white to-red-50/30 border-l-4 border-l-red-500 hover:shadow-xl hover:border-l-red-600 hover:from-red-100/60 hover:to-red-50/40'
                    : summary.totalOutstanding > 0
                    ? 'bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 border-l-4 border-l-blue-500 hover:shadow-xl hover:border-l-blue-600 hover:from-blue-100/60 hover:to-blue-50/40'
                    : 'bg-gradient-to-br from-emerald-50/50 via-white to-green-50/30 border-l-4 border-l-emerald-500 hover:shadow-xl hover:border-l-emerald-600 hover:from-emerald-100/60 hover:to-green-50/40'
                } ${selectable ? 'cursor-pointer' : ''} backdrop-blur-sm`}
                onClick={selectable ? () => handleCustomerClick(customer.id) : undefined}
              >
                <AuraCardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* Customer Info */}
                  <div className="flex items-start space-x-5 flex-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                          {customer.name}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColor} transition-all duration-200 group-hover:shadow-md`}>
                          {statusText}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        {customer.email && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-lg text-blue-700 group-hover:bg-blue-100/60 transition-colors duration-200">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50/50 rounded-lg text-green-700 group-hover:bg-green-100/60 transition-colors duration-200">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{customer.phone}</span>
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50/50 rounded-lg text-purple-700 group-hover:bg-purple-100/60 transition-colors duration-200">
                            <MapPin className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">
                              {customer.address.length > 35
                                ? customer.address.substring(0, 35) + '...'
                                : customer.address}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Financial Summary */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                              <DollarSign className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-green-700">Total Billed</p>
                              <p className="font-bold text-green-900 text-sm">
                                {formatCurrency(summary.totalBilled)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border transition-all duration-200 ${
                          summary.totalOutstanding > 0
                            ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-100 group-hover:from-red-100 group-hover:to-pink-100'
                            : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100 group-hover:from-gray-100 group-hover:to-slate-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              summary.totalOutstanding > 0
                                ? 'bg-gradient-to-br from-red-500 to-pink-600'
                                : 'bg-gradient-to-br from-gray-500 to-slate-600'
                            }`}>
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${
                                summary.totalOutstanding > 0 ? 'text-red-700' : 'text-gray-700'
                              }`}>Outstanding</p>
                              <p className={`font-bold text-sm ${
                                summary.totalOutstanding > 0 ? 'text-red-900' : 'text-gray-900'
                              }`}>
                                {formatCurrency(summary.totalOutstanding)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                              <Clock className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-700">Total Invoices</p>
                              <p className="font-bold text-blue-900 text-sm">
                                {summary.totalInvoices}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border transition-all duration-200 ${
                          summary.overdueInvoices > 0
                            ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 group-hover:from-orange-100 group-hover:to-red-100'
                            : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100 group-hover:from-gray-100 group-hover:to-slate-100'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              summary.overdueInvoices > 0
                                ? 'bg-gradient-to-br from-orange-500 to-red-600'
                                : 'bg-gradient-to-br from-gray-400 to-slate-500'
                            }`}>
                              <AlertTriangle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${
                                summary.overdueInvoices > 0 ? 'text-orange-700' : 'text-gray-700'
                              }`}>Overdue</p>
                              <p className={`font-bold text-sm ${
                                summary.overdueInvoices > 0 ? 'text-orange-900' : 'text-gray-900'
                              }`}>
                                {summary.overdueInvoices}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action */}
                  {selectable && (
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50/50 rounded-full group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-200">
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                    </div>
                  )}
                </div>
                </AuraCardContent>
              </AuraCard>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t pt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.total)} of {pagination.total} customers
          </div>

          <div className="flex items-center gap-2">
            <AuraButton
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </AuraButton>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {pagination.pages}
            </span>

            <AuraButton
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= pagination.pages}
            >
              Next
            </AuraButton>
          </div>
        </div>
      )}
    </div>
  )
})

export default CustomerList