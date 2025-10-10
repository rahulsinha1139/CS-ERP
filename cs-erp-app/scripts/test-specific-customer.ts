/**
 * Test specific customer lookup that frontend is trying
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing Frontend Customer Lookup');
  console.log('===================================');

  // Get customers available for 'default-company'
  const defaultCompanyCustomers = await prisma.customer.findMany({
    where: {
      companyId: 'default-company'
    }
  });

  console.log('\n✅ Customers available for default-company:');
  defaultCompanyCustomers.forEach(customer => {
    console.log(`   - ${customer.name} (ID: ${customer.id})`);
  });

  // Check what customer.getList returns (this is what frontend dropdown shows)
  const customerListForCompany = await prisma.customer.findMany({
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

  console.log('\n📋 Customer.getList results (what frontend sees):');
  customerListForCompany.forEach(customer => {
    console.log(`   - ${customer.name} (ID: ${customer.id})`);
  });

  // Test invoice creation scenario
  if (customerListForCompany.length > 0) {
    const testCustomer = customerListForCompany[0];
    console.log(`\n🧪 Testing invoice creation with: ${testCustomer.name}`);

    // Test the exact lookup that invoice.create does
    const customerLookup = await prisma.customer.findUnique({
      where: {
        id: testCustomer.id,
        companyId: 'default-company'
      }
    });

    const companyLookup = await prisma.company.findUnique({
      where: { id: 'default-company' }
    });

    console.log(`   - Customer lookup result: ${customerLookup ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   - Company lookup result: ${companyLookup ? 'SUCCESS' : 'FAILED'}`);

    if (customerLookup && companyLookup) {
      console.log(`   ✅ Invoice creation should work!`);
      console.log(`   - Customer: ${customerLookup.name} (${customerLookup.stateCode})`);
      console.log(`   - Company: ${companyLookup.name} (${companyLookup.stateCode})`);
    } else {
      console.log(`   ❌ Invoice creation will fail`);
    }
  } else {
    console.log('\n❌ No customers available for default-company');
  }

  await prisma.$disconnect();
}

main();