/**
 * Dashboard Overview Component
 * Real-time analytics and CS practice workflow overview
 * Mathematical layout optimization with golden ratio proportions
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/utils/api';
import { AuraButton } from '@/components/ui/aura-button';
import { AuraCard, AuraCardContent, AuraCardHeader, AuraCardTitle } from '@/components/ui/aura-card';
import {
  AuraGrid,
  AuraHeading,
  AuraStatusBadge,
  AuraLoadingCard,
  AuraProgressBar,
  AuraMetricCard
} from '@/components/ui/aura-components';

// Types for dashboard data
interface DashboardMetrics {
  revenue: {
    total: number;
    received: number;
    outstanding: number;
    collectionRate: number;
  };
  invoices: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  customers: {
    new: number;
  };
  compliance: {
    total: number;
    pending: number;
    overdue: number;
  };
}

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'draft';
  dueDate?: string;
  paidDate?: string;
  isOverdue: boolean;
}

interface Deadline {
  id: number;
  title: string;
  client: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  daysLeft: number;
}

interface QuickStats {
  totalClients: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
}

// Proper Prisma-aligned interfaces
interface ApiInvoice {
  id: string;
  number: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
  grandTotal: number;
  dueDate: Date | null;
  paidAmount: number;
  customer: { name: string } | null;
}

interface ApiCompliance {
  id: string;
  title?: string;
  complianceType?: string;
  dueDate: Date | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  customer: { name: string } | null;
}

interface DashboardData {
  metrics: DashboardMetrics;
  recentInvoices: Invoice[];
  upcomingDeadlines: Deadline[];
  quickStats: QuickStats;
}

// Real tRPC data hooks

const useDashboardData = () => {
  // Fetch dashboard metrics with aggressive caching
  const { data: dashboardMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = api.dashboard.getMetrics.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 10, // 10 minutes - cached data retention
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    refetchInterval: false, // No automatic polling
  });

  // Fetch recent invoices with caching
  const { data: recentInvoicesData, isLoading: invoicesLoading } = api.invoice.list.useQuery({
    limit: 5,
    page: 1
  }, {
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch upcoming compliance deadlines with caching
  const { data: upcomingDeadlinesData, isLoading: deadlinesLoading } = api.compliance.getUpcoming.useQuery({
    limit: 5,
    days: 30
  }, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Transform data to match interface
  const loading = metricsLoading || invoicesLoading || deadlinesLoading;

  const data = loading ? null : {
    metrics: dashboardMetrics || {
      revenue: { total: 0, received: 0, outstanding: 0, collectionRate: 0 },
      invoices: { total: 0, paid: 0, pending: 0, overdue: 0 },
      customers: { new: 0 },
      compliance: { total: 0, pending: 0, overdue: 0 }
    },
    recentInvoices: (recentInvoicesData?.invoices || []).map((invoice: ApiInvoice) => ({
      id: invoice.number || invoice.id,
      client: invoice.customer?.name || 'Unknown Client',
      amount: invoice.grandTotal,
      status: ({
        'DRAFT': 'draft',
        'SENT': 'pending',
        'PAID': 'paid',
        'PARTIALLY_PAID': 'pending',
        'OVERDUE': 'overdue',
        'CANCELLED': 'draft'
      }[invoice.status] || 'draft') as 'pending' | 'paid' | 'overdue' | 'draft',
      dueDate: invoice.dueDate ? invoice.dueDate.toISOString().split('T')[0] : undefined,
      paidDate: invoice.paidAmount > 0 && invoice.status === 'PAID'
        ? new Date().toISOString().split('T')[0] : undefined,
      isOverdue: invoice.status === 'OVERDUE'
    })),
    upcomingDeadlines: (upcomingDeadlinesData?.compliances || []).map((deadline: ApiCompliance, index: number) => ({
      id: index + 1,
      title: deadline.title || deadline.complianceType || 'Compliance Task',
      client: deadline.customer?.name || 'Unknown Client',
      dueDate: deadline.dueDate ? deadline.dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      priority: ({
        'LOW': 'low',
        'MEDIUM': 'medium',
        'HIGH': 'high',
        'CRITICAL': 'high'
      }[deadline.priority] || 'medium') as 'high' | 'medium' | 'low',
      daysLeft: deadline.dueDate ? Math.ceil((deadline.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
    })),
    quickStats: {
      totalClients: dashboardMetrics?.customers?.new || 0,
      activeProjects: 0,
      completedTasks: (dashboardMetrics?.compliance?.total || 0) - (dashboardMetrics?.compliance?.pending || 0),
      pendingTasks: dashboardMetrics?.compliance?.pending || 0
    }
  };

  return { data, loading, refetch: refetchMetrics };
};

// Quick action buttons with Aura design
const QuickActions = () => {
  const router = useRouter();

  const handleNewInvoice = () => router.push('/invoices/new');
  const handleRecordPayment = () => router.push('/payments/new');
  const handleCompliance = () => router.push('/compliance');
  const handleReports = () => router.push('/system-test');

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const ClipboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-8 4v9a2 2 0 002 2h4a2 2 0 002-2v-9m-8 0h8" />
    </svg>
  );

  const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  return (
    <AuraCard>
      <AuraCardHeader>
        <AuraCardTitle>Quick Actions</AuraCardTitle>
      </AuraCardHeader>
      <AuraCardContent>
        <AuraGrid cols={2} gap="sm">
          <AuraButton
            variant="primary"
            size="lg"
            icon={<PlusIcon />}
            onClick={handleNewInvoice}
            className="h-auto py-4 px-3 flex-col items-start text-left w-full justify-start"
          >
            <span className="font-medium text-sm whitespace-nowrap">New Invoice</span>
            <span className="text-xs opacity-80 whitespace-nowrap">Create & send</span>
          </AuraButton>

          <AuraButton
            variant="success"
            size="lg"
            icon={<CheckIcon />}
            onClick={handleRecordPayment}
            className="h-auto py-4 px-3 flex-col items-start text-left w-full justify-start"
          >
            <span className="font-medium text-sm whitespace-nowrap">Add Payment</span>
            <span className="text-xs opacity-80 whitespace-nowrap">Track receipts</span>
          </AuraButton>

          <AuraButton
            variant="secondary"
            size="lg"
            icon={<ClipboardIcon />}
            onClick={handleCompliance}
            className="h-auto py-4 px-3 flex-col items-start text-left w-full justify-start"
          >
            <span className="font-medium text-sm whitespace-nowrap">Compliance</span>
            <span className="text-xs opacity-80 whitespace-nowrap">View deadlines</span>
          </AuraButton>

          <AuraButton
            variant="tertiary"
            size="lg"
            icon={<ChartIcon />}
            onClick={handleReports}
            className="h-auto py-4 px-3 flex-col items-start text-left w-full justify-start"
          >
            <span className="font-medium text-sm whitespace-nowrap">Reports</span>
            <span className="text-xs opacity-80 whitespace-nowrap">Business insights</span>
          </AuraButton>
        </AuraGrid>
      </AuraCardContent>
    </AuraCard>
  );
};

// Recent invoices component with Aura design
const RecentInvoices = ({ invoices, loading }: { invoices: Invoice[]; loading: boolean }) => (
  <AuraCard>
    <AuraCardHeader>
      <div className="flex items-center justify-between">
        <AuraCardTitle>Recent Invoices</AuraCardTitle>
        <Link href="/invoices" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
          View all
        </Link>
      </div>
    </AuraCardHeader>
    <AuraCardContent>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <AuraLoadingCard key={i} className="p-3 h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 border border-blue-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <div>
                <p className="font-medium text-text-primary">{invoice.id}</p>
                <p className="text-sm text-text-secondary">{invoice.client}</p>
                {invoice.dueDate && (
                  <p className={cn(
                    "text-xs",
                    invoice.isOverdue ? "text-red-600" : "text-text-tertiary"
                  )}>
                    Due: {formatDate(new Date(invoice.dueDate))}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-text-primary">{formatCurrency(invoice.amount)}</p>
                <AuraStatusBadge status={invoice.status}>
                  {invoice.status}
                </AuraStatusBadge>
              </div>
            </div>
          ))}
        </div>
      )}
    </AuraCardContent>
  </AuraCard>
);

// Upcoming deadlines component with Aura design
const UpcomingDeadlines = ({ deadlines, loading }: { deadlines: Deadline[]; loading: boolean }) => (
  <AuraCard>
    <AuraCardHeader>
      <div className="flex items-center justify-between">
        <AuraCardTitle>Upcoming Deadlines</AuraCardTitle>
        <Link href="/compliance" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
          View all
        </Link>
      </div>
    </AuraCardHeader>
    <AuraCardContent>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <AuraLoadingCard key={i} className="p-3 h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-3 border border-blue-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <div className="flex-1">
                <p className="font-medium text-text-primary">{deadline.title}</p>
                <p className="text-sm text-text-secondary">{deadline.client}</p>
                <p className="text-xs text-text-tertiary">Due: {formatDate(new Date(deadline.dueDate))}</p>
              </div>
              <div className="text-right">
                <AuraStatusBadge status={deadline.priority === 'high' ? 'failed' : deadline.priority === 'medium' ? 'pending' : 'draft'}>
                  {deadline.daysLeft} days
                </AuraStatusBadge>
              </div>
            </div>
          ))}
        </div>
      )}
    </AuraCardContent>
  </AuraCard>
);

// Main dashboard component
const DashboardOverview = React.memo(function DashboardOverview() {
  const { data, loading } = useDashboardData();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <AuraGrid cols={3} gap="lg">
          <AuraLoadingCard />
          <AuraLoadingCard />
          <AuraLoadingCard />
        </AuraGrid>
        <AuraGrid cols={2} gap="lg">
          <AuraLoadingCard />
          <AuraLoadingCard />
        </AuraGrid>
      </div>
    );
  }

  const { metrics, recentInvoices, upcomingDeadlines, quickStats } = data || {} as Partial<DashboardData>;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <section>
        <AuraHeading size="xl" className="mb-6">Business Overview</AuraHeading>
        <AuraGrid cols={4} gap="lg">
          <AuraMetricCard
            title="Quarterly Revenue"
            value={formatCurrency(metrics?.revenue?.quarterly || 0)}
            change={{ value: metrics?.revenue?.collectionRate || 0, type: 'increase' }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            onClick={() => console.log('Navigate to revenue details')}
          />

          <AuraMetricCard
            title="Pending Invoices"
            value={metrics?.invoices?.pending || 0}
            description="Awaiting payment"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            onClick={() => console.log('Navigate to pending invoices')}
          />

          <AuraMetricCard
            title="Overdue Amount"
            value={formatCurrency(metrics?.revenue?.overdue || 0)}
            description="Requires follow-up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />

          <AuraMetricCard
            title="Compliance Score"
            value={`${Math.round((metrics?.compliance?.total ? ((metrics.compliance.total - metrics.compliance.pending) / metrics.compliance.total) * 100 : 0))}%`}
            description="Regulatory compliance"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </AuraGrid>
      </section>

      {/* Main content grid */}
      <AuraGrid cols={3} gap="lg" className="items-start">
        {/* Left column - 2/3 width */}
        <div className="col-span-2 space-y-6">
          <RecentInvoices invoices={recentInvoices || []} loading={loading} />
          <UpcomingDeadlines deadlines={upcomingDeadlines || []} loading={loading} />
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          <QuickActions />

          {/* Quick Stats */}
          <AuraCard>
            <AuraCardHeader>
              <AuraCardTitle>Quick Stats</AuraCardTitle>
            </AuraCardHeader>
            <AuraCardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Active Clients</span>
                  <span className="font-semibold">{quickStats?.totalClients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Active Projects</span>
                  <span className="font-semibold">{quickStats?.activeProjects}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Task Progress</span>
                    <span className="text-sm font-medium">
                      {quickStats?.completedTasks || 0}/{(quickStats?.completedTasks || 0) + (quickStats?.pendingTasks || 0)}
                    </span>
                  </div>
                  <AuraProgressBar
                    value={quickStats?.completedTasks || 0}
                    max={(quickStats?.completedTasks || 0) + (quickStats?.pendingTasks || 0)}
                    color="success"
                  />
                </div>
              </div>
            </AuraCardContent>
          </AuraCard>
        </div>
      </AuraGrid>
    </div>
  );
});

export default DashboardOverview;