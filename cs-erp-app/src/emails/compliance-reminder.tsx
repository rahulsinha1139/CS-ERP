/**
 * Professional Compliance Reminder Email Template
 * Critical deadlines and regulatory updates for CS clients
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

interface ComplianceReminderProps {
  customerName: string
  companyName: string
  companyLogo?: string
  companyEmail: string
  companyPhone?: string
  urgentItems: Array<{
    title: string
    description: string
    dueDate: string
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM'
    penalty?: number
    actionRequired?: string
  }>
  upcomingItems: Array<{
    title: string
    description: string
    dueDate: string
    category: string
  }>
  actionUrl?: string
}

export const ComplianceReminderEmail = ({
  customerName = "Sunrise Industries Ltd",
  companyName = "Sharma & Associates",
  companyLogo,
  companyEmail = "contact@sharmaassociates.com",
  companyPhone = "+91 98765 43210",
  urgentItems = [
    {
      title: "ROC Annual Filing",
      description: "Annual filing for FY 2023-24 must be completed",
      dueDate: "30th September 2024",
      priority: "CRITICAL" as const,
      penalty: 50000,
      actionRequired: "Submit audited financials and annual return"
    }
  ],
  upcomingItems = [
    {
      title: "AGM Notice",
      description: "Annual General Meeting notice to be sent",
      dueDate: "15th October 2024",
      category: "Corporate Governance"
    }
  ],
  actionUrl = "#"
}: ComplianceReminderProps) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#dc2626'
      case 'HIGH': return '#ea580c'
      case 'MEDIUM': return '#d97706'
      default: return '#6b7280'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '🚨'
      case 'HIGH': return '⚠️'
      case 'MEDIUM': return '📋'
      default: return '📝'
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{`Compliance Alert: ${urgentItems.length} critical items require immediate attention`}</Preview>
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
                <Text style={alertBadge}>COMPLIANCE ALERT</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Alert Header */}
          <Section style={alertHeader}>
            <Text style={alertTitle}>🚨 Compliance Deadline Alert</Text>
            <Text style={greeting}>Dear {customerName},</Text>
            <Text style={alertMessage}>
              We&apos;re monitoring your compliance calendar and have identified {urgentItems.length} critical
              item{urgentItems.length !== 1 ? 's' : ''} that require immediate attention to avoid penalties
              and ensure regulatory compliance.
            </Text>
          </Section>

          {/* Urgent Items */}
          {urgentItems.length > 0 && (
            <Section style={urgentSection}>
              <Text style={sectionTitle}>⚡ Immediate Action Required</Text>

              {urgentItems.map((item, index) => (
                <Section key={index} style={urgentItemCard}>
                  <Row style={urgentItemHeader}>
                    <Column>
                      <Text style={urgentItemTitle}>
                        {getPriorityIcon(item.priority)} {item.title}
                      </Text>
                      <Text style={urgentItemCategory}>
                        <span style={{
                          backgroundColor: getPriorityColor(item.priority),
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {item.priority}
                        </span>
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text style={dueDate}>Due: {item.dueDate}</Text>
                      {item.penalty && (
                        <Text style={penaltyAmount}>
                          Penalty: {formatCurrency(item.penalty)}
                        </Text>
                      )}
                    </Column>
                  </Row>

                  <Text style={itemDescription}>{item.description}</Text>

                  {item.actionRequired && (
                    <Section style={actionRequired}>
                      <Text style={actionRequiredTitle}>Action Required:</Text>
                      <Text style={actionRequiredText}>{item.actionRequired}</Text>
                    </Section>
                  )}
                </Section>
              ))}
            </Section>
          )}

          {/* Upcoming Items */}
          {upcomingItems.length > 0 && (
            <Section style={upcomingSection}>
              <Text style={sectionTitle}>📅 Upcoming Deadlines</Text>

              {upcomingItems.map((item, index) => (
                <Section key={index} style={upcomingItemCard}>
                  <Row>
                    <Column>
                      <Text style={upcomingItemTitle}>{item.title}</Text>
                      <Text style={upcomingItemCategory}>{item.category}</Text>
                      <Text style={upcomingItemDescription}>{item.description}</Text>
                    </Column>
                    <Column align="right">
                      <Text style={upcomingDueDate}>{item.dueDate}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>
          )}

          {/* Action Button */}
          <Section style={buttonSection}>
            <Button style={primaryButton} href={actionUrl}>
              View Compliance Dashboard
            </Button>
            <Text style={buttonSubtext}>
              Access your complete compliance calendar and track all deadlines
            </Text>
          </Section>

          {/* Important Notes */}
          <Section style={importantNotes}>
            <Text style={notesTitle}>📋 Important Reminders</Text>
            <Text style={noteItem}>
              • <strong>Late Filing Penalties:</strong> ROC imposes significant penalties for delayed filings
            </Text>
            <Text style={noteItem}>
              • <strong>Document Preparation:</strong> Ensure all required documents are ready in advance
            </Text>
            <Text style={noteItem}>
              • <strong>Digital Signatures:</strong> Valid DSCs are required for all e-filings
            </Text>
            <Text style={noteItem}>
              • <strong>Professional Support:</strong> Contact us immediately if you need assistance
            </Text>
          </Section>

          {/* Contact Information */}
          <Section style={contactSection}>
            <Text style={contactTitle}>Need Immediate Assistance?</Text>
            <Text style={contactText}>
              Our team is ready to help you meet these deadlines:
            </Text>
            <Row style={contactInfo}>
              <Column align="center">
                <Button style={contactButton} href={`mailto:${companyEmail}`}>
                  📧 Email Us
                </Button>
              </Column>
              <Column align="center">
                <Button style={contactButton} href={`tel:${companyPhone}`}>
                  📞 Call Now
                </Button>
              </Column>
            </Row>
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
              This is an automated compliance reminder. Please ensure all deadlines are met to avoid penalties.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ComplianceReminderEmail

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

const alertBadge = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '700',
  padding: '6px 12px',
  borderRadius: '20px',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em'
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0'
}

const alertHeader = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '32px'
}

const alertTitle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#dc2626',
  margin: '0 0 16px 0'
}

const greeting = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px 0'
}

const alertMessage = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#7f1d1d',
  margin: '0'
}

