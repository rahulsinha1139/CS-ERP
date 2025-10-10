/**
 * Advanced Payment Reconciliation Engine
 * Handles complex payment matching, partial payments, and automated reconciliation
 * Following Asymm mathematical optimization principles
 */


// Mathematical constants for optimization
const GOLDEN_RATIO = 1.618033988;
const MATCHING_TOLERANCE = 0.01; // 1 paisa tolerance for floating point precision

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  UPI = 'UPI',
  CARD = 'CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
}

export enum ReconciliationStatus {
  MATCHED = 'MATCHED',
  UNMATCHED = 'UNMATCHED',
  PARTIAL_MATCH = 'PARTIAL_MATCH',
  DUPLICATE = 'DUPLICATE',
  DISPUTED = 'DISPUTED',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW',
}

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: Date;
  method: PaymentMethod;
  reference?: string;
  description?: string;
  customerName?: string;
  invoiceNumber?: string;
  bankReference?: string;
  upiTransactionId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface InvoiceRecord {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  grandTotal: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate?: Date;
  status: string;
}

export interface BankStatementEntry {
  id: string;
  date: Date;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  reference: string;
  balance: number;
  accountNumber: string;
}

export interface ReconciliationMatch {
  paymentId: string;
  invoiceId?: string;
  bankEntryId?: string;
  matchScore: number;
  matchType: 'EXACT' | 'FUZZY' | 'MANUAL';
  status: ReconciliationStatus;
  discrepancy?: number;
  notes?: string;
  confidence: number; // 0-100%
}

export interface ReconciliationResult {
  totalProcessed: number;
  exactMatches: number;
  fuzzyMatches: number;
  unmatched: number;
  requiresReview: number;
  duplicates: number;
  totalMatchedAmount: number;
  totalUnmatchedAmount: number;
  matches: ReconciliationMatch[];
  unmatchedPayments: PaymentRecord[];
  unmatchedInvoices: InvoiceRecord[];
  processingTime: number;
}

export interface PaymentAnalytics {
  totalPayments: number;
  totalAmount: number;
  averagePaymentTime: number; // Days from invoice to payment
  paymentMethodDistribution: Record<PaymentMethod, number>;
  monthlyTrends: Array<{
    month: Date;
    totalPayments: number;
    totalAmount: number;
    averageAmount: number;
  }>;
  overdueAnalysis: {
    totalOverdue: number;
    overdueAmount: number;
    averageDaysOverdue: number;
  };
  reconciliationHealth: {
    matchRate: number;
    averageProcessingTime: number;
    errorRate: number;
  };
}

export class PaymentReconciliationEngine {
  private static instance: PaymentReconciliationEngine;

  static getInstance(): PaymentReconciliationEngine {
    if (!PaymentReconciliationEngine.instance) {
      PaymentReconciliationEngine.instance = new PaymentReconciliationEngine();
    }
    return PaymentReconciliationEngine.instance;
  }

