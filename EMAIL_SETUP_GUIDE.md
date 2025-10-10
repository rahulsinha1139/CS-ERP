# 📧 Email Setup Guide - Resend API

## 🎯 Quick Setup (5 minutes)

### **Step 1: Get FREE Resend API Key**

1. Visit [resend.com](https://resend.com)
2. Click "Start Building" (FREE plan - 100 emails/day)
3. Sign up with email (or GitHub)
4. Verify email address
5. Go to "API Keys" section
6. Click "Create API Key"
7. Name it: "CS ERP Production"
8. Copy the key (starts with `re_`)

**Example key format**: `re_123abc456def789ghi012jkl345mno678pqr`

---

### **Step 2: Add Domain (Optional but Recommended)**

For professional emails from `pragnyap.pradhan@gmail.com`:

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter: `gmail.com` (if using Gmail)
4. Follow DNS verification steps

**OR use Resend's default domain** (works immediately):
- Emails will send from: `onboarding@resend.dev`
- Reply-to will be: `pragnyap.pradhan@gmail.com`

---

### **Step 3: Configure in Application**

#### **Option A: Environment Variable (Recommended for Vercel)**

1. Open `.env.local` in the project
2. Replace this line:
   ```
   RESEND_API_KEY="re_dev_placeholder_key_replace_with_actual_resend_api_key"
   ```

   With your actual key:
   ```
   RESEND_API_KEY="re_your_actual_key_here"
   ```

3. In Vercel dashboard (after deployment):
   - Go to Project Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_your_actual_key_here`
   - Redeploy

#### **Option B: Database Configuration (Alternative)**

Run this script in Prisma Studio or via SQL:

```sql
UPDATE "CompanySettings"
SET
  "emailProvider" = 'RESEND',
  "smtpUser" = 'encrypted_resend_key_here',
  "fromEmail" = 'pragnyap.pradhan@gmail.com',
  "fromName" = 'PRAGNYA PRADHAN & ASSOCIATES',
  "emailEnabled" = true,
  "autoSendInvoices" = false
WHERE "companyId" = (SELECT "id" FROM "Company" LIMIT 1);
```

---

### **Step 4: Test Email Sending**

1. Login to the application
2. Create a test invoice
3. Click "Send Email" button
4. Check if email arrives (check spam folder too)

---

## 📧 **EMAIL CONFIGURATION**

### **Current Settings:**
- **From Name**: PRAGNYA PRADHAN & ASSOCIATES
- **From Email**: pragnyap.pradhan@gmail.com
- **Reply-To**: pragnyap.pradhan@gmail.com
- **Provider**: Resend
- **Cost**: FREE (100 emails/day)

### **Email Templates Available:**
1. **Invoice Email** - Professional invoice with PDF attachment
2. **Payment Reminder** - Automated overdue payment alerts
3. **Compliance Reminder** - Regulatory deadline notifications
4. **Welcome Email** - New customer onboarding

---

## 🔧 **TROUBLESHOOTING**

### **Emails not sending:**
1. Check API key is correct in environment variables
2. Verify Resend dashboard shows "Active" status
3. Check application logs for errors
4. Ensure email addresses are valid

### **Emails going to spam:**
1. Add custom domain (not using Resend default)
2. Set up SPF/DKIM records (Resend provides these)
3. Ask recipients to whitelist your email

### **Free tier limits exceeded:**
- **Limit**: 100 emails/day
- **Solution**: Upgrade to Resend paid plan ($20/month for 50,000 emails)

---

## 💰 **PRICING**

### **Resend Free Tier (Current):**
- ✅ 100 emails/day
- ✅ 1 custom domain
- ✅ Email API access
- ✅ Email tracking
- ✅ Perfect for small CS practice

### **Paid Plans (If Needed):**
- **$20/month**: 50,000 emails/month
- **$80/month**: 500,000 emails/month

---

## 🚀 **QUICK START (Copy-Paste)**

1. **Get API Key**: https://resend.com/api-keys
2. **Add to .env.local**:
   ```
   RESEND_API_KEY="re_paste_your_key_here"
   ```
3. **Restart dev server**: `npm run dev`
4. **Test**: Send an invoice email from the app

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Resend account created
- [ ] API key generated and copied
- [ ] API key added to .env.local
- [ ] (Optional) Custom domain added and verified
- [ ] Dev server restarted
- [ ] Test email sent successfully
- [ ] (For production) API key added to Vercel environment variables

---

**Need help?** Check Resend documentation: https://resend.com/docs
