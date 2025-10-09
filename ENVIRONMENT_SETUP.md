# Environment Variables Setup Guide

## Overview
This document provides comprehensive information about setting up environment variables for the CS ERP system. All sensitive production values are placeholder and should be replaced with actual values during deployment.

## Database Configuration

### DATABASE_URL
- **Purpose**: PostgreSQL database connection string
- **Development**: Already configured with Supabase
- **Production**: Replace with your production database URL
- **Format**: `postgresql://username:password@hostname:port/database`

## Authentication (NextAuth.js)

### NEXTAUTH_URL
- **Purpose**: Base URL for OAuth callbacks and redirects
- **Development**: `http://localhost:3000`
- **Production**: Your actual domain (e.g., `https://your-domain.com`)

### NEXTAUTH_SECRET
- **Purpose**: JWT signing secret for session tokens
- **Requirements**: Must be 32+ characters, cryptographically secure
- **Generation**: Use `openssl rand -base64 32` or similar
- **Security**: Never commit actual production secrets to git

## Email Service (Resend)

### RESEND_API_KEY
- **Purpose**: Professional email sending service
- **Signup**: https://resend.com
- **Features**: Invoice delivery, payment notifications, compliance reminders
- **Format**: `re_xxxxxxxx`

## WhatsApp Integration (Twilio)

### TWILIO_ACCOUNT_SID
- **Purpose**: Twilio account identifier
- **Format**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### TWILIO_AUTH_TOKEN
- **Purpose**: Twilio authentication token
- **Security**: Keep this secret and secure

### TWILIO_WHATSAPP_NUMBER
- **Purpose**: WhatsApp Business number for customer communication
- **Format**: `+1234567890`
- **Setup**: Configure through Twilio WhatsApp sandbox

## File Upload Configuration

### UPLOAD_DIR
- **Purpose**: Directory for storing uploaded files
- **Default**: `./uploads`
- **Production**: Consider cloud storage (AWS S3, Google Cloud)

### MAX_FILE_SIZE
- **Purpose**: Maximum file upload size in bytes
- **Default**: 10MB (10485760 bytes)
- **Recommendation**: Adjust based on your server capacity

## PDF Generation

### PDF_GENERATION_ENABLED
- **Purpose**: Enable/disable PDF invoice generation
- **Values**: `true` or `false`
- **Features**: Professional invoice PDFs with GST compliance

### PDF_STORAGE_PATH
- **Purpose**: Directory for storing generated PDFs
- **Default**: `./storage/pdfs`
- **Production**: Consider cloud storage integration

## Supabase Configuration

### NEXT_PUBLIC_SUPABASE_URL
- **Purpose**: Supabase project URL (public)
- **Current**: Already configured for your project

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Purpose**: Supabase anonymous access key (public)
- **Current**: Already configured for your project

## Security & Performance

### RATE_LIMIT_ENABLED
- **Purpose**: Enable API rate limiting protection
- **Recommended**: `true` for production

### RATE_LIMIT_REQUESTS_PER_MINUTE
- **Purpose**: Maximum requests per minute per IP
- **Default**: 100
- **Adjustment**: Based on your usage patterns

### CORS_ALLOWED_ORIGINS
- **Purpose**: Cross-origin request security
- **Development**: Includes localhost ports
- **Production**: Only your production domain

### SESSION_TIMEOUT
- **Purpose**: User session timeout in seconds
- **Default**: 86400 (24 hours)
- **Security**: Lower for sensitive environments

## Logging

### LOG_LEVEL
- **Purpose**: Application logging verbosity
- **Development**: `info` or `debug`
- **Production**: `warn` or `error`

### LOG_FILE_ENABLED
- **Purpose**: Enable file-based logging
- **Recommended**: `true` for production debugging

## Environment Setup Steps

### 1. Development Setup
```bash
# Already configured - system ready for development
npm run dev
```

### 2. Production Setup
1. Copy `.env` to your production server
2. Replace all placeholder values with actual credentials
3. Set `NODE_ENV=production`
4. Configure your production database
5. Set up email service (Resend) account
6. Configure WhatsApp integration (Twilio)

### 3. Security Checklist
- [ ] All placeholder values replaced
- [ ] Secrets are cryptographically secure
- [ ] Database credentials are production-ready
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] File upload directory has proper permissions

## Service Integration Guides

### Email Service Setup (Resend)
1. Sign up at https://resend.com
2. Verify your domain for professional emails
3. Generate API key
4. Update `RESEND_API_KEY` in environment

### WhatsApp Integration Setup (Twilio)
1. Create Twilio account
2. Set up WhatsApp Business sandbox
3. Configure webhook endpoints
4. Update Twilio credentials in environment

### Production Database Setup
1. Ensure PostgreSQL database is provisioned
2. Run database migrations: `npx prisma db push`
3. Seed initial data if needed
4. Configure backup procedures

## Troubleshooting

### Common Issues
1. **Database Connection**: Verify DATABASE_URL format and credentials
2. **Email Not Sending**: Check RESEND_API_KEY and domain verification
3. **WhatsApp Integration**: Verify Twilio webhook configuration
4. **File Uploads**: Check directory permissions and disk space
5. **Session Issues**: Regenerate NEXTAUTH_SECRET if sessions invalid

### Environment Validation
```bash
# Test database connection
npx prisma db pull

# Validate environment
npm run build

# Test email service (if configured)
npm run test:email
```

## Status: Environment Configuration Complete ✅

All environment variables have been configured with appropriate defaults and placeholders. The system is ready for:
- ✅ Development with working database
- ✅ Production deployment (after updating placeholder values)
- ✅ Email service integration (when API key provided)
- ✅ WhatsApp integration (when Twilio configured)
- ✅ File uploads and PDF generation
- ✅ Security and rate limiting features

## Next Steps
1. For development: Continue using the system as-is
2. For production: Replace placeholder values with actual credentials
3. For email/WhatsApp: Set up service accounts and update keys