  /**
   * Advanced payment reconciliation with multiple matching algorithms
   */
  async reconcilePayments(
    payments: PaymentRecord[],
    invoices: InvoiceRecord[],
    options?: {
      tolerance?: number;
      includePartialMatches?: boolean;
      useFuzzyMatching?: boolean;
      maxProcessingTime?: number;
    }
  ): Promise<ReconciliationResult> {
    const startTime = performance.now();
    const _tolerance = options?.tolerance || MATCHING_TOLERANCE;
    const includePartial = options?.includePartialMatches ?? true;
    const useFuzzy = options?.useFuzzyMatching ?? true;
    const maxTime = options?.maxProcessingTime || 30000; // 30 seconds

    try {
      const matches: ReconciliationMatch[] = [];
      const unmatchedPayments: PaymentRecord[] = [];
      const unmatchedInvoices: InvoiceRecord[] = [...invoices];
      const processedPayments = new Set<string>();

      let exactMatches = 0;
      let fuzzyMatches = 0;
      let duplicates = 0;
      let requiresReview = 0;

      // Step 1: Exact amount and reference matching
      for (const payment of payments) {
        if (performance.now() - startTime > maxTime) {
          console.warn('Payment reconciliation timeout reached');
          break;
        }

        if (processedPayments.has(payment.id)) continue;

        const exactMatch = this.findExactMatch(payment, unmatchedInvoices, _tolerance);

        if (exactMatch) {
          matches.push({
            paymentId: payment.id,
            invoiceId: exactMatch.invoice.id,
            matchScore: exactMatch.score,
            matchType: 'EXACT',
            status: ReconciliationStatus.MATCHED,
            confidence: 95,
          });

          // Remove matched invoice from unmatched list
          const invoiceIndex = unmatchedInvoices.findIndex(i => i.id === exactMatch.invoice.id);
          if (invoiceIndex > -1) {
            unmatchedInvoices.splice(invoiceIndex, 1);
          }

          processedPayments.add(payment.id);
          exactMatches++;
          continue;
        }

        // Check for partial matches if enabled
        if (includePartial) {
          const partialMatch = this.findPartialMatch(payment, unmatchedInvoices, _tolerance);

          if (partialMatch) {
            matches.push({
              paymentId: payment.id,
              invoiceId: partialMatch.invoice.id,
              matchScore: partialMatch.score,
              matchType: 'EXACT',
              status: ReconciliationStatus.PARTIAL_MATCH,
              discrepancy: partialMatch.discrepancy,
              confidence: 85,
              notes: `Partial payment: ${this.formatCurrency(payment.amount)} against invoice ${this.formatCurrency(partialMatch.invoice.remainingAmount)}`,
            });

            processedPayments.add(payment.id);
            exactMatches++;
            continue;
          }
        }

        // Step 2: Fuzzy matching using multiple algorithms
        if (useFuzzy) {
          const fuzzyMatch = await this.findFuzzyMatch(payment, unmatchedInvoices, _tolerance);

          if (fuzzyMatch && fuzzyMatch.confidence > 70) {
            matches.push({
              paymentId: payment.id,
              invoiceId: fuzzyMatch.invoice.id,
              matchScore: fuzzyMatch.score,
              matchType: 'FUZZY',
              status: fuzzyMatch.confidence > 85 ? ReconciliationStatus.MATCHED : ReconciliationStatus.REQUIRES_REVIEW,
              confidence: fuzzyMatch.confidence,
              notes: fuzzyMatch.notes,
            });

            if (fuzzyMatch.confidence > 85) {
              const invoiceIndex = unmatchedInvoices.findIndex(i => i.id === fuzzyMatch.invoice.id);
              if (invoiceIndex > -1) {
                unmatchedInvoices.splice(invoiceIndex, 1);
              }
            } else {
              requiresReview++;
            }

            processedPayments.add(payment.id);
            fuzzyMatches++;
            continue;
          }
        }

        // Step 3: Duplicate detection
        const isDuplicate = this.checkForDuplicates(payment, payments, processedPayments);
        if (isDuplicate) {
          matches.push({
            paymentId: payment.id,
            matchScore: 100,
            matchType: 'EXACT',
            status: ReconciliationStatus.DUPLICATE,
            confidence: 90,
            notes: 'Potential duplicate payment detected',
          });

          processedPayments.add(payment.id);
          duplicates++;
          continue;
        }

        // Unmatched payment
        unmatchedPayments.push(payment);
      }

      // Calculate totals
      const totalMatchedAmount = matches
        .filter(m => m.status === ReconciliationStatus.MATCHED || m.status === ReconciliationStatus.PARTIAL_MATCH)
        .reduce((sum, match) => {
          const payment = payments.find(p => p.id === match.paymentId);
          return sum + (payment?.amount || 0);
        }, 0);

      const totalUnmatchedAmount = unmatchedPayments.reduce((sum, p) => sum + p.amount, 0);

      const processingTime = performance.now() - startTime;

      return {
        totalProcessed: payments.length,
        exactMatches,
        fuzzyMatches,
        unmatched: unmatchedPayments.length,
        requiresReview,
        duplicates,
        totalMatchedAmount,
        totalUnmatchedAmount,
        matches,
        unmatchedPayments,
        unmatchedInvoices,
        processingTime,
      };

    } catch (error) {
      console.error('Payment reconciliation failed:', error);
      throw new Error(`Reconciliation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Bank statement reconciliation
   */
  async reconcileBankStatement(
    bankEntries: BankStatementEntry[],
    payments: PaymentRecord[],
    options?: {
      dateRange?: { start: Date; end: Date };
      amountTolerance?: number;
    }
  ): Promise<{
    matches: Array<{
      bankEntryId: string;
      paymentId: string;
      matchConfidence: number;
      discrepancy?: number;
    }>;
    unmatchedBankEntries: BankStatementEntry[];
    unmatchedPayments: PaymentRecord[];
  }> {
    const tolerance = options?.amountTolerance || MATCHING_TOLERANCE;
    const matches = [];
    const unmatchedBankEntries = [...bankEntries];
    const unmatchedPayments = [...payments];

    // Filter by date range if provided
    let filteredBankEntries = bankEntries;
    if (options?.dateRange) {
      filteredBankEntries = bankEntries.filter(entry =>
        entry.date >= options.dateRange!.start && entry.date <= options.dateRange!.end
      );
    }

    // Match bank entries to payments
    for (const bankEntry of filteredBankEntries) {
      if (bankEntry.type !== 'CREDIT') continue; // Only match credits for payments

      // Look for exact amount matches
      const amountMatches = payments.filter(payment =>
        Math.abs(payment.amount - bankEntry.amount) <= tolerance
      );

      if (amountMatches.length === 1) {
        // Single exact match
        const payment = amountMatches[0];
        matches.push({
          bankEntryId: bankEntry.id,
          paymentId: payment.id,
          matchConfidence: 95,
        });

        // Remove from unmatched lists
        const bankIndex = unmatchedBankEntries.findIndex(e => e.id === bankEntry.id);
        if (bankIndex > -1) unmatchedBankEntries.splice(bankIndex, 1);

        const paymentIndex = unmatchedPayments.findIndex(p => p.id === payment.id);
        if (paymentIndex > -1) unmatchedPayments.splice(paymentIndex, 1);

      } else if (amountMatches.length > 1) {
        // Multiple amount matches - use additional criteria
        const bestMatch = this.findBestBankMatch(bankEntry, amountMatches);

        if (bestMatch) {
          matches.push({
            bankEntryId: bankEntry.id,
            paymentId: bestMatch.payment.id,
            matchConfidence: bestMatch.confidence,
            discrepancy: Math.abs(bankEntry.amount - bestMatch.payment.amount),
          });

          // Remove from unmatched lists
          const bankIndex = unmatchedBankEntries.findIndex(e => e.id === bankEntry.id);
          if (bankIndex > -1) unmatchedBankEntries.splice(bankIndex, 1);

          const paymentIndex = unmatchedPayments.findIndex(p => p.id === bestMatch.payment.id);
          if (paymentIndex > -1) unmatchedPayments.splice(paymentIndex, 1);
        }
      }
    }

    return {
      matches,
      unmatchedBankEntries,
      unmatchedPayments,
    };
  }

  /**
   * Generate comprehensive payment analytics
   */
  async generatePaymentAnalytics(
    payments: PaymentRecord[],
    invoices: InvoiceRecord[],
    period?: { start: Date; end: Date }
  ): Promise<PaymentAnalytics> {
    let filteredPayments = payments;
    let filteredInvoices = invoices;

    if (period) {
      filteredPayments = payments.filter(p =>
        p.paymentDate >= period.start && p.paymentDate <= period.end
      );
      filteredInvoices = invoices.filter(inv =>
        inv.dueDate && inv.dueDate >= period.start && inv.dueDate <= period.end
      );
    }

    const totalPayments = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

    // Calculate average payment time
    const paymentTimes = [];
    for (const payment of filteredPayments) {
      if (payment.invoiceNumber) {
        const invoice = filteredInvoices.find(inv => inv.number === payment.invoiceNumber);
        if (invoice && invoice.dueDate) {
          const daysDiff = Math.floor(
            (payment.paymentDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          paymentTimes.push(daysDiff);
        }
      }
    }

    const averagePaymentTime = paymentTimes.length > 0
      ? paymentTimes.reduce((sum, days) => sum + days, 0) / paymentTimes.length
      : 0;

    // Payment method distribution
    const paymentMethodDistribution = filteredPayments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + 1;
      return acc;
    }, {} as Record<PaymentMethod, number>);

    // Monthly trends
    const monthlyTrends = this.calculateMonthlyTrends(filteredPayments);

    // Overdue analysis
    const now = new Date();
    const overdueInvoices = filteredInvoices.filter(inv =>
      inv.dueDate && inv.dueDate < now && inv.remainingAmount > 0
    );

    const totalOverdue = overdueInvoices.length;
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);
    const averageDaysOverdue = overdueInvoices.length > 0
      ? overdueInvoices.reduce((sum, inv) => {
          const days = Math.floor((now.getTime() - inv.dueDate!.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / overdueInvoices.length
      : 0;

    // Mock reconciliation health metrics
    const reconciliationHealth = {
      matchRate: 92.5, // Would be calculated from actual reconciliation data
      averageProcessingTime: 150, // milliseconds
      errorRate: 2.3, // percentage
    };

    return {
      totalPayments,
      totalAmount,
      averagePaymentTime,
      paymentMethodDistribution,
      monthlyTrends,
      overdueAnalysis: {
        totalOverdue,
        overdueAmount,
        averageDaysOverdue,
      },
      reconciliationHealth,
    };
  }

  /**
   * Advanced payment prediction using historical data
   */
  async predictPaymentProbability(
    invoiceId: string,
    historicalData: {
      customerPayments: PaymentRecord[];
      similarInvoices: InvoiceRecord[];
    }
  ): Promise<{
    probability: number; // 0-100%
    expectedPaymentDate: Date;
    confidence: number;
    factors: Array<{
      factor: string;
      impact: number; // -1 to 1
      description: string;
    }>;
  }> {
    const { customerPayments, similarInvoices } = historicalData;

    // Calculate historical payment behavior
    const paymentDelays = customerPayments
      .filter(p => p.invoiceNumber)
      .map(payment => {
        const invoice = similarInvoices.find(inv => inv.number === payment.invoiceNumber);
        if (invoice && invoice.dueDate) {
          return Math.floor((payment.paymentDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 0;
      });

    const averageDelay = paymentDelays.length > 0
      ? paymentDelays.reduce((sum, delay) => sum + delay, 0) / paymentDelays.length
      : 0;

    const paymentRate = customerPayments.length / Math.max(similarInvoices.length, 1);

    // Calculate probability factors
    const factors = [
      {
        factor: 'Payment History',
        impact: Math.min(paymentRate - 0.5, 0.5),
        description: `Customer has ${Math.round(paymentRate * 100)}% payment rate`,
      },
      {
        factor: 'Average Delay',
        impact: Math.max(-averageDelay / 30, -0.5), // Max negative impact at 30 days
        description: `Average payment delay: ${Math.round(averageDelay)} days`,
      },
      {
        factor: 'Recent Behavior',
        impact: this.calculateRecentBehaviorImpact(customerPayments),
        description: 'Based on last 5 payments',
      }
    ];

    // Calculate overall probability
    const baseprobability = 70; // Starting assumption
    const totalImpact = factors.reduce((sum, f) => sum + f.impact * 30, 0); // Scale impact
    const probability = Math.max(0, Math.min(100, baseprobability + totalImpact));

    // Predict payment date
    const currentDate = new Date();
    const expectedPaymentDate = new Date(currentDate);
    expectedPaymentDate.setDate(expectedPaymentDate.getDate() + Math.max(0, Math.round(averageDelay)));

    // Calculate confidence based on data quality
    const confidence = Math.min(95, 50 + (customerPayments.length * 5));

    return {
      probability,
      expectedPaymentDate,
      confidence,
      factors,
    };
  }

  // Private helper methods

  private findExactMatch(
    payment: PaymentRecord,
    invoices: InvoiceRecord[],
    tolerance: number
  ): { invoice: InvoiceRecord; score: number } | null {
    for (const invoice of invoices) {
      // Check amount match within tolerance
      const amountDiff = Math.abs(payment.amount - invoice.remainingAmount);
      if (amountDiff <= tolerance) {
        // Check reference match
        let score = 80; // Base score for amount match

        if (payment.reference && payment.reference === invoice.number) {
          score += 15; // Exact reference match
        }

        if (payment.customerName && payment.customerName === invoice.customerName) {
          score += 5; // Customer name match
        }

        return { invoice, score };
      }
    }

    return null;
  }

  private findPartialMatch(
    payment: PaymentRecord,
    invoices: InvoiceRecord[],
    tolerance: number
  ): { invoice: InvoiceRecord; score: number; discrepancy: number } | null {
    for (const invoice of invoices) {
      if (payment.amount < invoice.remainingAmount && payment.amount > tolerance) {
        // Partial payment - amount is less than invoice but more than tolerance
        let score = 60; // Base score for partial match

        if (payment.reference && payment.reference === invoice.number) {
          score += 20; // Reference match is critical for partial payments
        }

        if (payment.customerName && payment.customerName === invoice.customerName) {
          score += 10; // Customer match
        }

        if (score > 70) { // Only return if confidence is high enough
          return {
            invoice,
            score,
            discrepancy: invoice.remainingAmount - payment.amount,
          };
        }
      }
    }

    return null;
  }

  private async findFuzzyMatch(
    payment: PaymentRecord,
    invoices: InvoiceRecord[],
    _tolerance: number
  ): Promise<{ invoice: InvoiceRecord; score: number; confidence: number; notes: string } | null> {
    const matches = [];

    for (const invoice of invoices) {
      let score = 0;
      let notes = '';

      // Amount similarity (using relative tolerance)
      const amountDiff = Math.abs(payment.amount - invoice.remainingAmount);
      const amountSimilarity = 1 - (amountDiff / Math.max(payment.amount, invoice.remainingAmount));

      if (amountSimilarity > 0.8) {
        score += 40 * amountSimilarity;
        notes += `Amount similarity: ${Math.round(amountSimilarity * 100)}%. `;
      }

      // Reference similarity using Levenshtein distance (case-insensitive)
      if (payment.reference && invoice.number) {
        const refSimilarity = this.calculateStringSimilarity(
          payment.reference.toLowerCase().trim(),
          invoice.number.toLowerCase().trim()
        );
        if (refSimilarity > 0.6) {
          score += 30 * refSimilarity;
          notes += `Reference similarity: ${Math.round(refSimilarity * 100)}%. `;
        }
      }

      // Customer name similarity (case-insensitive)
      if (payment.customerName && invoice.customerName) {
        const nameSimilarity = this.calculateStringSimilarity(
          payment.customerName.toLowerCase().trim(),
          invoice.customerName.toLowerCase().trim()
        );
        if (nameSimilarity > 0.7) {
          score += 20 * nameSimilarity;
          notes += `Customer name similarity: ${Math.round(nameSimilarity * 100)}%. `;
        }
      }

      // Date proximity (if available)
      if (payment.paymentDate && invoice.dueDate) {
        const daysDiff = Math.abs(payment.paymentDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 30) {
          const dateScore = Math.max(0, 10 * (1 - daysDiff / 30));
          score += dateScore;
          notes += `Date proximity: ${Math.round(daysDiff)} days. `;
        }
      }

      if (score > 0) {
        matches.push({
          invoice,
          score,
          confidence: Math.min(95, score),
          notes: notes.trim(),
        });
      }
    }

    // Return the best match if it meets minimum criteria
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      const bestMatch = matches[0];

      if (bestMatch.confidence >= 60) {
        return bestMatch;
      }
    }

    return null;
  }

  private checkForDuplicates(
    payment: PaymentRecord,
    allPayments: PaymentRecord[],
    _processedIds: Set<string>
  ): boolean {
    // Check for duplicates against ALL payments, not just unprocessed ones
    // A duplicate is a payment that shares similar characteristics regardless of processing status
    const duplicates = allPayments.filter(p =>
      p.id !== payment.id && // Don't compare with itself
      Math.abs(p.amount - payment.amount) <= MATCHING_TOLERANCE &&
      p.method === payment.method &&
      Math.abs(p.paymentDate.getTime() - payment.paymentDate.getTime()) <= 86400000 // 1 day
    );

    return duplicates.length > 0;
  }

  private findBestBankMatch(
    bankEntry: BankStatementEntry,
    paymentMatches: PaymentRecord[]
  ): { payment: PaymentRecord; confidence: number } | null {
    let bestMatch = null;
    let bestScore = 0;

    for (const payment of paymentMatches) {
      let score = 80; // Base score for amount match

      // Date proximity
      const daysDiff = Math.abs(bankEntry.date.getTime() - payment.paymentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 1) score += 15;
      else if (daysDiff <= 3) score += 10;
      else if (daysDiff <= 7) score += 5;

      // Reference matching
      if (payment.reference && bankEntry.description.includes(payment.reference)) {
        score += 10;
      }

      if (payment.bankReference && bankEntry.reference.includes(payment.bankReference)) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { payment, confidence: Math.min(95, score) };
      }
    }

    return bestMatch;
  }

  private calculateMonthlyTrends(payments: PaymentRecord[]) {
    const monthlyData = new Map();

    payments.forEach(payment => {
      const monthKey = `${payment.paymentDate.getFullYear()}-${payment.paymentDate.getMonth()}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: new Date(payment.paymentDate.getFullYear(), payment.paymentDate.getMonth(), 1),
          totalPayments: 0,
          totalAmount: 0,
        });
      }

