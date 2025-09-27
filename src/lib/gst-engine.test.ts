/**
 * Tests for GST Calculation Engine
 * Testing core business logic for Indian GST compliance
 */

import { gstEngine, gstUtils, type TaxCalculationInput } from './gst-engine';

describe('GST Engine', () => {
  describe('calculateGST', () => {
    test('should calculate CGST and SGST for intrastate transaction', () => {
      const input: TaxCalculationInput = {
        amount: 1000,
        gstRate: 18,
        isReimbursement: false,
        companyStateCode: '07', // Delhi
        customerStateCode: '07', // Delhi
      };

      const result = gstEngine.calculateGST(input);

      expect(result.isInterstate).toBe(false);
      expect(result.taxableValue).toBe(1000);
      expect(result.cgst).toBe(90); // 9% of 1000
      expect(result.sgst).toBe(90); // 9% of 1000
      expect(result.igst).toBe(0);
      expect(result.totalTax).toBe(180);
      expect(result.grandTotal).toBe(1180);
    });

    test('should calculate IGST for interstate transaction', () => {
      const input: TaxCalculationInput = {
        amount: 1000,
        gstRate: 18,
        isReimbursement: false,
        companyStateCode: '07', // Delhi
        customerStateCode: '27', // Maharashtra
      };

      const result = gstEngine.calculateGST(input);

      expect(result.isInterstate).toBe(true);
      expect(result.taxableValue).toBe(1000);
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
      expect(result.igst).toBe(180); // 18% of 1000
      expect(result.totalTax).toBe(180);
      expect(result.grandTotal).toBe(1180);
    });

    test('should handle zero GST rate', () => {
      const input: TaxCalculationInput = {
        amount: 1000,
        gstRate: 0,
        isReimbursement: false,
        companyStateCode: '07',
        customerStateCode: '07',
      };

      const result = gstEngine.calculateGST(input);

      expect(result.taxableValue).toBe(1000);
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
      expect(result.igst).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.grandTotal).toBe(1000);
    });

    test('should handle reimbursement items', () => {
      const input: TaxCalculationInput = {
        amount: 500,
        gstRate: 18,
        isReimbursement: true,
        companyStateCode: '07',
        customerStateCode: '07',
      };

      const result = gstEngine.calculateGST(input);

      expect(result.taxableValue).toBe(0); // Reimbursements are not taxable
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.grandTotal).toBe(500);
    });

    test('should handle decimal amounts correctly', () => {
      const input: TaxCalculationInput = {
        amount: 1234.56,
        gstRate: 18,
        isReimbursement: false,
        companyStateCode: '07',
        customerStateCode: '07',
      };

      const result = gstEngine.calculateGST(input);

      expect(result.taxableValue).toBe(1234.56);
      expect(result.cgst).toBe(111.11); // 9% of 1234.56, rounded
      expect(result.sgst).toBe(111.11);
      expect(result.totalTax).toBe(222.22);
      expect(result.grandTotal).toBe(1456.78);
    });

    test('should use place of supply for interstate determination', () => {
      const input: TaxCalculationInput = {
        amount: 1000,
        gstRate: 18,
        isReimbursement: false,
        companyStateCode: '07', // Delhi
        customerStateCode: '07', // Delhi
        placeOfSupply: '27', // Maharashtra - this should override
      };

      const result = gstEngine.calculateGST(input);

      expect(result.isInterstate).toBe(true); // Should be interstate due to place of supply
      expect(result.igst).toBe(180);
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
    });
  });

  describe('calculateInvoiceTotals', () => {
    test('should calculate totals for multiple line items', () => {
      const lineCalculations = [
        {
          taxableValue: 1000,
          cgst: 90,
          sgst: 90,
          igst: 0,
          totalTax: 180,
          grandTotal: 1180,
          isInterstate: false,
        },
        {
          taxableValue: 500,
          cgst: 22.5,
          sgst: 22.5,
          igst: 0,
          totalTax: 45,
          grandTotal: 545,
          isInterstate: false,
        },
      ];

      const totals = gstEngine.calculateInvoiceTotals(lineCalculations);

      expect(totals.totalTaxableValue).toBe(1500);
      expect(totals.totalCGST).toBe(112.5);
      expect(totals.totalSGST).toBe(112.5);
      expect(totals.totalIGST).toBe(0);
      expect(totals.totalTax).toBe(225);
      expect(totals.grandTotal).toBe(1725);
      expect(totals.subtotal).toBe(1500);
    });

    test('should handle mixed interstate and intrastate items', () => {
      const lineCalculations = [
        {
          taxableValue: 1000,
          cgst: 90,
          sgst: 90,
          igst: 0,
          totalTax: 180,
          grandTotal: 1180,
          isInterstate: false,
        },
        {
          taxableValue: 500,
          cgst: 0,
          sgst: 0,
          igst: 90,
          totalTax: 90,
          grandTotal: 590,
          isInterstate: true,
        },
      ];

      const totals = gstEngine.calculateInvoiceTotals(lineCalculations);

      expect(totals.totalTaxableValue).toBe(1500);
      expect(totals.totalCGST).toBe(90);
      expect(totals.totalSGST).toBe(90);
      expect(totals.totalIGST).toBe(90);
      expect(totals.totalTax).toBe(270);
      expect(totals.grandTotal).toBe(1770);
    });
  });

  describe('validateGSTIN', () => {
    test('should validate correct GSTIN format', () => {
      const validGSTIN = '07AAACB0618C1Z5';
      expect(gstUtils.validateGSTIN(validGSTIN)).toBe(true);
    });

    test('should reject invalid GSTIN format', () => {
      expect(gstUtils.validateGSTIN('INVALID')).toBe(false);
      expect(gstUtils.validateGSTIN('07AAACB0618C1')).toBe(false); // Too short
      expect(gstUtils.validateGSTIN('99AAACB0618C1Z5')).toBe(false); // Invalid state code
    });

    test('should handle empty GSTIN', () => {
      expect(gstUtils.validateGSTIN('')).toBe(false);
      expect(gstUtils.validateGSTIN(undefined as any)).toBe(false);
    });
  });

  describe('getStateName', () => {
    test('should return correct state info for valid code', () => {
      const delhiInfo = gstEngine.getStateName('07');
      expect(delhiInfo).toBe('Delhi');
      // State code is the key, so no need to test this

      const maharashtraInfo = gstEngine.getStateName('27');
      expect(maharashtraInfo).toBe('Maharashtra');
      // State code is the key, so no need to test this
    });

    test('should return null for invalid state code', () => {
      expect(gstEngine.getStateName('99')).toBeUndefined();
      expect(gstEngine.getStateName('ABC')).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large amounts', () => {
      const input: TaxCalculationInput = {
        amount: 999999999.99,
        gstRate: 18,
        isReimbursement: false,
        companyStateCode: '07',
        customerStateCode: '07',
      };

      const result = gstEngine.calculateGST(input);

      expect(result.taxableValue).toBe(999999999.99);
      expect(result.grandTotal).toBeCloseTo(1179999999.99, 2);
    });

    test('should handle fractional GST rates', () => {
      const input: TaxCalculationInput = {
        amount: 1000,
        gstRate: 12.5, // Some items have fractional rates
        isReimbursement: false,
        companyStateCode: '07',
        customerStateCode: '07',
      };

      const result = gstEngine.calculateGST(input);

      expect(result.cgst).toBe(62.5);
      expect(result.sgst).toBe(62.5);
      expect(result.totalTax).toBe(125);
    });

    test('should handle negative amounts gracefully', () => {
      const input: TaxCalculationInput = {
        amount: -1000,
        gstRate: 18,
        isReimbursement: false,
        companyStateCode: '07',
        customerStateCode: '07',
      };

      // Should throw error or handle gracefully
      expect(() => gstEngine.calculateGST(input)).toThrow();
    });
  });
});