/**
 * Database diagnostics script
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Database Diagnostic Report');
  console.log('==============================');

  try {
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connection: SUCCESSFUL');

    // Check companies
    const companies = await prisma.company.findMany();
    console.log(`\n📊 Companies in database: ${companies.length}`);
    companies.forEach(company => {
      console.log(`   - ${company.name} (ID: ${company.id})`);
    });

    // Check customers
    const customers = await prisma.customer.findMany({
      include: {
        company: {
          select: { name: true }
        }
      }
    });
    console.log(`\n👥 Customers in database: ${customers.length}`);
    customers.forEach(customer => {
      console.log(`   - ${customer.name} (ID: ${customer.id}, Company: ${customer.company?.name || 'N/A'})`);
    });

    // Check for 'default-company' specifically
    const defaultCompany = await prisma.company.findUnique({
      where: { id: 'default-company' },
      include: {
        customers: true
      }
    });

    if (defaultCompany) {
      console.log(`\n🎯 Default Company Found:`);
      console.log(`   - Name: ${defaultCompany.name}`);
      console.log(`   - Customers: ${defaultCompany.customers.length}`);
      defaultCompany.customers.forEach(customer => {
        console.log(`     • ${customer.name} (${customer.id})`);
      });
    } else {
      console.log(`\n❌ 'default-company' NOT FOUND`);
    }

    // Test customer lookup with company scoping
    console.log(`\n🔍 Testing Customer Lookup (Company Scoped):`);
    if (customers.length > 0) {
      const testCustomer = customers[0];

      // Test WITHOUT company scoping (old way)
      const customerNoScope = await prisma.customer.findUnique({
        where: { id: testCustomer.id }
      });
      console.log(`   - Without company scope: ${customerNoScope ? 'FOUND' : 'NOT FOUND'}`);

      // Test WITH company scoping (new way)
      const customerWithScope = await prisma.customer.findUnique({
        where: {
          id: testCustomer.id,
          companyId: 'default-company'
        }
      });
      console.log(`   - With company scope: ${customerWithScope ? 'FOUND' : 'NOT FOUND'}`);

      if (customerWithScope) {
        console.log(`   - Customer belongs to company: ${customerWithScope.companyId}`);
      }
    }

    // Check invoices
    const invoices = await prisma.invoice.findMany();
    console.log(`\n📄 Invoices in database: ${invoices.length}`);

    console.log('\n✅ Database diagnostic complete');

  } catch (error) {
    console.error('❌ Database diagnostic failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();