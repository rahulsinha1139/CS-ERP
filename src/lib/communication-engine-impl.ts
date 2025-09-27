/**
 * Communication Engine Implementation
 * Handles email, WhatsApp, and SMS with provider abstraction and mathematical optimization
 */

import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Mathematical constants from Asymm protocol
const GOLDEN_RATIO = 1.618033988
const RETRY_BASE_DELAY = 1000 // 1 second
const MAX_RETRIES = 5

export interface CommunicationProvider {
  id: string
  name: string
  type: 'email' | 'whatsapp' | 'sms'
  authenticate(): Promise<boolean>
  send(message: any): Promise<DeliveryResult>
  getStatus(messageId: string): Promise<DeliveryStatus>
}

export interface DeliveryResult {
  messageId: string
  status: 'sent' | 'failed'
  provider: string
  cost?: number
  metadata?: any
  error?: string
}

export interface DeliveryStatus {
  messageId: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: Date
  errorReason?: string
}

// Email Provider Implementation
class SMTPProvider implements CommunicationProvider {
  id = 'smtp'
  name = 'SMTP Email'
  type = 'email' as const

  private transporter: nodemailer.Transporter
  private config: SMTPConfig

  constructor(config: SMTPConfig) {
    this.config = config
    this.transporter = nodemailer.createTransport({
      host: config.host || this.getDefaultHost(config.email),
      port: config.port || 587,
      secure: false,
      auth: {
        user: config.username,
        pass: config.password
      },
      tls: { rejectUnauthorized: false }
    })
  }

  async authenticate(): Promise<boolean> {
    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('SMTP Authentication failed:', error)
      return false
    }
  }

  async send(message: EmailMessage): Promise<DeliveryResult> {
    try {
      const result = await this.transporter.sendMail({
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        subject: message.subject,
        html: message.htmlContent,
        text: message.textContent,
        attachments: message.attachments?.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType
        }))
      })

      return {
        messageId: result.messageId,
        status: 'sent',
        provider: 'smtp',
        metadata: { response: result.response }
      }
    } catch (error: any) {
      return {
        messageId: crypto.randomUUID(),
        status: 'failed',
        provider: 'smtp',
        error: error.message
      }
    }
  }

  async getStatus(messageId: string): Promise<DeliveryStatus> {
    // SMTP doesn't provide delivery status tracking
    // Would need to implement webhook handling for advanced tracking
    return {
      messageId,
      status: 'sent', // Assume sent if no error
      timestamp: new Date()
    }
  }

  private getDefaultHost(email: string): string {
    if (email.includes('@gmail.com')) return 'smtp.gmail.com'
    if (email.includes('@outlook.com') || email.includes('@hotmail.com')) return 'smtp-mail.outlook.com'
    if (email.includes('@yahoo.com')) return 'smtp.mail.yahoo.com'
    return 'localhost' // fallback
  }
}

// WhatsApp Provider Implementation (using Twilio as example)
class TwilioWhatsAppProvider implements CommunicationProvider {
  id = 'twilio-whatsapp'
  name = 'Twilio WhatsApp'
  type = 'whatsapp' as const

  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(config: TwilioConfig) {
    this.accountSid = config.accountSid
    this.authToken = config.authToken
    this.fromNumber = config.fromNumber
  }

  async authenticate(): Promise<boolean> {
    try {
      // Test authentication by fetching account details
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`,
        {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
          }
        }
      )
      return response.ok
    } catch (error) {
      console.error('Twilio Authentication failed:', error)
      return false
    }
  }

  async send(message: WhatsAppMessage): Promise<DeliveryResult> {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: `whatsapp:${this.fromNumber}`,
            To: `whatsapp:${message.to}`,
            Body: message.content,
            ...(message.mediaUrl && { MediaUrl: message.mediaUrl })
          })
        }
      )

      const result = await response.json()

      if (response.ok) {
        return {
          messageId: result.sid,
          status: 'sent',
          provider: 'twilio-whatsapp',
          cost: parseFloat(result.price || '0'),
          metadata: result
        }
      } else {
        return {
          messageId: crypto.randomUUID(),
          status: 'failed',
          provider: 'twilio-whatsapp',
          error: result.message
        }
      }
    } catch (error: any) {
      return {
        messageId: crypto.randomUUID(),
        status: 'failed',
        provider: 'twilio-whatsapp',
        error: error.message
      }
    }
  }

  async getStatus(messageId: string): Promise<DeliveryStatus> {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages/${messageId}.json`,
        {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
          }
        }
      )

