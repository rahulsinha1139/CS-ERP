/**
 * Quick seed script to add test data for invoice creation
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Create a test company first
  const company = await prisma.company.upsert({
    where: { email: 'test@company.com' },
    update: {},
    create: {
      name: 'Test Company Secretary Practice',
      email: 'test@company.com',
      phone: '+91-9876543210',
      address: 'Test Address, Bangalore, Karnataka, India',
      gstin: '29ABCDE1234F1Z5',
      stateCode: '29',
      website: 'https://testcompany.com',
    },
  });

  console.log('✅ Company created:', company.name);

  // Create test customers
  const customer1 = await prisma.customer.upsert({
    where: { email: 'customer1@test.com' },
    update: {},
    create: {
      name: 'Test Customer Private Limited',
      email: 'customer1@test.com',
      phone: '+91-9876543211',
      address: 'Customer Address, Mumbai, Maharashtra, India',
      gstin: '27FGHIJ5678K2L9',
      stateCode: '27',
      companyId: company.id,
      creditLimit: 100000,
      creditDays: 30,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { email: 'customer2@test.com' },
    update: {},
    create: {
      name: 'Another Test Company Ltd',
      email: 'customer2@test.com',
      phone: '+91-9876543212',
      address: 'Another Address, Bangalore, Karnataka, India',
      gstin: '29KLMNO9012P3Q6',
      stateCode: '29',
      companyId: company.id,
      creditLimit: 50000,
      creditDays: 15,
    },
  });

  console.log('✅ Customers created:', customer1.name, customer2.name);

  // Create some service templates
  const serviceTemplate1 = await prisma.serviceTemplate.upsert({
    where: { name: 'ROC Annual Filing' },
    update: {},
    create: {
      name: 'ROC Annual Filing',
      description: 'Annual Return filing with ROC',
      defaultRate: 2500,
      gstRate: 18,
      hsnSac: '9983',
      companyId: company.id,
      category: 'COMPLIANCE',
    },
  });

  const serviceTemplate2 = await prisma.serviceTemplate.upsert({
    where: { name: 'GST Return Filing' },
    update: {},
    create: {
      name: 'GST Return Filing',
      description: 'Monthly GST return filing',
      defaultRate: 1500,
      gstRate: 18,
      hsnSac: '9984',
      companyId: company.id,
      category: 'COMPLIANCE',
    },
  });

  console.log('✅ Service templates created:', serviceTemplate1.name, serviceTemplate2.name);

  console.log('🎉 Test data seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`- Company: ${company.name} (ID: ${company.id})`);
  console.log(`- Customer 1: ${customer1.name} (ID: ${customer1.id})`);
  console.log(`- Customer 2: ${customer2.name} (ID: ${customer2.id})`);
  console.log(`- Service Templates: 2 created`);
  console.log('');
  console.log('✅ You can now try creating invoices in the app!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });