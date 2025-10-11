/**
 * Pragnya Pradhan & Associates - Custom PDF Engine
 * Matches exact invoice format with modern typography
 *
 * Based on client's invoice format: JPFL/A/232-233
 */

import { formatCurrency, formatDate } from './utils';

// Helper function to render service-specific details table
const renderServiceDetailsTable = (item: any): string => {
  if (!item.details || item.details.length === 0) return '';

  const serviceType = item.serviceType || 'GENERAL';
  const firstDetail = item.details[0];

  // Determine which service type based on fields present
  switch (serviceType) {
    case 'ROC_FILING':
      return `
        <table class="details-table">
          <thead>
            <tr>
              <th>ROC Forms</th>
              ${firstDetail.srn !== undefined ? '<th>SRN</th>' : ''}
              ${firstDetail.filingDate !== undefined ? '<th>Filing Date</th>' : ''}
              ${firstDetail.govtFees !== undefined ? '<th>Govt Fees</th>' : ''}
              <th>Prof. Fees</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                <td>${detail.formName || '-'}</td>
                ${firstDetail.srn !== undefined ? `<td>${detail.srn || '-'}</td>` : ''}
                ${firstDetail.filingDate !== undefined ? `<td>${detail.filingDate || '-'}</td>` : ''}
                ${firstDetail.govtFees !== undefined ? `<td>${formatCurrency(detail.govtFees || 0)}</td>` : ''}
                <td>${formatCurrency(detail.professionalFees || detail.amount)}</td>
              </tr>
            `).join('')}
            ${item.subtotals ? `
              <tr style="font-weight: 600; background-color: #f5f5f5;">
                <td>${firstDetail.srn !== undefined && firstDetail.filingDate !== undefined ? 'Total' : 'TOTAL'}</td>
                ${firstDetail.srn !== undefined ? '<td></td>' : ''}
                ${firstDetail.filingDate !== undefined ? '<td></td>' : ''}
                ${firstDetail.govtFees !== undefined ? `<td>${formatCurrency(item.subtotals.govtFees || 0)}</td>` : ''}
                <td>${formatCurrency(item.subtotals.professionalFees || 0)}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>`;

    case 'SECRETARIAL_AUDIT':
      return `
        <table class="details-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Audit Type</th>
              <th>Deliverables</th>
              ${firstDetail.hours !== undefined ? '<th>Hours</th>' : ''}
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                <td>${detail.period || '-'}</td>
                <td>${detail.auditType || '-'}</td>
                <td>${detail.deliverables || '-'}</td>
                ${firstDetail.hours !== undefined ? `<td>${detail.hours || '-'}</td>` : ''}
                <td>${formatCurrency(detail.fee || detail.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

    case 'BOARD_MEETING':
      return `
        <table class="details-table">
          <thead>
            <tr>
              <th>Meeting Type</th>
              <th>Date</th>
              <th>Notice</th>
              <th>Minutes</th>
              ${firstDetail.formsField ? '<th>Forms Filed</th>' : ''}
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                <td>${detail.meetingType || '-'}</td>
                <td>${detail.meetingDate || '-'}</td>
                <td>${detail.noticePrep ? 'Yes' : 'No'}</td>
                <td>${detail.minutesDraft ? 'Yes' : 'No'}</td>
                ${firstDetail.formsField ? `<td>${detail.formsField || '-'}</td>` : ''}
                <td>${formatCurrency(detail.fee || detail.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

    case 'TRADEMARK_IP':
      return `
        <table class="details-table">
          <thead>
            <tr>
              ${firstDetail.applicationNumber !== undefined ? '<th>App. No.</th>' : ''}
              ${firstDetail.class !== undefined ? '<th>Class</th>' : ''}
              <th>Description</th>
              ${firstDetail.govtFees !== undefined ? '<th>Govt Fees</th>' : ''}
              <th>Prof. Fees</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                ${firstDetail.applicationNumber !== undefined ? `<td>${detail.applicationNumber || '-'}</td>` : ''}
                ${firstDetail.class !== undefined ? `<td>${detail.class || '-'}</td>` : ''}
                <td>${detail.ipDescription || detail.description || '-'}</td>
                ${firstDetail.govtFees !== undefined ? `<td>${formatCurrency(detail.govtFees || 0)}</td>` : ''}
                <td>${formatCurrency(detail.professionalFees || detail.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

    case 'LEGAL_DRAFTING':
      return `
        <table class="details-table">
          <thead>
            <tr>
              <th>Document Type</th>
              ${firstDetail.pages !== undefined ? '<th>Pages</th>' : ''}
              <th>Revisions</th>
              ${firstDetail.deliveryDate !== undefined ? '<th>Delivery Date</th>' : ''}
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                <td>${detail.documentType || '-'}</td>
                ${firstDetail.pages !== undefined ? `<td>${detail.pages || '-'}</td>` : ''}
                <td>${detail.revisions || 0}</td>
                ${firstDetail.deliveryDate !== undefined ? `<td>${detail.deliveryDate || '-'}</td>` : ''}
                <td>${formatCurrency(detail.fee || detail.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

    case 'RETAINER':
      return `
        <table class="details-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Hours</th>
              <th>Rate/Hour</th>
              <th>Services Included</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                <td>${detail.period || '-'}</td>
                <td>${detail.hours || '-'}</td>
                <td>${formatCurrency(detail.ratePerHour || 0)}</td>
                <td>${detail.servicesIncluded || '-'}</td>
                <td>${formatCurrency(detail.fee || detail.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

    case 'DUE_DILIGENCE':
      return `
        <table class="details-table">
          <thead>
            <tr>
              <th>Scope</th>
              <th>Documents</th>
              <th>Report Type</th>
              <th>Timeline</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                <td>${detail.scope || '-'}</td>
                <td>${detail.documentsReviewed || 0}</td>
                <td>${detail.reportType || '-'}</td>
                <td>${detail.timeline || '-'}</td>
                <td>${formatCurrency(detail.fee || detail.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;

    default:
      // Fallback to original ROC format for backward compatibility
      return `
        <table class="details-table">
          <thead>
            <tr>
              ${firstDetail.formName !== undefined ? '<th>ROC Forms</th>' : '<th>Item</th>'}
              ${firstDetail.srn !== undefined ? '<th>SRN</th>' : ''}
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${item.details.map((detail: any) => `
              <tr>
                ${firstDetail.formName !== undefined ? `<td>${detail.formName}</td>` : '<td>-</td>'}
                ${firstDetail.srn !== undefined ? `<td>${detail.srn || '-'}</td>` : ''}
                <td>${formatCurrency(detail.amount || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>`;
  }
};

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
    pan?: string;
    gstin?: string;
  };
  invoice: {
    number: string; // Format: CLIENT/A/NUMBER
    issueDate: Date;
    notes?: string; // Like "*Note: Please do not deduct TDS on Reimbursement of ROC Fees"
  };
  lineItems: Array<{
    description: string;
    serviceType?: string; // 'ROC_FILING', 'SECRETARIAL_AUDIT', etc.
    details?: Array<{
      // ROC Filing fields
      formName?: string;
      srn?: string;
      filingDate?: string;
      govtFees?: number;
      professionalFees?: number;

      // Secretarial Audit fields
      period?: string;
      auditType?: string;
      deliverables?: string;
      hours?: number;

      // Board/AGM Meeting fields
      meetingType?: string;
      meetingDate?: string;
      noticePrep?: boolean;
      minutesDraft?: boolean;
      formsField?: string;

      // Trademark/IP fields
      applicationNumber?: string;
      class?: string;
      ipDescription?: string;

      // Legal Drafting fields
      documentType?: string;
      pages?: number;
      revisions?: number;
      deliveryDate?: string;

      // Retainer fields
      ratePerHour?: number;
      servicesIncluded?: string;

      // Due Diligence fields
      scope?: string;
      documentsReviewed?: number;
      reportType?: string;
      timeline?: string;

      // Common
      fee?: number;
      amount: number;
    }>;
    subtotals?: {
      govtFees?: number;
      professionalFees?: number;
      totalFees?: number;
      totalHours?: number;
      totalPages?: number;
      totalDocuments?: number;
    };
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
      padding: 15mm 20mm 25mm 20mm;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 10mm;
    }

    /* Header with Logo and Company Info */
    .header {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 15px;
    }

    .logo {
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .company-header {
      flex: 1;
    }

    .company-name {
      font-size: 22pt;
      font-weight: 700;
      color: #1a4d8f;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .company-subtitle {
      font-size: 12pt;
      font-weight: 600;
      color: #1a4d8f;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-line {
      border-bottom: 4px solid #8B0000;
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
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .signature-label {
      font-weight: 600;
      margin-bottom: 10px;
      font-size: 11pt;
    }

    .signature-box {
      margin-top: 70px;
      text-align: left;
    }

    .signature-image {
      max-width: 150px;
      max-height: 60px;
      margin-bottom: 5px;
      object-fit: contain;
    }

    .signature-line {
      border-bottom: 1px solid #333;
      width: 200px;
      margin-bottom: 5px;
    }

    .signature-name {
      font-weight: 600;
      margin-bottom: 2px;
      font-size: 11pt;
    }

    .signature-designation {
      font-size: 10pt;
      margin-bottom: 2px;
      font-style: italic;
    }

    .signature-pan {
      font-size: 10pt;
      font-weight: 600;
    }

    /* Footer */
    .footer {
      margin-top: 60px;
      padding: 15px 0 20px 0;
      border-top: 4px solid #8B0000;
      text-align: center;
      font-size: 10pt;
      line-height: 1.8;
      color: #333;
      page-break-inside: avoid;
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
        margin: 20mm 15mm;
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
          <img src="${data.company.logo}" alt="${data.company.name} Logo" crossorigin="anonymous" />
        </div>
      ` : ''}
      <div class="company-header">
        <div class="company-name">${data.company.name}</div>
        ${data.company.subtitle ? `<div class="company-subtitle">${data.company.subtitle}</div>` : ''}
      </div>
    </div>

    <div class="header-line"></div>

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
      ${data.customer.pan ? `PAN: ${data.customer.pan}` : ''}${data.customer.pan && data.customer.gstin ? ' | ' : ''}${data.customer.gstin ? `GST NO: ${data.customer.gstin}` : ''}
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
              ${renderServiceDetailsTable(item)}
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
        <div class="signature-line"></div>
        <div class="signature-name">(${data.signature?.proprietorName || 'Pragnya Parimita Pradhan'})</div>
        <div class="signature-designation">${data.signature?.designation || 'Proprietor'}</div>
        ${data.company.pan ? `<div class="signature-pan">PAN: ${data.company.pan}</div>` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      ${data.company.address}<br>
      ${data.company.phone ? `Mob: ${data.company.phone}` : ''}${data.company.email ? ` Email id: ${data.company.email}` : ''}
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
        windowHeight: container.scrollHeight,
      });

      document.body.removeChild(container);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      // Calculate how many pages we need
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

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
