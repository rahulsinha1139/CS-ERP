/**
 * Fix company data structure issue
 * Creates the 'default-company' that the system expects to exist
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing company data structure...');

  // Create the expected 'default-company' that tRPC context references
  const company = await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {},
    create: {
      id: 'default-company', // Explicit ID to match tRPC context
      name: 'CS Practice Demo Company',
      email: 'demo@cspractice.com',
      phone: '+91-9876543210',
      address: 'Demo Address, Bangalore, Karnataka, India',
      gstin: '29ABCDE1234F1Z5',
      stateCode: '29',
      website: 'https://cspractice.com',
    },
  });

  console.log('✅ Company created with correct ID:', company.id);

  // Create demo customers linked to this company
  const customer1 = await prisma.customer.create({
    data: {
      id: '001',
      name: 'Demo Customer Pvt Ltd',
      email: 'demo1@testcustomer.com',
      phone: '+91-9876543211',
      address: 'Customer Address, Mumbai, Maharashtra, India',
      gstin: '27FGHIJ5678K2L9',
      stateCode: '27',
      companyId: 'default-company', // Link to the default company
      creditLimit: 100000,
      creditDays: 30,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      id: '002',
      name: 'Another Demo Company Ltd',
      email: 'demo2@testcustomer.com',
      phone: '+91-9876543212',
      address: 'Another Address, Bangalore, Karnataka, India',
      gstin: '29KLMNO9012P3Q6',
      stateCode: '29',
      companyId: 'default-company', // Link to the default company
      creditLimit: 50000,
      creditDays: 15,
    },
  });

  console.log('✅ Customers created:', customer1.name, customer2.name);

  console.log('🎉 Company data structure fixed successfully!');
  console.log('');
  console.log('📊 System Status:');
  console.log(`- Company ID: ${company.id} (matches tRPC context)`);
  console.log(`- Company Name: ${company.name}`);
  console.log(`- Customer 1: ${customer1.name} (ID: ${customer1.id})`);
  console.log(`- Customer 2: ${customer2.name} (ID: ${customer2.id})`);
  console.log('');
  console.log('✅ Invoice creation should now work correctly!');
}

main()
  .catch((e) => {
    console.error('❌ Fix failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });