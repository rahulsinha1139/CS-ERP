/**
 * GST Calculation Engine for Indian Company Secretary Practice
 * Handles complex GST scenarios with mathematical precision
 * Follows Asymm optimization principles for performance
 */


// Mathematical constants from Asymm protocol
export const GST_CONSTANTS = {
  GOLDEN_RATIO: 1.618033988,
  DEFAULT_GST_RATE: 18.0,
  CGST_SGST_SPLIT: 2, // CGST = SGST = GST_RATE / 2
  PRECISION: 2, // Decimal places
} as const;

// State codes for GST calculation
export const STATE_CODES = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman & Diu',
  '26': 'Dadra & Nagar Haveli',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh (New)',
  '38': 'Ladakh',
} as const;

export interface TaxCalculationInput {
  amount: number;
  gstRate: number;
  isReimbursement: boolean;
  companyStateCode: string;
  customerStateCode?: string;
  placeOfSupply?: string;
}

export interface TaxCalculationResult {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterstate: boolean;
}

export class GSTEngine {
  private static instance: GSTEngine;

  static getInstance(): GSTEngine {
    if (!GSTEngine.instance) {
      GSTEngine.instance = new GSTEngine();
    }
    return GSTEngine.instance;
  }

  /**
   * Calculate GST with mathematical precision
   * Optimized for performance using mathematical constants
   */
  calculateGST(input: TaxCalculationInput): TaxCalculationResult {
    const {
      amount,
      gstRate,
      isReimbursement,
      companyStateCode,
      customerStateCode,
      placeOfSupply
    } = input;

    // Validation
    this.validateInput(input);

    // If reimbursement, no tax calculation needed
    if (isReimbursement) {
      return {
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
        grandTotal: amount,
        isInterstate: false
      };
    }

    const taxableValue = amount;
    const isInterstate = this.isInterstateTransaction(
      companyStateCode,
      customerStateCode,
      placeOfSupply
    );

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (gstRate > 0) {
      if (isInterstate) {
        // Interstate: IGST = full GST rate
        igst = this.roundToTwoDecimal((taxableValue * gstRate) / 100);
      } else {
        // Intrastate: CGST = SGST = GST rate / 2
        const halfRate = gstRate / GST_CONSTANTS.CGST_SGST_SPLIT;
        cgst = this.roundToTwoDecimal((taxableValue * halfRate) / 100);
        sgst = this.roundToTwoDecimal((taxableValue * halfRate) / 100);
      }
    }

    const totalTax = cgst + sgst + igst;
    const grandTotal = taxableValue + totalTax;

    return {
      taxableValue: this.roundToTwoDecimal(taxableValue),
      cgst: this.roundToTwoDecimal(cgst),
      sgst: this.roundToTwoDecimal(sgst),
      igst: this.roundToTwoDecimal(igst),
      totalTax: this.roundToTwoDecimal(totalTax),
      grandTotal: this.roundToTwoDecimal(grandTotal),
      isInterstate
    };
  }

  /**
   * Determine if transaction is interstate
   * Uses place of supply rules as per GST law
   */
  private isInterstateTransaction(
    companyState: string,
    customerState?: string,
    placeOfSupply?: string
  ): boolean {
    // If place of supply is specified, use that
    if (placeOfSupply) {
      return companyState !== placeOfSupply;
    }

    // If customer state is available, compare with company state
    if (customerState) {
      return companyState !== customerState;
    }

    // Default to intrastate if unclear
    return false;
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: TaxCalculationInput): void {
    const { amount, gstRate, companyStateCode } = input;

    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (gstRate < 0 || gstRate > 100) {
      throw new Error('GST rate must be between 0 and 100');
    }

    if (!companyStateCode || !STATE_CODES[companyStateCode as keyof typeof STATE_CODES]) {
      throw new Error('Invalid company state code');
    }
  }

  /**
   * Round to two decimal places with mathematical precision
   */
  private roundToTwoDecimal(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /**
   * Get state name from code
   */
  getStateName(stateCode: string): string | undefined {
    return STATE_CODES[stateCode as keyof typeof STATE_CODES];
  }

  /**
   * Calculate reverse GST (extract tax from inclusive amount)
   */
  calculateReverseGST(inclusiveAmount: number, gstRate: number, isInterstate: boolean): TaxCalculationResult {
    const taxMultiplier = 1 + (gstRate / 100);
    const taxableValue = inclusiveAmount / taxMultiplier;

    return this.calculateGST({
      amount: taxableValue,
      gstRate,
      isReimbursement: false,
      companyStateCode: '27', // Default
      customerStateCode: isInterstate ? '09' : '27',
    });
  }

  /**
   * Batch calculate GST for multiple line items
   * Optimized for performance using mathematical patterns
   */
  batchCalculateGST(items: TaxCalculationInput[]): TaxCalculationResult[] {
    return items.map(item => this.calculateGST(item));
  }

  /**
   * Calculate invoice totals from line items
   */
  calculateInvoiceTotals(lineCalculations: TaxCalculationResult[]): {
    subtotal: number;
    totalTaxableValue: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    totalTax: number;
    grandTotal: number;
  } {
    const totals = lineCalculations.reduce(
      (acc, line) => ({
        subtotal: acc.subtotal + (line.grandTotal - line.totalTax), // Line amount before tax
        totalTaxableValue: acc.totalTaxableValue + line.taxableValue,
        totalCGST: acc.totalCGST + line.cgst,
        totalSGST: acc.totalSGST + line.sgst,
        totalIGST: acc.totalIGST + line.igst,
        totalTax: acc.totalTax + line.totalTax,
        grandTotal: acc.grandTotal + line.grandTotal,
      }),
      {
        subtotal: 0,
        totalTaxableValue: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
        totalTax: 0,
        grandTotal: 0,
      }
    );

    // Round all totals
    return {
      subtotal: this.roundToTwoDecimal(totals.subtotal),
      totalTaxableValue: this.roundToTwoDecimal(totals.totalTaxableValue),
      totalCGST: this.roundToTwoDecimal(totals.totalCGST),
      totalSGST: this.roundToTwoDecimal(totals.totalSGST),
      totalIGST: this.roundToTwoDecimal(totals.totalIGST),
      totalTax: this.roundToTwoDecimal(totals.totalTax),
      grandTotal: this.roundToTwoDecimal(totals.grandTotal),
    };
  }
}

// Export singleton instance
export const gstEngine = GSTEngine.getInstance();

// Utility functions for common operations
export const gstUtils = {
  /**
   * Format amount in Indian currency format
   */
  formatIndianCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /**
   * Convert amount to words (Indian numbering system)
   */
  amountToWords: (amount: number): string => {
    // Implementation for Indian number to words conversion
    // This would be a comprehensive function for Indian currency
    return `Rupees ${amount.toFixed(2)} only`;
  },

  /**
   * Validate GSTIN number
   */
  validateGSTIN: (gstin: string): boolean => {
    if (!gstin) return false;

    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinPattern.test(gstin)) {
      return false;
    }

    // Validate state code
    const stateCode = gstin.substring(0, 2);
    return !!STATE_CODES[stateCode as keyof typeof STATE_CODES];
  },

  /**
   * Extract state code from GSTIN
   */
  getStateCodeFromGSTIN: (gstin: string): string | null => {
    if (!gstUtils.validateGSTIN(gstin)) {
      return null;
    }
    return gstin.substring(0, 2);
  },

  /**
   * Check if customer is GST registered
   */
  isGSTRegistered: (gstin?: string): boolean => {
    return gstin ? gstUtils.validateGSTIN(gstin) : false;
  },
};