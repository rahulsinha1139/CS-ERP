/**
 * Compliance Management Dashboard
 * Professional CS practice compliance tracking with beautiful UI
 */

import React, { useState } from 'react';
import { api } from '../../src/lib/trpc-client';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { formatCurrency, formatDate } from '../../src/lib/utils';
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Plus,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react';

interface ComplianceStats {
  totalCompliances: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  upcomingDeadlines: number;
  criticalAlerts: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  completionRate: number;
}

interface ComplianceItem {
  id: string;
  title: string;
  complianceType: string;
  category: string;
  dueDate: Date;
  status: string;
  priority: string;
  customer?: {
    name: string;
    gstin?: string;
  };
  estimatedCost?: number;
  calculatedPenalty?: number;
  daysOverdue: number;
}

export default function ComplianceDashboard() {
  const [dateRange, setDateRange] = useState<'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear'>('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'overdue' | 'upcoming'>('overview');

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = (api as any).compliance.getDashboard.useQuery({
    dateRange,
  });

  // Fetch all compliance items for filtering
  const { data: complianceData } = (api as any).compliance.getAll.useQuery({
    page: 1,
    limit: 50,
    category: selectedCategory || undefined,
  });

  // Initialize default templates mutation
  const initializeTemplatesMutation = (api as any).compliance.initializeDefaultTemplates.useMutation({
    onSuccess: (data: any) => {
      console.log(`Initialized ${data.created} compliance templates`);
    },
  });

  const handleInitializeTemplates = () => {
    initializeTemplatesMutation.mutate();
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800 border-green-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      OVERDUE: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      CORPORATE_GOVERNANCE: <Users className="h-4 w-4" />,
      REGULATORY_COMPLIANCE: <FileText className="h-4 w-4" />,
      BOARD_MATTERS: <Users className="h-4 w-4" />,
      ANNUAL_COMPLIANCE: <Calendar className="h-4 w-4" />,
      DEFAULT: <FileText className="h-4 w-4" />,
    };
    return icons[category] || icons.DEFAULT;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats: ComplianceStats = dashboardData?.stats || {
    totalCompliances: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    upcomingDeadlines: 0,
    criticalAlerts: 0,
    totalEstimatedCost: 0,
    totalActualCost: 0,
    completionRate: 0,
  };

  const upcomingDeadlines = dashboardData?.upcomingDeadlines || [];
  const overdueItems = dashboardData?.overdueItems || [];
  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600">Track deadlines, ROC filings, and regulatory compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleInitializeTemplates}
            disabled={initializeTemplatesMutation.isLoading}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {initializeTemplatesMutation.isLoading ? 'Initializing...' : 'Setup Templates'}
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Compliance
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Compliances */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Compliances</p>
                <p className="text-3xl font-bold">{stats.totalCompliances}</p>
                <p className="text-blue-100 text-sm">Across all clients</p>
              </div>
              <div className="h-12 w-12 bg-blue-400 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completion Rate</p>
                <p className="text-3xl font-bold">{stats.completionRate.toFixed(1)}%</p>
                <p className="text-green-100 text-sm">{stats.completed} completed</p>
              </div>
              <div className="h-12 w-12 bg-green-400 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Items */}
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Overdue Items</p>
                <p className="text-3xl font-bold">{stats.overdue}</p>
                <p className="text-red-100 text-sm">Require immediate action</p>
              </div>
              <div className="h-12 w-12 bg-red-400 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Upcoming (7 days)</p>
                <p className="text-3xl font-bold">{stats.upcomingDeadlines}</p>
                <p className="text-orange-100 text-sm">Due soon</p>
              </div>
              <div className="h-12 w-12 bg-orange-400 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Est. Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.totalEstimatedCost)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', count: stats.totalCompliances },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'overdue', label: 'Overdue', count: stats.overdue },
            { key: 'upcoming', label: 'Upcoming', count: stats.upcomingDeadlines },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <div className="text-sm text-green-600">Completed This Period</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                      <div className="text-sm text-blue-600">Currently Active</div>
                    </div>
                  </div>

                  {/* Completion Rate Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Progress</span>
                      <span>{stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(activeTab === 'overdue' || activeTab === 'upcoming') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeTab === 'overdue' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                  {activeTab === 'overdue' ? 'Overdue Items' : 'Upcoming Deadlines'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(activeTab === 'overdue' ? overdueItems : upcomingDeadlines).map((item: ComplianceItem) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.customer?.name} • Due: {formatDate(item.dueDate)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                            {item.calculatedPenalty && item.calculatedPenalty > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Penalty: {formatCurrency(item.calculatedPenalty)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.compliance?.customer?.name} • {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create AGM Compliance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                ROC Filing Checklist
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Board Meeting Schedule
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}