/**
 * Professional PDF Engine for Invoice Generation
 * Enterprise-grade PDF creation with optimized HTML-based rendering
 * Following Asymm mathematical principles for perfect layouts
 */

import { formatCurrency, formatDate } from './utils';

// Mathematical constants for perfect layouts
const GOLDEN_RATIO = 1.618033988;
const DESIGN_CONSTANTS = {
  PAGE_MARGIN: 40,
  SECTION_SPACING: 20,
  LINE_HEIGHT: 1.4,
  HEADER_HEIGHT: 80,
  FOOTER_HEIGHT: 40,
};

export interface InvoicePDFData {
  company: {
    name: string;
    gstin?: string;
    address: string;
    email?: string;
    phone?: string;
    website?: string;
    logo?: string;
  };
  customer: {
    name: string;
    gstin?: string;
    address: string;
    email?: string;
    phone?: string;
    stateCode?: string;
  };
  invoice: {
    number: string;
    issueDate: Date;
    dueDate?: Date;
    placeOfSupply?: string;
    notes?: string;
    terms?: string;
    paymentInstructions?: string;
    currency?: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    lineTotal: number;
    gstRate: number;
    hsnSac?: string;
    discount?: number;
  }>;
  totals: {
    subtotal: number;
    taxableValue: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    totalTax: number;
    grandTotal: number;
    isInterstate: boolean;
    totalDiscount?: number;
    roundOff?: number;
    amountInWords?: string;
  };
  branding?: {
    primaryColor?: string;
    accentColor?: string;
    showWatermark?: boolean;
    logoPosition?: 'left' | 'center' | 'right';
  };
  paymentDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    paymentLink?: string;
  };
}

