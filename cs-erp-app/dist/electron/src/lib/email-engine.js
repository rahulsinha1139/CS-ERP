"use strict";
/**
 * Email Service Engine using Resend
 * Optimized for invoice delivery and client communication
 * Following Asymm mathematical principles for reliability
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailUtils = exports.emailEngine = exports.EmailEngine = void 0;
const resend_1 = require("resend");
// Email configuration constants
const EMAIL_CONSTANTS = {
    MAX_ATTACHMENT_SIZE: 25 * 1024 * 1024, // 25MB limit
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second base delay
    GOLDEN_RATIO: 1.618, // For exponential backoff
};
class EmailEngine {
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.FROM_EMAIL;
        const replyToEmail = process.env.REPLY_TO_EMAIL;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY environment variable is required');
        }
        if (!fromEmail) {
            throw new Error('FROM_EMAIL environment variable is required');
        }
        this.resend = new resend_1.Resend(apiKey);
        this.fromEmail = fromEmail;
        this.replyToEmail = replyToEmail || fromEmail; // Fallback to fromEmail if not set
    }
    static getInstance() {
        if (!EmailEngine.instance) {
            EmailEngine.instance = new EmailEngine();
        }
        return EmailEngine.instance;
    }
    /**
     * Send email with retry logic and performance tracking
     */
    async sendEmail(options) {
        const startTime = performance.now();
        let retryCount = 0;
        while (retryCount < EMAIL_CONSTANTS.RETRY_ATTEMPTS) {
            try {
                // Validate email options
                this.validateEmailOptions(options);
                // Send email
                const result = await this.resend.emails.send({
                    from: this.fromEmail,
                    to: options.to,
                    cc: options.cc,
                    bcc: options.bcc,
                    subject: options.subject,
                    html: options.html || options.text || '',
                    text: options.text,
                    attachments: options.attachments?.map(att => ({
                        filename: att.filename,
                        content: att.content,
                        content_type: att.contentType,
                    })),
                    replyTo: options.replyTo || this.replyToEmail, // Use configured reply-to if not specified
                    tags: options.tags,
                });
                const duration = performance.now() - startTime;
                // Log performance if slow
                if (duration > 5000) {
                    console.warn(`Slow email delivery: ${duration.toFixed(2)}ms`);
                }
                return {
                    success: true,
                    messageId: result.data?.id,
                    deliveredAt: new Date(),
                    retryCount,
                };
            }
            catch (error) {
                retryCount++;
                if (retryCount >= EMAIL_CONSTANTS.RETRY_ATTEMPTS) {
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error',
                        deliveredAt: new Date(),
                        retryCount,
                    };
                }
                // Exponential backoff using golden ratio
                const delay = EMAIL_CONSTANTS.RETRY_DELAY * Math.pow(EMAIL_CONSTANTS.GOLDEN_RATIO, retryCount);
                await this.sleep(delay);
            }
        }
        return {
            success: false,
            error: 'Max retry attempts reached',
            deliveredAt: new Date(),
            retryCount,
        };
    }
    /**
     * Send invoice email with professional template
     */
    async sendInvoiceEmail(customerEmail, template, pdfAttachment, invoiceNumber) {
        const html = this.generateInvoiceEmailHTML(template);
        const text = this.generateInvoiceEmailText(template);
        return this.sendEmail({
            to: customerEmail,
            subject: `Invoice ${template.invoiceNumber} from ${template.companyName}`,
            html,
            text,
            attachments: [
                {
                    filename: `Invoice-${invoiceNumber}.pdf`,
                    content: pdfAttachment,
                    contentType: 'application/pdf',
                },
            ],
            tags: [
                { name: 'type', value: 'invoice' },
                { name: 'invoice_number', value: template.invoiceNumber },
            ],
        });
    }
    /**
     * Send payment reminder email
     */
    async sendPaymentReminder(customerEmail, template) {
        const html = this.generateReminderEmailHTML(template);
        const text = this.generateReminderEmailText(template);
        return this.sendEmail({
            to: customerEmail,
            subject: `Payment Reminder: Invoice ${template.invoiceNumber} - ${template.daysOverdue} days overdue`,
            html,
            text,
            tags: [
                { name: 'type', value: 'payment_reminder' },
                { name: 'invoice_number', value: template.invoiceNumber },
                { name: 'days_overdue', value: template.daysOverdue.toString() },
            ],
        });
    }
    /**
     * Send compliance deadline reminder
     */
    async sendComplianceReminder(customerEmail, complianceTitle, dueDate, companyName) {
        const html = this.generateComplianceReminderHTML(complianceTitle, dueDate, companyName);
        const text = this.generateComplianceReminderText(complianceTitle, dueDate, companyName);
        return this.sendEmail({
            to: customerEmail,
            subject: `Compliance Reminder: ${complianceTitle} due soon`,
            html,
            text,
            tags: [
                { name: 'type', value: 'compliance_reminder' },
                { name: 'compliance_type', value: complianceTitle },
            ],
        });
    }
    /**
     * Validate email options
     */
    validateEmailOptions(options) {
        if (!options.to) {
            throw new Error('Recipient email is required');
        }
        if (!options.subject) {
            throw new Error('Email subject is required');
        }
        if (!options.html && !options.text) {
            throw new Error('Email content (HTML or text) is required');
        }
        // Validate attachment sizes
        if (options.attachments) {
            for (const attachment of options.attachments) {
                const size = attachment.content instanceof Buffer
                    ? attachment.content.length
                    : attachment.content.toString().length;
                if (size > EMAIL_CONSTANTS.MAX_ATTACHMENT_SIZE) {
                    throw new Error(`Attachment ${attachment.filename} exceeds size limit`);
                }
            }
        }
    }
    /**
     * Generate professional invoice email HTML
     */
    generateInvoiceEmailHTML(template) {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(template.amount);
        const formattedDueDate = template.dueDate
            ? new Intl.DateTimeFormat('en-IN').format(template.dueDate)
            : '';
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${template.invoiceNumber}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1e40af; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .amount { font-size: 24px; font-weight: bold; color: #1e40af; margin: 15px 0; }
        .details { background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .footer { background-color: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; font-size: 14px; color: #64748b; }
        .btn { display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Invoice ${template.invoiceNumber}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">From ${template.companyName}</p>
        </div>

        <div class="content">
            <p>Dear ${template.customerName},</p>

            <p>We hope this email finds you well. Please find attached your invoice for the services provided.</p>

            <div class="details">
                <h3 style="margin-top: 0; color: #1e40af;">Invoice Details</h3>
                <p><strong>Invoice Number:</strong> ${template.invoiceNumber}</p>
                <p><strong>Amount:</strong> <span class="amount">${formattedAmount}</span></p>
                ${template.dueDate ? `<p><strong>Due Date:</strong> ${formattedDueDate}</p>` : ''}
            </div>

            ${template.paymentInstructions ? `
            <div class="details">
                <h3 style="margin-top: 0; color: #1e40af;">Payment Instructions</h3>
                <p>${template.paymentInstructions}</p>
            </div>
            ` : ''}

            ${template.additionalNotes ? `
            <p><strong>Additional Notes:</strong></p>
            <p>${template.additionalNotes}</p>
            ` : ''}

            <p>If you have any questions regarding this invoice, please don't hesitate to contact us.</p>

            <p>Thank you for your business!</p>

            <p>Best regards,<br>
            <strong>${template.companyName}</strong></p>
        </div>

        <div class="footer">
            <p style="margin: 0;">This is an automated email. Please do not reply directly to this message.</p>
        </div>
    </div>
</body>
</html>`;
    }
    /**
     * Generate invoice email plain text version
     */
    generateInvoiceEmailText(template) {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(template.amount);
        const formattedDueDate = template.dueDate
            ? new Intl.DateTimeFormat('en-IN').format(template.dueDate)
            : '';
        return `Invoice ${template.invoiceNumber} from ${template.companyName}

Dear ${template.customerName},

We hope this email finds you well. Please find attached your invoice for the services provided.

Invoice Details:
- Invoice Number: ${template.invoiceNumber}
- Amount: ${formattedAmount}
${template.dueDate ? `- Due Date: ${formattedDueDate}` : ''}

${template.paymentInstructions ? `Payment Instructions:\n${template.paymentInstructions}\n\n` : ''}

${template.additionalNotes ? `Additional Notes:\n${template.additionalNotes}\n\n` : ''}

If you have any questions regarding this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${template.companyName}

---
This is an automated email. Please do not reply directly to this message.`;
    }
    /**
     * Generate payment reminder email HTML
     */
    generateReminderEmailHTML(template) {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(template.amount);
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Reminder</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #dc2626; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .amount { font-size: 24px; font-weight: bold; color: #dc2626; margin: 15px 0; }
        .overdue { background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { background-color: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Payment Reminder</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Invoice ${template.invoiceNumber}</p>
        </div>

        <div class="content">
            <p>Dear ${template.customerName},</p>

            <div class="overdue">
                <h3 style="margin-top: 0; color: #dc2626;">Overdue Payment Notice</h3>
                <p>This is a friendly reminder that Invoice ${template.invoiceNumber} is now <strong>${template.daysOverdue} days overdue</strong>.</p>
                <p><strong>Amount Due:</strong> <span class="amount">${formattedAmount}</span></p>
            </div>

            <p>Please arrange for payment at your earliest convenience to avoid any late fees or service interruptions.</p>

            ${template.paymentInstructions ? `
            <p><strong>Payment Instructions:</strong></p>
            <p>${template.paymentInstructions}</p>
            ` : ''}

            <p>If you have already made this payment, please disregard this notice. If you have any questions or need to discuss payment arrangements, please contact us immediately.</p>

            <p>Thank you for your prompt attention to this matter.</p>

            <p>Best regards,<br>
            <strong>${template.companyName}</strong></p>
        </div>

        <div class="footer">
            <p style="margin: 0;">This is an automated reminder. Please contact us if you need assistance.</p>
        </div>
    </div>
</body>
</html>`;
    }
    /**
     * Generate payment reminder plain text
     */
    generateReminderEmailText(template) {
        const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(template.amount);
        return `Payment Reminder - Invoice ${template.invoiceNumber}

Dear ${template.customerName},

OVERDUE PAYMENT NOTICE

This is a friendly reminder that Invoice ${template.invoiceNumber} is now ${template.daysOverdue} days overdue.

Amount Due: ${formattedAmount}

Please arrange for payment at your earliest convenience to avoid any late fees or service interruptions.

${template.paymentInstructions ? `Payment Instructions:\n${template.paymentInstructions}\n\n` : ''}

If you have already made this payment, please disregard this notice. If you have any questions or need to discuss payment arrangements, please contact us immediately.

Thank you for your prompt attention to this matter.

Best regards,
${template.companyName}

---
This is an automated reminder. Please contact us if you need assistance.`;
    }
    /**
     * Generate compliance reminder HTML
     */
    generateComplianceReminderHTML(title, dueDate, companyName) {
        const formattedDate = new Intl.DateTimeFormat('en-IN').format(dueDate);
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compliance Reminder</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #f59e0b; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .deadline { background-color: #fffbeb; border: 1px solid #fed7aa; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { background-color: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Compliance Reminder</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${title}</p>
        </div>

        <div class="content">
            <div class="deadline">
                <h3 style="margin-top: 0; color: #f59e0b;">Upcoming Deadline</h3>
                <p><strong>${title}</strong> is due on <strong>${formattedDate}</strong></p>
            </div>

            <p>This is a reminder that the above compliance requirement is approaching its deadline. Please ensure all necessary documentation and filings are completed on time.</p>

            <p>If you need assistance with this compliance requirement, please contact us immediately.</p>

            <p>Best regards,<br>
            <strong>${companyName}</strong></p>
        </div>

        <div class="footer">
            <p style="margin: 0;">This is an automated compliance reminder from your Company Secretary.</p>
        </div>
    </div>
</body>
</html>`;
    }
    /**
     * Generate compliance reminder plain text
     */
    generateComplianceReminderText(title, dueDate, companyName) {
        const formattedDate = new Intl.DateTimeFormat('en-IN').format(dueDate);
        return `Compliance Reminder: ${title}

UPCOMING DEADLINE

${title} is due on ${formattedDate}

This is a reminder that the above compliance requirement is approaching its deadline. Please ensure all necessary documentation and filings are completed on time.

If you need assistance with this compliance requirement, please contact us immediately.

Best regards,
${companyName}

---
This is an automated compliance reminder from your Company Secretary.`;
    }
    /**
     * Sleep utility for retry delays
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.EmailEngine = EmailEngine;
// Export singleton instance
exports.emailEngine = EmailEngine.getInstance();
// Utility functions for email operations
exports.emailUtils = {
    /**
     * Validate email address format
     */
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    /**
     * Extract domain from email address
     */
    getDomain: (email) => {
        return email.split('@')[1] || '';
    },
    /**
     * Format email list for display
     */
    formatEmailList: (emails) => {
        if (emails.length <= 2) {
            return emails.join(', ');
        }
        return `${emails.slice(0, 2).join(', ')} and ${emails.length - 2} others`;
    },
    /**
     * Check if email delivery is likely to succeed
     */
    checkDeliverability: (email) => {
        if (!exports.emailUtils.validateEmail(email)) {
            return { valid: false, reason: 'Invalid email format' };
        }
        const domain = exports.emailUtils.getDomain(email);
        // Basic domain validation
        if (!domain.includes('.')) {
            return { valid: false, reason: 'Invalid domain' };
        }
        return { valid: true };
    },
};