      const data = monthlyData.get(monthKey);
      data.totalPayments += 1;
      data.totalAmount += payment.amount;
    });

    return Array.from(monthlyData.values()).map(data => ({
      ...data,
      averageAmount: data.totalAmount / data.totalPayments,
    }));
  }

  private calculateRecentBehaviorImpact(payments: PaymentRecord[]): number {
    const recentPayments = payments
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
      .slice(0, 5);

    if (recentPayments.length === 0) return 0;

    // Simple scoring based on payment consistency
    const now = new Date();
    const avgDaysAgo = recentPayments.reduce((sum, p) => {
      return sum + (now.getTime() - p.paymentDate.getTime()) / (1000 * 60 * 60 * 24);
    }, 0) / recentPayments.length;

    // More recent payments = positive impact
    return Math.max(-0.3, Math.min(0.3, (90 - avgDaysAgo) / 300));
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }
}

// Export singleton instance
export const paymentReconciliationEngine = PaymentReconciliationEngine.getInstance();

// Utility functions for payment operations
export const paymentUtils = {
  /**
   * Generate payment reference
   */
  generatePaymentReference: (prefix: string = 'PAY'): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random.toString().padStart(4, '0')}`;
  },

  /**
   * Validate payment method
   */
  isValidPaymentMethod: (method: string): method is PaymentMethod => {
    return Object.values(PaymentMethod).includes(method as PaymentMethod);
  },

  /**
   * Calculate payment processing fee
   */
  calculateProcessingFee: (amount: number, method: PaymentMethod): number => {
    const feeStructure: Record<PaymentMethod, number> = {
      [PaymentMethod.CASH]: 0,
      [PaymentMethod.BANK_TRANSFER]: 0,
      [PaymentMethod.CHEQUE]: 0,
      [PaymentMethod.UPI]: 0,
      [PaymentMethod.CARD]: 0.02, // 2%
      [PaymentMethod.DIGITAL_WALLET]: 0.015, // 1.5%
      [PaymentMethod.CRYPTOCURRENCY]: 0.01, // 1%
    };

    return amount * (feeStructure[method] || 0);
  },

  /**
   * Get payment method display name
   */
  getPaymentMethodName: (method: PaymentMethod): string => {
    const names: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: 'Cash',
      [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
      [PaymentMethod.CHEQUE]: 'Cheque',
      [PaymentMethod.UPI]: 'UPI',
      [PaymentMethod.CARD]: 'Card',
      [PaymentMethod.DIGITAL_WALLET]: 'Digital Wallet',
      [PaymentMethod.CRYPTOCURRENCY]: 'Cryptocurrency',
    };

    return names[method] || method;
  },

  /**
   * Check if payment is overdue
   */
  isPaymentOverdue: (dueDate: Date): boolean => {
    return new Date() > dueDate;
  },

  /**
   * Calculate days overdue
   */
  getDaysOverdue: (dueDate: Date): number => {
    const now = new Date();
    if (now <= dueDate) return 0;

    return Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  },
};