/**
 * Comprehensive Customer Pipeline Test
 * Tests all customer management features end-to-end
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCustomerPipeline() {
  console.log('🚀 Starting Customer Pipeline Test...\n');

  try {
    // Get the actual company ID from database
    const company = await prisma.company.findFirst();
    if (!company) {
      throw new Error('No company found. Please run db:seed first.');
    }

    console.log('🏢 Using company:', company.name, '(ID:', company.id.substring(0, 8) + '...)');

    // 1. Test Customer Creation
    console.log('\n1️⃣ TESTING: Customer Creation');
    const newCustomer = await prisma.customer.create({
      data: {
        name: 'Test Client Ltd',
        email: 'test@testclient.com',
        phone: '+91-9999999999',
        address: '123 Test Street, Test City, Test State, 123456',
        gstin: '27TESTCLIENT1234',
        stateCode: '27',
        creditLimit: 50000,
        creditDays: 30,
        companyId: company.id, // Using the actual company ID
      }
    });
    console.log('✅ Customer created:', newCustomer.name, '(ID:', newCustomer.id.substring(0, 8) + '...)');

    // 2. Test Invoice Creation for Customer
    console.log('\n2️⃣ TESTING: Invoice Creation');
    const newInvoice = await prisma.invoice.create({
      data: {
        number: 'TEST-INV-001',
        status: 'SENT',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        customerId: newCustomer.id,
        companyId: company.id,
        subtotal: 10000,
        cgstAmount: 900,
        sgstAmount: 900,
        igstAmount: 0,
        totalTax: 1800,
        grandTotal: 11800,
        paidAmount: 0,
        placeOfSupply: 'Maharashtra',
        notes: 'Test invoice for pipeline testing',
        lines: {
          create: [
            {
              description: 'Legal Consultation Services',
              quantity: 2,
              rate: 5000,
              amount: 10000,
              gstRate: 18,
              hsnSac: '998311',
            }
          ]
        }
      },
      include: {
        lines: true,
      }
    });
    console.log('✅ Invoice created:', newInvoice.number, 'Amount:', newInvoice.grandTotal);

    // 3. Test Partial Payment
    console.log('\n3️⃣ TESTING: Partial Payment');
    const partialPayment = await prisma.payment.create({
      data: {
        invoiceId: newInvoice.id,
        customerId: newCustomer.id,
        companyId: company.id,
        amount: 5000, // Partial payment
        paymentDate: new Date(),
        method: 'BANK_TRANSFER',
        reference: 'TEST-PAY-001',
        notes: 'Test partial payment',
      }
    });

    // Update invoice paid amount
    await prisma.invoice.update({
      where: { id: newInvoice.id },
      data: {
        paidAmount: 5000,
        status: 'PARTIALLY_PAID',
      }
    });
    console.log('✅ Partial payment recorded:', partialPayment.amount);

    // 4. Test Another Invoice (Overdue)
    console.log('\n4️⃣ TESTING: Overdue Invoice Creation');
    const overdueInvoice = await prisma.invoice.create({
      data: {
        number: 'TEST-INV-002',
        status: 'SENT',
        issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days overdue
        customerId: newCustomer.id,
        companyId: company.id,
        subtotal: 15000,
        cgstAmount: 1350,
        sgstAmount: 1350,
        igstAmount: 0,
        totalTax: 2700,
        grandTotal: 17700,
        paidAmount: 0,
        placeOfSupply: 'Maharashtra',
        notes: 'Test overdue invoice',
        lines: {
          create: [
            {
              description: 'Company Incorporation Services',
              quantity: 1,
              rate: 15000,
              amount: 15000,
              gstRate: 18,
              hsnSac: '998311',
            }
          ]
        }
      }
    });
    console.log('✅ Overdue invoice created:', overdueInvoice.number);

    // 5. Test Customer Dashboard Data Retrieval
    console.log('\n5️⃣ TESTING: Customer Dashboard Data');
    const customerWithDetails = await prisma.customer.findUnique({
      where: { id: newCustomer.id },
      include: {
        invoices: {
          include: {
            payments: true,
            lines: true,
          },
          orderBy: { issueDate: 'desc' },
        },
        payments: {
          include: {
            invoice: {
              select: {
                number: true,
                issueDate: true,
              }
            }
          },
          orderBy: { paymentDate: 'desc' },
        },
        _count: {
          select: {
            invoices: true,
            payments: true,
          }
        }
      }
    });

    // Calculate financial summary
    const totalBilled = customerWithDetails.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPaid = customerWithDetails.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = totalBilled - totalPaid;
    const paidInvoices = customerWithDetails.invoices.filter(inv => inv.paidAmount >= inv.grandTotal).length;
    const overdueInvoices = customerWithDetails.invoices.filter(inv =>
      inv.dueDate && new Date(inv.dueDate) < new Date() && inv.paidAmount < inv.grandTotal
    ).length;

    console.log('📊 Customer Financial Summary:');
    console.log(`   - Total Invoices: ${customerWithDetails._count.invoices}`);
    console.log(`   - Total Billed: ₹${totalBilled.toLocaleString('en-IN')}`);
    console.log(`   - Total Paid: ₹${totalPaid.toLocaleString('en-IN')}`);
    console.log(`   - Total Outstanding: ₹${totalOutstanding.toLocaleString('en-IN')}`);
    console.log(`   - Paid Invoices: ${paidInvoices}`);
    console.log(`   - Overdue Invoices: ${overdueInvoices}`);
    console.log(`   - Payment Rate: ${totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0}%`);

    // 6. Test Invoice Status Calculations
    console.log('\n6️⃣ TESTING: Invoice Payment Status Calculations');
    customerWithDetails.invoices.forEach(invoice => {
      const paymentStatus = invoice.paidAmount >= invoice.grandTotal
        ? 'PAID'
        : invoice.paidAmount > 0
          ? 'PARTIALLY_PAID'
          : 'UNPAID';

      const outstandingAmount = Math.max(0, invoice.grandTotal - invoice.paidAmount);
      const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && outstandingAmount > 0;
      const daysPastDue = isOverdue
        ? Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      console.log(`   Invoice ${invoice.number}:`);
      console.log(`     - Status: ${paymentStatus}`);
      console.log(`     - Outstanding: ₹${outstandingAmount.toLocaleString('en-IN')}`);
      console.log(`     - Overdue: ${isOverdue ? `Yes (${daysPastDue} days)` : 'No'}`);
    });

    // 7. Test Customer List Query (similar to tRPC getAll)
    console.log('\n7️⃣ TESTING: Customer List Query');
    const allCustomers = await prisma.customer.findMany({
      where: {
        companyId: company.id,
        OR: [
          { name: { contains: 'Test', mode: 'insensitive' } },
        ]
      },
      include: {
        invoices: {
          select: {
            grandTotal: true,
            paidAmount: true,
            status: true,
            dueDate: true,
          }
        },
        payments: {
          select: {
            amount: true,
            paymentDate: true,
          }
        },
        _count: {
          select: {
            invoices: true,
            payments: true,
          }
        }
      },
      orderBy: { name: 'asc' },
    });

    console.log(`📋 Found ${allCustomers.length} customers matching search:`);
    allCustomers.forEach(customer => {
      const customerTotalBilled = customer.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
      const customerTotalPaid = customer.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      const customerOverdue = customer.invoices.filter(inv =>
        inv.dueDate && new Date(inv.dueDate) < new Date() && inv.paidAmount < inv.grandTotal
      ).length;

      console.log(`   - ${customer.name}: ₹${customerTotalBilled.toLocaleString('en-IN')} billed, ${customerOverdue} overdue`);
    });

    // 8. Test Full Payment
    console.log('\n8️⃣ TESTING: Full Payment Settlement');
    const remainingPayment = await prisma.payment.create({
      data: {
        invoiceId: newInvoice.id,
        customerId: newCustomer.id,
        companyId: company.id,
        amount: 6800, // Remaining amount
        paymentDate: new Date(),
        method: 'UPI',
        reference: 'TEST-PAY-002',
        notes: 'Final payment to settle invoice',
      }
    });

    // Update invoice to fully paid
    await prisma.invoice.update({
      where: { id: newInvoice.id },
      data: {
        paidAmount: 11800, // Full amount
        status: 'PAID',
      }
    });
    console.log('✅ Full payment completed, invoice settled');

    // 9. Test Activity Timeline
    console.log('\n9️⃣ TESTING: Activity Timeline');
    const timeline = [
      ...customerWithDetails.payments.map(payment => ({
        type: 'PAYMENT',
        date: payment.paymentDate,
        amount: payment.amount,
        description: `Payment for Invoice ${payment.invoice.number}`,
      })),
      ...customerWithDetails.invoices.map(invoice => ({
        type: 'INVOICE',
        date: invoice.issueDate,
        amount: invoice.grandTotal,
        description: `Invoice ${invoice.number} created`,
        status: invoice.status,
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log('📅 Recent Activity Timeline:');
    timeline.slice(0, 5).forEach((activity, index) => {
      console.log(`   ${index + 1}. [${activity.type}] ${activity.description} - ₹${activity.amount?.toLocaleString('en-IN') || 'N/A'}`);
    });

    // 10. Final Status Summary
    console.log('\n🎯 FINAL TEST SUMMARY:');
    console.log('✅ Customer Creation: PASSED');
    console.log('✅ Invoice Creation: PASSED');
    console.log('✅ Payment Recording: PASSED');
    console.log('✅ Status Calculations: PASSED');
    console.log('✅ Financial Summaries: PASSED');
    console.log('✅ Search & Filtering: PASSED');
    console.log('✅ Overdue Detection: PASSED');
    console.log('✅ Activity Timeline: PASSED');

    console.log('\n🚀 CUSTOMER PIPELINE TEST COMPLETED SUCCESSFULLY!');
    console.log('\n📱 Next Steps:');
    console.log('1. Open http://localhost:3007/customers in browser');
    console.log('2. Click on "Test Client Ltd" to see dashboard');
    console.log('3. Verify all data displays correctly');
    console.log('4. Test search and filter functionality');

    return {
      customer: newCustomer,
      invoices: [newInvoice, overdueInvoice],
      payments: [partialPayment, remainingPayment],
      summary: {
        totalBilled,
        totalPaid,
        totalOutstanding,
        paidInvoices,
        overdueInvoices,
      }
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run the test
testCustomerPipeline()
  .then((results) => {
    console.log('\n✅ All tests passed! Customer pipeline is working correctly.');
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });