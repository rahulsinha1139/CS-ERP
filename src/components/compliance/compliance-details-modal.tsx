/**
 * Compliance Details Modal Component
 * View full compliance information with activity timeline
 */

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { api } from '@/utils/api';
import { AuraButton } from '../ui/aura-button';
import {
  X,
  Edit,
  Trash2,
  CheckCircle,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  Building,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ComplianceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complianceId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkComplete?: () => void;
}

export function ComplianceDetailsModal({
  open,
  onOpenChange,
  complianceId,
  onEdit,
  onDelete,
  onMarkComplete,
}: ComplianceDetailsModalProps) {
  // Fetch compliance data
  const { data: compliance, isLoading } = api.compliance.getById.useQuery(
    { id: complianceId },
    { enabled: open && !!complianceId }
  );

  if (!compliance && !isLoading) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      OVERDUE: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
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

  const canMarkComplete = compliance?.status !== 'COMPLETED';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Dialog.Title className="text-2xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : compliance?.title}
                </Dialog.Title>
                {compliance && (
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getStatusColor(compliance.status))}>
                    {compliance.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              <Dialog.Description className="text-sm text-gray-600">
                Compliance tracking and management
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </Dialog.Close>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : compliance ? (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex items-center gap-3 pb-4 border-b">
                {canMarkComplete && (
                  <AuraButton
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={onMarkComplete}
                  >
                    Mark as Complete
                  </AuraButton>
                )}
                <AuraButton
                  variant="secondary"
                  size="sm"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={onEdit}
                >
                  Edit
                </AuraButton>
                <AuraButton
                  variant="secondary"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </AuraButton>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Customer */}
                  {compliance.customer && (
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Customer</div>
                        <div className="text-base font-semibold text-gray-900">
                          {compliance.customer.name}
                        </div>
                        {compliance.customer.gstin && (
                          <div className="text-sm text-gray-600">GSTIN: {compliance.customer.gstin}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Compliance Type */}
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Compliance Type</div>
                      <div className="text-base font-semibold text-gray-900">
                        {compliance.complianceType.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Category</div>
                      <div className="text-base font-semibold text-gray-900">
                        {compliance.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Priority</div>
                      <span className={cn('inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1', getPriorityColor(compliance.priority))}>
                        {compliance.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Due Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Due Date</div>
                      <div className="text-base font-semibold text-gray-900">
                        {formatDate(compliance.dueDate)}
                      </div>
                    </div>
                  </div>

                  {/* Reminder */}
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Reminder</div>
                      <div className="text-base font-semibold text-gray-900">
                        {compliance.reminderDays} days before
                      </div>
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  {compliance.estimatedCost && compliance.estimatedCost > 0 && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Estimated Cost</div>
                        <div className="text-base font-semibold text-gray-900">
                          {formatCurrency(compliance.estimatedCost)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recurring */}
                  {compliance.isRecurring && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Frequency</div>
                        <div className="text-base font-semibold text-gray-900">
                          {compliance.frequency?.replace('_', ' ')} (Recurring)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ROC & Legal Details */}
              {(compliance.rocForm || compliance.rocSection || compliance.applicableAct) && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ROC & Legal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {compliance.rocForm && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">ROC Form</div>
                        <div className="text-base font-semibold text-gray-900 mt-1">{compliance.rocForm}</div>
                      </div>
                    )}
                    {compliance.rocSection && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Section</div>
                        <div className="text-base font-semibold text-gray-900 mt-1">{compliance.rocSection}</div>
                      </div>
                    )}
                    {compliance.applicableAct && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Applicable Act</div>
                        <div className="text-base font-semibold text-gray-900 mt-1">{compliance.applicableAct}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {compliance.description && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{compliance.description}</p>
                </div>
              )}

              {/* Activity Timeline */}
              {compliance.activities && compliance.activities.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                  <div className="space-y-3">
                    {compliance.activities.map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.createdAt)}
                            {activity.performedBy && ` • ${activity.performedBy}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-4 border-t text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Created: {formatDate(compliance.createdAt)}</span>
                  <span>Updated: {formatDate(compliance.updatedAt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Compliance item not found
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
