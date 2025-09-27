# 📱 Complete Communication Integration Architecture
## Email & WhatsApp System Implementation Plan

### 🎯 **Integration Overview**

**Challenge**: How do Company Secretary practices integrate client emails/phones and activate communication features?

**Solution**: Multi-layer integration with secure credential management, user consent, and automated communication workflows.

---

## 🗄️ **1. Database Schema Extensions**

### **A. Communication Settings Models**

```prisma
// Add to existing schema.prisma

model CompanySettings {
  id              String   @id @default(cuid())
  companyId       String   @unique

  // Email Configuration
  emailProvider   EmailProvider?
  smtpHost        String?
  smtpPort        Int?
  smtpUser        String?
  smtpPassword    String? // Encrypted
  fromEmail       String?
  fromName        String?
  emailEnabled    Boolean @default(false)

  // WhatsApp Configuration
  whatsappProvider WhatsAppProvider?
  whatsappApiKey   String? // Encrypted
  whatsappPhoneId  String?
  whatsappEnabled  Boolean @default(false)

  // Default Templates
  defaultEmailTemplate    String?
  defaultWhatsAppTemplate String?

  // Audit fields
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  company         Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("company_settings")
}

model CommunicationPreference {
  id              String   @id @default(cuid())
  customerId      String

  // Client Communication Preferences
  emailOptIn      Boolean  @default(false)
  whatsappOptIn   Boolean  @default(false)
  smsOptIn        Boolean  @default(false)

  // Preferred channels for different types
  invoiceDelivery    CommunicationChannel @default(EMAIL)
  complianceReminders CommunicationChannel @default(EMAIL)
  paymentReminders   CommunicationChannel @default(EMAIL)
  generalUpdates     CommunicationChannel @default(EMAIL)

  // Frequency preferences
  reminderFrequency  ReminderFrequency @default(WEEKLY)
  quietHours         Json? // {"start": "22:00", "end": "09:00"}

  // Audit fields
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  customer        Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@map("communication_preferences")
}

model CommunicationLog {
  id              String   @id @default(cuid())
  customerId      String
  companyId       String

  // Communication details
  type            CommunicationType
  channel         CommunicationChannel
  subject         String?
  content         String
  templateUsed    String?

  // Delivery tracking
  status          DeliveryStatus @default(PENDING)
  sentAt          DateTime?
  deliveredAt     DateTime?
  readAt          DateTime?
  responseAt      DateTime?

  // Error handling
  errorMessage    String?
  retryCount      Int @default(0)
  maxRetries      Int @default(3)

  // Metadata
  metadata        Json? // Provider-specific data
  cost            Float? @default(0)

  // Audit fields
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  customer        Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  company         Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("communication_logs")
}

// Enums
enum EmailProvider {
  SMTP
  SENDGRID
  RESEND
  MAILGUN
  AWS_SES
}

enum WhatsAppProvider {
  WHATSAPP_BUSINESS_API
  TWILIO
  MESSAGEBIRD
  GUPSHUP
}

enum CommunicationChannel {
  EMAIL
  WHATSAPP
  SMS
  VOICE
}

enum ReminderFrequency {
  DAILY
  WEEKLY
  MONTHLY
  CUSTOM
}

enum DeliveryStatus {
  PENDING
  SENT
  DELIVERED
  READ
  FAILED
  BOUNCED
}

// Update existing models
model Customer {
  // ... existing fields ...

  // Enhanced communication fields
  whatsappNumber     String?
  preferredLanguage  String? @default("en")
  timezone          String? @default("Asia/Kolkata")

  // Relations (add these)
  communicationPreferences CommunicationPreference[]
  communicationLogs        CommunicationLog[]
}

model Company {
  // ... existing fields ...

  // Relations (add these)
  settings              CompanySettings?
  communicationLogs     CommunicationLog[]
}
```

---

## 🔧 **2. Backend Implementation**

### **A. Communication Engine (`src/lib/communication-engine.ts`)**

