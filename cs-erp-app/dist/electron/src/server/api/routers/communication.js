"use strict";
/**
 * tRPC Communication Router
 * Type-safe API endpoints for email, WhatsApp, and communication management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicationRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const communication_engine_1 = require("@/lib/communication-engine");
const render_1 = require("@react-email/render");
const invoice_email_1 = __importDefault(require("@/emails/invoice-email"));
const client_1 = require("@prisma/client");
const id_generator_1 = require("@/lib/id-generator");
// Input validation schemas
const configureResendSchema = zod_1.z.object({
    apiKey: zod_1.z.string().min(1, 'API key is required'),
    fromEmail: zod_1.z.string().email('Valid email required'),
    fromName: zod_1.z.string().min(1, 'From name is required')
});
const configureWhatsAppSchema = zod_1.z.object({
    provider: zod_1.z.enum(['TWILIO', 'WHATSAPP_BUSINESS_API']),
    accountSid: zod_1.z.string().min(1, 'Account SID is required'),
    authToken: zod_1.z.string().min(1, 'Auth token is required'),
    fromNumber: zod_1.z.string().min(1, 'Phone number is required')
});
const updateCustomerPreferencesSchema = zod_1.z.object({
    customerId: zod_1.z.string(),
    preferences: zod_1.z.object({
        emailOptIn: zod_1.z.boolean(),
        whatsappOptIn: zod_1.z.boolean(),
        smsOptIn: zod_1.z.boolean().optional(),
        invoiceDelivery: zod_1.z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
        complianceReminders: zod_1.z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
        paymentReminders: zod_1.z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
        reminderFrequency: zod_1.z.enum(['DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY']),
        quietHoursStart: zod_1.z.string().optional(),
        quietHoursEnd: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        timezone: zod_1.z.string().optional()
    })
});
const sendEmailSchema = zod_1.z.object({
    to: zod_1.z.union([zod_1.z.string().email(), zod_1.z.array(zod_1.z.string().email())]),
    cc: zod_1.z.array(zod_1.z.string().email()).optional(),
    bcc: zod_1.z.array(zod_1.z.string().email()).optional(),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    content: zod_1.z.string().min(1, 'Content is required'),
    templateId: zod_1.z.string().optional(),
    templateData: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional()
});
const sendBulkEmailSchema = zod_1.z.object({
    messages: zod_1.z.array(sendEmailSchema),
    batchSize: zod_1.z.number().min(1).max(50).default(10)
});
const sendInvoiceSchema = zod_1.z.object({
    invoiceId: zod_1.z.string(),
    channels: zod_1.z.array(zod_1.z.enum(['EMAIL', 'WHATSAPP'])).min(1),
    customMessage: zod_1.z.string().optional()
});
const createTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Template name is required'),
    type: zod_1.z.enum(['INVOICE', 'PAYMENT_REMINDER', 'COMPLIANCE_REMINDER', 'WELCOME', 'GENERAL_UPDATE']),
    channel: zod_1.z.enum(['EMAIL', 'WHATSAPP', 'SMS']),
    language: zod_1.z.string().default('en'),
    subject: zod_1.z.string().optional(),
    htmlContent: zod_1.z.string().optional(),
    textContent: zod_1.z.string().min(1, 'Text content is required'),
    variables: zod_1.z.array(zod_1.z.string()).default([]),
    isDefault: zod_1.z.boolean().default(false)
});
exports.communicationRouter = (0, trpc_1.createTRPCRouter)({
    // ===== CONFIGURATION ENDPOINTS =====
    configureResend: trpc_1.companyProcedure
        .input(configureResendSchema)
        .mutation(async ({ input, ctx }) => {
        // Test the configuration
        const isValid = await communication_engine_1.communicationEngine.configureResend(input);
        if (!isValid) {
            throw new Error('Failed to configure Resend. Please check your API key and settings.');
        }
        // Encrypt sensitive data
        const encryptedData = communication_engine_1.communicationEngine.encryptCredentials({
            apiKey: input.apiKey
        });
        // Save to database
        await ctx.db.companySettings.upsert({
            where: { companyId: ctx.companyId },
            create: {
                id: id_generator_1.idGenerator.companySettings(),
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
        });
        return { success: true, message: 'Resend configured successfully!' };
    }),
    configureWhatsApp: trpc_1.companyProcedure
        .input(configureWhatsAppSchema)
        .mutation(async ({ input, ctx }) => {
        // Test the configuration
        const isValid = await communication_engine_1.communicationEngine.configureWhatsApp({
            accountSid: input.accountSid,
            authToken: input.authToken,
            fromNumber: input.fromNumber
        });
        if (!isValid) {
            throw new Error('Failed to configure WhatsApp. Please check your credentials.');
        }
        // Encrypt sensitive data
        const encryptedData = communication_engine_1.communicationEngine.encryptCredentials({
            accountSid: input.accountSid,
            authToken: input.authToken
        });
        // Save to database
        await ctx.db.companySettings.upsert({
            where: { companyId: ctx.companyId },
            create: {
                id: id_generator_1.idGenerator.companySettings(),
                companyId: ctx.companyId,
                whatsappProvider: input.provider,
                whatsappApiKey: encryptedData.accountSid,
                whatsappPhoneId: input.fromNumber,
                whatsappEnabled: true
            },
            update: {
                whatsappProvider: input.provider,
                whatsappApiKey: encryptedData.accountSid,
                whatsappPhoneId: input.fromNumber,
                whatsappEnabled: true
            }
        });
        return { success: true, message: 'WhatsApp configured successfully!' };
    }),
    getSettings: trpc_1.companyProcedure
        .query(async ({ ctx }) => {
        const settings = await ctx.db.companySettings.findUnique({
            where: { companyId: ctx.companyId }
        });
        if (!settings) {
            return {
                emailEnabled: false,
                whatsappEnabled: false,
                hasEmailConfig: false,
                hasWhatsAppConfig: false
            };
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
        };
    }),
    // ===== CUSTOMER PREFERENCES =====
    updateCustomerPreferences: trpc_1.companyProcedure
        .input(updateCustomerPreferencesSchema)
        .mutation(async ({ input, ctx }) => {
        // Verify customer belongs to company
        const customer = await ctx.db.customer.findFirst({
            where: {
                id: input.customerId,
                companyId: ctx.companyId
            }
        });
        if (!customer) {
            throw new Error('Customer not found or access denied');
        }
        // Update or create preferences
        const preferences = await ctx.db.communicationPreference.upsert({
            where: { customerId: input.customerId },
            create: {
                id: id_generator_1.idGenerator.communicationPreference(),
                customerId: input.customerId,
                ...input.preferences
            },
            update: input.preferences
        });
        return preferences;
    }),
    getCustomerPreferences: trpc_1.companyProcedure
        .input(zod_1.z.object({ customerId: zod_1.z.string() }))
        .query(async ({ input, ctx }) => {
        const customer = await ctx.db.customer.findFirst({
            where: {
                id: input.customerId,
                companyId: ctx.companyId
            },
            include: {
                communicationPreferences: true
            }
        });
        if (!customer) {
            throw new Error('Customer not found or access denied');
        }
        return {
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                whatsappNumber: customer.whatsappNumber
            },
            preferences: customer.communicationPreferences || null
        };
    }),
    // ===== MESSAGE SENDING =====
    sendEmail: trpc_1.companyProcedure
        .input(sendEmailSchema)
        .mutation(async ({ input, ctx }) => {
        let htmlContent = input.content;
        let textContent = input.content;
        // If template is specified, render it
        if (input.templateId && input.templateData) {
            const rendered = await communication_engine_1.communicationEngine.renderTemplate(input.templateId, input.templateData);
            htmlContent = rendered.htmlContent;
            textContent = rendered.textContent;
        }
        const result = await communication_engine_1.communicationEngine.sendEmail({
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
        });
        // Log the communication
        await ctx.db.communicationLog.create({
            data: {
                id: id_generator_1.idGenerator.communicationLog(),
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
                metadata: result.metadata ? JSON.parse(JSON.stringify(result.metadata)) : client_1.Prisma.JsonNull,
                errorMessage: result.error
            }
        });
        return result;
    }),
    sendBulkEmails: trpc_1.companyProcedure
        .input(sendBulkEmailSchema)
        .mutation(async ({ input, ctx }) => {
        const emailMessages = input.messages.map(msg => ({
            to: Array.isArray(msg.to) ? msg.to[0] : msg.to, // Simplify for bulk
            subject: msg.subject,
            htmlContent: msg.content,
            textContent: msg.content
        }));
        const result = await communication_engine_1.communicationEngine.sendBulkEmails(emailMessages, input.batchSize);
        // Log bulk operation
        await ctx.db.communicationLog.create({
            data: {
                id: id_generator_1.idGenerator.communicationLog(),
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
        });
        return result;
    }),
    sendInvoice: trpc_1.companyProcedure
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
        });
        if (!invoice) {
            throw new Error('Invoice not found or access denied');
        }
        const results = [];
        // Send via Email
        if (input.channels.includes('EMAIL') && invoice.customer.email) {
            const emailHtml = await (0, render_1.render)((0, invoice_email_1.default)({
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
            }));
            const emailResult = await communication_engine_1.communicationEngine.sendEmail({
                to: invoice.customer.email,
                subject: `Invoice ${invoice.number} from ${invoice.company.name}`,
                htmlContent: emailHtml,
                textContent: `Invoice ${invoice.number} for ${invoice.grandTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`,
                tags: [
                    { name: 'invoice_id', value: invoice.id },
                    { name: 'customer_id', value: invoice.customer.id }
                ]
            });
            results.push({ channel: 'EMAIL', result: emailResult });
            // Log communication
            await ctx.db.communicationLog.create({
                data: {
                    id: id_generator_1.idGenerator.communicationLog(),
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
            });
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
        `.trim();
            const whatsappResult = await communication_engine_1.communicationEngine.sendWhatsApp({
                to: invoice.customer.whatsappNumber,
                content: whatsappMessage
            });
            results.push({ channel: 'WHATSAPP', result: whatsappResult });
            // Log communication
            await ctx.db.communicationLog.create({
                data: {
                    id: id_generator_1.idGenerator.communicationLog(),
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
            });
        }
        return {
            success: results.length > 0,
            results,
            message: `Invoice sent via ${results.map(r => r.channel).join(' and ')}`
        };
    }),
    // ===== TEMPLATES =====
    createTemplate: trpc_1.companyProcedure
        .input(createTemplateSchema)
        .mutation(async ({ input, ctx }) => {
        const template = await ctx.db.messageTemplate.create({
            data: {
                id: id_generator_1.idGenerator.messageTemplate(),
                companyId: ctx.companyId,
                ...input
            }
        });
        return template;
    }),
    getTemplates: trpc_1.companyProcedure
        .query(async ({ ctx }) => {
        return await ctx.db.messageTemplate.findMany({
            where: { companyId: ctx.companyId },
            orderBy: [
                { isDefault: 'desc' },
                { type: 'asc' },
                { createdAt: 'desc' }
            ]
        });
    }),
    // ===== ANALYTICS =====
    getCommunicationStats: trpc_1.companyProcedure
        .input(zod_1.z.object({
        startDate: zod_1.z.date().optional(),
        endDate: zod_1.z.date().optional()
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
        };
        const [totalMessages, emailMessages, whatsappMessages, deliveredMessages, failedMessages, totalCost] = await Promise.all([
            ctx.db.communicationLog.count({ where: whereClause }),
            ctx.db.communicationLog.count({ where: { ...whereClause, channel: 'EMAIL' } }),
            ctx.db.communicationLog.count({ where: { ...whereClause, channel: 'WHATSAPP' } }),
            ctx.db.communicationLog.count({ where: { ...whereClause, status: 'DELIVERED' } }),
            ctx.db.communicationLog.count({ where: { ...whereClause, status: 'FAILED' } }),
            ctx.db.communicationLog.aggregate({
                where: whereClause,
                _sum: { cost: true }
            })
        ]);
        const recentMessages = await ctx.db.communicationLog.findMany({
            where: whereClause,
            include: {
                customer: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        return {
            totalMessages,
            emailMessages,
            whatsappMessages,
            deliveredMessages,
            failedMessages,
            totalCost: totalCost._sum.cost || 0,
            deliveryRate: totalMessages > 0 ? (deliveredMessages / totalMessages) * 100 : 0,
            recentMessages
        };
    }),
    // ===== TESTING =====
    testConfiguration: trpc_1.companyProcedure
        .mutation(async ({ ctx }) => {
        const settings = await ctx.db.companySettings.findUnique({
            where: { companyId: ctx.companyId }
        });
        if (!settings) {
            throw new Error('No communication settings found. Please configure first.');
        }
        const results = {
            email: false,
            whatsapp: false,
            errors: []
        };
        // Test email configuration
        if (settings.emailEnabled && settings.smtpUser) {
            try {
                const decrypted = communication_engine_1.communicationEngine.decryptCredentials({
                    apiKey: settings.smtpUser
                });
                const emailValid = await communication_engine_1.communicationEngine.configureResend({
                    apiKey: decrypted.apiKey,
                    fromEmail: settings.fromEmail,
                    fromName: settings.fromName
                });
                results.email = emailValid;
                if (!emailValid)
                    results.errors.push('Email configuration invalid');
            }
            catch (error) {
                results.errors.push(`Email test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        // Test WhatsApp configuration
        if (settings.whatsappEnabled && settings.whatsappApiKey) {
            try {
                const decrypted = communication_engine_1.communicationEngine.decryptCredentials({
                    accountSid: settings.whatsappApiKey,
                    authToken: settings.whatsappApiKey // In real implementation, store separately
                });
                const whatsappValid = await communication_engine_1.communicationEngine.configureWhatsApp({
                    accountSid: decrypted.accountSid,
                    authToken: decrypted.authToken,
                    fromNumber: settings.whatsappPhoneId
                });
                results.whatsapp = whatsappValid;
                if (!whatsappValid)
                    results.errors.push('WhatsApp configuration invalid');
            }
            catch (error) {
                results.errors.push(`WhatsApp test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        return results;
    })
});
