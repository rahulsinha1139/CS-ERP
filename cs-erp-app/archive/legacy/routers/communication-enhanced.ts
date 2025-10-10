/**
 * Enhanced Communication Router for CS ERP
 * Integrates enhanced PDF generation, professional email templates, and WhatsApp
 * Following Asymm optimization patterns
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, companyProcedure } from "../trpc";
import { db } from "../../db";

// Import enhanced engines
import { pdfEngine, type InvoicePDFData } from "../../../lib/pdf-engine";
import { communicationEngine } from "../../../lib/communication-engine";
import { emailEngine } from "../../../lib/email-engine";

// Email rendering
import { render } from '@react-email/render';
import InvoiceProfessionalEmail from '../../../emails/invoice-professional';

// Input validation schemas
const sendInvoiceEmailSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  customEmail: z.string().email().optional(),
  includePaymentLink: z.boolean().default(false),
  customMessage: z.string().optional(),
  ccEmails: z.array(z.string().email()).optional(),
  scheduledFor: z.date().optional(),
});

const bulkSendInvoicesSchema = z.object({
  invoiceIds: z.array(z.string()).min(1, "At least one invoice ID required"),
  customMessage: z.string().optional(),
  includePaymentLinks: z.boolean().default(false),
  batchSize: z.number().min(1).max(50).default(10),
});

const testCommunicationSchema = z.object({
  type: z.enum(['email', 'whatsapp']),
  testData: z.object({
    to: z.string(),
    subject: z.string().optional(),
    content: z.string(),
  }),
});

const setupCommunicationSchema = z.object({
  emailConfig: z.object({
    provider: z.enum(['RESEND', 'SMTP']),
    apiKey: z.string().optional(),
    fromEmail: z.string().email(),
    fromName: z.string(),
    smtpHost: z.string().optional(),
    smtpPort: z.number().optional(),
    smtpUser: z.string().optional(),
    smtpPassword: z.string().optional(),
  }).optional(),
  whatsappConfig: z.object({
    provider: z.enum(['TWILIO']),
    accountSid: z.string(),
    authToken: z.string(),
    fromNumber: z.string(),
  }).optional(),
});

const messageTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  type: z.enum(['INVOICE', 'PAYMENT_REMINDER', 'COMPLIANCE_REMINDER', 'WELCOME', 'GENERAL_UPDATE']),
  channel: z.enum(['EMAIL', 'WHATSAPP']),
  language: z.string().default('en'),
  subject: z.string().optional(),
  htmlContent: z.string().optional(),
  textContent: z.string(),
  variables: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
});

export const enhancedCommunicationRouter = createTRPCRouter({
  // Enhanced invoice email sending
  sendInvoiceEmail: companyProcedure
    .input(sendInvoiceEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { invoiceId, customEmail, includePaymentLink, customMessage, ccEmails, scheduledFor } = input;

      try {
        // Fetch invoice with all related data
        const invoice = await db.invoice.findUnique({
          where: { id: invoiceId, companyId },
          include: {
            company: true,
            customer: {
              include: {
                communicationPreferences: true,
              }
            },
            lines: {
              include: {
                serviceTemplate: true,
              }
            },
            payments: true,
          },
        });

        if (!invoice) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invoice not found',
          });
        }

        // Determine recipient email
        const recipientEmail = customEmail || invoice.customer.email;
        if (!recipientEmail) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No email address available for customer',
          });
        }

        // Check communication preferences
        const preferences = invoice.customer.communicationPreferences?.[0];
        if (preferences && !preferences.emailOptIn) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Customer has opted out of email communications',
          });
        }

        // Prepare enhanced PDF data
        const pdfData: InvoicePDFData = {
          company: {
            name: invoice.company.name,
            gstin: invoice.company.gstin || undefined,
            address: invoice.company.address || '',
            email: invoice.company.email,
            phone: invoice.company.phone || undefined,
          },
          customer: {
            name: invoice.customer.name,
            gstin: invoice.customer.gstin || undefined,
            address: invoice.customer.address || '',
            email: invoice.customer.email || undefined,
            phone: invoice.customer.phone || undefined,
            stateCode: invoice.customer.stateCode || undefined,
          },
          invoice: {
            number: invoice.number,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate || undefined,
            placeOfSupply: invoice.placeOfSupply || undefined,
            notes: customMessage || invoice.notes || undefined,
            terms: invoice.terms || "Payment due within 30 days of invoice date",
            paymentInstructions: includePaymentLink
              ? "Click the payment link in the email to pay instantly"
              : undefined,
          },
          lineItems: invoice.lines.map(line => ({
            description: line.description,
            quantity: line.quantity,
            rate: line.rate,
            taxableValue: line.amount,
            cgst: line.gstRate === 0 ? 0 : (line.amount * line.gstRate) / 200, // Assuming CGST = GST/2
            sgst: line.gstRate === 0 ? 0 : (line.amount * line.gstRate) / 200, // Assuming SGST = GST/2
            igst: 0, // Calculate based on interstate logic
            lineTotal: line.amount * (1 + line.gstRate / 100),
            gstRate: line.gstRate,
            hsnSac: line.hsnSac || undefined,
            isReimbursement: line.isReimbursement,
          })),
          totals: {
            subtotal: invoice.subtotal,
            taxableValue: invoice.subtotal,
            cgstAmount: invoice.cgstAmount,
            sgstAmount: invoice.sgstAmount,
            igstAmount: invoice.igstAmount,
            totalTax: invoice.totalTax,
            grandTotal: invoice.grandTotal,
            isInterstate: invoice.igstAmount > 0,
            // amountInWords: // Removed - not available in basic engine
          },
          branding: {
            primaryColor: '#1e40af',
            accentColor: '#059669',
            showWatermark: true,
          },
        };

        // Generate enhanced PDF
        const pdfBuffer = await pdfEngine.generatePDFBuffer(pdfData);

        // Prepare professional email template data
        const emailProps = {
          customerName: invoice.customer.name,
          customerEmail: recipientEmail,
          companyName: invoice.company.name,
          companyEmail: invoice.company.email,
          companyPhone: invoice.company.phone || undefined,
          companyWebsite: invoice.company.website || undefined,
          invoiceNumber: invoice.number,
          invoiceDate: invoice.issueDate.toLocaleDateString('en-IN'),
          dueDate: invoice.dueDate?.toLocaleDateString('en-IN'),
          amount: invoice.grandTotal,
          currency: 'INR',
          paymentInstructions: includePaymentLink
            ? "Please use the payment link above for instant payment"
            : "Please refer to the invoice for payment instructions",
          services: invoice.lines.map(line => ({
            description: line.description,
            amount: line.amount * (1 + line.gstRate / 100),
          })),
          notes: customMessage,
          attachmentName: `Invoice-${invoice.number}.pdf`,
          showPoweredBy: true,
        };

        // Render professional email
        const emailHtml = await render(InvoiceProfessionalEmail(emailProps));
        const emailText = `Invoice ${invoice.number} from ${invoice.company.name}

Dear ${invoice.customer.name},

Please find attached your invoice for ${new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(invoice.grandTotal)}.

Invoice Details:
- Invoice Number: ${invoice.number}
- Date: ${invoice.issueDate.toLocaleDateString('en-IN')}
- Amount: ${new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(invoice.grandTotal)}

${customMessage ? `\nAdditional Notes:\n${customMessage}\n` : ''}

Thank you for your business!

Best regards,
${invoice.company.name}`;

        // Send email using enhanced email engine
        const result = await emailEngine.sendEmail({
          to: recipientEmail,
          cc: ccEmails,
          subject: `Invoice ${invoice.number} from ${invoice.company.name}`,
          html: emailHtml,
          text: emailText,
          attachments: [
            {
              filename: `Invoice-${invoice.number}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
          tags: [
            { name: 'type', value: 'invoice' },
            { name: 'invoice_id', value: invoiceId },
            { name: 'company_id', value: companyId },
          ],
        });

        // Log communication in database
        await db.communicationLog.create({
          data: {
            customerId: invoice.customerId,
            companyId,
            type: 'INVOICE',
            channel: 'EMAIL',
            subject: `Invoice ${invoice.number}`,
            content: emailText,
            status: result.success ? 'SENT' : 'FAILED',
            providerId: result.messageId || undefined,
            sentAt: result.success ? result.deliveredAt : undefined,
            errorMessage: result.error || undefined,
            retryCount: result.retryCount,
            providerName: 'resend',
            cost: 0, // Update based on provider pricing
            metadata: {
              attachmentSize: pdfBuffer.length,
              templateUsed: 'invoice-professional',
              includePaymentLink,
              customMessage: !!customMessage,
            },
          },
        });

        // Update invoice status if it was in draft
        if (invoice.status === 'DRAFT') {
          await db.invoice.update({
            where: { id: invoiceId },
            data: { status: 'SENT' },
          });
        }

        return {
          success: result.success,
          messageId: result.messageId,
          deliveredAt: result.deliveredAt,
          error: result.error,
        };

      } catch (error) {
        console.error('Enhanced invoice email sending failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to send invoice email',
        });
      }
    }),

  // Bulk send enhanced invoices
  bulkSendInvoices: companyProcedure
    .input(bulkSendInvoicesSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { invoiceIds, customMessage, includePaymentLinks, batchSize } = input;

      try {
        // Fetch all invoices
        const invoices = await db.invoice.findMany({
          where: {
            id: { in: invoiceIds },
            companyId,
            customer: {
              email: { not: null }
            }
          },
          include: {
            company: true,
            customer: {
              include: {
                communicationPreferences: true,
              }
            },
            lines: {
              include: {
                serviceTemplate: true,
              }
            },
          },
        });

        if (invoices.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No valid invoices found for bulk sending',
          });
        }

        const results: Array<{invoiceId: string; invoiceNumber: string; customerEmail: string | null; success: boolean; messageId?: string}> = [];
        const failures: Array<{invoiceId: string; invoiceNumber: string; customerEmail: string | null; error: string}> = [];

        // Process in batches
        for (let i = 0; i < invoices.length; i += batchSize) {
          const batch = invoices.slice(i, i + batchSize);

          const batchPromises = batch.map(async (invoice) => {
            try {
              // Check communication preferences
              const preferences = invoice.customer.communicationPreferences?.[0];
              if (preferences && !preferences.emailOptIn) {
                throw new Error('Customer has opted out of email communications');
              }

              // Use the single invoice sending logic
              const result = await enhancedCommunicationRouter
                .createCaller(ctx)
                .sendInvoiceEmail({
                  invoiceId: invoice.id,
                  customMessage,
                  includePaymentLink: includePaymentLinks,
                });

              results.push({
                invoiceId: invoice.id,
                invoiceNumber: invoice.number,
                customerEmail: invoice.customer.email,
                success: result.success,
                messageId: result.messageId,
              });

            } catch (error) {
              failures.push({
                invoiceId: invoice.id,
                invoiceNumber: invoice.number,
                customerEmail: invoice.customer.email,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          });

          await Promise.allSettled(batchPromises);

          // Small delay between batches
          if (i + batchSize < invoices.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        return {
          total: invoices.length,
          successful: results.filter(r => r.success).length,
          failed: failures.length,
          results,
          failures,
        };

      } catch (error) {
        console.error('Bulk invoice sending failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to send bulk invoices',
        });
      }
    }),

  // Test communication setup
  testCommunication: companyProcedure
    .input(testCommunicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { type, testData } = input;

      try {
        // Get company settings
        const settings = await db.companySettings.findUnique({
          where: { companyId },
        });

        if (!settings) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Communication settings not configured',
          });
        }

        if (type === 'email') {
          if (!settings.emailEnabled) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Email not enabled in settings',
            });
          }

          const result = await emailEngine.sendEmail({
            to: testData.to,
            subject: testData.subject || 'Test Email from CS ERP',
            html: `<p>${testData.content}</p>`,
            text: testData.content,
            tags: [
              { name: 'type', value: 'test' },
              { name: 'company_id', value: companyId },
            ],
          });

          return {
            success: result.success,
            messageId: result.messageId,
            error: result.error,
          };

        } else if (type === 'whatsapp') {
          if (!settings.whatsappEnabled) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'WhatsApp not enabled in settings',
            });
          }

          const result = await communicationEngine.sendWhatsApp({
            to: testData.to,
            content: testData.content,
          });

          return {
            success: result.status === 'sent',
            messageId: result.messageId,
            error: result.error,
          };
        }

      } catch (error) {
        console.error('Communication test failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Communication test failed',
        });
      }
    }),

  // Enhanced communication setup
  setupCommunication: companyProcedure
    .input(setupCommunicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { emailConfig, whatsappConfig } = input;

      try {
        const updateData: any = {};

        // Configure email
        if (emailConfig) {
          if (emailConfig.provider === 'RESEND' && emailConfig.apiKey) {
            const success = await communicationEngine.configureResend({
              apiKey: emailConfig.apiKey,
              fromEmail: emailConfig.fromEmail,
              fromName: emailConfig.fromName,
            });

            if (!success) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Failed to authenticate with Resend',
              });
            }

            updateData.emailProvider = 'RESEND';
            updateData.fromEmail = emailConfig.fromEmail;
            updateData.fromName = emailConfig.fromName;
            updateData.emailEnabled = true;

            // Encrypt sensitive data
            const encryptedCredentials = communicationEngine.encryptCredentials({
              apiKey: emailConfig.apiKey,
            });
            updateData.smtpPassword = encryptedCredentials.apiKey;
          }
        }

        // Configure WhatsApp
        if (whatsappConfig) {
          const success = await communicationEngine.configureWhatsApp({
            accountSid: whatsappConfig.accountSid,
            authToken: whatsappConfig.authToken,
            fromNumber: whatsappConfig.fromNumber,
          });

          if (!success) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Failed to authenticate with Twilio WhatsApp',
            });
          }

          updateData.whatsappProvider = 'TWILIO';
          updateData.whatsappPhoneId = whatsappConfig.fromNumber;
          updateData.whatsappEnabled = true;

          // Encrypt sensitive data
          const encryptedCredentials = communicationEngine.encryptCredentials({
            accountSid: whatsappConfig.accountSid,
            authToken: whatsappConfig.authToken,
          });
          updateData.whatsappApiKey = encryptedCredentials.authToken;
        }

        // Update or create company settings
        await db.companySettings.upsert({
          where: { companyId },
          update: updateData,
          create: {
            companyId,
            ...updateData,
          },
        });

        return {
          success: true,
          emailConfigured: !!emailConfig,
          whatsappConfigured: !!whatsappConfig,
        };

      } catch (error) {
        console.error('Communication setup failed:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to setup communication',
        });
      }
    }),

  // Enhanced communication analytics
  getCommunicationAnalytics: companyProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      channel: z.enum(['EMAIL', 'WHATSAPP']).optional(),
      messageType: z.enum(['INVOICE', 'PAYMENT_REMINDER', 'COMPLIANCE_REMINDER']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { companyId } = ctx;
      const { startDate, endDate, channel, messageType } = input;

      try {
        const whereClause: any = { companyId };

        if (startDate && endDate) {
          whereClause.createdAt = {
            gte: startDate,
            lte: endDate,
          };
        }

        if (channel) whereClause.channel = channel;
        if (messageType) whereClause.type = messageType;

        // Get communication logs with analytics
        const logs = await db.communicationLog.findMany({
          where: whereClause,
          include: {
            customer: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
        });

        // Calculate analytics
        const totalMessages = logs.length;
        const successfulMessages = logs.filter(log => log.status === 'SENT').length;
        const failedMessages = logs.filter(log => log.status === 'FAILED').length;
        const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);

        const deliveryRate = totalMessages > 0 ? (successfulMessages / totalMessages) * 100 : 0;

        // Channel distribution
        const channelDistribution = logs.reduce((acc, log) => {
          acc[log.channel] = (acc[log.channel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Message type distribution
        const typeDistribution = logs.reduce((acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Monthly trends (last 12 months)
        const monthlyData = await db.$queryRaw<any[]>`
          SELECT
            DATE_TRUNC('month', "createdAt") as month,
            COUNT(*) as total_messages,
            COUNT(CASE WHEN status = 'SENT' THEN 1 END) as successful_messages,
            SUM(COALESCE(cost, 0)) as total_cost
          FROM "communication_logs"
          WHERE "companyId" = ${companyId}
            AND "createdAt" >= NOW() - INTERVAL '12 months'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month ASC
        `;

        return {
          summary: {
            totalMessages,
            successfulMessages,
            failedMessages,
            deliveryRate: Math.round(deliveryRate * 100) / 100,
            totalCost: Math.round(totalCost * 100) / 100,
          },
          distributions: {
            channels: channelDistribution,
            messageTypes: typeDistribution,
          },
          trends: {
            monthly: monthlyData.map(row => ({
              month: row.month,
              totalMessages: parseInt(row.total_messages),
              successfulMessages: parseInt(row.successful_messages),
              totalCost: parseFloat(row.total_cost),
            })),
          },
          recentLogs: logs.slice(0, 20).map(log => ({
            id: log.id,
            type: log.type,
            channel: log.channel,
            customerName: log.customer.name,
            subject: log.subject,
            status: log.status,
            sentAt: log.sentAt,
            cost: log.cost,
            errorMessage: log.errorMessage,
          })),
        };

      } catch (error) {
        console.error('Failed to get communication analytics:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve communication analytics',
        });
      }
    }),
});