/**
 * Pragnya Pradhan & Associates - Custom PDF Engine
 * Matches exact invoice format with modern typography
 *
 * Based on client's invoice format: JPFL/A/232-233
 */

import { formatCurrency, formatDate } from './utils';

export interface PragnyaInvoicePDFData {
  company: {
    name: string;
    subtitle?: string; // "PRACTICING COMPANY SECRETARIES"
    address: string;
    email?: string;
    phone?: string;
    pan?: string;
    logo?: string;
  };
  customer: {
    name: string;
    address: string;
    city?: string;
    pin?: string;
    gstin?: string;
  };
  invoice: {
    number: string; // Format: CLIENT/A/NUMBER
    issueDate: Date;
    notes?: string; // Like "*Note: Please do not deduct TDS on Reimbursement of ROC Fees"
  };
  lineItems: Array<{
    description: string;
    details?: Array<{
      formName?: string;
      srn?: string;
      amount: number;
    }>;
    amount: number;
  }>;
  totals: {
    grandTotal: number;
    amountInWords: string;
  };
  signature?: {
    proprietorName: string;
    designation?: string;
  };
}

// Generate professional invoice matching Pragnya's format
const generatePragnyaHTML = (data: PragnyaInvoicePDFData): string => {
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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      background: white;
      padding: 20mm;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header with Logo and Company Info */
    .header {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 10px;
    }

    .logo {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
    }

    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .company-header {
      flex: 1;
    }

    .company-name {
      font-size: 20pt;
      font-weight: 700;
      color: #003087;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .company-subtitle {
      font-size: 11pt;
      font-weight: 500;
      color: #003087;
      margin-bottom: 8px;
    }

    .header-line {
      border-bottom: 3px solid #8B0000;
      margin-bottom: 15px;
    }

    .company-contact {
      font-size: 10pt;
      line-height: 1.4;
      color: #333;
    }

    /* Invoice Details Row */
    .invoice-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 20px 0;
      gap: 40px;
    }

    .bill-number {
      font-size: 11pt;
      font-weight: 600;
    }

    .invoice-date {
      font-size: 11pt;
      font-weight: 600;
    }

    /* Customer Details */
    .customer-section {
      margin: 20px 0 30px 0;
      font-size: 11pt;
      line-height: 1.6;
    }

    .customer-section strong {
      font-weight: 600;
    }

    /* Invoice Table */
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      font-size: 11pt;
    }

    .invoice-table th,
    .invoice-table td {
      border: 1px solid #333;
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }

    .invoice-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      text-align: center;
    }

    .invoice-table td.number {
      text-align: right;
    }

    /* Nested details table */
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 10pt;
    }

    .details-table th,
    .details-table td {
      border: 1px solid #666;
      padding: 6px 8px;
      text-align: center;
    }

    .details-table th {
      background-color: #f0f0f0;
      font-weight: 600;
      font-size: 9pt;
    }

    /* Total Row */
    .total-row td {
      font-weight: 700;
      background-color: #f9f9f9;
    }

    .amount-words {
      text-align: center;
      font-style: italic;
      padding: 8px 0;
    }

    /* Notes Section */
    .notes-section {
      margin: 30px 0;
      font-size: 10pt;
      font-style: italic;
    }

    /* Signature Section */
    .signature-section {
      margin-top: 50px;
      page-break-inside: avoid;
    }

    .signature-label {
      font-weight: 600;
      margin-bottom: 60px;
    }

    .signature-box {
      margin-top: 80px;
      text-align: left;
    }

    .signature-name {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .signature-designation {
      font-size: 10pt;
      margin-bottom: 2px;
    }

    .signature-pan {
      font-size: 10pt;
      font-weight: 600;
    }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 3px solid #8B0000;
      text-align: center;
      font-size: 10pt;
      color: #333;
    }

    @media print {
      body {
        padding: 0;
      }

      .container {
        max-width: none;
      }

      @page {
        size: A4;
        margin: 15mm;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${data.company.logo ? `
        <div class="logo">
          <img src="${data.company.logo}" alt="${data.company.name} Logo" />
        </div>
      ` : ''}
      <div class="company-header">
        <div class="company-name">${data.company.name}</div>
        ${data.company.subtitle ? `<div class="company-subtitle">${data.company.subtitle}</div>` : ''}
      </div>
    </div>

    <div class="header-line"></div>

    <!-- Company Contact Info -->
    <div class="company-contact">
      ${data.company.address}<br>
      Mob: ${data.company.phone || ''}${data.company.email ? ` Email id: ${data.company.email}` : ''}
    </div>

    <!-- Invoice Number and Date -->
    <div class="invoice-row">
      <div class="bill-number">Bill No : ${data.invoice.number}</div>
      <div class="invoice-date">Date: ${formatDate(data.invoice.issueDate)}</div>
    </div>

    <!-- Customer Details -->
    <div class="customer-section">
      <strong>${data.customer.name}</strong><br>
      ${data.customer.address}${data.customer.city ? `, ${data.customer.city}` : ''}<br>
      ${data.customer.pin ? `PIN-${data.customer.pin}` : ''}<br>
      ${data.customer.gstin ? `GST NO: ${data.customer.gstin}` : ''}
    </div>

    <!-- Invoice Table -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th style="width: 10%">SL<br>No.</th>
          <th style="width: 70%">Transaction</th>
          <th style="width: 20%">Amount (Rs.)</th>
        </tr>
      </thead>
      <tbody>
        ${data.lineItems.map((item, index) => `
          <tr>
            <td style="text-align: center;">${index + 1}.</td>
            <td>
              ${item.description}
              ${item.details && item.details.length > 0 ? `
                <table class="details-table">
                  <thead>
                    <tr>
                      ${item.details[0].formName !== undefined ? '<th>ROC Forms</th>' : '<th>Item</th>'}
                      ${item.details[0].srn !== undefined ? '<th>SRN</th>' : ''}
                      <th>${item.details[0].formName !== undefined ? 'Professional Fees' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${item.details.map(detail => `
                      <tr>
                        ${detail.formName !== undefined ? `<td>${detail.formName}</td>` : '<td>-</td>'}
                        ${detail.srn !== undefined ? `<td>${detail.srn}</td>` : ''}
                        <td>${detail.amount.toFixed(0)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : ''}
            </td>
            <td class="number">${formatCurrency(item.amount)}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="2" style="text-align: center;">
            <strong>TOTAL</strong><br>
            <span class="amount-words">(${data.totals.amountInWords})</span>
          </td>
          <td class="number"><strong>${formatCurrency(data.totals.grandTotal)}</strong></td>
        </tr>
      </tbody>
    </table>

    <!-- Notes (if any) -->
    ${data.invoice.notes ? `
      <div class="notes-section">
        *Note: ${data.invoice.notes}
      </div>
    ` : ''}

    <!-- Signature Section -->
    <div class="signature-section">
      <div class="signature-label">For ${data.company.name}</div>

      <div class="signature-box">
        <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
        <div class="signature-name">(${data.signature?.proprietorName || 'Pragnya Parimita Pradhan'})</div>
        <div class="signature-designation">${data.signature?.designation || 'Proprietor'}</div>
        ${data.company.pan ? `<div class="signature-pan">PAN: ${data.company.pan}</div>` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      ${data.company.address}<br>
      Mob: ${data.company.phone || ''}${data.company.email ? ` Email id: ${data.company.email}` : ''}
    </div>
  </div>
</body>
</html>`;
};

export class PragnyaPDFEngine {
  async generatePDFBlob(data: PragnyaInvoicePDFData): Promise<Blob> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('PDF generation is only supported in browser environment');
      }

      const htmlContent = generatePragnyaHTML(data);

      const { default: jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '210mm';
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(container);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      return pdf.output('blob');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateHTMLPreview(data: PragnyaInvoicePDFData): string {
    return generatePragnyaHTML(data);
  }
}

export const pragnyaPDFEngine = new PragnyaPDFEngine();
