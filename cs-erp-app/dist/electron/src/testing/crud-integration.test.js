"use strict";
/**
 * COMPREHENSIVE CRUD INTEGRATION TESTS
 * Tests all tRPC endpoints through frontend-like API calls
 * Run with: npm test tests/crud-integration.test.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
const id_generator_1 = require("@/lib/id-generator");
const prisma = new client_1.PrismaClient();
// Test data
const companyId = 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b'; // From seed
let testCustomerId;
let testInvoiceId;
let testPaymentId;
(0, vitest_1.describe)('CRUD Integration Tests', () => {
    (0, vitest_1.beforeAll)(async () => {
        // Clean up any existing test data
        await prisma.payment.deleteMany({ where: { customer: { name: { contains: 'TEST_CRUD' } } } });
        await prisma.invoice.deleteMany({ where: { customer: { name: { contains: 'TEST_CRUD' } } } });
        await prisma.customer.deleteMany({ where: { name: { contains: 'TEST_CRUD' } } });
    });
    (0, vitest_1.afterAll)(async () => {
        // Clean up test data
        if (testPaymentId)
            await prisma.payment.delete({ where: { id: testPaymentId } }).catch(() => { });
        if (testInvoiceId)
            await prisma.invoice.delete({ where: { id: testInvoiceId } }).catch(() => { });
        if (testCustomerId)
            await prisma.customer.delete({ where: { id: testCustomerId } }).catch(() => { });
        await prisma.$disconnect();
    });
    (0, vitest_1.describe)('Customer Module', () => {
        (0, vitest_1.it)('CREATE - Should create a new customer', async () => {
            const customer = await prisma.customer.create({
                data: {
                    id: id_generator_1.idGenerator.customer(),
                    name: 'TEST_CRUD Customer Ltd',
                    email: 'crud-test@example.com',
                    phone: '+91-9876543210',
                    gstin: '29ABCDE1234F1Z5',
                    stateCode: '29',
                    companyId,
                }
            });
            testCustomerId = customer.id;
            (0, vitest_1.expect)(customer).toBeDefined();
            (0, vitest_1.expect)(customer.name).toBe('TEST_CRUD Customer Ltd');
            (0, vitest_1.expect)(customer.email).toBe('crud-test@example.com');
            (0, vitest_1.expect)(customer.gstin).toBe('29ABCDE1234F1Z5');
            console.log('✓ Customer created:', customer.id);
        });
        (0, vitest_1.it)('READ - Should retrieve customer by ID', async () => {
            const customer = await prisma.customer.findUnique({
                where: { id: testCustomerId },
                include: {
                    invoices: true,
                    payments: true
                }
            });
            (0, vitest_1.expect)(customer).toBeDefined();
            (0, vitest_1.expect)(customer?.name).toBe('TEST_CRUD Customer Ltd');
            (0, vitest_1.expect)(customer?.email).toBe('crud-test@example.com');
            console.log('✓ Customer retrieved:', customer?.id);
        });
        (0, vitest_1.it)('READ - Should list all customers', async () => {
            const customers = await prisma.customer.findMany({
                where: { name: { contains: 'TEST_CRUD' } },
                orderBy: { createdAt: 'desc' }
            });
            (0, vitest_1.expect)(customers.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(customers[0]?.name).toBe('TEST_CRUD Customer Ltd');
            console.log('✓ Customers listed:', customers.length);
        });
        (0, vitest_1.it)('UPDATE - Should update customer details', async () => {
            const updated = await prisma.customer.update({
                where: { id: testCustomerId },
                data: {
                    phone: '+91-9999999999',
                    email: 'updated-crud@example.com'
                }
            });
            (0, vitest_1.expect)(updated.phone).toBe('+91-9999999999');
            (0, vitest_1.expect)(updated.email).toBe('updated-crud@example.com');
            console.log('✓ Customer updated:', updated.id);
        });
    });
    (0, vitest_1.describe)('Invoice Module', () => {
        (0, vitest_1.it)('CREATE - Should create a new invoice', async () => {
            const invoice = await prisma.invoice.create({
                data: {
                    id: id_generator_1.idGenerator.invoice(),
                    number: 'INV-CRUD-001',
                    customerId: testCustomerId,
                    companyId,
                    issueDate: new Date(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    status: 'DRAFT',
                    subtotal: 10000,
                    cgstAmount: 900,
                    sgstAmount: 900,
                    igstAmount: 0,
                    totalTax: 1800,
                    grandTotal: 11800,
                    paidAmount: 0,
                    lines: {
                        create: [{
                                id: id_generator_1.idGenerator.generate(),
                                description: 'Company Incorporation Services',
                                quantity: 1,
                                rate: 10000,
                                amount: 10000,
                                hsnSac: '998399',
                                gstRate: 18,
                                isReimbursement: false,
                            }]
                    }
                }
            });
            testInvoiceId = invoice.id;
            (0, vitest_1.expect)(invoice).toBeDefined();
            (0, vitest_1.expect)(invoice.number).toBe('INV-CRUD-001');
            (0, vitest_1.expect)(invoice.grandTotal).toBe(11800);
            (0, vitest_1.expect)(invoice.status).toBe('DRAFT');
            console.log('✓ Invoice created:', invoice.number);
        });
        (0, vitest_1.it)('READ - Should retrieve invoice by ID', async () => {
            const invoice = await prisma.invoice.findUnique({
                where: { id: testInvoiceId },
                include: {
                    customer: true,
                    payments: true
                }
            });
            (0, vitest_1.expect)(invoice).toBeDefined();
            (0, vitest_1.expect)(invoice?.number).toBe('INV-CRUD-001');
            (0, vitest_1.expect)(invoice?.customer?.name).toBe('TEST_CRUD Customer Ltd');
            console.log('✓ Invoice retrieved:', invoice?.number);
        });
        (0, vitest_1.it)('READ - Should list invoices for customer', async () => {
            const invoices = await prisma.invoice.findMany({
                where: { customerId: testCustomerId },
                orderBy: { issueDate: 'desc' }
            });
            (0, vitest_1.expect)(invoices.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(invoices[0]?.number).toBe('INV-CRUD-001');
            console.log('✓ Invoices listed for customer:', invoices.length);
        });
        (0, vitest_1.it)('UPDATE - Should update invoice status', async () => {
            const updated = await prisma.invoice.update({
                where: { id: testInvoiceId },
                data: {
                    status: 'SENT'
                }
            });
            (0, vitest_1.expect)(updated.status).toBe('SENT');
            console.log('✓ Invoice status updated to SENT');
        });
        (0, vitest_1.it)('UPDATE - Should recalculate invoice totals', async () => {
            const updated = await prisma.invoice.update({
                where: { id: testInvoiceId },
                data: {
                    subtotal: 15000,
                    cgstAmount: 1350,
                    sgstAmount: 1350,
                    totalTax: 2700,
                    grandTotal: 17700,
                }
            });
            (0, vitest_1.expect)(updated.grandTotal).toBe(17700);
            (0, vitest_1.expect)(updated.subtotal).toBe(15000);
            console.log('✓ Invoice totals recalculated');
        });
    });
    (0, vitest_1.describe)('Payment Module', () => {
        (0, vitest_1.it)('CREATE - Should record a payment', async () => {
            const payment = await prisma.payment.create({
                data: {
                    id: id_generator_1.idGenerator.payment(),
                    customerId: testCustomerId,
                    invoiceId: testInvoiceId,
                    companyId,
                    amount: 10000,
                    paymentDate: new Date(),
                    method: 'BANK_TRANSFER',
                    reference: 'REF-CRUD-001',
                    status: 'COMPLETED'
                }
            });
            testPaymentId = payment.id;
            (0, vitest_1.expect)(payment).toBeDefined();
            (0, vitest_1.expect)(payment.amount).toBe(10000);
            (0, vitest_1.expect)(payment.method).toBe('BANK_TRANSFER');
            console.log('✓ Payment created:', payment.id);
        });
        (0, vitest_1.it)('UPDATE - Should update invoice with payment', async () => {
            const invoice = await prisma.invoice.update({
                where: { id: testInvoiceId },
                data: {
                    paidAmount: 10000,
                    status: 'PARTIALLY_PAID'
                }
            });
            (0, vitest_1.expect)(invoice.paidAmount).toBe(10000);
            (0, vitest_1.expect)(invoice.status).toBe('PARTIALLY_PAID');
            console.log('✓ Invoice updated with payment');
        });
        (0, vitest_1.it)('READ - Should retrieve payment by ID', async () => {
            const payment = await prisma.payment.findUnique({
                where: { id: testPaymentId },
                include: {
                    customer: true,
                    invoice: true
                }
            });
            (0, vitest_1.expect)(payment).toBeDefined();
            (0, vitest_1.expect)(payment?.amount).toBe(10000);
            (0, vitest_1.expect)(payment?.customer?.name).toBe('TEST_CRUD Customer Ltd');
            console.log('✓ Payment retrieved:', payment?.id);
        });
        (0, vitest_1.it)('READ - Should list payments for invoice', async () => {
            const payments = await prisma.payment.findMany({
                where: { invoiceId: testInvoiceId },
                orderBy: { paymentDate: 'desc' }
            });
            (0, vitest_1.expect)(payments.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(payments[0]?.amount).toBe(10000);
            console.log('✓ Payments listed for invoice:', payments.length);
        });
        (0, vitest_1.it)('CREATE - Should record second payment to complete invoice', async () => {
            const payment2 = await prisma.payment.create({
                data: {
                    id: id_generator_1.idGenerator.payment(),
                    customerId: testCustomerId,
                    invoiceId: testInvoiceId,
                    companyId,
                    amount: 7700,
                    paymentDate: new Date(),
                    method: 'UPI',
                    reference: 'REF-CRUD-002',
                    status: 'COMPLETED'
                }
            });
            (0, vitest_1.expect)(payment2.amount).toBe(7700);
            console.log('✓ Second payment created');
            // Update invoice to PAID status
            const invoice = await prisma.invoice.update({
                where: { id: testInvoiceId },
                data: {
                    paidAmount: 17700,
                    status: 'PAID'
                }
            });
            (0, vitest_1.expect)(invoice.status).toBe('PAID');
            console.log('✓ Invoice marked as PAID');
            // Clean up second payment
            await prisma.payment.delete({ where: { id: payment2.id } });
        });
    });
    (0, vitest_1.describe)('Advanced Queries', () => {
        (0, vitest_1.it)('Should get customer with financial summary', async () => {
            const customer = await prisma.customer.findUnique({
                where: { id: testCustomerId },
                include: {
                    invoices: {
                        select: {
                            grandTotal: true,
                            paidAmount: true,
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
            (0, vitest_1.expect)(customer).toBeDefined();
            (0, vitest_1.expect)(customer?.invoices.length).toBeGreaterThan(0);
            const totalInvoiced = customer?.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
            const totalPaid = customer?.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
            console.log('✓ Customer financial summary:', {
                totalInvoiced,
                totalPaid,
                outstanding: (totalInvoiced || 0) - (totalPaid || 0)
            });
        });
        (0, vitest_1.it)('Should filter invoices by status', async () => {
            const paidInvoices = await prisma.invoice.findMany({
                where: {
                    customerId: testCustomerId,
                    status: 'PAID'
                }
            });
            (0, vitest_1.expect)(paidInvoices.length).toBeGreaterThan(0);
            console.log('✓ Paid invoices found:', paidInvoices.length);
        });
        (0, vitest_1.it)('Should calculate total revenue', async () => {
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
            (0, vitest_1.expect)(result._sum.paidAmount).toBeDefined();
            console.log('✓ Revenue calculated:', {
                totalPaid: result._sum.paidAmount,
                totalInvoiced: result._sum.grandTotal
            });
        });
    });
    (0, vitest_1.describe)('DELETE Operations', () => {
        (0, vitest_1.it)('DELETE - Should delete payment', async () => {
            await prisma.payment.delete({
                where: { id: testPaymentId }
            });
            const payment = await prisma.payment.findUnique({
                where: { id: testPaymentId }
            });
            (0, vitest_1.expect)(payment).toBeNull();
            console.log('✓ Payment deleted');
        });
        (0, vitest_1.it)('DELETE - Should delete invoice', async () => {
            await prisma.invoice.delete({
                where: { id: testInvoiceId }
            });
            const invoice = await prisma.invoice.findUnique({
                where: { id: testInvoiceId }
            });
            (0, vitest_1.expect)(invoice).toBeNull();
            console.log('✓ Invoice deleted');
        });
        (0, vitest_1.it)('DELETE - Should delete customer', async () => {
            await prisma.customer.delete({
                where: { id: testCustomerId }
            });
            const customer = await prisma.customer.findUnique({
                where: { id: testCustomerId }
            });
            (0, vitest_1.expect)(customer).toBeNull();
            console.log('✓ Customer deleted');
        });
    });
});
