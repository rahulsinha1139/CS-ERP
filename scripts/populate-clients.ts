#!/usr/bin/env npx tsx
/**
 * Database Population Script
 * Populate CS ERP with client data from CSV
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CSV data from the provided file
const clientData = [
  { name: 'JINDAL PHOTO LIMITED', email: 'cs_jphoto@jindalgroup.com' },
  { name: 'JINDAL SPORTS PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'ADORABLE ALLOYS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'AGILE PROPERTIES LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CHAMPAK NIKETAN PVT LTD', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED FINVEST & HOLDINGS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED BUILDWELL LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED REALCON PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED REALTORS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL FLEXIFILMS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL MEADOWS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL POLY INVESTMENT AND FINANCE COMPANY LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONCATENATE ADVEST ADVISORY PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL FOOTBALL PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONCATENATE IMAGING ADVEST PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'VIGIL FARMS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL REALTORS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'SNAP PACK PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CLIFF PROPBUILD LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'LUCKY HOLDINGS', email: 'corporate_sectt@jindalgroup.com' },
];

async function main() {
  console.log('🚀 Starting database population...');

  try {
    // 1. Ensure default company exists
    console.log('📊 Setting up default company...');

    let company = await prisma.company.findUnique({
      where: { id: 'default-company' }
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          id: 'default-company',
          name: 'CS Practice',
          email: 'admin@cspractice.com',
          phone: '+91-9876543210',
          address: 'Professional Office, Business District',
          gstin: '27ABCDE1234F1Z5',
          stateCode: '27',
          settings: {
            create: {
              id: '001',
              emailEnabled: true,
              whatsappEnabled: true,
              autoSendInvoices: true,
              complianceReminderDays: 7,
              paymentReminderDays: 3,
              fromEmail: 'admin@cspractice.com',
              fromName: 'CS Practice',
            }
          }
        },
      });
      console.log('✅ Default company created');
    } else {
      console.log('✅ Default company already exists');
    }

    // 2. Clear existing customers for fresh start
    console.log('🧹 Clearing existing customer data...');
    await prisma.customer.deleteMany({
      where: { companyId: 'default-company' }
    });

    // 3. Create customers from CSV data
    console.log('👥 Creating customers from CSV data...');

    for (let i = 0; i < clientData.length; i++) {
      const client = clientData[i];

      if (!client.name.trim()) continue; // Skip empty entries

      // Generate some realistic data for Indian companies
      const gstin = `27${String(Math.random()).substring(2, 12).padStart(10, '0')}5F1Z${i % 10}`;
      const phone = `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`;

      const customer = await prisma.customer.create({
        data: {
          id: `cust-${(i + 1).toString().padStart(3, '0')}`,
          name: client.name,
          email: client.email,
          phone: phone,
          address: 'Mumbai, Maharashtra, India',
          gstin: gstin,
          stateCode: '27', // Maharashtra
          creditLimit: 500000 + Math.floor(Math.random() * 2000000), // Random credit limit 5L-25L
          creditDays: [15, 30, 45, 60][Math.floor(Math.random() * 4)], // Random payment terms
          companyId: 'default-company',
          timezone: 'Asia/Kolkata',
          preferredLanguage: 'en',
          whatsappNumber: phone,
        },
      });

      console.log(`✅ Created customer: ${customer.name}`);
    }

    console.log('🎉 Database population completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • Company: 1 (CS Practice)`);
    console.log(`   • Customers: ${clientData.length}`);

  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });