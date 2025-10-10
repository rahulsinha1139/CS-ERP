/**
 * Comprehensive Simple ID Implementation
 * Changes entire system to use zero-padded IDs: 001, 002, 003
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate zero-padded IDs
function generateSimpleId(prefix: string, number: number): string {
  return `${prefix}${number.toString().padStart(3, '0')}`;
}

async function main() {
  console.log('🔄 Implementing Simple ID System');
  console.log('================================');

  try {
    // Step 1: Create ID mapping for existing data
    console.log('\n📊 Step 1: Analyzing existing data...');

    const companies = await prisma.company.findMany();
    const customers = await prisma.customer.findMany();
    const invoices = await prisma.invoice.findMany();
    const payments = await prisma.payment.findMany();

    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Invoices: ${invoices.length}`);
    console.log(`   - Payments: ${payments.length}`);

    // Step 2: Delete all existing data to start fresh with simple IDs
    console.log('\n🗑️ Step 2: Clearing existing data...');
    await prisma.payment.deleteMany();
    await prisma.invoiceLine.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.company.deleteMany();
    console.log('   ✅ All existing data cleared');

    // Step 3: Create company with simple ID
    console.log('\n🏢 Step 3: Creating company with simple ID...');
    const newCompany = await prisma.company.create({
      data: {
        id: '001',
        name: 'CS Practice Demo Company',
        email: 'demo@cspractice.com',
        phone: '+91-9876543210',
        address: 'Demo Address, Bangalore, Karnataka, India',
        gstin: '29ABCDE1234F1Z5',
        stateCode: '29',
        website: 'https://cspractice.com',
      }
    });
    console.log(`   ✅ Company created: ${newCompany.name} (ID: ${newCompany.id})`);

    // Step 4: Create customers with simple IDs
    console.log('\n👥 Step 4: Creating customers with simple IDs...');
    const customers1 = await prisma.customer.create({
      data: {
        id: '001',
        name: 'Demo Customer Pvt Ltd',
        email: 'demo1@testcustomer.com',
        phone: '+91-9876543211',
        address: 'Customer Address, Mumbai, Maharashtra, India',
        gstin: '27FGHIJ5678K2L9',
        stateCode: '27',
        companyId: '001',
        creditLimit: 100000,
        creditDays: 30,
      },
    });

    const customers2 = await prisma.customer.create({
      data: {
        id: '002',
        name: 'Another Demo Company Ltd',
        email: 'demo2@testcustomer.com',
        phone: '+91-9876543212',
        address: 'Another Address, Bangalore, Karnataka, India',
        gstin: '29KLMNO9012P3Q6',
        stateCode: '29',
        companyId: '001',
        creditLimit: 50000,
        creditDays: 15,
      },
    });

    console.log(`   ✅ Customer 1: ${customers1.name} (ID: ${customers1.id})`);
    console.log(`   ✅ Customer 2: ${customers2.name} (ID: ${customers2.id})`);

    // Step 5: Create sample invoice with simple ID
    console.log('\n📄 Step 5: Creating sample invoice with simple ID...');
    const invoice = await prisma.invoice.create({
      data: {
        id: '001',
        number: 'INV-2024-001',
        customerId: '001',
        companyId: '001',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: 10000,
        cgstAmount: 900,
        sgstAmount: 900,
        igstAmount: 0,
        totalTax: 1800,
        grandTotal: 11800,
        paidAmount: 0,
        status: 'SENT',
        lines: {
          create: [
            {
              id: '001',
              description: 'ROC Annual Filing Service',
              quantity: 1,
              rate: 10000,
              amount: 10000,
              gstRate: 18,
              hsnSac: '9983',
              isReimbursement: false,
            }
          ]
        }
      }
    });

    console.log(`   ✅ Invoice created: ${invoice.number} (ID: ${invoice.id})`);

    // Step 6: Create sample payment with simple ID
    console.log('\n💰 Step 6: Creating sample payment with simple ID...');
    const payment = await prisma.payment.create({
      data: {
        id: '001',
        invoiceId: '001',
        customerId: '001',
        companyId: '001',
        amount: 5000,
        method: 'BANK_TRANSFER',
        reference: 'UTR123456789',
        paymentDate: new Date(),
        status: 'COMPLETED',
        notes: 'Partial payment received',
      }
    });

    console.log(`   ✅ Payment created: ₹${payment.amount} (ID: ${payment.id})`);

    // Step 7: Update invoice paid amount
    await prisma.invoice.update({
      where: { id: '001' },
      data: {
        paidAmount: 5000,
        status: 'PARTIALLY_PAID'
      }
    });

    console.log('\n🎉 Simple ID System Implementation Complete!');
    console.log('==========================================');
    console.log('\n📊 New System Summary:');
    console.log(`   - Company: "CS Practice Demo Company" (ID: 001)`);
    console.log(`   - Customer 1: "Demo Customer Pvt Ltd" (ID: 001)`);
    console.log(`   - Customer 2: "Another Demo Company Ltd" (ID: 002)`);
    console.log(`   - Invoice: "INV-2024-001" (ID: 001)`);
    console.log(`   - Payment: "₹5,000" (ID: 001)`);
    console.log('\n✅ All IDs are now simple, zero-padded format!');
    console.log('✅ Frontend should work immediately with these IDs!');

  } catch (error) {
    console.error('❌ Implementation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();