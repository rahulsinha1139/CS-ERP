/**
 * Compliance Form Modal Component
 * Create and Edit compliance items with full validation
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Dialog from '@radix-ui/react-dialog';
import { api } from '@/utils/api';
import { AuraButton } from '../ui/aura-button';
import { AuraInput } from '../ui/aura-input';
import { AuraSelect } from '../ui/aura-select';
import { X, Save, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema matching the compliance router
const complianceFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  customerId: z.string().optional(),
  complianceType: z.enum([
    'ROC_FILING', 'BOARD_MEETING', 'AGM', 'EGM', 'AUDIT',
    'TAX_FILING', 'REGULATORY', 'STATUTORY', 'PERIODIC', 'ONE_TIME'
  ]),
  category: z.enum([
    'CORPORATE_GOVERNANCE', 'REGULATORY_COMPLIANCE', 'TAX_COMPLIANCE',
    'AUDIT_COMPLIANCE', 'BOARD_MATTERS', 'SHAREHOLDER_MATTERS',
    'SECRETARIAL_COMPLIANCE', 'ANNUAL_COMPLIANCE', 'QUARTERLY_COMPLIANCE',
    'MONTHLY_COMPLIANCE'
  ]),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  frequency: z.enum([
    'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY',
    'HALF_YEARLY', 'ANNUALLY', 'BI_ANNUALLY', 'ON_DEMAND'
  ]).optional(),
  isRecurring: z.boolean().default(false),
  reminderDays: z.number().min(0).max(365).default(7),
  estimatedCost: z.number().min(0).optional(),
  rocForm: z.string().optional(),
  rocSection: z.string().optional(),
  applicableAct: z.string().optional(),
  assignedTo: z.string().optional(),
});

type ComplianceFormData = z.infer<typeof complianceFormSchema>;

interface ComplianceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complianceId?: string; // If provided, edit mode
  onSuccess?: () => void;
}

export function ComplianceFormModal({
  open,
  onOpenChange,
  complianceId,
  onSuccess,
}: ComplianceFormModalProps) {
  const utils = api.useUtils();
  const isEditMode = !!complianceId;

  // Form setup
  const form = useForm<ComplianceFormData>({
    resolver: zodResolver(complianceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      complianceType: 'ROC_FILING',
      category: 'CORPORATE_GOVERNANCE',
      dueDate: '',
      priority: 'MEDIUM',
      isRecurring: false,
      reminderDays: 7,
      estimatedCost: 0,
      rocForm: '',
      rocSection: '',
      applicableAct: '',
    },
  });

  // Fetch customers for dropdown
  const { data: customers } = api.customer.getList.useQuery(undefined, {
    enabled: open,
  });

  // Fetch compliance data for edit mode
  const { data: complianceData, isLoading: isLoadingCompliance } = api.compliance.getById.useQuery(
    { id: complianceId! },
    {
      enabled: isEditMode && open,
    }
  );

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && complianceData) {
      form.reset({
        title: complianceData.title,
        description: complianceData.description || '',
        customerId: complianceData.customerId || undefined,
        complianceType: complianceData.complianceType as any,
        category: complianceData.category as any,
        dueDate: new Date(complianceData.dueDate).toISOString().split('T')[0],
        priority: (complianceData.priority as any) || 'MEDIUM',
        frequency: complianceData.frequency as any,
        isRecurring: complianceData.isRecurring,
        reminderDays: complianceData.reminderDays,
        estimatedCost: complianceData.estimatedCost || 0,
        rocForm: complianceData.rocForm || '',
        rocSection: complianceData.rocSection || '',
        applicableAct: complianceData.applicableAct || '',
        assignedTo: complianceData.assignedTo || '',
      });
    } else if (!isEditMode && open) {
      // Reset form for create mode
      form.reset({
        title: '',
        description: '',
        complianceType: 'ROC_FILING',
        category: 'CORPORATE_GOVERNANCE',
        dueDate: '',
        priority: 'MEDIUM',
        isRecurring: false,
        reminderDays: 7,
        estimatedCost: 0,
      });
    }
  }, [complianceData, isEditMode, open, form]);

  // Mutations
  const createMutation = api.compliance.create.useMutation({
    onSuccess: () => {
      utils.compliance.getAll.invalidate();
      utils.compliance.getDashboard.invalidate();
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Failed to create compliance:', error);
      alert('Failed to create compliance item. Please try again.');
    },
  });

  const updateMutation = api.compliance.update.useMutation({
    onSuccess: () => {
      utils.compliance.getAll.invalidate();
      utils.compliance.getDashboard.invalidate();
      utils.compliance.getById.invalidate({ id: complianceId! });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Failed to update compliance:', error);
      alert('Failed to update compliance item. Please try again.');
    },
  });

  // Form submission
  const onSubmit = (data: ComplianceFormData) => {
    // Convert date string to Date object
    const formattedData = {
      ...data,
      dueDate: new Date(data.dueDate),
      estimatedCost: data.estimatedCost || undefined,
      rocForm: data.rocForm || undefined,
      rocSection: data.rocSection || undefined,
      applicableAct: data.applicableAct || undefined,
      assignedTo: data.assignedTo || undefined,
    };

    if (isEditMode) {
      updateMutation.mutate({
        id: complianceId,
        ...formattedData,
      });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isRecurring = form.watch('isRecurring');

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Compliance Item' : 'Create New Compliance Item'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mt-1">
                {isEditMode
                  ? 'Update compliance details and tracking information'
                  : 'Create a new compliance item with deadlines and alerts'}
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </Dialog.Close>
          </div>

          {isLoadingCompliance && isEditMode ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <AuraInput
                      {...form.register('title')}
                      placeholder="e.g., Annual General Meeting 2024"
                      error={form.formState.errors.title?.message}
                    />
                  </div>

                  {/* Customer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer (Optional)
                    </label>
                    <AuraSelect {...form.register('customerId')}>
                      <option value="">Select customer (optional)</option>
                      {customers?.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </AuraSelect>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <AuraInput
                      type="date"
                      {...form.register('dueDate')}
                      error={form.formState.errors.dueDate?.message}
                    />
                  </div>

                  {/* Compliance Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compliance Type <span className="text-red-500">*</span>
                    </label>
                    <AuraSelect {...form.register('complianceType')}>
                      <option value="ROC_FILING">ROC Filing</option>
                      <option value="BOARD_MEETING">Board Meeting</option>
                      <option value="AGM">Annual General Meeting</option>
                      <option value="EGM">Extraordinary General Meeting</option>
                      <option value="AUDIT">Audit</option>
                      <option value="TAX_FILING">Tax Filing</option>
                      <option value="REGULATORY">Regulatory</option>
                      <option value="STATUTORY">Statutory</option>
                      <option value="PERIODIC">Periodic</option>
                      <option value="ONE_TIME">One Time</option>
                    </AuraSelect>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <AuraSelect {...form.register('category')}>
                      <option value="CORPORATE_GOVERNANCE">Corporate Governance</option>
                      <option value="REGULATORY_COMPLIANCE">Regulatory Compliance</option>
                      <option value="TAX_COMPLIANCE">Tax Compliance</option>
                      <option value="AUDIT_COMPLIANCE">Audit Compliance</option>
                      <option value="BOARD_MATTERS">Board Matters</option>
                      <option value="SHAREHOLDER_MATTERS">Shareholder Matters</option>
                      <option value="SECRETARIAL_COMPLIANCE">Secretarial Compliance</option>
                      <option value="ANNUAL_COMPLIANCE">Annual Compliance</option>
                      <option value="QUARTERLY_COMPLIANCE">Quarterly Compliance</option>
                      <option value="MONTHLY_COMPLIANCE">Monthly Compliance</option>
                    </AuraSelect>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <AuraSelect {...form.register('priority')}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </AuraSelect>
                  </div>

                  {/* Reminder Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder (Days Before)
                    </label>
                    <AuraInput
                      type="number"
                      {...form.register('reminderDays', { valueAsNumber: true })}
                      placeholder="7"
                      min="0"
                      max="365"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...form.register('description')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Additional details about this compliance requirement..."
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Configuration */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Recurrence Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Is Recurring */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      {...form.register('isRecurring')}
                      id="isRecurring"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                      This is a recurring compliance
                    </label>
                  </div>

                  {/* Frequency (only if recurring) */}
                  {isRecurring && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <AuraSelect {...form.register('frequency')}>
                        <option value="">Select frequency</option>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="HALF_YEARLY">Half-Yearly</option>
                        <option value="ANNUALLY">Annually</option>
                        <option value="BI_ANNUALLY">Bi-Annually</option>
                        <option value="ON_DEMAND">On Demand</option>
                      </AuraSelect>
                    </div>
                  )}
                </div>
              </div>

              {/* ROC & Legal Details */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  ROC & Legal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ROC Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ROC Form Number
                    </label>
                    <AuraInput
                      {...form.register('rocForm')}
                      placeholder="e.g., MGT-7, AOC-4, ADT-1"
                    />
                  </div>

                  {/* ROC Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ROC Section
                    </label>
                    <AuraInput
                      {...form.register('rocSection')}
                      placeholder="e.g., Section 92, Section 137"
                    />
                  </div>

                  {/* Applicable Act */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applicable Act
                    </label>
                    <AuraInput
                      {...form.register('applicableAct')}
                      placeholder="e.g., Companies Act 2013"
                    />
                  </div>

                  {/* Estimated Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Cost (₹)
                    </label>
                    <AuraInput
                      type="number"
                      {...form.register('estimatedCost', { valueAsNumber: true })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <AuraButton
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </AuraButton>
                <AuraButton
                  type="submit"
                  variant="primary"
                  icon={<Save className="h-4 w-4" />}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : isEditMode
                    ? 'Update Compliance'
                    : 'Create Compliance'}
                </AuraButton>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
