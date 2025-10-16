"use strict";
/**
 * Practice Assistant - Notification Helper for Mrs. Pradhan
 * Converts enterprise notification system into personal practice assistant
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePracticeAssistant = exports.PracticeAssistant = void 0;
class PracticeAssistant {
    // Helper to create practice-specific notifications
    static createNotification(template, ...args) {
        const templateFn = PracticeAssistant.templates[template];
        return templateFn(...args);
    }
}
exports.PracticeAssistant = PracticeAssistant;
// Static notification templates for Mrs. Pradhan's common scenarios
PracticeAssistant.templates = {
    invoiceCreated: (customerName, amount) => ({
        type: 'success',
        title: '📄 Invoice Created',
        message: `New invoice for ${customerName} - ₹${amount.toLocaleString('en-IN')}`,
    }),
    paymentReceived: (customerName, amount) => ({
        type: 'success',
        title: '💰 Payment Received',
        message: `Payment of ₹${amount.toLocaleString('en-IN')} from ${customerName}`,
    }),
    invoiceOverdue: (customerName, daysOverdue) => ({
        type: 'warning',
        title: '⏰ Invoice Overdue',
        message: `${customerName} has an invoice ${daysOverdue} days overdue`,
    }),
    customerAdded: (customerName) => ({
        type: 'success',
        title: '👥 New Client Added',
        message: `${customerName} added to your practice`,
    }),
    performanceInsight: (metric, value) => ({
        type: 'info',
        title: '📊 Practice Insight',
        message: `${metric}: ${value}`,
    }),
    systemAlert: (message) => ({
        type: 'info',
        title: '🔧 System Update',
        message,
    }),
    errorAlert: (operation, error) => ({
        type: 'error',
        title: '⚠️ Operation Failed',
        message: `${operation}: ${error}`,
    }),
};
// Common practice workflow notifications
PracticeAssistant.workflows = {
    // When Mrs. Pradhan completes an invoice workflow
    invoiceWorkflowComplete: (customerName, invoiceNumber, amount) => [
        PracticeAssistant.createNotification('invoiceCreated', customerName, amount),
        {
            type: 'info',
            title: '✅ Workflow Complete',
            message: `Invoice ${invoiceNumber} ready for dispatch`,
        },
    ],
    // When a payment is reconciled
    paymentReconciled: (customerName, amount, outstandingBalance) => [
        PracticeAssistant.createNotification('paymentReceived', customerName, amount),
        ...(outstandingBalance === 0 ? [{
                type: 'success',
                title: '🎉 Account Settled',
                message: `${customerName} has fully paid all outstanding invoices`,
            }] : []),
    ],
    // Daily practice summary
    dailySummary: (stats) => [{
            type: 'info',
            title: '📋 Daily Practice Summary',
            message: `${stats.invoices} invoices, ${stats.payments} payments, ${stats.newClients} new clients`,
        }],
};
// Hook to integrate with existing store
const usePracticeAssistant = () => {
    // This will be connected to useAppStore in the next session
    // For now, returns the helper functions
    return {
        notify: PracticeAssistant.createNotification,
        workflows: PracticeAssistant.workflows,
    };
};
exports.usePracticeAssistant = usePracticeAssistant;
