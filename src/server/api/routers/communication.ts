/**
 * tRPC Communication Router
 * Type-safe API endpoints for email, WhatsApp, and communication management
 */

import { z } from 'zod'
import { createTRPCRouter, companyProcedure } from '../trpc'
import { communicationEngine } from '@/lib/communication-engine'
import { render } from '@react-email/render'
import InvoiceEmail from '@/emails/invoice-email'
import ComplianceReminderEmail from '@/emails/compliance-reminder'

// Input validation schemas
const configureResendSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  fromEmail: z.string().email('Valid email required'),
  fromName: z.string().min(1, 'From name is required')
})

const configureWhatsAppSchema = z.object({
  provider: z.enum(['TWILIO', 'WHATSAPP_BUSINESS_API']),
  accountSid: z.string().min(1, 'Account SID is required'),
  authToken: z.string().min(1, 'Auth token is required'),
  fromNumber: z.string().min(1, 'Phone number is required')
})

const updateCustomerPreferencesSchema = z.object({
  customerId: z.string(),
  preferences: z.object({
    emailOptIn: z.boolean(),
    whatsappOptIn: z.boolean(),
    smsOptIn: z.boolean().optional(),
    invoiceDelivery: z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
    complianceReminders: z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
    paymentReminders: z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
    reminderFrequency: z.enum(['DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY']),
    quietHoursStart: z.string().optional(),
    quietHoursEnd: z.string().optional(),
    language: z.string().optional(),
    timezone: z.string().optional()
  })
})

const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  templateId: z.string().optional(),
  templateData: z.record(z.any()).optional()
})

const sendBulkEmailSchema = z.object({
  messages: z.array(sendEmailSchema),
  batchSize: z.number().min(1).max(50).default(10)
})

const sendInvoiceSchema = z.object({
  invoiceId: z.string(),
  channels: z.array(z.enum(['EMAIL', 'WHATSAPP'])).min(1),
  customMessage: z.string().optional()
})

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  type: z.enum(['INVOICE', 'PAYMENT_REMINDER', 'COMPLIANCE_REMINDER', 'WELCOME', 'GENERAL_UPDATE']),
  channel: z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
  language: z.string().default('en'),
  subject: z.string().optional(),
  htmlContent: z.string().optional(),
  textContent: z.string().min(1, 'Text content is required'),
  variables: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false)
})