// Professional HTML Invoice Generator
const generateHTMLInvoice = (data: InvoicePDFData): string => {
  const primaryColor = data.branding?.primaryColor || '#1f2937';
  const accentColor = data.branding?.accentColor || '#3b82f6';

  return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${data.invoice.number}</title>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      background: white;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: ${DESIGN_CONSTANTS.PAGE_MARGIN}px;
      min-height: 100vh;
      position: relative;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: ${DESIGN_CONSTANTS.SECTION_SPACING * 1.5}px;
      border-bottom: 3px solid ${primaryColor};
      padding-bottom: 20px;
    }

    .company-info h1 {
      font-size: ${Math.round(28 * GOLDEN_RATIO / 1.618)}px;
      color: ${primaryColor};
      margin-bottom: 10px;
      font-weight: bold;
    }

    .company-info p {
      margin-bottom: 5px;
      color: #4b5563;
    }

    .invoice-title {
      text-align: center;
      font-size: ${Math.round(32 * GOLDEN_RATIO / 1.618)}px;
      font-weight: bold;
      color: ${primaryColor};
      margin: ${DESIGN_CONSTANTS.SECTION_SPACING * 1.5}px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
      position: relative;
    }

    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: ${DESIGN_CONSTANTS.SECTION_SPACING * 1.5}px;
      gap: 40px;
    }

    .billing-column {
      flex: 1;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: ${primaryColor};
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    .customer-info p {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .customer-info strong {
      font-weight: 600;
    }

    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: ${DESIGN_CONSTANTS.SECTION_SPACING * 1.5}px 0;
      font-size: 11px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .invoice-table th,
    .invoice-table td {
      border: 1px solid #d1d5db;
      padding: 12px 8px;
      text-align: left;
      vertical-align: top;
    }

    .invoice-table th {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      font-weight: bold;
      text-align: center;
      color: ${primaryColor};
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .invoice-table td.number {
      text-align: right;
      font-weight: 500;
    }

    .invoice-table td.description {
      text-align: left;
    }

    .invoice-table tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }

    .invoice-table tbody tr:hover {
      background-color: #f0f9ff;
    }

    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-top: ${DESIGN_CONSTANTS.SECTION_SPACING}px;
    }

    .totals-table {
      width: 320px;
      border-collapse: collapse;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .totals-table td {
      padding: 12px 15px;
      border: 1px solid #d1d5db;
      font-size: 13px;
    }

    .totals-table .label {
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
    }

    .totals-table .value {
      text-align: right;
      font-weight: 500;
    }

    .grand-total {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
      color: white !important;
      font-size: 16px !important;
      font-weight: bold !important;
    }

    .grand-total td {
      color: white !important;
    }

    .amount-words {
      margin: ${DESIGN_CONSTANTS.SECTION_SPACING}px 0;
      padding: 20px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid ${accentColor};
      border-radius: 0 8px 8px 0;
    }

    .amount-words .label {
      font-weight: bold;
      margin-bottom: 8px;
      color: #0c4a6e;
      font-size: 14px;
    }

    .amount-words .text {
      text-transform: capitalize;
      font-size: 13px;
      color: #0369a1;
      font-style: italic;
    }

    .notes-section {
      margin-top: ${DESIGN_CONSTANTS.SECTION_SPACING * 1.5}px;
      padding: 20px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-left: 4px solid #f59e0b;
      border-radius: 0 8px 8px 0;
    }

    .notes-section .label {
      font-weight: bold;
      margin-bottom: 10px;
      color: #92400e;
      font-size: 14px;
    }

    .notes-section p {
      color: #a16207;
      line-height: 1.6;
    }

    .payment-section {
      margin-top: ${DESIGN_CONSTANTS.SECTION_SPACING}px;
      padding: 20px;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-left: 4px solid #10b981;
      border-radius: 0 8px 8px 0;
    }

    .payment-section .label {
      font-weight: bold;
      margin-bottom: 12px;
      color: #065f46;
      font-size: 14px;
    }

    .payment-section p {
      margin-bottom: 8px;
      color: #047857;
    }

    .payment-section strong {
      color: #064e3b;
    }

    .footer {
      margin-top: ${DESIGN_CONSTANTS.SECTION_SPACING * 2}px;
      text-align: center;
      padding: 20px 0;
      border-top: 2px solid #e5e7eb;
      color: #6b7280;
      font-size: 10px;
      position: absolute;
      bottom: 30px;
      left: ${DESIGN_CONSTANTS.PAGE_MARGIN}px;
      right: ${DESIGN_CONSTANTS.PAGE_MARGIN}px;
    }

    .footer p {
      margin-bottom: 5px;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 60px;
      color: rgba(0,0,0,0.05);
      font-weight: bold;
      z-index: 0;
      pointer-events: none;
    }

    .content {
      position: relative;
      z-index: 1;
    }

    @media print {
      .container {
        padding: 20px;
        max-width: none;
      }

      .footer {
        position: fixed;
        bottom: 0;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }

    @page {
      size: A4;
      margin: 20mm;
    }
  </style>
</head>
<body>
  <div class="container">
    ${data.branding?.showWatermark ? '<div class="watermark">ORIGINAL</div>' : ''}

    <div class="content">
      <div class="header">
        <div class="company-info">
          <h1>${data.company.name}</h1>
          <p>${data.company.address}</p>
          ${data.company.gstin ? `<p><strong>GSTIN:</strong> ${data.company.gstin}</p>` : ''}
          ${data.company.email ? `<p><strong>Email:</strong> ${data.company.email}</p>` : ''}
          ${data.company.phone ? `<p><strong>Phone:</strong> ${data.company.phone}</p>` : ''}
          ${data.company.website ? `<p><strong>Website:</strong> ${data.company.website}</p>` : ''}
        </div>
      </div>

      <div class="invoice-title">Tax Invoice</div>

      <div class="billing-section">
        <div class="billing-column">
          <div class="section-title">Bill To:</div>
          <div class="customer-info">
            <p><strong>${data.customer.name}</strong></p>
            <p>${data.customer.address}</p>
            ${data.customer.gstin ? `<p><strong>GSTIN:</strong> ${data.customer.gstin}</p>` : ''}
            ${data.customer.email ? `<p><strong>Email:</strong> ${data.customer.email}</p>` : ''}
            ${data.customer.phone ? `<p><strong>Phone:</strong> ${data.customer.phone}</p>` : ''}
          </div>
        </div>
        <div class="billing-column">
          <div class="section-title">Invoice Details:</div>
          <div class="customer-info">
            <p><strong>Invoice No:</strong> ${data.invoice.number}</p>
            <p><strong>Issue Date:</strong> ${formatDate(data.invoice.issueDate)}</p>
            ${data.invoice.dueDate ? `<p><strong>Due Date:</strong> ${formatDate(data.invoice.dueDate)}</p>` : ''}
            ${data.invoice.placeOfSupply ? `<p><strong>Place of Supply:</strong> ${data.invoice.placeOfSupply}</p>` : ''}
            <p><strong>Currency:</strong> ${data.invoice.currency || 'INR'}</p>
          </div>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 40%">Description</th>
            <th style="width: 8%">Qty</th>
            <th style="width: 12%">Rate</th>
            <th style="width: 12%">Taxable Value</th>
            ${!data.totals.isInterstate ?
              '<th style="width: 10%">CGST</th><th style="width: 10%">SGST</th>' :
              '<th style="width: 20%">IGST</th>'
            }
            <th style="width: 13%">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.lineItems.map(item => `
            <tr>
              <td class="description">
                <strong>${item.description}</strong>
                ${item.hsnSac ? `<br><small style="color: #6b7280;">HSN/SAC: ${item.hsnSac}</small>` : ''}
              </td>
              <td class="number">${item.quantity}</td>
              <td class="number">${formatCurrency(item.rate)}</td>
              <td class="number">${formatCurrency(item.taxableValue)}</td>
              ${!data.totals.isInterstate ?
                `<td class="number">${formatCurrency(item.cgst)}</td><td class="number">${formatCurrency(item.sgst)}</td>` :
                `<td class="number">${formatCurrency(item.igst)}</td>`
              }
              <td class="number"><strong>${formatCurrency(item.lineTotal)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals-section">
        <table class="totals-table">
          <tr>
            <td class="label">Subtotal:</td>
            <td class="value">${formatCurrency(data.totals.subtotal)}</td>
          </tr>
          ${data.totals.totalDiscount && data.totals.totalDiscount > 0 ?
            `<tr><td class="label">Total Discount:</td><td class="value">-${formatCurrency(data.totals.totalDiscount)}</td></tr>` : ''
          }
          ${data.totals.cgstAmount > 0 ?
            `<tr><td class="label">CGST:</td><td class="value">${formatCurrency(data.totals.cgstAmount)}</td></tr>` : ''
          }
          ${data.totals.sgstAmount > 0 ?
            `<tr><td class="label">SGST:</td><td class="value">${formatCurrency(data.totals.sgstAmount)}</td></tr>` : ''
          }
          ${data.totals.igstAmount > 0 ?
            `<tr><td class="label">IGST:</td><td class="value">${formatCurrency(data.totals.igstAmount)}</td></tr>` : ''
          }
          ${data.totals.roundOff && data.totals.roundOff !== 0 ?
            `<tr><td class="label">Round Off:</td><td class="value">${data.totals.roundOff > 0 ? '+' : ''}${formatCurrency(data.totals.roundOff)}</td></tr>` : ''
          }
          <tr class="grand-total">
            <td class="label"><strong>Grand Total:</strong></td>
            <td class="value"><strong>${formatCurrency(data.totals.grandTotal)}</strong></td>
          </tr>
        </table>
      </div>

      ${data.totals.amountInWords ? `
        <div class="amount-words">
          <div class="label">Amount in Words:</div>
          <div class="text">${data.totals.amountInWords}</div>
        </div>
      ` : ''}

      ${data.paymentDetails ? `
        <div class="payment-section">
          <div class="label">Payment Details:</div>
          ${data.paymentDetails.bankName ? `<p><strong>Bank:</strong> ${data.paymentDetails.bankName}</p>` : ''}
          ${data.paymentDetails.accountNumber ? `<p><strong>Account No:</strong> ${data.paymentDetails.accountNumber}</p>` : ''}
          ${data.paymentDetails.ifscCode ? `<p><strong>IFSC Code:</strong> ${data.paymentDetails.ifscCode}</p>` : ''}
          ${data.paymentDetails.upiId ? `<p><strong>UPI ID:</strong> ${data.paymentDetails.upiId}</p>` : ''}
          ${data.invoice.paymentInstructions ? `<p style="margin-top: 12px;"><strong>${data.invoice.paymentInstructions}</strong></p>` : ''}
        </div>
      ` : ''}

      ${(data.invoice.notes || data.invoice.terms) ? `
        <div class="notes-section">
          <div class="label">${data.invoice.notes ? 'Additional Notes:' : 'Terms & Conditions:'}</div>
          <p>${data.invoice.notes || data.invoice.terms}</p>
        </div>
      ` : ''}
    </div>

    <div class="footer">
      <p><strong>This is a computer-generated invoice and does not require a signature.</strong></p>
      <p>Generated on: ${formatDate(new Date())} | Powered by ${data.company.name}</p>
      ${data.branding?.showWatermark ? '<p style="font-weight: bold; color: #059669;">ORIGINAL DOCUMENT</p>' : ''}
    </div>
  </div>
</body>
</html>`;
};

export class PDFEngine {
  private static instance: PDFEngine;

  static getInstance(): PDFEngine {
    if (!PDFEngine.instance) {
      PDFEngine.instance = new PDFEngine();
    }
    return PDFEngine.instance;
  }

  async generatePDFBlob(data: InvoicePDFData): Promise<Blob> {
    try {
      // Generate professional HTML invoice
      const htmlContent = generateHTMLInvoice(data);
      return new Blob([htmlContent], { type: 'text/html' });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generatePDFBuffer(data: InvoicePDFData): Promise<Buffer> {
    try {
      // Generate professional HTML invoice
      const htmlContent = generateHTMLInvoice(data);
      return Buffer.from(htmlContent, 'utf8');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Method to validate PDF data before generation
  validatePDFData(data: InvoicePDFData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required company fields
    if (!data.company.name) errors.push('Company name is required');
    if (!data.company.address) errors.push('Company address is required');

    // Required customer fields
    if (!data.customer.name) errors.push('Customer name is required');
    if (!data.customer.address) errors.push('Customer address is required');

    // Required invoice fields
    if (!data.invoice.number) errors.push('Invoice number is required');
    if (!data.invoice.issueDate) errors.push('Invoice issue date is required');

    // Line items validation
    if (!data.lineItems || data.lineItems.length === 0) {
      errors.push('At least one line item is required');
    } else {
      data.lineItems.forEach((item, index) => {
        if (!item.description) errors.push(`Line item ${index + 1}: Description is required`);
        if (item.quantity <= 0) errors.push(`Line item ${index + 1}: Quantity must be greater than 0`);
        if (item.rate <= 0) errors.push(`Line item ${index + 1}: Rate must be greater than 0`);
      });
    }

    // Totals validation
    if (!data.totals) {
      errors.push('Totals data is required');
    } else {
      if (data.totals.grandTotal <= 0) errors.push('Grand total must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate HTML for preview/printing
  generateHTMLPreview(data: InvoicePDFData): string {
    return generateHTMLInvoice(data);
  }
}

export const pdfEngine = PDFEngine.getInstance();