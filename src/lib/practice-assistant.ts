/**
 * Practice Assistant - Notification Helper for Mrs. Pradhan
 * Converts enterprise notification system into personal practice assistant
 */

import type { Notification } from '../store/app-store';

type NotificationType = Notification['type'];

// Type definitions for template function parameters
type TemplateArgs = {
  invoiceCreated: [customerName: string, amount: number];
  paymentReceived: [customerName: string, amount: number];
  invoiceOverdue: [customerName: string, daysOverdue: number];
  customerAdded: [customerName: string];
  performanceInsight: [metric: string, value: string];
  systemAlert: [message: string];
  errorAlert: [operation: string, error: string];
};

// Template function type that returns notification data
type TemplateFunction<T extends keyof TemplateArgs> = (
  ...args: TemplateArgs[T]
) => Omit<Notification, 'id' | 'timestamp' | 'read'>;

export class PracticeAssistant {
  // Static notification templates for Mrs. Pradhan's common scenarios
  static templates = {
    invoiceCreated: (customerName: string, amount: number) => ({
      type: 'success' as NotificationType,
      title: '📄 Invoice Created',
      message: `New invoice for ${customerName} - ₹${amount.toLocaleString('en-IN')}`,
    }),

    paymentReceived: (customerName: string, amount: number) => ({
      type: 'success' as NotificationType,
      title: '💰 Payment Received',
      message: `Payment of ₹${amount.toLocaleString('en-IN')} from ${customerName}`,
    }),

    invoiceOverdue: (customerName: string, daysOverdue: number) => ({
      type: 'warning' as NotificationType,
      title: '⏰ Invoice Overdue',
      message: `${customerName} has an invoice ${daysOverdue} days overdue`,
    }),

    customerAdded: (customerName: string) => ({
      type: 'success' as NotificationType,
      title: '👥 New Client Added',
      message: `${customerName} added to your practice`,
    }),

    performanceInsight: (metric: string, value: string) => ({
      type: 'info' as NotificationType,
      title: '📊 Practice Insight',
      message: `${metric}: ${value}`,
    }),

    systemAlert: (message: string) => ({
      type: 'info' as NotificationType,
      title: '🔧 System Update',
      message,
    }),

    errorAlert: (operation: string, error: string) => ({
      type: 'error' as NotificationType,
      title: '⚠️ Operation Failed',
      message: `${operation}: ${error}`,
    }),
  };

  // Helper to create practice-specific notifications
  static createNotification<T extends keyof TemplateArgs>(
    template: T,
    ...args: TemplateArgs[T]
  ): Omit<Notification, 'id' | 'timestamp' | 'read'> {
    const templateFn = PracticeAssistant.templates[template] as TemplateFunction<T>;
    return templateFn(...args);
  }

  // Common practice workflow notifications
  static workflows = {
    // When Mrs. Pradhan completes an invoice workflow
    invoiceWorkflowComplete: (customerName: string, invoiceNumber: string, amount: number) => [
      PracticeAssistant.createNotification('invoiceCreated', customerName, amount),
      {
        type: 'info' as NotificationType,
        title: '✅ Workflow Complete',
        message: `Invoice ${invoiceNumber} ready for dispatch`,
      },
    ],

    // When a payment is reconciled
    paymentReconciled: (customerName: string, amount: number, outstandingBalance: number) => [
      PracticeAssistant.createNotification('paymentReceived', customerName, amount),
      ...(outstandingBalance === 0 ? [{
        type: 'success' as NotificationType,
        title: '🎉 Account Settled',
        message: `${customerName} has fully paid all outstanding invoices`,
      }] : []),
    ],

    // Daily practice summary
    dailySummary: (stats: { invoices: number; payments: number; newClients: number }) => [{
      type: 'info' as NotificationType,
      title: '📋 Daily Practice Summary',
      message: `${stats.invoices} invoices, ${stats.payments} payments, ${stats.newClients} new clients`,
    }],
  };
}

// Hook to integrate with existing store
export const usePracticeAssistant = () => {
  // This will be connected to useAppStore in the next session
  // For now, returns the helper functions
  return {
    notify: PracticeAssistant.createNotification,
    workflows: PracticeAssistant.workflows,
  };
};