```typescript
/**
 * Universal Communication Engine
 * Handles Email, WhatsApp, SMS with provider abstraction
 */

interface CommunicationEngine {
  // Setup and configuration
  configureProvider(type: 'email' | 'whatsapp', config: ProviderConfig): Promise<void>
  validateConfiguration(type: 'email' | 'whatsapp'): Promise<boolean>

  // Template management
  createTemplate(template: CommunicationTemplate): Promise<string>
  getTemplate(id: string): Promise<CommunicationTemplate>

  // Message sending
  sendEmail(message: EmailMessage): Promise<DeliveryResult>
  sendWhatsApp(message: WhatsAppMessage): Promise<DeliveryResult>

  // Bulk operations
  sendBulkMessages(messages: BulkMessage[]): Promise<BulkDeliveryResult>

  // Tracking and analytics
  getDeliveryStatus(messageId: string): Promise<DeliveryStatus>
  getAnalytics(dateRange: DateRange): Promise<CommunicationAnalytics>
}

class CommunicationEngineImpl implements CommunicationEngine {
  private emailProvider: EmailProvider
  private whatsappProvider: WhatsAppProvider

  async configureProvider(type: 'email' | 'whatsapp', config: ProviderConfig) {
    // Provider-specific setup with encryption
    if (type === 'email') {
      this.emailProvider = this.createEmailProvider(config)
      await this.emailProvider.authenticate()
    } else if (type === 'whatsapp') {
      this.whatsappProvider = this.createWhatsAppProvider(config)
      await this.whatsappProvider.authenticate()
    }
  }

  async sendEmail(message: EmailMessage): Promise<DeliveryResult> {
    // Golden ratio retry pattern
    const retryConfig = {
      maxRetries: 5,
      baseDelay: 1000,
      multiplier: this.GOLDEN_RATIO // 1.618
    }

    return this.executeWithRetry(
      () => this.emailProvider.send(message),
      retryConfig
    )
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    // Mathematical retry with exponential backoff using golden ratio
    let lastError: Error

    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error

        if (attempt < config.maxRetries - 1) {
          const delay = config.baseDelay * Math.pow(config.multiplier, attempt)
          await this.sleep(delay)
        }
      }
    }

    throw lastError
  }
}
```

### **B. tRPC Router Extension (`src/server/api/routers/communication.ts`)**

```typescript
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { communicationEngine } from '~/lib/communication-engine'

export const communicationRouter = createTRPCRouter({
  // Configuration endpoints
  configureEmail: protectedProcedure
    .input(z.object({
      provider: z.enum(['SMTP', 'SENDGRID', 'RESEND']),
      host: z.string().optional(),
      port: z.number().optional(),
      username: z.string(),
      password: z.string(),
      fromEmail: z.string().email(),
      fromName: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // Encrypt sensitive data before storing
      const encrypted = await encryptCredentials(input)

      await ctx.prisma.companySettings.upsert({
        where: { companyId: ctx.user.companyId },
        create: {
          companyId: ctx.user.companyId,
          emailProvider: input.provider,
          smtpHost: encrypted.host,
          smtpUser: encrypted.username,
          smtpPassword: encrypted.password,
          fromEmail: input.fromEmail,
          fromName: input.fromName,
          emailEnabled: true
        },
        update: {
          emailProvider: input.provider,
          smtpHost: encrypted.host,
          smtpUser: encrypted.username,
          smtpPassword: encrypted.password,
          fromEmail: input.fromEmail,
          fromName: input.fromName,
          emailEnabled: true
        }
      })

      // Test configuration
      return await communicationEngine.validateConfiguration('email')
    }),

  configureWhatsApp: protectedProcedure
    .input(z.object({
      provider: z.enum(['WHATSAPP_BUSINESS_API', 'TWILIO']),
      apiKey: z.string(),
      phoneNumberId: z.string(),
      webhookUrl: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Similar implementation for WhatsApp
    }),

  // Customer preference management
  updateCustomerPreferences: protectedProcedure
    .input(z.object({
      customerId: z.string(),
      preferences: z.object({
        emailOptIn: z.boolean(),
        whatsappOptIn: z.boolean(),
        invoiceDelivery: z.enum(['EMAIL', 'WHATSAPP']),
        complianceReminders: z.enum(['EMAIL', 'WHATSAPP']),
        reminderFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY'])
      })
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.communicationPreference.upsert({
        where: { customerId: input.customerId },
        create: {
          customerId: input.customerId,
          ...input.preferences
        },
        update: input.preferences
      })
    }),

  // Sending endpoints
  sendInvoice: protectedProcedure
    .input(z.object({
      invoiceId: z.string(),
      channel: z.enum(['EMAIL', 'WHATSAPP', 'BOTH'])
    }))
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.invoice.findUnique({
        where: { id: input.invoiceId },
        include: { customer: true }
      })

      if (!invoice) throw new Error('Invoice not found')

      // Generate PDF
      const pdfBuffer = await generateInvoicePDF(invoice)

      if (input.channel === 'EMAIL' || input.channel === 'BOTH') {
        await communicationEngine.sendEmail({
          to: invoice.customer.email!,
          subject: `Invoice ${invoice.number} from ${invoice.company.name}`,
          template: 'invoice-delivery',
          data: { invoice, customer: invoice.customer },
          attachments: [{ filename: `invoice-${invoice.number}.pdf`, content: pdfBuffer }]
        })
      }

      if (input.channel === 'WHATSAPP' || input.channel === 'BOTH') {
        await communicationEngine.sendWhatsApp({
          to: invoice.customer.whatsappNumber!,
          template: 'invoice-whatsapp',
          data: { invoice, customer: invoice.customer },
          attachments: [{ filename: `invoice-${invoice.number}.pdf`, content: pdfBuffer }]
        })
      }
    })
})
```

