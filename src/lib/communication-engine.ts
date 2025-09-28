/**
 * Professional Communication Engine with Resend & WhatsApp
 * Optimized for Mrs. Pragnya Pradhan's CS Practice
 * Single-user focus with expansion-ready architecture
 */

import { Resend } from 'resend'
import crypto from 'crypto'

// Mathematical constants from Asymm protocol
const GOLDEN_RATIO = 1.618033988
const RETRY_BASE_DELAY = 1000 // 1 second
const MAX_RETRIES = 5

// Environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-byte-key-for-dev-only!!'

export interface EmailMessage {
  to: string | string[]
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
  replyTo?: string
  tags?: Array<{ name: string; value: string }>
}

export interface WhatsAppMessage {
  to: string
  content: string
  mediaUrl?: string
  templateId?: string
  templateData?: Record<string, any>
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
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced'
  timestamp: Date
  errorReason?: string
  webhookData?: any
}

export interface BulkDeliveryResult {
  total: number
  successful: number
  failed: number
  results: DeliveryResult[]
  failures: Array<{ message: EmailMessage, error: string }>
  totalCost: number
}

// Resend Provider Implementation
class ResendProvider {
  private resend: Resend
  private fromEmail: string
  private fromName: string

  constructor(config: { apiKey: string; fromEmail: string; fromName: string }) {
    this.resend = new Resend(config.apiKey)
    this.fromEmail = config.fromEmail
    this.fromName = config.fromName
  }

  async authenticate(): Promise<boolean> {
    try {
      // Test authentication by making a simple API call
      const domains = await this.resend.domains.list()
      return true
    } catch (error) {
      console.error('Resend authentication failed:', error)
      return false
    }
  }

  async send(message: EmailMessage): Promise<DeliveryResult> {
    try {
      const result = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: Array.isArray(message.to) ? message.to : [message.to],
        cc: message.cc,
        bcc: message.bcc,
        subject: message.subject,
        html: message.htmlContent,
        text: message.textContent,
        reply_to: message.replyTo,
        attachments: message.attachments?.map(att => ({
          filename: att.filename,
          content: att.content
        })),
        tags: message.tags
      })

