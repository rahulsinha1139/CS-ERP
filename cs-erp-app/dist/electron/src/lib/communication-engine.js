"use strict";
/**
 * Professional Communication Engine with Resend & WhatsApp
 * Optimized for Mrs. Pragnya Pradhan's CS Practice
 * Single-user focus with expansion-ready architecture
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.formatCurrency = exports.communicationEngine = exports.CommunicationEngine = exports.EncryptionService = void 0;
const resend_1 = require("resend");
const crypto = __importStar(require("crypto"));
// Mathematical constants from Asymm protocol
const GOLDEN_RATIO = 1.618033988;
const RETRY_BASE_DELAY = 1000; // 1 second
const MAX_RETRIES = 5;
// Environment variables
// const RESEND_API_KEY = process.env.RESEND_API_KEY // Unused - removed
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-byte-key-for-dev-only!!';
// Resend Provider Implementation
class ResendProvider {
    constructor(config) {
        this.resend = new resend_1.Resend(config.apiKey);
        this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;
    }
    async authenticate() {
        try {
            // Test authentication by making a simple API call
            await this.resend.domains.list();
            return true;
        }
        catch (_error) {
            console.error('Resend authentication failed:', _error);
            return false;
        }
    }
    async send(message) {
        try {
            const result = await this.resend.emails.send({
                from: `${this.fromName} <${this.fromEmail}>`,
                to: Array.isArray(message.to) ? message.to : [message.to],
                cc: message.cc,
                bcc: message.bcc,
                subject: message.subject,
                html: message.htmlContent,
                text: message.textContent,
                replyTo: message.replyTo,
                attachments: message.attachments?.map(att => ({
                    filename: att.filename,
                    content: att.content
                })),
                tags: message.tags
            });
            return {
                messageId: result.data?.id || crypto.randomUUID(),
                status: 'sent',
                provider: 'resend',
                metadata: result
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                messageId: crypto.randomUUID(),
                status: 'failed',
                provider: 'resend',
                error: errorMessage
            };
        }
    }
    async getStatus(messageId) {
        try {
            // Note: Resend doesn't provide detailed delivery status by default
            // You'd need to implement webhook handlers for detailed tracking
            return {
                messageId,
                status: 'sent', // Assume sent if no error
                timestamp: new Date()
            };
        }
        catch (_error) {
            return {
                messageId,
                status: 'failed',
                timestamp: new Date(),
                errorReason: 'Status check failed'
            };
        }
    }
}
// WhatsApp Provider Implementation (using Twilio as example)
class TwilioWhatsAppProvider {
    constructor(config) {
        this.accountSid = config.accountSid;
        this.authToken = config.authToken;
        this.fromNumber = config.fromNumber;
    }
    async authenticate() {
        try {
            const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
                }
            });
            return response.ok;
        }
        catch (error) {
            console.error('Twilio Authentication failed:', error);
            return false;
        }
    }
    async send(message) {
        try {
            const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
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
            });
            const result = await response.json();
            if (response.ok) {
                return {
                    messageId: result.sid,
                    status: 'sent',
                    provider: 'twilio-whatsapp',
                    cost: parseFloat(result.price || '0'),
                    metadata: result
                };
            }
            else {
                return {
                    messageId: crypto.randomUUID(),
                    status: 'failed',
                    provider: 'twilio-whatsapp',
                    error: result.message
                };
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                messageId: crypto.randomUUID(),
                status: 'failed',
                provider: 'twilio-whatsapp',
                error: errorMessage
            };
        }
    }
    async getStatus(messageId) {
        try {
            const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages/${messageId}.json`, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
                }
            });
            if (response.ok) {
                const result = await response.json();
                return {
                    messageId,
                    status: this.mapTwilioStatus(result.status),
                    timestamp: new Date(result.date_updated),
                    errorReason: result.error_message
                };
            }
            return {
                messageId,
                status: 'failed',
                timestamp: new Date(),
                errorReason: 'Failed to fetch status'
            };
        }
        catch (_error) {
            return {
                messageId,
                status: 'failed',
                timestamp: new Date(),
                errorReason: 'Status check failed'
            };
        }
    }
    mapTwilioStatus(twilioStatus) {
        switch (twilioStatus) {
            case 'queued':
            case 'sending': return 'pending';
            case 'sent': return 'sent';
            case 'delivered': return 'delivered';
            case 'read': return 'read';
            case 'failed':
            case 'undelivered': return 'failed';
            default: return 'pending';
        }
    }
}
// Encryption utilities
class EncryptionService {
    constructor(encryptionKey) {
        this.algorithm = 'aes-256-gcm';
        this.key = Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32));
    }
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(this.algorithm, this.key.toString('hex'));
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Simple encryption without auth tag for basic cipher
        return `${iv.toString('hex')}:${encrypted}`;
    }
    decrypt(encryptedData) {
        const [_ivHex, encrypted] = encryptedData.split(':');
        const decipher = crypto.createDecipher(this.algorithm, this.key.toString('hex'));
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    static shouldEncrypt(fieldName) {
        const sensitiveFields = ['password', 'apikey', 'secret', 'token', 'authtoken'];
        return sensitiveFields.some(field => fieldName.toLowerCase().includes(field.toLowerCase()));
    }
}
exports.EncryptionService = EncryptionService;
// Main Communication Engine
class CommunicationEngine {
    constructor() {
        this.templates = new Map();
        this.encryption = new EncryptionService(ENCRYPTION_KEY);
    }
    // Provider Configuration
    async configureResend(config) {
        this.emailProvider = new ResendProvider({
            apiKey: config.apiKey,
            fromEmail: config.fromEmail,
            fromName: config.fromName
        });
        return await this.emailProvider.authenticate();
    }
    async configureWhatsApp(config) {
        this.whatsappProvider = new TwilioWhatsAppProvider(config);
        return await this.whatsappProvider.authenticate();
    }
    // Message Sending with Golden Ratio Retry Logic
    async sendEmail(message) {
        if (!this.emailProvider) {
            throw new Error('Email provider not configured. Please configure Resend first.');
        }
        return this.executeWithRetry(() => this.emailProvider.send(message), 'email');
    }
    async sendWhatsApp(message) {
        if (!this.whatsappProvider) {
            throw new Error('WhatsApp provider not configured. Please configure Twilio WhatsApp first.');
        }
        return this.executeWithRetry(() => this.whatsappProvider.send(message), 'whatsapp');
    }
    // Bulk email sending with intelligent batching
    async sendBulkEmails(messages, batchSize = 10) {
        const results = [];
        const failures = [];
        let totalCost = 0;
        // Process in batches to respect rate limits
        for (let i = 0; i < messages.length; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);
            const batchPromises = batch.map(async (message) => {
                try {
                    const result = await this.sendEmail(message);
                    results.push(result);
                    if (result.cost)
                        totalCost += result.cost;
                    return result;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    failures.push({ message, error: errorMessage });
                    return null;
                }
            });
            await Promise.allSettled(batchPromises);
            // Golden ratio delay between batches
            if (i + batchSize < messages.length) {
                await this.sleep(RETRY_BASE_DELAY * GOLDEN_RATIO);
            }
        }
        return {
            total: messages.length,
            successful: results.filter(r => r.status === 'sent').length,
            failed: failures.length,
            results,
            failures,
            totalCost
        };
    }
    // Template Management
    async saveTemplate(template) {
        const templateId = crypto.randomUUID();
        this.templates.set(templateId, { ...template, id: templateId });
        return templateId;
    }
    async getTemplate(templateId) {
        return this.templates.get(templateId) || null;
    }
    async renderTemplate(templateId, data) {
        const template = await this.getTemplate(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }
        return {
            subject: this.interpolateString(template.subject || '', data),
            htmlContent: this.interpolateString(template.htmlContent || '', data),
            textContent: this.interpolateString(template.textContent, data)
        };
    }
    // Smart message routing based on customer preferences
    async sendSmartMessage(customerId, messageType, data, preferences) {
        const results = [];
        // Send via email if opted in and preferred
        if (preferences.emailOptIn &&
            preferences.email &&
            preferences.preferredChannels[messageType]?.includes('EMAIL')) {
            const emailTemplate = await this.getTemplate(`${messageType}_email`);
            if (emailTemplate) {
                const rendered = await this.renderTemplate(emailTemplate.id, data);
                const result = await this.sendEmail({
                    to: preferences.email,
                    subject: rendered.subject,
                    htmlContent: rendered.htmlContent,
                    textContent: rendered.textContent,
                    tags: [
                        { name: 'customer_id', value: customerId },
                        { name: 'message_type', value: messageType }
                    ]
                });
                results.push(result);
            }
        }
        // Send via WhatsApp if opted in and preferred
        if (preferences.whatsappOptIn &&
            preferences.whatsappNumber &&
            preferences.preferredChannels[messageType]?.includes('WHATSAPP')) {
            const whatsappTemplate = await this.getTemplate(`${messageType}_whatsapp`);
            if (whatsappTemplate) {
                const rendered = await this.renderTemplate(whatsappTemplate.id, data);
                const result = await this.sendWhatsApp({
                    to: preferences.whatsappNumber,
                    content: rendered.textContent
                });
                results.push(result);
            }
        }
        return results;
    }
    // Encryption helpers
    encryptCredentials(credentials) {
        const encrypted = {};
        for (const [key, value] of Object.entries(credentials)) {
            if (value && EncryptionService.shouldEncrypt(key)) {
                encrypted[key] = this.encryption.encrypt(value);
            }
            else {
                encrypted[key] = value;
            }
        }
        return encrypted;
    }
    decryptCredentials(encrypted) {
        const decrypted = {};
        for (const [key, value] of Object.entries(encrypted)) {
            if (value && EncryptionService.shouldEncrypt(key)) {
                try {
                    decrypted[key] = this.encryption.decrypt(value);
                }
                catch (error) {
                    console.error(`Failed to decrypt ${key}:`, error);
                    decrypted[key] = value; // Return as-is if decryption fails
                }
            }
            else {
                decrypted[key] = value;
            }
        }
        return decrypted;
    }
    // Private helper methods
    async executeWithRetry(operation, context) {
        let lastError;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                console.warn(`${context} attempt ${attempt + 1} failed:`, error);
                if (attempt < MAX_RETRIES - 1) {
                    // Golden ratio exponential backoff
                    const delay = RETRY_BASE_DELAY * Math.pow(GOLDEN_RATIO, attempt);
                    console.log(`Retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        throw new Error(`${context} failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    interpolateString(template, data) {
        return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
            const value = path.split('.').reduce((obj, key) => {
                if (obj && typeof obj === 'object' && key in obj) {
                    return obj[key];
                }
                return undefined;
            }, data);
            return value !== undefined ? String(value) : match;
        });
    }
}
exports.CommunicationEngine = CommunicationEngine;
// Export singleton instance
exports.communicationEngine = new CommunicationEngine();
// Helper functions for React components
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};
exports.formatDate = formatDate;