---

## 🎨 **3. Frontend Implementation**

### **A. Settings Configuration Page (`src/pages/settings/communication.tsx`)**

```typescript
export default function CommunicationSettings() {
  const [activeTab, setActiveTab] = useState('email')
  const [emailConfig, setEmailConfig] = useState<EmailConfig>()
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const configureEmail = trpc.communication.configureEmail.useMutation({
    onSuccess: () => setTestStatus('success'),
    onError: () => setTestStatus('error')
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Communication Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Setup</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <EmailConfigurationForm
            onSave={(config) => configureEmail.mutate(config)}
            onTest={() => testEmailConfiguration()}
            status={testStatus}
          />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppConfigurationForm />
        </TabsContent>

        <TabsContent value="templates">
          <MessageTemplateEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmailConfigurationForm({ onSave, onTest, status }: Props) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Email Provider Setup</h3>

      <Form onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <Label>Email Provider</Label>
            <Select {...register('provider')}>
              <SelectItem value="SMTP">SMTP Server</SelectItem>
              <SelectItem value="SENDGRID">SendGrid</SelectItem>
              <SelectItem value="RESEND">Resend</SelectItem>
            </Select>
          </FormField>

          <FormField>
            <Label>From Email</Label>
            <Input {...register('fromEmail')} type="email" required />
          </FormField>

          {/* Conditional fields based on provider */}
          {watchedProvider === 'SMTP' && (
            <>
              <FormField>
                <Label>SMTP Host</Label>
                <Input {...register('host')} placeholder="mail.example.com" />
              </FormField>

              <FormField>
                <Label>Port</Label>
                <Input {...register('port')} type="number" placeholder="587" />
              </FormField>
            </>
          )}

          <FormField>
            <Label>Username/API Key</Label>
            <Input {...register('username')} required />
          </FormField>

          <FormField>
            <Label>Password/Secret</Label>
            <Input {...register('password')} type="password" required />
          </FormField>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" disabled={status === 'testing'}>
            {status === 'testing' ? 'Saving...' : 'Save Configuration'}
          </Button>

          <Button type="button" variant="outline" onClick={onTest}>
            Test Connection
          </Button>
        </div>

        {status === 'success' && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Configuration Saved Successfully</AlertTitle>
            <AlertDescription>
              Email provider configured and tested successfully.
            </AlertDescription>
          </Alert>
        )}
      </Form>
    </Card>
  )
}
```

### **B. Customer Communication Preferences (`src/components/customers/communication-preferences.tsx`)**