const urgentSection = {
  marginBottom: '32px'
}

const sectionTitle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 20px 0'
}

const urgentItemCard = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fca5a5',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px'
}

const urgentItemHeader = {
  marginBottom: '12px'
}

const urgentItemTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#7f1d1d',
  margin: '0 0 8px 0'
}

const urgentItemCategory = {
  margin: '0'
}

const dueDate = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#dc2626',
  margin: '0 0 4px 0'
}

const penaltyAmount = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#dc2626',
  margin: '0'
}

const itemDescription = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#374151',
  margin: '0 0 16px 0'
}

const actionRequired = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  padding: '12px'
}

const actionRequiredTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#92400e',
  margin: '0 0 4px 0'
}

const actionRequiredText = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0'
}

const upcomingSection = {
  marginBottom: '32px'
}

const upcomingItemCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '16px',
  marginBottom: '12px'
}

const upcomingItemTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 4px 0'
}

const upcomingItemCategory = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 8px 0'
}

const upcomingItemDescription = {
  fontSize: '14px',
  color: '#4b5563',
  margin: '0'
}

const upcomingDueDate = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#4f46e5',
  margin: '0'
}

const buttonSection = {
  textAlign: 'center' as const,
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
  padding: '14px 28px'
}

const buttonSubtext = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '12px 0 0 0'
}

const importantNotes = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '32px'
}

const notesTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#0c4a6e',
  margin: '0 0 16px 0'
}

const noteItem = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#0c4a6e',
  margin: '0 0 8px 0'
}

const contactSection = {
  textAlign: 'center' as const,
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '32px'
}

const contactTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 12px 0'
}

const contactText = {
  fontSize: '16px',
  color: '#4b5563',
  margin: '0 0 20px 0'
}

const contactInfo = {
  marginTop: '16px'
}

const contactButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #4f46e5',
  borderRadius: '6px',
  color: '#4f46e5',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 20px',
  margin: '0 8px'
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