      if (response.ok) {
        const result = await response.json()
        return {
          messageId,
          status: this.mapTwilioStatus(result.status),
          timestamp: new Date(result.date_updated),
          errorReason: result.error_message
        }
      }

      return {
        messageId,
        status: 'failed',
        timestamp: new Date(),
        errorReason: 'Failed to fetch status'
      }
    } catch (error) {
      return {
        messageId,
        status: 'failed',
        timestamp: new Date(),
        errorReason: 'Status check failed'
      }
    }
  }

  private mapTwilioStatus(twilioStatus: string): 'pending' | 'sent' | 'delivered' | 'read' | 'failed' {
    switch (twilioStatus) {
      case 'queued':
      case 'sending': return 'pending'
      case 'sent': return 'sent'
      case 'delivered': return 'delivered'
      case 'read': return 'read'
      case 'failed':
      case 'undelivered': return 'failed'
      default: return 'pending'
    }
  }
}

// Main Communication Engine
export class CommunicationEngine {
  private emailProvider?: CommunicationProvider
  private whatsappProvider?: CommunicationProvider
  private templates: Map<string, MessageTemplate> = new Map()

  // Provider Management
  async configureEmailProvider(config: EmailProviderConfig): Promise<boolean> {
    switch (config.type) {
      case 'SMTP':
        this.emailProvider = new SMTPProvider(config as unknown as SMTPConfig)
        break
      case 'SENDGRID':
        // this.emailProvider = new SendGridProvider(config as SendGridConfig)
        throw new Error('SendGrid provider not implemented yet')
      case 'RESEND':
        // this.emailProvider = new ResendProvider(config as ResendConfig)
        throw new Error('Resend provider not implemented yet')
      default:
        throw new Error(`Unsupported email provider: ${config.type}`)
    }

    return await this.emailProvider.authenticate()
  }

  async configureWhatsAppProvider(config: WhatsAppProviderConfig): Promise<boolean> {
    switch (config.type) {
      case 'TWILIO':
        this.whatsappProvider = new TwilioWhatsAppProvider(config as unknown as TwilioConfig)
        break
      case 'WHATSAPP_BUSINESS_API':
        // Direct WhatsApp Business API implementation
        throw new Error('WhatsApp Business API provider not implemented yet')
      default:
        throw new Error(`Unsupported WhatsApp provider: ${config.type}`)
    }

    return await this.whatsappProvider.authenticate()
  }

  // Message Sending with Retry Logic (Golden Ratio Backoff)
  async sendEmail(message: EmailMessage): Promise<DeliveryResult> {
    if (!this.emailProvider) {
      throw new Error('Email provider not configured')
    }

    return this.executeWithRetry(() => this.emailProvider!.send(message), 'email')
  }

  async sendWhatsApp(message: WhatsAppMessage): Promise<DeliveryResult> {
    if (!this.whatsappProvider) {
      throw new Error('WhatsApp provider not configured')
    }

    return this.executeWithRetry(() => this.whatsappProvider!.send(message), 'whatsapp')
  }

  // Bulk sending with intelligent batching
  async sendBulkEmails(messages: EmailMessage[], batchSize = 10): Promise<BulkDeliveryResult> {
    const results: DeliveryResult[] = []
    const failures: Array<{ message: EmailMessage, error: string }> = []

    // Process in batches to avoid rate limits
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize)

      const batchPromises = batch.map(async (message) => {
        try {
          const result = await this.sendEmail(message)
          results.push(result)
          return result
        } catch (error: any) {
          failures.push({ message, error: error.message })
          return null
        }
      })

      await Promise.allSettled(batchPromises)

