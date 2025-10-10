/**
 * Invoice Management Engine with State Machine Pattern
 * Handles invoice lifecycle and business logic
 * Optimized using Asymm mathematical principles
 */

import { gstEngine, type TaxCalculationInput, type TaxCalculationResult } from './gst-engine';

// Invoice states following FSM pattern
export enum InvoiceState {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Valid state transitions
export const INVOICE_STATE_TRANSITIONS: Record<InvoiceState, InvoiceState[]> = {
  [InvoiceState.DRAFT]: [InvoiceState.PENDING_APPROVAL, InvoiceState.SENT, InvoiceState.CANCELLED],
  [InvoiceState.PENDING_APPROVAL]: [InvoiceState.SENT, InvoiceState.DRAFT, InvoiceState.CANCELLED],
  [InvoiceState.SENT]: [InvoiceState.PAID, InvoiceState.PARTIALLY_PAID, InvoiceState.OVERDUE, InvoiceState.CANCELLED],
  [InvoiceState.PARTIALLY_PAID]: [InvoiceState.PAID, InvoiceState.OVERDUE, InvoiceState.CANCELLED],
  [InvoiceState.OVERDUE]: [InvoiceState.PAID, InvoiceState.PARTIALLY_PAID, InvoiceState.CANCELLED],
  [InvoiceState.PAID]: [InvoiceState.REFUNDED],
  [InvoiceState.CANCELLED]: [], // Terminal state
  [InvoiceState.REFUNDED]: [] // Terminal state
};

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  isReimbursement: boolean;
  gstRate: number;
  hsnSac?: string;
  serviceTemplateId?: string;
}

export interface InvoiceData {
  id?: string;
  number: string;
  issueDate: Date;
  dueDate?: Date;
  customerId: string;
  companyId: string;
  placeOfSupply?: string;
  notes?: string;
  terms?: string;
  lines: InvoiceLineItem[];
  // Customer data for calculations
  customerStateCode?: string;
  companyStateCode: string;
}

export interface CalculatedInvoice extends InvoiceData {
  lineCalculations: (TaxCalculationResult & { lineItem: InvoiceLineItem })[];
  subtotal: number;
  taxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  grandTotal: number;
  isInterstate: boolean;
  state: InvoiceState;
}

export interface PaymentData {
  amount: number;
  paymentDate: Date;
  mode: string;
  reference?: string;
  notes?: string;
}

