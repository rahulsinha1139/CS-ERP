/**
 * Database Cleanup and Update Script
 *
 * Purpose:
 * 1. Remove duplicate services
 * 2. Clean test customer/invoice data
 * 3. Update company profile with correct details
 * 4. Prepare for production deployment
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup and update...\n');

  // Step 1: Clean up duplicate services
  console.log('📋 Step 1: Cleaning up duplicate services...');

  // Get first company to use its ID
  const companyForServices = await prisma.company.findFirst();

  if (!companyForServices) {
    console.log('⚠️  No company found, skipping service cleanup\n');
    return;
  }

  // Get all services with their counts
  const services = await prisma.serviceTemplate.findMany({
    where: {
      companyId: companyForServices.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  console.log(`Found ${services.length} services in total`);

  // Group by name and keep only the first occurrence
  const servicesByName = new Map<string, typeof services[0]>();
  const duplicatesToDelete: string[] = [];

  for (const service of services) {
    if (!servicesByName.has(service.name)) {
      servicesByName.set(service.name, service);
      console.log(`  ✅ Keeping: ${service.name}`);
    } else {
      duplicatesToDelete.push(service.id);
      console.log(`  ❌ Marking for deletion: ${service.name} (duplicate)`);
    }
  }

  if (duplicatesToDelete.length > 0) {
    const deleted = await prisma.serviceTemplate.deleteMany({
      where: {
        id: {
          in: duplicatesToDelete,
        },
      },
    });
    console.log(`\n✅ Deleted ${deleted.count} duplicate services\n`);
  } else {
    console.log('\n✅ No duplicate services found\n');
  }

  // Step 2: Clean test customers and invoices
  console.log('📋 Step 2: Cleaning test customer and invoice data...');

  const customersDeleted = await prisma.customer.deleteMany({
    where: {
      companyId: companyForServices.id,
    },
  });

  console.log(`✅ Deleted ${customersDeleted.count} test customers (and related invoices/payments)\n`);

  // Step 3: Update or create company profile
  console.log('📋 Step 3: Updating company profile with correct details...');

  // Get first company or create new one
  let company = await prisma.company.findFirst();

  if (company) {
    company = await prisma.company.update({
      where: { id: company.id },
      data: {
        name: 'PRAGNYA PRADHAN & ASSOCIATES',
        email: 'pragnyap.pradhan@gmail.com',
        phone: '9953457413',
        address: '46, LGF, JOR BAGH, New Delhi-110003',
        gstin: null, // Under 40L limit
        stateCode: '07', // Delhi
        pan: 'AMEPP4323R',
        website: null,
        logo: '/images/company-logo.png',
      },
    });
  } else {
    company = await prisma.company.create({
      data: {
        id: 'company_pradhan_001',
        name: 'PRAGNYA PRADHAN & ASSOCIATES',
        email: 'pragnyap.pradhan@gmail.com',
        phone: '9953457413',
        address: '46, LGF, JOR BAGH, New Delhi-110003',
        gstin: null, // Under 40L limit
        stateCode: '07', // Delhi
        pan: 'AMEPP4323R',
        website: null,
        logo: '/images/company-logo.png',
      },
    });
  }

  console.log('✅ Company profile updated:');
  console.log(`   Name: ${company.name}`);
  console.log(`   Email: ${company.email}`);
  console.log(`   Phone: ${company.phone}`);
  console.log(`   Address: ${company.address}`);
  console.log(`   GSTIN: ${company.gstin || 'N/A (under 40L limit)'}`);
  console.log(`   Logo: ${company.logo}\n`);

  // Step 4: Update company settings
  console.log('📋 Step 4: Updating company settings...');

  const settings = await prisma.companySettings.upsert({
    where: {
      companyId: company.id,
    },
    create: {
      companyId: company.id,
      emailProvider: 'RESEND',
      fromEmail: 'pragnyap.pradhan@gmail.com',
      fromName: 'PRAGNYA PRADHAN & ASSOCIATES',
      emailEnabled: false, // Will be enabled when Resend is configured
      autoSendInvoices: false,
      defaultEmailTemplate: null,
    },
    update: {
      fromEmail: 'pragnyap.pradhan@gmail.com',
      fromName: 'PRAGNYA PRADHAN & ASSOCIATES',
    },
  });

  console.log('✅ Company settings updated\n');

  // Step 5: Summary
  console.log('🎉 Database cleanup and update complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Unique services: ${servicesByName.size}`);
  console.log(`   - Duplicates removed: ${duplicatesToDelete.length}`);
  console.log(`   - Test customers removed: ${customersDeleted.count}`);
  console.log(`   - Company profile: Updated ✅`);
  console.log(`   - Company settings: Updated ✅\n`);

  console.log('✨ Database is now ready for production with clean data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
