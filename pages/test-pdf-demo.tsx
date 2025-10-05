/**
 * PDF Enhancement Demo Page
 * Visual testing for logo, watermark, and status badge features
 */

import { useState } from 'react';
import { PDFEngine } from '@/lib/pdf-engine';
import { allTestInvoices } from '@/lib/pdf-engine.test-demo';

type InvoiceType = keyof typeof allTestInvoices;

export default function PDFDemoPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType>('draft');
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const generatePreview = async (type: InvoiceType) => {
    setSelectedInvoice(type);
    const pdfEngine = PDFEngine.getInstance();
    const invoiceData = allTestInvoices[type];

    try {
      const blob = await pdfEngine.generatePDFBlob(invoiceData);
      const html = await blob.text();
      setHtmlPreview(html);
      setShowPreview(true);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF preview');
    }
  };

  const invoiceOptions = [
    { key: 'draft', label: 'DRAFT - Logo Initials (Left)', description: 'Shows "PP" initials + DRAFT watermark + badge' },
    { key: 'paid', label: 'PAID - Logo (Center)', description: 'Shows logo in center + PAID watermark + badge' },
    { key: 'overdue', label: 'OVERDUE - Logo (Right)', description: 'Logo on right + OVERDUE badge' },
    { key: 'sent', label: 'SENT - Original Watermark', description: 'Shows ORIGINAL watermark, no status badge' },
    { key: 'partiallyPaid', label: 'PARTIALLY PAID', description: 'Shows PARTIALLY PAID badge' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#1e40af' }}>
          📄 PDF Enhancement Demo
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Test the new logo, watermark, and status badge features
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '30px',
        marginBottom: '30px'
      }}>
        {/* Control Panel */}
        <div style={{
          background: '#f9fafb',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            Select Invoice Type
          </h2>

          {invoiceOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => generatePreview(option.key as InvoiceType)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px',
                marginBottom: '10px',
                background: selectedInvoice === option.key ? '#1e40af' : 'white',
                color: selectedInvoice === option.key ? 'white' : '#1f2937',
                border: '2px solid',
                borderColor: selectedInvoice === option.key ? '#1e40af' : '#d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '13px',
                fontWeight: selectedInvoice === option.key ? 'bold' : 'normal',
                minHeight: '75px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (selectedInvoice !== option.key) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.background = '#eff6ff';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedInvoice !== option.key) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              <div style={{
                fontWeight: 'bold',
                marginBottom: '5px',
                wordWrap: 'break-word',
                overflow: 'hidden',
              }}>
                {option.label}
              </div>
              <div style={{
                fontSize: '11px',
                opacity: selectedInvoice === option.key ? 0.9 : 0.6,
                lineHeight: '1.4',
                wordWrap: 'break-word',
                overflow: 'hidden',
              }}>
                {option.description}
              </div>
            </button>
          ))}

          <div style={{
            marginTop: '30px',
            padding: '15px',
            background: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #10b981'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#065f46' }}>
              ✨ New Features
            </h3>
            <ul style={{ fontSize: '12px', color: '#047857', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Smart logo rendering</li>
              <li>Logo position control</li>
              <li>Initials fallback</li>
              <li>Status watermarks</li>
              <li>Corner badges</li>
              <li>Professional styling</li>
            </ul>
          </div>
        </div>

        {/* Preview Area */}
        <div style={{
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          minHeight: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {showPreview ? (
            <iframe
              srcDoc={htmlPreview}
              style={{
                width: '100%',
                height: '1000px',
                border: 'none',
                borderRadius: '8px',
              }}
              title="PDF Preview"
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📄</div>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>
                Select an invoice type to preview
              </p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Click any option on the left to generate a PDF preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>
          Feature Matrix
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>Invoice Type</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Logo</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Position</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Watermark</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>Status Badge</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'white' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>DRAFT</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Initials (PP)</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Left</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>🔴 DRAFT</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>🟡 DRAFT</td>
            </tr>
            <tr style={{ background: '#f9fafb' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>PAID</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Logo Image</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Center</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>🟢 PAID</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>🟢 PAID</td>
            </tr>
            <tr style={{ background: 'white' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>OVERDUE</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Initials (PP)</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Right</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>-</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>🔴 OVERDUE</td>
            </tr>
            <tr style={{ background: '#f9fafb' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>SENT</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Initials (PP)</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Left</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>⚪ ORIGINAL</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>-</td>
            </tr>
            <tr style={{ background: 'white' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>PARTIALLY PAID</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Initials (PP)</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Left</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>-</td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>🟡 PARTIALLY PAID</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