```typescript
interface CommunicationPreferencesProps {
  customerId: string
  currentPreferences?: CommunicationPreference
}

export function CommunicationPreferences({ customerId, currentPreferences }: Props) {
  const updatePreferences = trpc.communication.updateCustomerPreferences.useMutation()

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Communication Preferences</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Email Notifications</Label>
            <p className="text-sm text-gray-600">Receive invoices and reminders via email</p>
          </div>
          <Switch
            checked={preferences.emailOptIn}
            onCheckedChange={(checked) =>
              setPreferences(prev => ({ ...prev, emailOptIn: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">WhatsApp Messages</Label>
            <p className="text-sm text-gray-600">Get instant updates on WhatsApp</p>
          </div>
          <Switch
            checked={preferences.whatsappOptIn}
            onCheckedChange={(checked) =>
              setPreferences(prev => ({ ...prev, whatsappOptIn: checked }))
            }
          />
        </div>

        {preferences.whatsappOptIn && (
          <FormField>
            <Label>WhatsApp Number</Label>
            <Input
              {...register('whatsappNumber')}
              placeholder="+91 9876543210"
              type="tel"
            />
          </FormField>
        )}

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium">Delivery Preferences</h4>

          <div className="grid grid-cols-2 gap-4">
            <FormField>
              <Label>Invoice Delivery</Label>
              <Select value={preferences.invoiceDelivery} onValueChange={...}>
                <SelectItem value="EMAIL">Email Only</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp Only</SelectItem>
              </Select>
            </FormField>

            <FormField>
              <Label>Compliance Reminders</Label>
              <Select value={preferences.complianceReminders} onValueChange={...}>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
              </Select>
            </FormField>
          </div>
        </div>

        <Button
          onClick={() => updatePreferences.mutate({ customerId, preferences })}
          className="w-full"
        >
          Save Preferences
        </Button>
      </div>
    </Card>
  )
}
```

---

## 🔐 **4. Security Implementation**

### **A. Credential Encryption (`src/lib/encryption.ts`)**

```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32-byte key
const ALGORITHM = 'aes-256-gcm'

export async function encryptCredentials(data: Record<string, string>) {
  const encrypted: Record<string, string> = {}

  for (const [key, value] of Object.entries(data)) {
    if (value && shouldEncrypt(key)) {
      encrypted[key] = await encrypt(value)
    } else {
      encrypted[key] = value
    }
  }

  return encrypted
}

async function encrypt(text: string): Promise<string> {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  cipher.setAAD(Buffer.from('communication-credentials'))

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

async function decrypt(encryptedData: string): Promise<string> {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':')

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  decipher.setAAD(Buffer.from('communication-credentials'))
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

function shouldEncrypt(key: string): boolean {
  const sensitiveFields = ['password', 'apiKey', 'secret', 'token']
  return sensitiveFields.some(field => key.toLowerCase().includes(field))
}
```

---

## 🚀 **5. Integration Workflow**

### **Company Secretary Practice Setup Flow:**

1. **Initial Setup** (`/settings/communication`)
   - Choose email provider (SMTP, SendGrid, Resend)
   - Enter credentials (encrypted and stored securely)
   - Test connection and save

2. **WhatsApp Setup** (`/settings/communication#whatsapp`)
   - Connect to WhatsApp Business API or Twilio
   - Configure webhook endpoints
   - Test message delivery

3. **Client Onboarding** (`/customers/[id]/preferences`)
   - Collect email addresses (required for invoicing)
   - Request WhatsApp opt-in with number
   - Set communication preferences per message type

4. **Template Customization** (`/settings/templates`)
   - Customize email templates for invoices, reminders
   - Create WhatsApp message templates
   - Preview and test templates

5. **Automated Workflows**
   - Invoice generation → automatic delivery via preferred channel
   - Compliance deadline approaching → automated reminders
   - Payment overdue → escalating reminder sequence

### **Technical Implementation Priority:**

1. ✅ **Phase 1**: Database schema extensions
2. ✅ **Phase 2**: Backend communication engine
3. ✅ **Phase 3**: Frontend configuration pages
4. ✅ **Phase 4**: Security and encryption
5. ✅ **Phase 5**: Integration testing and deployment

This architecture provides:
- **Security**: Encrypted credential storage
- **Flexibility**: Multiple provider support
- **Compliance**: Opt-in/opt-out functionality
- **Analytics**: Delivery tracking and reporting
- **Scalability**: Bulk messaging capabilities

Would you like me to start implementing any specific part of this system?