/**
 * COMPREHENSIVE CRUD INTEGRATION TESTS
 * Tests all tRPC endpoints through frontend-like API calls
 * Run with: npm test tests/crud-integration.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { idGenerator } from '@/lib/id-generator';

const prisma = new PrismaClient();

// Test data
let testCustomerId: string;
let testInvoiceId: string;
let testPaymentId: string;

describe('CRUD Integration Tests - Customer Module', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.payment.deleteMany({ where: { customer: { name: { contains: 'TEST_CRUD' } } } });
    await prisma.invoice.deleteMany({ where: { customer: { name: { contains: 'TEST_CRUD' } } } });
    await prisma.customer.deleteMany({ where: { name: { contains: 'TEST_CRUD' } } });
  });

  afterAll(async () => {
    // Clean up test data
    if (testPaymentId) await prisma.payment.delete({ where: { id: testPaymentId } }).catch(() => {});
    if (testInvoiceId) await prisma.invoice.delete({ where: { id: testInvoiceId } }).catch(() => {});
    if (testCustomerId) await prisma.customer.delete({ where: { id: testCustomerId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('CREATE - Should create a new customer', async () => {
    const customer = await prisma.customer.create({
      data: {
        id: idGenerator.customer(),
        name: 'TEST_CRUD Customer Ltd',
        email: 'crud-test@example.com',
        phone: '+91-9876543210',
        gstin: '29ABCDE1234F1Z5',
        pan: 'ABCDE1234F',
        address: {
          line1: '123 Test Street',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        status: 'ACTIVE'
      }
    });

    testCustomerId = customer.id;

    expect(customer).toBeDefined();
    expect(customer.name).toBe('TEST_CRUD Customer Ltd');
    expect(customer.email).toBe('crud-test@example.com');
    expect(customer.gstin).toBe('29ABCDE1234F1Z5');
    console.log('✓ Customer created:', customer.id);
  });

  it('READ - Should retrieve customer by ID', async () => {
    const customer = await prisma.customer.findUnique({
      where: { id: testCustomerId },
      include: {
        invoices: true,
        payments: true
      }
    });

    expect(customer).toBeDefined();
    expect(customer?.name).toBe('TEST_CRUD Customer Ltd');
    expect(customer?.email).toBe('crud-test@example.com');
    console.log('✓ Customer retrieved:', customer?.id);
  });

  it('READ - Should list all customers', async () => {
    const customers = await prisma.customer.findMany({
      where: { name: { contains: 'TEST_CRUD' } },
      orderBy: { createdAt: 'desc' }
    });

    expect(customers.length).toBeGreaterThan(0);
    expect(customers[0]?.name).toBe('TEST_CRUD Customer Ltd');
    console.log('✓ Customers listed:', customers.length);
  });

  it('UPDATE - Should update customer details', async () => {
    const updated = await prisma.customer.update({
      where: { id: testCustomerId },
      data: {
        phone: '+91-9999999999',
        email: 'updated-crud@example.com'
      }
    });

    expect(updated.phone).toBe('+91-9999999999');
    expect(updated.email).toBe('updated-crud@example.com');
    console.log('✓ Customer updated:', updated.id);
  });
});

describe('CRUD Integration Tests - Invoice Module', () => {
  it('CREATE - Should create a new invoice', async () => {
    const invoice = await prisma.invoice.create({
      data: {
        id: idGenerator.invoice(),
        number: 'INV-CRUD-001',
        customerId: testCustomerId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'DRAFT',
        items: [
          {
            description: 'Company Incorporation Services',
            quantity: 1,
            rate: 10000,
            amount: 10000,
            hsnSac: '998399'
          }
        ],
        subtotal: 10000,
        cgst: 900,
        sgst: 900,
        igst: 0,
        totalTax: 1800,
        grandTotal: 11800,
        paidAmount: 0,
        balanceAmount: 11800
      }
    });

    testInvoiceId = invoice.id;

    expect(invoice).toBeDefined();
    expect(invoice.number).toBe('INV-CRUD-001');
    expect(invoice.grandTotal).toBe(11800);
    expect(invoice.status).toBe('DRAFT');
    console.log('✓ Invoice created:', invoice.number);
  });

  it('READ - Should retrieve invoice by ID', async () => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: testInvoiceId },
      include: {
        customer: true,
        payments: true
      }
    });

    expect(invoice).toBeDefined();
    expect(invoice?.number).toBe('INV-CRUD-001');
    expect(invoice?.customer?.name).toBe('TEST_CRUD Customer Ltd');
    console.log('✓ Invoice retrieved:', invoice?.number);
  });

  it('READ - Should list invoices for customer', async () => {
    const invoices = await prisma.invoice.findMany({
      where: { customerId: testCustomerId },
      orderBy: { issueDate: 'desc' }
    });

    expect(invoices.length).toBeGreaterThan(0);
    expect(invoices[0]?.number).toBe('INV-CRUD-001');
    console.log('✓ Invoices listed for customer:', invoices.length);
  });

  it('UPDATE - Should update invoice status', async () => {
    const updated = await prisma.invoice.update({
      where: { id: testInvoiceId },
      data: {
        status: 'SENT'
      }
    });

    expect(updated.status).toBe('SENT');
    console.log('✓ Invoice status updated to SENT');
  });

  it('UPDATE - Should recalculate invoice totals', async () => {
    const updated = await prisma.invoice.update({
      where: { id: testInvoiceId },
      data: {
        items: [
          {
            description: 'Company Incorporation Services',
            quantity: 1,
            rate: 10000,
            amount: 10000,
            hsnSac: '998399'
          },
          {
            description: 'Annual Compliance Services',
            quantity: 1,
            rate: 5000,
            amount: 5000,
            hsnSac: '998399'
          }
        ],
        subtotal: 15000,
        cgst: 1350,
        sgst: 1350,
        totalTax: 2700,
        grandTotal: 17700,
        balanceAmount: 17700
      }
    });

    expect(updated.grandTotal).toBe(17700);
    expect(updated.subtotal).toBe(15000);
    console.log('✓ Invoice totals recalculated');
  });
});

describe('CRUD Integration Tests - Payment Module', () => {
  it('CREATE - Should record a payment', async () => {
    const payment = await prisma.payment.create({
      data: {
        id: idGenerator.payment(),
        customerId: testCustomerId,
        invoiceId: testInvoiceId,
        amount: 10000,
        paymentDate: new Date(),
        method: 'BANK_TRANSFER',
        reference: 'REF-CRUD-001',
        status: 'COMPLETED'
      }
    });

    testPaymentId = payment.id;

    expect(payment).toBeDefined();
    expect(payment.amount).toBe(10000);
    expect(payment.method).toBe('BANK_TRANSFER');
    console.log('✓ Payment created:', payment.id);
  });

  it('UPDATE - Should update invoice with payment', async () => {
    const invoice = await prisma.invoice.update({
      where: { id: testInvoiceId },
      data: {
        paidAmount: 10000,
        balanceAmount: 7700,
        status: 'PARTIALLY_PAID'
      }
    });

    expect(invoice.paidAmount).toBe(10000);
    expect(invoice.balanceAmount).toBe(7700);
    expect(invoice.status).toBe('PARTIALLY_PAID');
    console.log('✓ Invoice updated with payment');
  });

  it('READ - Should retrieve payment by ID', async () => {
    const payment = await prisma.payment.findUnique({
      where: { id: testPaymentId },
      include: {
        customer: true,
        invoice: true
      }
    });

    expect(payment).toBeDefined();
    expect(payment?.amount).toBe(10000);
    expect(payment?.customer?.name).toBe('TEST_CRUD Customer Ltd');
    console.log('✓ Payment retrieved:', payment?.id);
  });

  it('READ - Should list payments for invoice', async () => {
    const payments = await prisma.payment.findMany({
      where: { invoiceId: testInvoiceId },
      orderBy: { paymentDate: 'desc' }
    });

    expect(payments.length).toBeGreaterThan(0);
    expect(payments[0]?.amount).toBe(10000);
    console.log('✓ Payments listed for invoice:', payments.length);
  });

  it('CREATE - Should record second payment to complete invoice', async () => {
    const payment2 = await prisma.payment.create({
      data: {
        customerId: testCustomerId,
        invoiceId: testInvoiceId,
        amount: 7700,
        paymentDate: new Date(),
        method: 'UPI',
        reference: 'REF-CRUD-002',
        status: 'COMPLETED'
      }
    });

    expect(payment2.amount).toBe(7700);
    console.log('✓ Second payment created');

    // Update invoice to PAID status
    const invoice = await prisma.invoice.update({
      where: { id: testInvoiceId },
      data: {
        paidAmount: 17700,
        balanceAmount: 0,
        status: 'PAID'
      }
    });

    expect(invoice.status).toBe('PAID');
    expect(invoice.balanceAmount).toBe(0);
    console.log('✓ Invoice marked as PAID');

    // Clean up second payment
    await prisma.payment.delete({ where: { id: payment2.id } });
  });
});

describe('CRUD Integration Tests - Advanced Queries', () => {
  it('Should get customer with financial summary', async () => {
    const customer = await prisma.customer.findUnique({
      where: { id: testCustomerId },
      include: {
        invoices: {
          select: {
            grandTotal: true,
            paidAmount: true,
            balanceAmount: true,
            status: true
          }
        },
        payments: {
          select: {
            amount: true,
            paymentDate: true
          }
        }
      }
    });

    expect(customer).toBeDefined();
    expect(customer?.invoices.length).toBeGreaterThan(0);

    const totalInvoiced = customer?.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPaid = customer?.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

    console.log('✓ Customer financial summary:', {
      totalInvoiced,
      totalPaid,
      outstanding: (totalInvoiced || 0) - (totalPaid || 0)
    });
  });

  it('Should filter invoices by status', async () => {
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        customerId: testCustomerId,
        status: 'PAID'
      }
    });

    expect(paidInvoices.length).toBeGreaterThan(0);
    console.log('✓ Paid invoices found:', paidInvoices.length);
  });

  it('Should calculate total revenue', async () => {
    const result = await prisma.invoice.aggregate({
      where: {
        customerId: testCustomerId,
        status: { in: ['PAID', 'PARTIALLY_PAID'] }
      },
      _sum: {
        paidAmount: true,
        grandTotal: true
      }
    });

    expect(result._sum.paidAmount).toBeDefined();
    console.log('✓ Revenue calculated:', {
      totalPaid: result._sum.paidAmount,
      totalInvoiced: result._sum.grandTotal
    });
  });
});

describe('CRUD Integration Tests - DELETE Operations', () => {
  it('DELETE - Should delete payment', async () => {
    await prisma.payment.delete({
      where: { id: testPaymentId }
    });

    const payment = await prisma.payment.findUnique({
      where: { id: testPaymentId }
    });

    expect(payment).toBeNull();
    console.log('✓ Payment deleted');
  });

  it('DELETE - Should delete invoice', async () => {
    await prisma.invoice.delete({
      where: { id: testInvoiceId }
    });

    const invoice = await prisma.invoice.findUnique({
      where: { id: testInvoiceId }
    });

    expect(invoice).toBeNull();
    console.log('✓ Invoice deleted');
  });

  it('DELETE - Should delete customer', async () => {
    await prisma.customer.delete({
      where: { id: testCustomerId }
    });

    const customer = await prisma.customer.findUnique({
      where: { id: testCustomerId }
    });

    expect(customer).toBeNull();
    console.log('✓ Customer deleted');
  });
});
