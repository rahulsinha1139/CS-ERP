/**
 * PDF Engine Enhancement Test & Demo
 * Demonstrates new logo, watermark, and status badge features
 */

import { type InvoicePDFData } from './pdf-engine';

// Test Data 1: DRAFT Invoice with Logo Initials (Left Position)
export const testInvoiceDraft: InvoicePDFData = {
  company: {
    name: "Pragnya Pradhan & Associates",
    address: "123 Business Park, Mumbai, Maharashtra - 400001",
    gstin: "27ABCDE1234F1Z5",
    email: "contact@ppandassociates.com",
    phone: "+91 98765 43210",
    website: "www.ppandassociates.com",
    // No logo - will show "PP" initials
  },
  customer: {
    name: "ABC Corporation Ltd",
    address: "456 Industrial Area, Mumbai, Maharashtra - 400002",
    gstin: "27XYZAB5678G1W2",
    email: "accounts@abccorp.com",
    phone: "+91 99887 76543",
    stateCode: "27",
  },
  invoice: {
    number: "INV-2025-001",
    issueDate: new Date('2025-01-15'),
    dueDate: new Date('2025-02-14'),
    placeOfSupply: "Maharashtra",
    status: "DRAFT", // DRAFT watermark + badge
    currency: "INR",
    notes: "Please make payment within 30 days.",
    terms: "Payment due within 30 days from invoice date.",
  },
  lineItems: [
    {
      description: "Company Secretary Services - Annual Compliance",
      quantity: 1,
      rate: 50000,
      taxableValue: 50000,
      gstRate: 18,
      cgst: 4500,
      sgst: 4500,
      igst: 0,
      lineTotal: 59000,
      hsnSac: "998399",
    },
    {
      description: "ROC Filing & Documentation",
      quantity: 1,
      rate: 25000,
      taxableValue: 25000,
      gstRate: 18,
      cgst: 2250,
      sgst: 2250,
      igst: 0,
      lineTotal: 29500,
      hsnSac: "998399",
    },
  ],
  totals: {
    subtotal: 75000,
    taxableValue: 75000,
    cgstAmount: 6750,
    sgstAmount: 6750,
    igstAmount: 0,
    totalTax: 13500,
    grandTotal: 88500,
    isInterstate: false,
    amountInWords: "Eighty Eight Thousand Five Hundred Only",
  },
  branding: {
    primaryColor: "#1e40af",
    accentColor: "#3b82f6",
    logoPosition: "left",
    showWatermark: false, // DRAFT watermark will show anyway
  },
  paymentDetails: {
    bankName: "HDFC Bank",
    accountNumber: "50200012345678",
    ifscCode: "HDFC0001234",
    upiId: "ppandassociates@hdfcbank",
  },
};

// Test Data 2: PAID Invoice with Logo (Center Position)
export const testInvoicePaid: InvoicePDFData = {
  ...testInvoiceDraft,
  company: {
    ...testInvoiceDraft.company,
    // Simulating a logo URL (in real usage, use actual logo URL or base64)
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='%231e40af'/%3E%3Ctext x='60' y='25' font-family='Arial' font-size='20' font-weight='bold' fill='white' text-anchor='middle'%3EPP%26A%3C/text%3E%3C/svg%3E",
  },
  invoice: {
    ...testInvoiceDraft.invoice,
    number: "INV-2025-002",
    status: "PAID", // PAID watermark + badge
  },
  branding: {
    ...testInvoiceDraft.branding,
    logoPosition: "center", // Logo in center
  },
};

// Test Data 3: OVERDUE Invoice with Logo (Right Position)
export const testInvoiceOverdue: InvoicePDFData = {
  ...testInvoiceDraft,
  invoice: {
    ...testInvoiceDraft.invoice,
    number: "INV-2025-003",
    issueDate: new Date('2024-11-15'),
    dueDate: new Date('2024-12-15'),
    status: "OVERDUE", // OVERDUE badge
  },
  branding: {
    ...testInvoiceDraft.branding,
    logoPosition: "right", // Logo on right
  },
};

// Test Data 4: SENT Invoice with ORIGINAL Watermark
export const testInvoiceSent: InvoicePDFData = {
  ...testInvoiceDraft,
  invoice: {
    ...testInvoiceDraft.invoice,
    number: "INV-2025-004",
    status: "SENT",
  },
  branding: {
    ...testInvoiceDraft.branding,
    showWatermark: true, // Shows "ORIGINAL" watermark for SENT invoices
  },
};

// Test Data 5: PARTIALLY_PAID Invoice
export const testInvoicePartiallyPaid: InvoicePDFData = {
  ...testInvoiceDraft,
  invoice: {
    ...testInvoiceDraft.invoice,
    number: "INV-2025-005",
    status: "PARTIALLY_PAID",
  },
  totals: {
    ...testInvoiceDraft.totals,
    amountInWords: "Forty Four Thousand Two Hundred Fifty Only (Partial Payment)",
  },
};

// Export all test cases
export const allTestInvoices = {
  draft: testInvoiceDraft,
  paid: testInvoicePaid,
  overdue: testInvoiceOverdue,
  sent: testInvoiceSent,
  partiallyPaid: testInvoicePartiallyPaid,
};

/**
 * Usage Instructions:
 *
 * 1. Import the test data:
 *    import { testInvoiceDraft, testInvoicePaid, allTestInvoices } from './pdf-engine.test-demo';
 *
 * 2. Generate PDF:
 *    const pdfEngine = new PDFEngine();
 *    const html = pdfEngine.generateInvoiceHTML(testInvoiceDraft);
 *
 * 3. Test Features:
 *    - testInvoiceDraft: Shows "PP" initials (no logo) + DRAFT watermark + badge
 *    - testInvoicePaid: Shows logo in center + PAID watermark + badge
 *    - testInvoiceOverdue: Shows logo on right + OVERDUE badge
 *    - testInvoiceSent: Shows ORIGINAL watermark (no status badge)
 *    - testInvoicePartiallyPaid: Shows PARTIALLY PAID badge
 *
 * Expected Visual Results:
 * ✅ Logo positions: Left (default), Center, Right
 * ✅ Logo fallback: Gradient "PP" initials when no logo
 * ✅ Watermarks: DRAFT (red), PAID (green), ORIGINAL (gray)
 * ✅ Status badges: Color-coded corner indicators
 * ✅ Professional styling: Gradients, shadows, rounded corners
 */
