/**
 * Debug the actual customer IDs being used
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Customer ID Debug Report');
  console.log('===========================');

  // Get exactly what customer.getList returns (what frontend dropdown shows)
  const customersFromGetList = await prisma.customer.findMany({
    where: { companyId: 'default-company' },
    select: {
      id: true,
      name: true,
      email: true,
      gstin: true,
      stateCode: true,
    },
    orderBy: { name: 'asc' },
  });

  console.log('\n📋 Customer.getList results (frontend dropdown):');
  customersFromGetList.forEach((customer, index) => {
    console.log(`   ${index + 1}. "${customer.name}"`);
    console.log(`      ID: ${customer.id}`);
    console.log(`      Email: ${customer.email || 'N/A'}`);
    console.log('');
  });

  // Test the exact lookup for each customer
  console.log('🧪 Testing invoice.create lookup for each customer:');
  for (const customer of customersFromGetList) {
    console.log(`\n   Testing: ${customer.name}`);
    console.log(`   ID: ${customer.id}`);

    const lookupResult = await prisma.customer.findUnique({
      where: {
        id: customer.id,
        companyId: 'default-company'
      }
    });

    console.log(`   Result: ${lookupResult ? '✅ FOUND' : '❌ NOT FOUND'}`);

    if (lookupResult) {
      console.log(`   ✓ Customer belongs to company: ${lookupResult.companyId}`);
    }
  }

  // Also check if there are any customer ID format issues
  console.log('\n🔍 Customer ID Analysis:');
  const allCustomers = await prisma.customer.findMany({
    select: { id: true, name: true, companyId: true }
  });

  allCustomers.forEach(customer => {
    const belongsToDefault = customer.companyId === 'default-company';
    console.log(`   ${customer.name}: ${customer.id} (${belongsToDefault ? 'default-company' : customer.companyId})`);
  });

  await prisma.$disconnect();
}

main();