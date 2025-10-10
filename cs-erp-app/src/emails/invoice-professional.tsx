/**
 * Professional Invoice Email Template
 * Using React Email with mathematical optimization
 * Following Asymm design principles with golden ratio layouts
 */

import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Img,
  Link,
  Hr,
  Preview,
  Heading,
  Button,
} from '@react-email/components';

// Mathematical constants for design optimization
const GOLDEN_RATIO = 1.618;
const CONTAINER_WIDTH = 600;
const CONTENT_PADDING = Math.round(CONTAINER_WIDTH / GOLDEN_RATIO / 10); // ~37px

// Professional color scheme
const colors = {
  primary: '#1e40af',
  secondary: '#374151',
  accent: '#059669',
  light: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

interface InvoiceEmailProps {
  // Customer information
  customerName: string;
  customerEmail: string;

  // Company information
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  companyWebsite?: string;
  companyLogo?: string;

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  amount: number;
  currency?: string;

  // Payment information
  paymentInstructions?: string;
  paymentLink?: string;

  // Additional details
  services?: Array<{
    description: string;
    amount: number;
  }>;

  notes?: string;
  attachmentName?: string;

  // Branding
  primaryColor?: string;
  accentColor?: string;
  showPoweredBy?: boolean;
}

const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const InvoiceProfessionalEmail: React.FC<InvoiceEmailProps> = ({
  customerName,
  customerEmail,
  companyName,
  companyEmail,
  companyPhone,
  companyWebsite,
  companyLogo,
  invoiceNumber,
  invoiceDate,
  dueDate,
  amount,
  currency = 'INR',
  paymentInstructions,
  paymentLink,
  services = [],
  notes,
  attachmentName,
  primaryColor = colors.primary,
  accentColor = colors.accent,
  showPoweredBy = true,
}) => {
  const totalAmount = formatCurrency(amount, currency);
  const previewText = `Invoice ${invoiceNumber} for ${totalAmount} from ${companyName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>

          {/* Header Section */}
          <Section style={headerStyle}>
            <Row>
              <Column>
                {companyLogo ? (
                  <Img
                    src={companyLogo}
                    alt={companyName}
                    width="120"
                    height="40"
                    style={logoStyle}
                  />
                ) : (
                  <Text style={companyNameStyle}>{companyName}</Text>
                )}
              </Column>
              <Column align="right">
                <Text style={invoiceNumberStyle}>
                  Invoice #{invoiceNumber}
                </Text>
                <Text style={dateStyle}>
                  {invoiceDate}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero Section */}
          <Section style={heroStyle}>
            <Heading style={heroHeadingStyle}>
              Your Invoice is Ready
            </Heading>
            <Text style={heroSubtextStyle}>
              Thank you for your business! Please find your invoice details below.
            </Text>
          </Section>

          {/* Customer Information */}
          <Section style={customerSectionStyle}>
            <Text style={sectionLabelStyle}>Bill To:</Text>
            <Text style={customerNameStyle}>{customerName}</Text>
            <Text style={customerEmailStyle}>{customerEmail}</Text>
          </Section>

          {/* Invoice Summary */}
          <Section style={summaryStyle}>
            <Row>
              <Column>
                <Text style={summaryLabelStyle}>Invoice Date:</Text>
                <Text style={summaryValueStyle}>{invoiceDate}</Text>
              </Column>
              <Column>
                <Text style={summaryLabelStyle}>Invoice Number:</Text>
                <Text style={summaryValueStyle}>{invoiceNumber}</Text>
              </Column>
            </Row>
            {dueDate && (
              <Row style={{ marginTop: 16 }}>
                <Column>
                  <Text style={summaryLabelStyle}>Due Date:</Text>
                  <Text style={{...summaryValueStyle, ...dueDateStyle}}>{dueDate}</Text>
                </Column>
                <Column>
                  <Text style={summaryLabelStyle}>Amount Due:</Text>
                  <Text style={{...summaryValueStyle, ...amountStyle}}>{totalAmount}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Services/Items Table */}
          {services.length > 0 && (
            <Section style={servicesStyle}>
              <Text style={sectionTitleStyle}>Services</Text>

              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Description</th>
                    <th style={{...tableHeaderStyle, textAlign: 'right'}}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td style={tableCellStyle}>{service.description}</td>
                      <td style={{...tableCellStyle, textAlign: 'right'}}>
                        {formatCurrency(service.amount, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Hr style={hrStyle} />

              <Row style={{ marginTop: 16 }}>
                <Column align="right">
                  <Text style={totalLabelStyle}>Total Amount:</Text>
                  <Text style={totalAmountStyle}>{totalAmount}</Text>
                </Column>
              </Row>
            </Section>
          )}

          {/* Payment Section */}
          <Section style={paymentSectionStyle}>
            <Text style={sectionTitleStyle}>Payment Information</Text>

            {paymentLink && (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Button
                  href={paymentLink}
                  style={payButtonStyle}
                >
                  Pay Now - {totalAmount}
                </Button>
              </div>
            )}

            {paymentInstructions && (
              <div style={paymentInstructionsStyle}>
                <Text style={instructionsLabelStyle}>Payment Instructions:</Text>
                <Text style={instructionsTextStyle}>{paymentInstructions}</Text>
              </div>
            )}

            {attachmentName && (
              <div style={attachmentStyle}>
                <Text style={attachmentTextStyle}>
                  📎 Attachment: {attachmentName}
                </Text>
              </div>
            )}
          </Section>

          {/* Notes Section */}
          {notes && (
            <Section style={notesStyle}>
              <Text style={notesLabelStyle}>Additional Notes:</Text>
              <Text style={notesTextStyle}>{notes}</Text>
            </Section>
          )}

          {/* Contact Information */}
          <Section style={contactStyle}>
            <Text style={contactTitleStyle}>Need Help?</Text>
            <Text style={contactTextStyle}>
              If you have any questions about this invoice, please contact us:
            </Text>
            <Text style={contactDetailsStyle}>
              📧 Email: <Link href={`mailto:${companyEmail}`} style={linkStyle}>{companyEmail}</Link>
              {companyPhone && (
                <>
                  <br />
                  📞 Phone: <Link href={`tel:${companyPhone}`} style={linkStyle}>{companyPhone}</Link>
                </>
              )}
              {companyWebsite && (
                <>
                  <br />
                  🌐 Website: <Link href={companyWebsite} style={linkStyle}>{companyWebsite}</Link>
                </>
              )}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Hr style={hrStyle} />
            <Text style={footerTextStyle}>
              This email was sent to {customerEmail} regarding Invoice {invoiceNumber}.
              <br />
              This is an automated message, please do not reply directly to this email.
            </Text>

            {showPoweredBy && (
              <Text style={poweredByStyle}>
                Powered by <strong>CS ERP System</strong> - Professional Company Secretary Software
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles with golden ratio proportions
const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  margin: '20px auto',
  maxWidth: CONTAINER_WIDTH,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  padding: `${CONTENT_PADDING}px`,
  borderBottom: `2px solid ${colors.primary}`,
};

const logoStyle: React.CSSProperties = {
  maxHeight: 40,
};

const companyNameStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 'bold',
  color: colors.primary,
  margin: 0,
};

const invoiceNumberStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.text,
  margin: 0,
};

const dateStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.muted,
  margin: '4px 0 0',
};

const heroStyle: React.CSSProperties = {
  backgroundColor: colors.light,
  padding: `${CONTENT_PADDING}px`,
  textAlign: 'center',
};

const heroHeadingStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 8px',
};

const heroSubtextStyle: React.CSSProperties = {
  fontSize: 16,
  color: colors.muted,
  margin: 0,
  lineHeight: 1.5,
};

const customerSectionStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  borderBottom: `1px solid ${colors.border}`,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 'bold',
  color: colors.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
};

const customerNameStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 4px',
};

const customerEmailStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.muted,
  margin: 0,
};

const summaryStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  backgroundColor: colors.light,
  borderBottom: `1px solid ${colors.border}`,
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 'bold',
  color: colors.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '0 0 4px',
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: '600',
  color: colors.text,
  margin: 0,
};

const dueDateStyle: React.CSSProperties = {
  color: colors.warning,
};

const amountStyle: React.CSSProperties = {
  color: colors.primary,
  fontSize: 18,
};

const servicesStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  borderBottom: `1px solid ${colors.border}`,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 16px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '16px 0',
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: colors.white,
  padding: '12px',
  fontSize: 14,
  fontWeight: 'bold',
  textAlign: 'left',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: 14,
  color: colors.text,
  borderBottom: `1px solid ${colors.border}`,
};

const totalLabelStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 4px',
};

const totalAmountStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 'bold',
  color: colors.primary,
  margin: 0,
};

const paymentSectionStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  borderBottom: `1px solid ${colors.border}`,
};

const payButtonStyle: React.CSSProperties = {
  backgroundColor: colors.success,
  color: colors.white,
  padding: '12px 24px',
  borderRadius: 6,
  fontSize: 16,
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const paymentInstructionsStyle: React.CSSProperties = {
  backgroundColor: colors.light,
  padding: 16,
  borderRadius: 6,
  border: `1px solid ${colors.border}`,
};

const instructionsLabelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 8px',
};

const instructionsTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.text,
  margin: 0,
  lineHeight: 1.5,
  whiteSpace: 'pre-line',
};

const attachmentStyle: React.CSSProperties = {
  backgroundColor: colors.light,
  padding: 12,
  borderRadius: 6,
  border: `1px solid ${colors.border}`,
  marginTop: 16,
};

const attachmentTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.text,
  margin: 0,
};

const notesStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: colors.light,
};

const notesLabelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 8px',
};

const notesTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.text,
  margin: 0,
  lineHeight: 1.5,
  whiteSpace: 'pre-line',
};

const contactStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  backgroundColor: colors.light,
  borderBottom: `1px solid ${colors.border}`,
};

const contactTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.text,
  margin: '0 0 8px',
};

const contactTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.text,
  margin: '0 0 12px',
};

const contactDetailsStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.text,
  margin: 0,
  lineHeight: 1.6,
};

const linkStyle: React.CSSProperties = {
  color: colors.primary,
  textDecoration: 'none',
};

const footerStyle: React.CSSProperties = {
  padding: `${CONTENT_PADDING}px`,
  backgroundColor: colors.white,
};

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: `1px solid ${colors.border}`,
  margin: '0 0 16px',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: colors.muted,
  margin: '0 0 12px',
  lineHeight: 1.5,
  textAlign: 'center',
};

const poweredByStyle: React.CSSProperties = {
  fontSize: 11,
  color: colors.muted,
  margin: 0,
  textAlign: 'center',
};

export default InvoiceProfessionalEmail;