      // Golden ratio delay between batches
      if (i + batchSize < messages.length) {
        await this.sleep(RETRY_BASE_DELAY * GOLDEN_RATIO)
      }
    }

    return {
      total: messages.length,
      successful: results.filter(r => r.status === 'sent').length,
      failed: failures.length,
      results,
      failures
    }
  }

  // Template Management
  async createTemplate(template: MessageTemplate): Promise<string> {
    const templateId = crypto.randomUUID()
    this.templates.set(templateId, { ...template, id: templateId })
    return templateId
  }

  async getTemplate(templateId: string): Promise<MessageTemplate | null> {
    return this.templates.get(templateId) || null
  }

  async renderTemplate(templateId: string, data: any): Promise<RenderedTemplate> {
    const template = await this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    return {
      subject: this.interpolateString(template.subject, data),
      htmlContent: this.interpolateString(template.htmlContent, data),
      textContent: this.interpolateString(template.textContent || '', data)
    }
  }

  // Smart message routing based on customer preferences
  async sendSmartMessage(customerId: string, messageType: MessageType, data: any): Promise<DeliveryResult[]> {
    // This would integrate with the database to get customer preferences
    // For now, showing the logic structure

    const preferences = await this.getCustomerPreferences(customerId)
    const results: DeliveryResult[] = []

    if (preferences.emailOptIn && preferences.preferredChannels[messageType].includes('EMAIL')) {
      const emailTemplate = await this.getTemplate(`${messageType}_email`)
      if (emailTemplate) {
        const rendered = await this.renderTemplate(emailTemplate.id!, data)
        const result = await this.sendEmail({
          to: preferences.email,
          subject: rendered.subject,
          htmlContent: rendered.htmlContent,
          textContent: rendered.textContent
        })
        results.push(result)
      }
    }

    if (preferences.whatsappOptIn && preferences.preferredChannels[messageType].includes('WHATSAPP')) {
      const whatsappTemplate = await this.getTemplate(`${messageType}_whatsapp`)
      if (whatsappTemplate) {
        const rendered = await this.renderTemplate(whatsappTemplate.id!, data)
        const result = await this.sendWhatsApp({
          to: preferences.whatsappNumber || '',
          content: rendered.textContent
        })
        results.push(result)
      }
    }

    return results
  }

  // Private helper methods
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.warn(`${context} attempt ${attempt + 1} failed:`, error)

        if (attempt < MAX_RETRIES - 1) {
          // Golden ratio exponential backoff
          const delay = RETRY_BASE_DELAY * Math.pow(GOLDEN_RATIO, attempt)
          console.log(`Retrying in ${delay}ms...`)
          await this.sleep(delay)
        }
      }
    }

    throw new Error(`${context} failed after ${MAX_RETRIES} attempts: ${lastError!.message}`)
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private interpolateString(template: string, data: any): string {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data)
      return value !== undefined ? String(value) : match
    })
  }

  private async getCustomerPreferences(customerId: string): Promise<CustomerPreferences> {
    // This would query the database
    // Placeholder implementation
    return {
      email: 'customer@example.com',
      whatsappNumber: '+919876543210',
      emailOptIn: true,
      whatsappOptIn: true,
      preferredChannels: {
        INVOICE: ['EMAIL'],
        COMPLIANCE_REMINDER: ['WHATSAPP'],
        PAYMENT_REMINDER: ['EMAIL', 'WHATSAPP'],
        GENERAL_UPDATE: ['EMAIL']
      }
    }
  }
}

// Type definitions
interface SMTPConfig {
  email: string
  username: string
  password: string
  host?: string
  port?: number
  fromEmail: string
  fromName: string
}

interface TwilioConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

interface EmailProviderConfig {
  type: 'SMTP' | 'SENDGRID' | 'RESEND'
  [key: string]: any
}

interface WhatsAppProviderConfig {
  type: 'TWILIO' | 'WHATSAPP_BUSINESS_API'
  [key: string]: any
}

interface EmailMessage {
  to: string
  cc?: string[]
  bcc?: string[]
  subject: string
  htmlContent: string
  textContent?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

interface WhatsAppMessage {
  to: string
  content: string
  mediaUrl?: string
}

interface MessageTemplate {
  id?: string
  name: string
  type: MessageType
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
}

interface RenderedTemplate {
  subject: string
  htmlContent: string
  textContent: string
}

interface BulkDeliveryResult {
  total: number
  successful: number
  failed: number
  results: DeliveryResult[]
  failures: Array<{ message: EmailMessage, error: string }>
}

interface CustomerPreferences {
  email: string
  whatsappNumber?: string
  emailOptIn: boolean
  whatsappOptIn: boolean
  preferredChannels: Record<MessageType, string[]>
}

type MessageType = 'INVOICE' | 'COMPLIANCE_REMINDER' | 'PAYMENT_REMINDER' | 'GENERAL_UPDATE'

// Export singleton instance
export const communicationEngine = new CommunicationEngine()