      return {
        messageId: result.data?.id || crypto.randomUUID(),
        status: 'sent',
        provider: 'resend',
        metadata: result
      }
    } catch (error: any) {
      return {
        messageId: crypto.randomUUID(),
        status: 'failed',
        provider: 'resend',
        error: error.message
      }
    }
  }

  async getStatus(messageId: string): Promise<DeliveryStatus> {
    try {
      // Note: Resend doesn't provide detailed delivery status by default
      // You'd need to implement webhook handlers for detailed tracking
      return {
        messageId,
        status: 'sent', // Assume sent if no error
        timestamp: new Date()
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
}

// WhatsApp Provider Implementation (using Twilio as example)
class TwilioWhatsAppProvider {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(config: { accountSid: string; authToken: string; fromNumber: string }) {
    this.accountSid = config.accountSid
    this.authToken = config.authToken
    this.fromNumber = config.fromNumber
  }

  async authenticate(): Promise<boolean> {
    try {
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

  private mapTwilioStatus(twilioStatus: string): DeliveryStatus['status'] {
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

// Encryption utilities
export class EncryptionService {
  private algorithm = 'aes-256-gcm'
  private key: Buffer

  constructor(encryptionKey: string) {
    this.key = Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32))
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.key.toString('hex'))

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Simple encryption without auth tag for basic cipher
    return `${iv.toString('hex')}:${encrypted}`
  }

  decrypt(encryptedData: string): string {
    const [ivHex, encrypted] = encryptedData.split(':')

    const decipher = crypto.createDecipher(this.algorithm, this.key.toString('hex'))

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  static shouldEncrypt(fieldName: string): boolean {
    const sensitiveFields = ['password', 'apikey', 'secret', 'token', 'authtoken']
    return sensitiveFields.some(field =>
      fieldName.toLowerCase().includes(field.toLowerCase())
    )
  }
}

// Main Communication Engine
export class CommunicationEngine {
  private emailProvider?: ResendProvider
  private whatsappProvider?: TwilioWhatsAppProvider
  private encryption: EncryptionService
  private templates: Map<string, any> = new Map()

  constructor() {
    this.encryption = new EncryptionService(ENCRYPTION_KEY)
  }

  // Provider Configuration
  async configureResend(config: {
    apiKey: string
    fromEmail: string
    fromName: string
  }): Promise<boolean> {
    this.emailProvider = new ResendProvider({
      apiKey: config.apiKey,
      fromEmail: config.fromEmail,
      fromName: config.fromName
    })

    return await this.emailProvider.authenticate()
  }

  async configureWhatsApp(config: {
    accountSid: string
    authToken: string
    fromNumber: string
  }): Promise<boolean> {
    this.whatsappProvider = new TwilioWhatsAppProvider(config)
    return await this.whatsappProvider.authenticate()
  }

  // Message Sending with Golden Ratio Retry Logic
  async sendEmail(message: EmailMessage): Promise<DeliveryResult> {
    if (!this.emailProvider) {
      throw new Error('Email provider not configured. Please configure Resend first.')
    }

    return this.executeWithRetry(() => this.emailProvider!.send(message), 'email')
  }

  async sendWhatsApp(message: WhatsAppMessage): Promise<DeliveryResult> {
    if (!this.whatsappProvider) {
      throw new Error('WhatsApp provider not configured. Please configure Twilio WhatsApp first.')
    }

    return this.executeWithRetry(() => this.whatsappProvider!.send(message), 'whatsapp')
  }

  // Bulk email sending with intelligent batching
  async sendBulkEmails(messages: EmailMessage[], batchSize = 10): Promise<BulkDeliveryResult> {
    const results: DeliveryResult[] = []
    const failures: Array<{ message: EmailMessage, error: string }> = []
    let totalCost = 0

    // Process in batches to respect rate limits
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize)

      const batchPromises = batch.map(async (message) => {
        try {
          const result = await this.sendEmail(message)
          results.push(result)
          if (result.cost) totalCost += result.cost
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
      failures,
      totalCost
    }
  }

  // Template Management
  async saveTemplate(template: {
    name: string
    type: string
    channel: string
    subject?: string
    htmlContent?: string
    textContent: string
    variables: string[]
  }): Promise<string> {
    const templateId = crypto.randomUUID()
    this.templates.set(templateId, { ...template, id: templateId })
    return templateId
  }

  async getTemplate(templateId: string) {
    return this.templates.get(templateId) || null
  }

  async renderTemplate(templateId: string, data: Record<string, any>): Promise<{
    subject: string
    htmlContent: string
    textContent: string
  }> {
    const template = await this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    return {
      subject: this.interpolateString(template.subject || '', data),
      htmlContent: this.interpolateString(template.htmlContent || '', data),
      textContent: this.interpolateString(template.textContent, data)
    }
  }

  // Smart message routing based on customer preferences
  async sendSmartMessage(
    customerId: string,
    messageType: string,
    data: Record<string, any>,
    preferences: {
      emailOptIn: boolean
      whatsappOptIn: boolean
      email?: string
      whatsappNumber?: string
      preferredChannels: Record<string, string[]>
    }
  ): Promise<DeliveryResult[]> {
    const results: DeliveryResult[] = []

    // Send via email if opted in and preferred
    if (preferences.emailOptIn &&
        preferences.email &&
        preferences.preferredChannels[messageType]?.includes('EMAIL')) {

      const emailTemplate = await this.getTemplate(`${messageType}_email`)
      if (emailTemplate) {
        const rendered = await this.renderTemplate(emailTemplate.id!, data)
        const result = await this.sendEmail({
          to: preferences.email,
          subject: rendered.subject,
          htmlContent: rendered.htmlContent,
          textContent: rendered.textContent,
          tags: [
            { name: 'customer_id', value: customerId },
            { name: 'message_type', value: messageType }
          ]
        })
        results.push(result)
      }
    }

    // Send via WhatsApp if opted in and preferred
    if (preferences.whatsappOptIn &&
        preferences.whatsappNumber &&
        preferences.preferredChannels[messageType]?.includes('WHATSAPP')) {

      const whatsappTemplate = await this.getTemplate(`${messageType}_whatsapp`)
      if (whatsappTemplate) {
        const rendered = await this.renderTemplate(whatsappTemplate.id!, data)
        const result = await this.sendWhatsApp({
          to: preferences.whatsappNumber,
          content: rendered.textContent
        })
        results.push(result)
      }
    }

    return results
  }

  // Encryption helpers
  encryptCredentials(credentials: Record<string, string>): Record<string, string> {
    const encrypted: Record<string, string> = {}

    for (const [key, value] of Object.entries(credentials)) {
      if (value && EncryptionService.shouldEncrypt(key)) {
        encrypted[key] = this.encryption.encrypt(value)
      } else {
        encrypted[key] = value
      }
    }

    return encrypted
  }

  decryptCredentials(encrypted: Record<string, string>): Record<string, string> {
    const decrypted: Record<string, string> = {}

    for (const [key, value] of Object.entries(encrypted)) {
      if (value && EncryptionService.shouldEncrypt(key)) {
        try {
          decrypted[key] = this.encryption.decrypt(value)
        } catch (error) {
          console.error(`Failed to decrypt ${key}:`, error)
          decrypted[key] = value // Return as-is if decryption fails
        }
      } else {
        decrypted[key] = value
      }
    }

    return decrypted
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

  private interpolateString(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data)
      return value !== undefined ? String(value) : match
    })
  }
}

// Export singleton instance
export const communicationEngine = new CommunicationEngine()

// Helper functions for React components
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}