export const communicationRouter = createTRPCRouter({
  // ===== CONFIGURATION ENDPOINTS =====

  configureResend: companyProcedure
    .input(configureResendSchema)
    .mutation(async ({ input, ctx }) => {
      // Test the configuration
      const isValid = await communicationEngine.configureResend(input)

      if (!isValid) {
        throw new Error('Failed to configure Resend. Please check your API key and settings.')
      }

      // Encrypt sensitive data
      const encryptedData = communicationEngine.encryptCredentials({
        apiKey: input.apiKey
      })

      // Save to database
      await ctx.db.companySettings.upsert({
        where: { companyId: ctx.companyId },
        create: {
          companyId: ctx.companyId,
          emailProvider: 'RESEND',
          smtpUser: encryptedData.apiKey,
          fromEmail: input.fromEmail,
          fromName: input.fromName,
          emailEnabled: true
        },
        update: {
          emailProvider: 'RESEND',
          smtpUser: encryptedData.apiKey,
          fromEmail: input.fromEmail,
          fromName: input.fromName,
          emailEnabled: true
        }
      })

      return { success: true, message: 'Resend configured successfully!' }
    }),

  configureWhatsApp: companyProcedure
    .input(configureWhatsAppSchema)
    .mutation(async ({ input, ctx }) => {
      // Test the configuration
      const isValid = await communicationEngine.configureWhatsApp({
        accountSid: input.accountSid,
        authToken: input.authToken,
        fromNumber: input.fromNumber
      })

      if (!isValid) {
        throw new Error('Failed to configure WhatsApp. Please check your credentials.')
      }

      // Encrypt sensitive data
      const encryptedData = communicationEngine.encryptCredentials({
        accountSid: input.accountSid,
        authToken: input.authToken
      })

      // Save to database
      await ctx.db.companySettings.upsert({
        where: { companyId: ctx.companyId },
        create: {
          companyId: ctx.companyId,
          whatsappProvider: input.provider as any,
          whatsappApiKey: encryptedData.accountSid,
          whatsappPhoneId: input.fromNumber,
          whatsappEnabled: true
        },
        update: {
          whatsappProvider: input.provider as any,
          whatsappApiKey: encryptedData.accountSid,
          whatsappPhoneId: input.fromNumber,
          whatsappEnabled: true
        }
      })

      return { success: true, message: 'WhatsApp configured successfully!' }
    }),

  getSettings: companyProcedure
    .query(async ({ ctx }) => {
      const settings = await ctx.db.companySettings.findUnique({
        where: { companyId: ctx.companyId }
      })

      if (!settings) {
        return {
          emailEnabled: false,
          whatsappEnabled: false,
          hasEmailConfig: false,
          hasWhatsAppConfig: false
        }
      }

      return {
        emailEnabled: settings.emailEnabled,
        whatsappEnabled: settings.whatsappEnabled,
        emailProvider: settings.emailProvider,
        fromEmail: settings.fromEmail,
        fromName: settings.fromName,
        whatsappProvider: settings.whatsappProvider,
        whatsappPhoneId: settings.whatsappPhoneId,
        hasEmailConfig: !!settings.smtpUser,
        hasWhatsAppConfig: !!settings.whatsappApiKey,
        autoSendInvoices: settings.autoSendInvoices,
        complianceReminderDays: settings.complianceReminderDays,
        paymentReminderDays: settings.paymentReminderDays
      }
    }),

  // ===== CUSTOMER PREFERENCES =====

  updateCustomerPreferences: companyProcedure
    .input(updateCustomerPreferencesSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify customer belongs to company
      const customer = await ctx.db.customer.findFirst({
        where: {
          id: input.customerId,
          companyId: ctx.companyId
        }
      })

      if (!customer) {
        throw new Error('Customer not found or access denied')
      }

      // Update or create preferences
      const preferences = await ctx.db.communicationPreference.upsert({
        where: { customerId: input.customerId },
        create: {
          customerId: input.customerId,
          ...input.preferences
        },
        update: input.preferences
      })

      return preferences
    }),

  getCustomerPreferences: companyProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const customer = await ctx.db.customer.findFirst({
        where: {
          id: input.customerId,
          companyId: ctx.companyId
        },
        include: {
          communicationPreferences: true
        }
      })

      if (!customer) {
        throw new Error('Customer not found or access denied')
      }

      return {
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          whatsappNumber: customer.whatsappNumber
        },
        preferences: customer.communicationPreferences[0] || null
      }
    }),

  // ===== MESSAGE SENDING =====

  sendEmail: companyProcedure
    .input(sendEmailSchema)
    .mutation(async ({ input, ctx }) => {
      let htmlContent = input.content
      let textContent = input.content

      // If template is specified, render it
      if (input.templateId && input.templateData) {
        const rendered = await communicationEngine.renderTemplate(
          input.templateId,
          input.templateData
        )
        htmlContent = rendered.htmlContent
        textContent = rendered.textContent
      }

      const result = await communicationEngine.sendEmail({
        to: input.to,
        cc: input.cc,
        bcc: input.bcc,
        subject: input.subject,
        htmlContent,
        textContent,
        tags: [
          { name: 'company_id', value: ctx.companyId },
          { name: 'sent_by', value: ctx.companyId }
        ]
      })

      // Log the communication
      await ctx.db.communicationLog.create({
        data: {
          customerId: Array.isArray(input.to) ? 'bulk' : 'single', // Simplified for now
          companyId: ctx.companyId,
          type: input.templateId?.includes('INVOICE') ? 'INVOICE' : 'GENERAL_UPDATE',
          channel: 'EMAIL',
          subject: input.subject,
          content: textContent,
          templateUsed: input.templateId,
          status: result.status === 'sent' ? 'SENT' : 'FAILED',
          providerId: result.messageId,
          providerName: result.provider,
          cost: result.cost,
          metadata: result.metadata,
          errorMessage: result.error
        }
      })

      return result
    }),

  sendBulkEmails: companyProcedure
    .input(sendBulkEmailSchema)
    .mutation(async ({ input, ctx }) => {
      const emailMessages = input.messages.map(msg => ({
        to: Array.isArray(msg.to) ? msg.to[0] : msg.to, // Simplify for bulk
        subject: msg.subject,
        htmlContent: msg.content,
        textContent: msg.content
      }))

      const result = await communicationEngine.sendBulkEmails(
        emailMessages,
        input.batchSize
      )

      // Log bulk operation
      await ctx.db.communicationLog.create({
        data: {
          customerId: 'bulk_operation',
          companyId: ctx.companyId,
          type: 'GENERAL_UPDATE',
          channel: 'EMAIL',
          subject: `Bulk email: ${result.total} messages`,
          content: `Sent: ${result.successful}, Failed: ${result.failed}`,
          status: result.failed === 0 ? 'SENT' : 'PARTIALLY_FAILED',
          cost: result.totalCost,
          metadata: {
            total: result.total,
            successful: result.successful,
            failed: result.failed,
            failures: result.failures.slice(0, 10).map(f => ({
              to: f.message.to,
              subject: f.message.subject,
              error: f.error
            }))
          }
        }
      })

      return result
    }),

  sendInvoice: companyProcedure
    .input(sendInvoiceSchema)
    .mutation(async ({ input, ctx }) => {
      // Get invoice with customer details
      const invoice = await ctx.db.invoice.findFirst({
        where: {
          id: input.invoiceId,
          companyId: ctx.companyId
        },
        include: {
          customer: {
            include: {
              communicationPreferences: true
            }
          },
          company: true,
          lines: {
            include: {
              serviceTemplate: true
            }
          }
        }
      })

      if (!invoice) {
        throw new Error('Invoice not found or access denied')
      }

      const results = []

      // Send via Email
      if (input.channels.includes('EMAIL') && invoice.customer.email) {
        const emailHtml = await render(InvoiceEmail({
          invoiceNumber: invoice.number,
          customerName: invoice.customer.name,
          companyName: invoice.company.name,
          amount: invoice.grandTotal,
          dueDate: invoice.dueDate?.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) || 'On Receipt',
          companyEmail: invoice.company.email,
          companyPhone: invoice.company.phone || undefined,
          services: invoice.lines.map(line => ({
            description: line.description,
            amount: line.amount
          }))
        }))

        const emailResult = await communicationEngine.sendEmail({
          to: invoice.customer.email,
          subject: `Invoice ${invoice.number} from ${invoice.company.name}`,
          htmlContent: emailHtml,
          textContent: `Invoice ${invoice.number} for ${invoice.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`,
          tags: [
            { name: 'invoice_id', value: invoice.id },
            { name: 'customer_id', value: invoice.customer.id }
          ]
        })

        results.push({ channel: 'EMAIL', result: emailResult })

        // Log communication
        await ctx.db.communicationLog.create({
          data: {
            customerId: invoice.customer.id,
            companyId: ctx.companyId,
            type: 'INVOICE',
            channel: 'EMAIL',
            subject: `Invoice ${invoice.number}`,
            content: `Invoice for ${invoice.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`,
            status: emailResult.status === 'sent' ? 'SENT' : 'FAILED',
            providerId: emailResult.messageId,
            providerName: emailResult.provider,
            errorMessage: emailResult.error
          }
        })
      }

      // Send via WhatsApp
      if (input.channels.includes('WHATSAPP') && invoice.customer.whatsappNumber) {
        const whatsappMessage = `
🧾 *Invoice from ${invoice.company.name}*

Dear ${invoice.customer.name},

Invoice: *${invoice.number}*
Amount: *${invoice.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}*
Due Date: ${invoice.dueDate?.toLocaleDateString('en-IN') || 'On Receipt'}

${input.customMessage || 'Thank you for your business!'}

For questions, contact: ${invoice.company.email}
        `.trim()

        const whatsappResult = await communicationEngine.sendWhatsApp({
          to: invoice.customer.whatsappNumber,
          content: whatsappMessage
        })

        results.push({ channel: 'WHATSAPP', result: whatsappResult })

        // Log communication
        await ctx.db.communicationLog.create({
          data: {
            customerId: invoice.customer.id,
            companyId: ctx.companyId,
            type: 'INVOICE',
            channel: 'WHATSAPP',
            content: whatsappMessage,
            status: whatsappResult.status === 'sent' ? 'SENT' : 'FAILED',
            providerId: whatsappResult.messageId,
            providerName: whatsappResult.provider,
            cost: whatsappResult.cost,
            errorMessage: whatsappResult.error
          }
        })
      }

      return {
        success: results.length > 0,
        results,
        message: `Invoice sent via ${results.map(r => r.channel).join(' and ')}`
      }
    }),

  // ===== TEMPLATES =====

  createTemplate: companyProcedure
    .input(createTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      const template = await ctx.db.messageTemplate.create({
        data: {
          companyId: ctx.companyId,
          ...input
        }
      })

      return template
    }),

  getTemplates: companyProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.messageTemplate.findMany({
        where: { companyId: ctx.companyId },
        orderBy: [
          { isDefault: 'desc' },
          { type: 'asc' },
          { createdAt: 'desc' }
        ]
      })
    }),

  // ===== ANALYTICS =====

  getCommunicationStats: companyProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ input, ctx }) => {
      const whereClause = {
        companyId: ctx.companyId,
        ...(input.startDate && input.endDate && {
          createdAt: {
            gte: input.startDate,
            lte: input.endDate
          }
        })
      }

      const [
        totalMessages,
        emailMessages,
        whatsappMessages,
        deliveredMessages,
        failedMessages,
        totalCost
      ] = await Promise.all([
        ctx.db.communicationLog.count({ where: whereClause }),
        ctx.db.communicationLog.count({ where: { ...whereClause, channel: 'EMAIL' } }),
        ctx.db.communicationLog.count({ where: { ...whereClause, channel: 'WHATSAPP' } }),
        ctx.db.communicationLog.count({ where: { ...whereClause, status: 'DELIVERED' } }),
        ctx.db.communicationLog.count({ where: { ...whereClause, status: 'FAILED' } }),
        ctx.db.communicationLog.aggregate({
          where: whereClause,
          _sum: { cost: true }
        })
      ])

      const recentMessages = await ctx.db.communicationLog.findMany({
        where: whereClause,
        include: {
          customer: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      return {
        totalMessages,
        emailMessages,
        whatsappMessages,
        deliveredMessages,
        failedMessages,
        totalCost: totalCost._sum.cost || 0,
        deliveryRate: totalMessages > 0 ? (deliveredMessages / totalMessages) * 100 : 0,
        recentMessages
      }
    }),

  // ===== TESTING =====

  testConfiguration: companyProcedure
    .mutation(async ({ ctx }) => {
      const settings = await ctx.db.companySettings.findUnique({
        where: { companyId: ctx.companyId }
      })

      if (!settings) {
        throw new Error('No communication settings found. Please configure first.')
      }

      const results = {
        email: false,
        whatsapp: false,
        errors: [] as string[]
      }

      // Test email configuration
      if (settings.emailEnabled && settings.smtpUser) {
        try {
          const decrypted = communicationEngine.decryptCredentials({
            apiKey: settings.smtpUser!
          })

          const emailValid = await communicationEngine.configureResend({
            apiKey: decrypted.apiKey,
            fromEmail: settings.fromEmail!,
            fromName: settings.fromName!
          })

          results.email = emailValid
          if (!emailValid) results.errors.push('Email configuration invalid')
        } catch (error: any) {
          results.errors.push(`Email test failed: ${error.message}`)
        }
      }

      // Test WhatsApp configuration
      if (settings.whatsappEnabled && settings.whatsappApiKey) {
        try {
          const decrypted = communicationEngine.decryptCredentials({
            accountSid: settings.whatsappApiKey!,
            authToken: settings.whatsappApiKey! // In real implementation, store separately
          })

          const whatsappValid = await communicationEngine.configureWhatsApp({
            accountSid: decrypted.accountSid,
            authToken: decrypted.authToken,
            fromNumber: settings.whatsappPhoneId!
          })

          results.whatsapp = whatsappValid
          if (!whatsappValid) results.errors.push('WhatsApp configuration invalid')
        } catch (error: any) {
          results.errors.push(`WhatsApp test failed: ${error.message}`)
        }
      }

      return results
    })
})