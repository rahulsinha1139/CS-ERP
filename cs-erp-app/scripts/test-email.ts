/**
 * Test Email Sending with Resend
 *
 * Usage: npx tsx scripts/test-email.ts YOUR_EMAIL@example.com
 */

import { config } from 'dotenv';
import { Resend } from 'resend';

// Load environment variables from .env.local
config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  const testEmail = process.argv[2];

  if (!testEmail) {
    console.error('❌ Error: Please provide a test email address');
    console.log('\nUsage: npx tsx scripts/test-email.ts YOUR_EMAIL@example.com');
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in environment');
    process.exit(1);
  }

  if (!process.env.FROM_EMAIL) {
    console.error('❌ Error: FROM_EMAIL not found in environment');
    process.exit(1);
  }

  console.log('📧 Testing Resend Email Configuration...\n');
  console.log(`From: ${process.env.FROM_EMAIL}`);
  console.log(`Reply-To: ${process.env.REPLY_TO_EMAIL || 'Not configured'}`);
  console.log(`To: ${testEmail}\n`);

  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: testEmail,
      replyTo: process.env.REPLY_TO_EMAIL,
      subject: 'Test Email from Pragnya Pradhan & Associates',
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Email</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1e40af; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .footer { background-color: #f1f5f9; padding: 20px; border-radius: 0 0 8px 8px; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🎉 Email Configuration Successful!</h1>
        </div>

        <div class="content">
            <h2>Congratulations!</h2>
            <p>Your Resend email integration is working perfectly.</p>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e40af;">Configuration Details:</h3>
                <p><strong>Sender:</strong> ${process.env.FROM_EMAIL}</p>
                <p><strong>API Provider:</strong> Resend</p>
                <p><strong>Status:</strong> ✅ Active</p>
            </div>

            <p>You can now send invoices, payment reminders, and compliance notifications to your clients.</p>

            <p>Best regards,<br>
            <strong>Pragnya Pradhan & Associates</strong></p>
        </div>

        <div class="footer">
            <p style="margin: 0;">This is a test email from your CS ERP System.</p>
        </div>
    </div>
</body>
</html>`,
    });

    console.log('✅ Email sent successfully!\n');
    console.log('📋 Details:');
    console.log(`   Message ID: ${result.data?.id}`);
    console.log(`   Recipient: ${testEmail}`);
    console.log(`\n💡 Check your inbox (including spam folder) for the test email.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    process.exit(1);
  }
}

testEmail();
