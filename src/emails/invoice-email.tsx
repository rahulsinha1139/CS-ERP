/**
 * Professional Invoice Email Template for Company Secretary Practices
 * Built with React Email for perfect rendering across all email clients
 */

import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text
} from '@react-email/components'
import React from 'react'

interface InvoiceEmailProps {
  invoiceNumber: string
  customerName: string
  companyName: string
  amount: number
  dueDate: string
  invoiceUrl?: string
  paymentUrl?: string
  companyLogo?: string
  companyEmail: string
  companyPhone?: string
  services: Array<{
    description: string
    amount: number
  }>
}

export const InvoiceEmail = ({
  invoiceNumber = "INV-2024-001",
  customerName = "Sunrise Industries Ltd",
  companyName = "Sharma & Associates",
  amount = 25000,
  dueDate = "30th September 2024",
  invoiceUrl = "#",
  paymentUrl = "#",
  companyLogo,
  companyEmail = "contact@sharmaassociates.com",
  companyPhone = "+91 98765 43210",
  services = [
    { description: "ROC Annual Filing", amount: 15000 },
    { description: "Board Resolution Preparation", amount: 10000 }
  ]
}: InvoiceEmailProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} from {companyName} - Due {dueDate}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                {companyLogo && (
                  <Img
                    src={companyLogo}
                    width="120"
                    height="40"
                    alt={companyName}
                    style={logo}
                  />
                )}
                <Heading style={companyNameHeading}>{companyName}</Heading>
                <Text style={companySubtitle}>Company Secretary & Legal Consultants</Text>
              </Column>
              <Column align="right">
                <Text style={invoiceTitle}>INVOICE</Text>
                <Text style={invoiceNumberStyle}>{invoiceNumber}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Customer Info */}
          <Section style={section}>
            <Text style={greeting}>Dear {customerName},</Text>
            <Text style={paragraph}>
              Thank you for choosing our professional company secretary services.
              Please find your invoice details below:
            </Text>
          </Section>

          {/* Invoice Summary */}
          <Section style={invoiceCard}>
            <Row style={invoiceHeader}>
              <Column>
                <Text style={invoiceHeaderText}>Invoice Amount</Text>
                <Text style={amountStyle}>{formatCurrency(amount)}</Text>
              </Column>
              <Column align="right">
                <Text style={invoiceHeaderText}>Due Date</Text>
                <Text style={dueDateStyle}>{dueDate}</Text>
              </Column>
            </Row>

            {/* Services List */}
            <Section style={servicesSection}>
              <Text style={servicesTitle}>Services Provided</Text>
              {services.map((service, index) => (
                <Row key={index} style={serviceRow}>
                  <Column>
                    <Text style={serviceDescription}>{service.description}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={serviceAmount}>{formatCurrency(service.amount)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={serviceDivider} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total Amount</Text>
              </Column>
              <Column align="right">
                <Text style={totalAmount}>{formatCurrency(amount)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Action Buttons */}
          <Section style={buttonSection}>
            <Row>
              <Column align="center">
                <Button style={primaryButton} href={paymentUrl}>
                  Pay Now
                </Button>
              </Column>
              <Column align="center">
                <Button style={secondaryButton} href={invoiceUrl}>
                  View Invoice
                </Button>
              </Column>
            </Row>
          </Section>

          {/* Payment Instructions */}
          <Section style={section}>
            <Text style={sectionTitle}>Payment Instructions</Text>
            <Text style={paragraph}>
              • <strong>Online Payment:</strong> Click &quot;Pay Now&quot; above for secure online payment
            </Text>
            <Text style={paragraph}>
              • <strong>Bank Transfer:</strong> Use invoice number as reference
            </Text>
            <Text style={paragraph}>
              • <strong>Questions?</strong> Reply to this email or call {companyPhone}
            </Text>
          </Section>

          {/* Professional Note */}
          <Section style={noteSection}>
            <Text style={noteText}>
              <strong>Note:</strong> This invoice includes all applicable taxes as per Indian GST regulations.
              Payment terms are net 30 days from invoice date.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {companyName} | Company Secretary Practice
            </Text>
            <Text style={footerText}>
              Email: <Link href={`mailto:${companyEmail}`} style={link}>{companyEmail}</Link>
              {companyPhone && (
                <>
                  {' '} | Phone: <Link href={`tel:${companyPhone}`} style={link}>{companyPhone}</Link>
                </>
              )}
            </Text>
            <Text style={footerDisclaimer}>
              This is a computer-generated invoice. Thank you for your business.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default InvoiceEmail

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 20px 48px',
  maxWidth: '600px'
}

const header = {
  marginBottom: '32px'
}

const logo = {
  marginBottom: '16px'
}

const companyNameHeading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 8px 0'
}

const companySubtitle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 16px 0'
}

const invoiceTitle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0'
}

const invoiceNumberStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#4f46e5',
  margin: '8px 0 0 0'
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0'
}

const section = {
  marginBottom: '32px'
}

const greeting = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0 0 16px 0'
}

const invoiceCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '32px'
}

const invoiceHeader = {
  marginBottom: '24px'
}

const invoiceHeaderText = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em'
}

const amountStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#059669',
  margin: '0'
}

const dueDateStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#dc2626',
  margin: '0'
}

const servicesSection = {
  marginBottom: '24px'
}

const servicesTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0'
}

const serviceRow = {
  marginBottom: '8px'
}

const serviceDescription = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0'
}

const serviceAmount = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0'
}

const serviceDivider = {
  borderColor: '#d1d5db',
  margin: '16px 0'
}

const totalRow = {
  backgroundColor: '#ffffff',
  padding: '16px 0 0 0'
}

const totalLabel = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0'
}

const totalAmount = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0'
}

const buttonSection = {
  margin: '32px 0'
}

const primaryButton = {
  backgroundColor: '#4f46e5',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px'
}

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #4f46e5',
  borderRadius: '6px',
  color: '#4f46e5',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 24px',
  margin: '0 8px'
}

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0'
}

const noteSection = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '32px'
}

const noteText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0'
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '32px'
}

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 8px 0'
}

const footerDisclaimer = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '16px 0 0 0'
}

const link = {
  color: '#4f46e5',
  textDecoration: 'none'
}