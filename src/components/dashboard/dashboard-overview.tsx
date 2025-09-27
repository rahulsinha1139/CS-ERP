/**
 * Dashboard Overview Component
 * Real-time analytics and CS practice workflow overview
 * Mathematical layout optimization with golden ratio proportions
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/trpc-client';
import {
  Card,
  MetricCard,
  Grid,
  Heading,
  StatusBadge,
  LoadingCard,
  ProgressBar
} from '@/components/ui/design-system';

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

interface DashboardData {
  metrics: DashboardMetrics;
  recentInvoices: Invoice[];
  upcomingDeadlines: Deadline[];
  quickStats: QuickStats;
}

// Real tRPC data hooks

const useDashboardData = () => {
  // Fetch dashboard metrics
  const { data: dashboardMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = api.dashboard?.getMetrics?.useQuery() || { data: null, isLoading: true, refetch: () => {} };

  // Fetch recent invoices
  const { data: recentInvoicesData, isLoading: invoicesLoading } = api.invoice?.list?.useQuery({
    limit: 5,
    page: 1
  }) || { data: [], isLoading: true };

  // Fetch upcoming compliance deadlines
  const { data: upcomingDeadlinesData, isLoading: deadlinesLoading } = api.compliance?.getUpcoming?.useQuery({
    limit: 5,
    days: 30
  }) || { data: [], isLoading: true };

  // Transform data to match interface
  const loading = metricsLoading || invoicesLoading || deadlinesLoading;

  const data = loading ? null : {
    metrics: dashboardMetrics || {
      revenue: { total: 0, received: 0, outstanding: 0, collectionRate: 0 },
      invoices: { total: 0, paid: 0, pending: 0, overdue: 0 },
      customers: { new: 0 },
      compliance: { total: 0, pending: 0, overdue: 0 }
    },
    recentInvoices: (recentInvoicesData?.invoices || []).map((invoice: any) => ({
      id: invoice.number || invoice.id,
      client: invoice.customer?.name || 'Unknown Client',
      amount: invoice.grandTotal || 0,
      status: invoice.status?.toLowerCase() || 'draft',
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : undefined,
      paidDate: invoice.paidDate ? new Date(invoice.paidDate).toISOString().split('T')[0] : undefined,
      isOverdue: invoice.status === 'OVERDUE' || (invoice.dueDate && new Date(invoice.dueDate) < new Date())
    })),
    upcomingDeadlines: (upcomingDeadlinesData?.compliances || []).map((deadline: any, index: number) => ({
      id: index + 1,
      title: deadline.title || deadline.complianceType || 'Compliance Task',
      client: deadline.customer?.name || 'Unknown Client',
      dueDate: deadline.dueDate ? new Date(deadline.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      priority: deadline.priority?.toLowerCase() || 'medium',
      daysLeft: deadline.dueDate ? Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
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

// Quick action buttons
const QuickActions = () => {
  const router = useRouter();

  const handleNewInvoice = () => router.push('/invoices/new');
  const handleRecordPayment = () => router.push('/payments/new');
  const handleCompliance = () => router.push('/compliance');
  const handleReports = () => router.push('/system-test');

  return (
    <Card className="p-6">
      <Heading size="default" className="mb-4">Quick Actions</Heading>
      <Grid cols={2} gap="sm">
        <button
          onClick={handleNewInvoice}
          className="w-full p-4 text-left border border-border rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">New Invoice</p>
              <p className="text-sm text-muted-foreground">Create and send invoice</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleRecordPayment}
          className="w-full p-4 text-left border border-border rounded-lg hover:border-success-300 hover:bg-success-50 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center group-hover:bg-success-200 transition-colors">
              <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Record Payment</p>
              <p className="text-sm text-muted-foreground">Track received payments</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleCompliance}
          className="w-full p-4 text-left border border-border rounded-lg hover:border-warning-300 hover:bg-warning-50 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center group-hover:bg-warning-200 transition-colors">
              <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-8 4v9a2 2 0 002 2h4a2 2 0 002-2v-9m-8 0h8" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Compliance Check</p>
              <p className="text-sm text-muted-foreground">Review upcoming deadlines</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleReports}
          className="w-full p-4 text-left border border-border rounded-lg hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">View Reports</p>
              <p className="text-sm text-muted-foreground">Generate business insights</p>
            </div>
          </div>
        </button>
      </Grid>
    </Card>
  );
};

// Recent invoices component
const RecentInvoices = ({ invoices, loading }: { invoices: Invoice[]; loading: boolean }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <Heading size="default">Recent Invoices</Heading>
      <Link href="/invoices" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
        View all
      </Link>
    </div>

    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-32"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-24"></div>
              </div>
              <div className="h-6 bg-muted-foreground/20 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">{invoice.id}</p>
              <p className="text-sm text-muted-foreground">{invoice.client}</p>
              {invoice.dueDate && (
                <p className={cn(
                  "text-xs",
                  invoice.isOverdue ? "text-danger-600" : "text-muted-foreground"
                )}>
                  Due: {formatDate(new Date(invoice.dueDate))}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{formatCurrency(invoice.amount)}</p>
              <StatusBadge status={invoice.status}>
                {invoice.status}
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// Upcoming deadlines component
const UpcomingDeadlines = ({ deadlines, loading }: { deadlines: Deadline[]; loading: boolean }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <Heading size="default">Upcoming Deadlines</Heading>
      <Link href="/compliance" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
        View all
      </Link>
    </div>

    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <LoadingCard key={i} className="p-3" />
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-foreground">{deadline.title}</p>
              <p className="text-sm text-muted-foreground">{deadline.client}</p>
              <p className="text-xs text-muted-foreground">Due: {formatDate(new Date(deadline.dueDate))}</p>
            </div>
            <div className="text-right">
              <StatusBadge status={deadline.priority === 'high' ? 'failed' : deadline.priority === 'medium' ? 'pending' : 'draft'}>
                {deadline.daysLeft} days
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

// Main dashboard component
export default function DashboardOverview() {
  const { data, loading } = useDashboardData();

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <Grid cols={3} gap="lg">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </Grid>
        <Grid cols={2} gap="lg">
          <LoadingCard />
          <LoadingCard />
        </Grid>
      </div>
    );
  }

  const { metrics, recentInvoices, upcomingDeadlines, quickStats } = data || {} as Partial<DashboardData>;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <section>
        <Heading size="xl" className="mb-6">Business Overview</Heading>
        <Grid cols={4} gap="lg">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(metrics?.revenue?.total || 0)}
            change={{ value: metrics?.revenue?.collectionRate || 0, type: 'increase' }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            onClick={() => console.log('Navigate to revenue details')}
          />

          <MetricCard
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

          <MetricCard
            title="Overdue Amount"
            value={formatCurrency(metrics?.revenue?.outstanding || 0)}
            description="Requires follow-up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />

          <MetricCard
            title="Compliance Score"
            value={`${Math.round((metrics?.compliance?.total ? ((metrics.compliance.total - metrics.compliance.pending) / metrics.compliance.total) * 100 : 0))}%`}
            description="Regulatory compliance"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </Grid>
      </section>

      {/* Main content grid */}
      <Grid cols={3} gap="lg" className="items-start">
        {/* Left column - 2/3 width */}
        <div className="col-span-2 space-y-6">
          <RecentInvoices invoices={recentInvoices || []} loading={loading} />
          <UpcomingDeadlines deadlines={upcomingDeadlines || []} loading={loading} />
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          <QuickActions />

          {/* Quick Stats */}
          <Card className="p-6">
            <Heading size="default" className="mb-4">Quick Stats</Heading>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Clients</span>
                <span className="font-semibold">{quickStats?.totalClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Projects</span>
                <span className="font-semibold">{quickStats?.activeProjects}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Task Progress</span>
                  <span className="text-sm font-medium">
                    {quickStats?.completedTasks || 0}/{(quickStats?.completedTasks || 0) + (quickStats?.pendingTasks || 0)}
                  </span>
                </div>
                <ProgressBar
                  value={quickStats?.completedTasks || 0}
                  max={(quickStats?.completedTasks || 0) + (quickStats?.pendingTasks || 0)}
                  color="success"
                />
              </div>
            </div>
          </Card>
        </div>
      </Grid>
    </div>
  );
}