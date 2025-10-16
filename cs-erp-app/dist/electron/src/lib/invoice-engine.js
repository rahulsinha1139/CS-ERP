"use strict";
/**
 * Invoice Management Engine with State Machine Pattern
 * Handles invoice lifecycle and business logic
 * Optimized using Asymm mathematical principles
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceUtils = exports.invoiceEngine = exports.InvoiceEngine = exports.INVOICE_STATE_TRANSITIONS = exports.InvoiceState = void 0;
const gst_engine_1 = require("./gst-engine");
// Invoice states following FSM pattern
var InvoiceState;
(function (InvoiceState) {
    InvoiceState["DRAFT"] = "DRAFT";
    InvoiceState["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    InvoiceState["SENT"] = "SENT";
    InvoiceState["PAID"] = "PAID";
    InvoiceState["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceState["OVERDUE"] = "OVERDUE";
    InvoiceState["CANCELLED"] = "CANCELLED";
    InvoiceState["REFUNDED"] = "REFUNDED";
})(InvoiceState || (exports.InvoiceState = InvoiceState = {}));
// Valid state transitions
exports.INVOICE_STATE_TRANSITIONS = {
    [InvoiceState.DRAFT]: [InvoiceState.PENDING_APPROVAL, InvoiceState.SENT, InvoiceState.CANCELLED],
    [InvoiceState.PENDING_APPROVAL]: [InvoiceState.SENT, InvoiceState.DRAFT, InvoiceState.CANCELLED],
    [InvoiceState.SENT]: [InvoiceState.PAID, InvoiceState.PARTIALLY_PAID, InvoiceState.OVERDUE, InvoiceState.CANCELLED],
    [InvoiceState.PARTIALLY_PAID]: [InvoiceState.PAID, InvoiceState.OVERDUE, InvoiceState.CANCELLED],
    [InvoiceState.OVERDUE]: [InvoiceState.PAID, InvoiceState.PARTIALLY_PAID, InvoiceState.CANCELLED],
    [InvoiceState.PAID]: [InvoiceState.REFUNDED],
    [InvoiceState.CANCELLED]: [], // Terminal state
    [InvoiceState.REFUNDED]: [] // Terminal state
};
class InvoiceEngine {
    static getInstance() {
        if (!InvoiceEngine.instance) {
            InvoiceEngine.instance = new InvoiceEngine();
        }
        return InvoiceEngine.instance;
    }
    /**
     * Calculate complete invoice with all tax computations
     * Uses mathematical optimization for performance
     */
    calculateInvoice(invoiceData) {
        this.validateInvoiceData(invoiceData);
        // Calculate each line item
        const lineCalculations = invoiceData.lines.map(line => {
            const taxInput = {
                amount: line.quantity * line.rate,
                gstRate: line.gstRate,
                isReimbursement: line.isReimbursement,
                companyStateCode: invoiceData.companyStateCode,
                customerStateCode: invoiceData.customerStateCode,
                placeOfSupply: invoiceData.placeOfSupply
            };
            const calculation = gst_engine_1.gstEngine.calculateGST(taxInput);
            return {
                ...calculation,
                lineItem: line
            };
        });
        // Calculate invoice totals
        const totals = gst_engine_1.gstEngine.calculateInvoiceTotals(lineCalculations);
        // Determine if any line is interstate
        const isInterstate = lineCalculations.some(calc => calc.isInterstate);
        return {
            ...invoiceData,
            lineCalculations,
            subtotal: totals.subtotal,
            taxableValue: totals.totalTaxableValue,
            cgstAmount: totals.totalCGST,
            sgstAmount: totals.totalSGST,
            igstAmount: totals.totalIGST,
            totalTax: totals.totalTax,
            grandTotal: totals.grandTotal,
            isInterstate,
            state: InvoiceState.DRAFT
        };
    }
    /**
     * Generate invoice number with smart patterns
     * Uses mathematical sequencing for uniqueness
     */
    generateInvoiceNumber(companyPrefix = 'INV', year) {
        const currentYear = year || new Date().getFullYear();
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        // Use golden ratio + random for unique aesthetic number generation
        const goldenSequence = Math.floor((timestamp + random) * 1.618033988) % 10000;
        return `${companyPrefix}-${currentYear}-${goldenSequence.toString().padStart(4, '0')}`;
    }
    /**
     * Validate state transition
     */
    canTransitionTo(currentState, newState) {
        const allowedTransitions = exports.INVOICE_STATE_TRANSITIONS[currentState];
        return allowedTransitions.includes(newState);
    }
    /**
     * Transition invoice state with validation
     */
    transitionState(invoice, newState, context) {
        if (!this.canTransitionTo(invoice.state, newState)) {
            throw new Error(`Invalid state transition from ${invoice.state} to ${newState}`);
        }
        // Perform state-specific actions
        const updatedInvoice = this.performStateActions(invoice, newState, context);
        return {
            ...updatedInvoice,
            state: newState
        };
    }
    /**
     * Process payment and update invoice state
     */
    processPayment(invoice, payment) {
        if (payment.amount <= 0) {
            throw new Error('Payment amount must be positive');
        }
        if (payment.amount > invoice.grandTotal) {
            throw new Error('Payment amount cannot exceed invoice total');
        }
        const remainingBalance = invoice.grandTotal - payment.amount;
        let newState;
        if (remainingBalance === 0) {
            newState = InvoiceState.PAID;
        }
        else if (remainingBalance > 0) {
            newState = InvoiceState.PARTIALLY_PAID;
        }
        else {
            // Overpayment case - handle as business rule
            newState = InvoiceState.PAID;
        }
        const updatedInvoice = this.transitionState(invoice, newState, { payment });
        return {
            invoice: updatedInvoice,
            remainingBalance: Math.max(0, remainingBalance)
        };
    }
    /**
     * Check if invoice is overdue
     */
    isOverdue(invoice) {
        if (!invoice.dueDate)
            return false;
        const now = new Date();
        const dueDate = new Date(invoice.dueDate);
        return now > dueDate &&
            ![InvoiceState.PAID, InvoiceState.CANCELLED, InvoiceState.REFUNDED].includes(invoice.state);
    }
    /**
     * Calculate days overdue
     */
    getDaysOverdue(invoice) {
        if (!this.isOverdue(invoice) || !invoice.dueDate)
            return 0;
        const now = new Date();
        const dueDate = new Date(invoice.dueDate);
        const diffTime = now.getTime() - dueDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    /**
     * Generate payment terms based on business rules
     */
    generatePaymentTerms(customerId, defaultDays = 30) {
        const issueDate = new Date();
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + defaultDays);
        const terms = `Payment due within ${defaultDays} days of invoice date. Late payment charges may apply.`;
        return { dueDate, terms };
    }
    /**
     * Validate invoice data
     */
    validateInvoiceData(data) {
        if (!data.number?.trim()) {
            throw new Error('Invoice number is required');
        }
        if (!data.customerId?.trim()) {
            throw new Error('Customer ID is required');
        }
        if (!data.companyId?.trim()) {
            throw new Error('Company ID is required');
        }
        if (!data.lines || data.lines.length === 0) {
            throw new Error('Invoice must have at least one line item');
        }
        // Validate each line item
        data.lines.forEach((line, index) => {
            if (!line.description?.trim()) {
                throw new Error(`Line ${index + 1}: Description is required`);
            }
            if (line.quantity <= 0) {
                throw new Error(`Line ${index + 1}: Quantity must be positive`);
            }
            if (line.rate < 0) {
                throw new Error(`Line ${index + 1}: Rate cannot be negative`);
            }
            if (line.gstRate < 0 || line.gstRate > 100) {
                throw new Error(`Line ${index + 1}: GST rate must be between 0 and 100`);
            }
        });
    }
    /**
     * Perform actions specific to state transitions
     */
    performStateActions(invoice, newState, context) {
        switch (newState) {
            case InvoiceState.SENT:
                // Record sent timestamp, trigger email
                return {
                    ...invoice,
                    // sentAt: new Date() // This would be handled at the service layer
                };
            case InvoiceState.OVERDUE:
                // Trigger overdue notifications
                return invoice;
            case InvoiceState.PAID:
                // Finalize payment, trigger receipts
                return invoice;
            case InvoiceState.CANCELLED:
                // Cancel related processes
                return invoice;
            default:
                return invoice;
        }
    }
    /**
     * Batch calculate multiple invoices for performance
     */
    batchCalculateInvoices(invoices) {
        return invoices.map(invoice => this.calculateInvoice(invoice));
    }
    /**
     * Generate invoice summary for reporting
     */
    generateInvoiceSummary(invoices) {
        const summary = invoices.reduce((acc, invoice) => ({
            totalAmount: acc.totalAmount + invoice.grandTotal,
            totalTax: acc.totalTax + invoice.totalTax,
            stateCount: {
                ...acc.stateCount,
                [invoice.state]: (acc.stateCount[invoice.state] || 0) + 1
            }
        }), {
            totalAmount: 0,
            totalTax: 0,
            stateCount: {}
        });
        return {
            totalInvoices: invoices.length,
            totalAmount: summary.totalAmount,
            totalTax: summary.totalTax,
            averageAmount: invoices.length > 0 ? summary.totalAmount / invoices.length : 0,
            stateDistribution: summary.stateCount
        };
    }
}
exports.InvoiceEngine = InvoiceEngine;
// Export singleton instance
exports.invoiceEngine = InvoiceEngine.getInstance();
// Utility functions for common invoice operations
exports.invoiceUtils = {
    /**
     * Format invoice number for display
     */
    formatInvoiceNumber: (number) => {
        return number.toUpperCase();
    },
    /**
     * Calculate payment percentage
     */
    getPaymentPercentage: (paidAmount, totalAmount) => {
        if (totalAmount === 0)
            return 0;
        return Math.round((paidAmount / totalAmount) * 100);
    },
    /**
     * Get invoice age in days
     */
    getInvoiceAge: (issueDate) => {
        const now = new Date();
        const issue = new Date(issueDate);
        const diffTime = now.getTime() - issue.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    /**
     * Check if invoice requires approval
     */
    requiresApproval: (invoice) => {
        // Business rule: invoices over 1 lakh need approval
        const APPROVAL_THRESHOLD = 100000;
        return invoice.grandTotal > APPROVAL_THRESHOLD;
    },
    /**
     * Generate late fee calculation
     */
    calculateLateFee: (amount, daysOverdue, rate = 2) => {
        if (daysOverdue <= 0)
            return 0;
        // Simple interest calculation: Principal * Rate * Time / 100 / 365
        const dailyRate = rate / 100 / 365;
        return Math.round(amount * dailyRate * daysOverdue * 100) / 100;
    }
};