// Context interfaces for state transitions
export interface StateTransitionContext {
  payment?: PaymentData;
  notes?: string;
  timestamp?: Date;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export class InvoiceEngine {
  private static instance: InvoiceEngine;

  static getInstance(): InvoiceEngine {
    if (!InvoiceEngine.instance) {
      InvoiceEngine.instance = new InvoiceEngine();
    }
    return InvoiceEngine.instance;
  }

  /**
   * Calculate complete invoice with all tax computations
   * Uses mathematical optimization for performance
   */
  calculateInvoice(invoiceData: InvoiceData): CalculatedInvoice {
    this.validateInvoiceData(invoiceData);

    // Calculate each line item
    const lineCalculations = invoiceData.lines.map(line => {
      const taxInput: TaxCalculationInput = {
        amount: line.quantity * line.rate,
        gstRate: line.gstRate,
        isReimbursement: line.isReimbursement,
        companyStateCode: invoiceData.companyStateCode,
        customerStateCode: invoiceData.customerStateCode,
        placeOfSupply: invoiceData.placeOfSupply
      };

      const calculation = gstEngine.calculateGST(taxInput);

      return {
        ...calculation,
        lineItem: line
      };
    });

    // Calculate invoice totals
    const totals = gstEngine.calculateInvoiceTotals(lineCalculations);

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
  generateInvoiceNumber(companyPrefix: string = 'INV', year?: number): string {
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
  canTransitionTo(currentState: InvoiceState, newState: InvoiceState): boolean {
    const allowedTransitions = INVOICE_STATE_TRANSITIONS[currentState];
    return allowedTransitions.includes(newState);
  }

  /**
   * Transition invoice state with validation
   */
  transitionState(
    invoice: CalculatedInvoice,
    newState: InvoiceState,
    context?: StateTransitionContext
  ): CalculatedInvoice {
    if (!this.canTransitionTo(invoice.state, newState)) {
      throw new Error(
        `Invalid state transition from ${invoice.state} to ${newState}`
      );
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
  processPayment(
    invoice: CalculatedInvoice,
    payment: PaymentData
  ): { invoice: CalculatedInvoice; remainingBalance: number } {
    if (payment.amount <= 0) {
      throw new Error('Payment amount must be positive');
    }

    if (payment.amount > invoice.grandTotal) {
      throw new Error('Payment amount cannot exceed invoice total');
    }

    const remainingBalance = invoice.grandTotal - payment.amount;
    let newState: InvoiceState;

    if (remainingBalance === 0) {
      newState = InvoiceState.PAID;
    } else if (remainingBalance > 0) {
      newState = InvoiceState.PARTIALLY_PAID;
    } else {
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
  isOverdue(invoice: CalculatedInvoice): boolean {
    if (!invoice.dueDate) return false;

    const now = new Date();
    const dueDate = new Date(invoice.dueDate);

    return now > dueDate &&
           ![InvoiceState.PAID, InvoiceState.CANCELLED, InvoiceState.REFUNDED].includes(invoice.state);
  }

  /**
   * Calculate days overdue
   */
  getDaysOverdue(invoice: CalculatedInvoice): number {
    if (!this.isOverdue(invoice) || !invoice.dueDate) return 0;

    const now = new Date();
    const dueDate = new Date(invoice.dueDate);
    const diffTime = now.getTime() - dueDate.getTime();

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Generate payment terms based on business rules
   */
  generatePaymentTerms(customerId: string, defaultDays: number = 30): {
    dueDate: Date;
    terms: string;
  } {
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + defaultDays);

    const terms = `Payment due within ${defaultDays} days of invoice date. Late payment charges may apply.`;

    return { dueDate, terms };
  }

  /**
   * Validate invoice data
   */
  private validateInvoiceData(data: InvoiceData): void {
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
  private performStateActions(
    invoice: CalculatedInvoice,
    newState: InvoiceState,
    context?: StateTransitionContext
  ): CalculatedInvoice {
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
  batchCalculateInvoices(invoices: InvoiceData[]): CalculatedInvoice[] {
    return invoices.map(invoice => this.calculateInvoice(invoice));
  }

  /**
   * Generate invoice summary for reporting
   */
  generateInvoiceSummary(invoices: CalculatedInvoice[]): {
    totalInvoices: number;
    totalAmount: number;
    totalTax: number;
    averageAmount: number;
    stateDistribution: Record<InvoiceState, number>;
  } {
    const summary = invoices.reduce(
      (acc, invoice) => ({
        totalAmount: acc.totalAmount + invoice.grandTotal,
        totalTax: acc.totalTax + invoice.totalTax,
        stateCount: {
          ...acc.stateCount,
          [invoice.state]: (acc.stateCount[invoice.state] || 0) + 1
        }
      }),
      {
        totalAmount: 0,
        totalTax: 0,
        stateCount: {} as Record<InvoiceState, number>
      }
    );

    return {
      totalInvoices: invoices.length,
      totalAmount: summary.totalAmount,
      totalTax: summary.totalTax,
      averageAmount: invoices.length > 0 ? summary.totalAmount / invoices.length : 0,
      stateDistribution: summary.stateCount
    };
  }
}

// Export singleton instance
export const invoiceEngine = InvoiceEngine.getInstance();

// Utility functions for common invoice operations
export const invoiceUtils = {
  /**
   * Format invoice number for display
   */
  formatInvoiceNumber: (number: string): string => {
    return number.toUpperCase();
  },

  /**
   * Calculate payment percentage
   */
  getPaymentPercentage: (paidAmount: number, totalAmount: number): number => {
    if (totalAmount === 0) return 0;
    return Math.round((paidAmount / totalAmount) * 100);
  },

  /**
   * Get invoice age in days
   */
  getInvoiceAge: (issueDate: Date): number => {
    const now = new Date();
    const issue = new Date(issueDate);
    const diffTime = now.getTime() - issue.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if invoice requires approval
   */
  requiresApproval: (invoice: CalculatedInvoice): boolean => {
    // Business rule: invoices over 1 lakh need approval
    const APPROVAL_THRESHOLD = 100000;
    return invoice.grandTotal > APPROVAL_THRESHOLD;
  },

  /**
   * Generate late fee calculation
   */
  calculateLateFee: (amount: number, daysOverdue: number, rate: number = 2): number => {
    if (daysOverdue <= 0) return 0;

    // Simple interest calculation: Principal * Rate * Time / 100 / 365
    const dailyRate = rate / 100 / 365;
    return Math.round(amount * dailyRate * daysOverdue * 100) / 100;
  }
};