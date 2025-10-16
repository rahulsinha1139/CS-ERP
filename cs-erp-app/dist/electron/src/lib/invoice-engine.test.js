"use strict";
/**
 * Tests for Invoice Management Engine
 * Testing invoice lifecycle and business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_engine_1 = require("./invoice-engine");
describe('Invoice Engine', () => {
    const mockInvoiceData = {
        number: 'INV-2024-0001',
        issueDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-14'),
        customerId: 'customer-123',
        companyId: 'company-456',
        companyStateCode: '07', // Delhi
        customerStateCode: '07', // Delhi
        placeOfSupply: '07',
        lines: [
            {
                description: 'Consulting Services',
                quantity: 10,
                rate: 5000,
                isReimbursement: false,
                gstRate: 18,
                hsnSac: '998314',
            },
            {
                description: 'Travel Reimbursement',
                quantity: 1,
                rate: 2000,
                isReimbursement: true,
                gstRate: 0,
            },
        ],
        notes: 'Test invoice',
    };
    describe('calculateInvoice', () => {
        test('should calculate invoice with GST correctly', () => {
            const calculatedInvoice = invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData);
            expect(calculatedInvoice.number).toBe('INV-2024-0001');
            expect(calculatedInvoice.lineCalculations).toHaveLength(2);
            // First line (consulting services) - taxable
            const consultingLine = calculatedInvoice.lineCalculations[0];
            expect(consultingLine.taxableValue).toBe(50000); // 10 * 5000
            expect(consultingLine.cgst).toBe(4500); // 9% of 50000
            expect(consultingLine.sgst).toBe(4500); // 9% of 50000
            expect(consultingLine.igst).toBe(0);
            // Second line (reimbursement) - not taxable
            const reimbursementLine = calculatedInvoice.lineCalculations[1];
            expect(reimbursementLine.taxableValue).toBe(0); // Reimbursement
            expect(reimbursementLine.cgst).toBe(0);
            expect(reimbursementLine.sgst).toBe(0);
            // Invoice totals
            expect(calculatedInvoice.subtotal).toBe(52000); // 50000 + 2000
            expect(calculatedInvoice.taxableValue).toBe(50000); // Only taxable portion
            expect(calculatedInvoice.cgstAmount).toBe(4500);
            expect(calculatedInvoice.sgstAmount).toBe(4500);
            expect(calculatedInvoice.igstAmount).toBe(0);
            expect(calculatedInvoice.totalTax).toBe(9000);
            expect(calculatedInvoice.grandTotal).toBe(61000); // 52000 + 9000
            expect(calculatedInvoice.isInterstate).toBe(false);
            expect(calculatedInvoice.state).toBe(invoice_engine_1.InvoiceState.DRAFT);
        });
        test('should calculate interstate invoice correctly', () => {
            const interstateInvoice = {
                ...mockInvoiceData,
                customerStateCode: '27', // Maharashtra
                placeOfSupply: '27',
            };
            const calculatedInvoice = invoice_engine_1.invoiceEngine.calculateInvoice(interstateInvoice);
            expect(calculatedInvoice.isInterstate).toBe(true);
            expect(calculatedInvoice.cgstAmount).toBe(0);
            expect(calculatedInvoice.sgstAmount).toBe(0);
            expect(calculatedInvoice.igstAmount).toBe(9000); // 18% of 50000
            expect(calculatedInvoice.totalTax).toBe(9000);
            expect(calculatedInvoice.grandTotal).toBe(61000);
        });
        test('should validate required fields', () => {
            const invalidInvoice = { ...mockInvoiceData, number: '' };
            expect(() => invoice_engine_1.invoiceEngine.calculateInvoice(invalidInvoice)).toThrow('Invoice number is required');
            const noLinesInvoice = { ...mockInvoiceData, lines: [] };
            expect(() => invoice_engine_1.invoiceEngine.calculateInvoice(noLinesInvoice)).toThrow('Invoice must have at least one line item');
        });
        test('should validate line items', () => {
            const invalidLineInvoice = {
                ...mockInvoiceData,
                lines: [
                    {
                        description: '',
                        quantity: 1,
                        rate: 100,
                        isReimbursement: false,
                        gstRate: 18,
                    },
                ],
            };
            expect(() => invoice_engine_1.invoiceEngine.calculateInvoice(invalidLineInvoice)).toThrow('Line 1: Description is required');
            const negativeQuantityInvoice = {
                ...mockInvoiceData,
                lines: [
                    {
                        description: 'Test Service',
                        quantity: -1,
                        rate: 100,
                        isReimbursement: false,
                        gstRate: 18,
                    },
                ],
            };
            expect(() => invoice_engine_1.invoiceEngine.calculateInvoice(negativeQuantityInvoice)).toThrow('Line 1: Quantity must be positive');
        });
    });
    describe('generateInvoiceNumber', () => {
        test('should generate unique invoice numbers', async () => {
            const number1 = invoice_engine_1.invoiceEngine.generateInvoiceNumber('INV', 2024);
            // Add small delay to ensure different timestamp
            await new Promise(resolve => setTimeout(resolve, 1));
            const number2 = invoice_engine_1.invoiceEngine.generateInvoiceNumber('INV', 2024);
            expect(number1).toMatch(/^INV-2024-\d{4}$/);
            expect(number2).toMatch(/^INV-2024-\d{4}$/);
            expect(number1).not.toBe(number2);
        });
        test('should use current year if not specified', () => {
            const currentYear = new Date().getFullYear();
            const number = invoice_engine_1.invoiceEngine.generateInvoiceNumber('INV');
            expect(number).toMatch(new RegExp(`^INV-${currentYear}-\\d{4}$`));
        });
        test('should handle custom prefixes', () => {
            const number = invoice_engine_1.invoiceEngine.generateInvoiceNumber('QUOTE', 2024);
            expect(number).toMatch(/^QUOTE-2024-\d{4}$/);
        });
    });
    describe('State Transitions', () => {
        let calculatedInvoice;
        beforeEach(() => {
            calculatedInvoice = invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData);
        });
        test('should allow valid state transitions', () => {
            expect(invoice_engine_1.invoiceEngine.canTransitionTo(invoice_engine_1.InvoiceState.DRAFT, invoice_engine_1.InvoiceState.SENT)).toBe(true);
            expect(invoice_engine_1.invoiceEngine.canTransitionTo(invoice_engine_1.InvoiceState.SENT, invoice_engine_1.InvoiceState.PAID)).toBe(true);
            expect(invoice_engine_1.invoiceEngine.canTransitionTo(invoice_engine_1.InvoiceState.PARTIALLY_PAID, invoice_engine_1.InvoiceState.PAID)).toBe(true);
        });
        test('should reject invalid state transitions', () => {
            expect(invoice_engine_1.invoiceEngine.canTransitionTo(invoice_engine_1.InvoiceState.PAID, invoice_engine_1.InvoiceState.DRAFT)).toBe(false);
            expect(invoice_engine_1.invoiceEngine.canTransitionTo(invoice_engine_1.InvoiceState.CANCELLED, invoice_engine_1.InvoiceState.SENT)).toBe(false);
        });
        test('should transition invoice state correctly', () => {
            const sentInvoice = invoice_engine_1.invoiceEngine.transitionState(calculatedInvoice, invoice_engine_1.InvoiceState.SENT);
            expect(sentInvoice.state).toBe(invoice_engine_1.InvoiceState.SENT);
        });
        test('should throw error for invalid transitions', () => {
            expect(() => {
                invoice_engine_1.invoiceEngine.transitionState(calculatedInvoice, invoice_engine_1.InvoiceState.REFUNDED);
            }).toThrow('Invalid state transition from DRAFT to REFUNDED');
        });
    });
    describe('Payment Processing', () => {
        let calculatedInvoice;
        beforeEach(() => {
            calculatedInvoice = invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData);
        });
        test('should process full payment correctly', () => {
            // First transition to SENT state
            const sentInvoice = invoice_engine_1.invoiceEngine.transitionState(calculatedInvoice, invoice_engine_1.InvoiceState.SENT);
            const payment = {
                amount: 61000, // Full amount
                paymentDate: new Date('2024-01-20'),
                mode: 'BANK_TRANSFER',
                reference: 'TXN123456',
            };
            const result = invoice_engine_1.invoiceEngine.processPayment(sentInvoice, payment);
            expect(result.invoice.state).toBe(invoice_engine_1.InvoiceState.PAID);
            expect(result.remainingBalance).toBe(0);
        });
        test('should process partial payment correctly', () => {
            // First transition to SENT state
            const sentInvoice = invoice_engine_1.invoiceEngine.transitionState(calculatedInvoice, invoice_engine_1.InvoiceState.SENT);
            const payment = {
                amount: 30000, // Partial amount
                paymentDate: new Date('2024-01-20'),
                mode: 'BANK_TRANSFER',
                reference: 'TXN123456',
            };
            const result = invoice_engine_1.invoiceEngine.processPayment(sentInvoice, payment);
            expect(result.invoice.state).toBe(invoice_engine_1.InvoiceState.PARTIALLY_PAID);
            expect(result.remainingBalance).toBe(31000); // 61000 - 30000
        });
        test('should reject negative payment amounts', () => {
            const payment = {
                amount: -1000,
                paymentDate: new Date('2024-01-20'),
                mode: 'CASH',
            };
            expect(() => invoice_engine_1.invoiceEngine.processPayment(calculatedInvoice, payment)).toThrow('Payment amount must be positive');
        });
        test('should reject overpayment', () => {
            const payment = {
                amount: 70000, // More than invoice total
                paymentDate: new Date('2024-01-20'),
                mode: 'BANK_TRANSFER',
            };
            expect(() => invoice_engine_1.invoiceEngine.processPayment(calculatedInvoice, payment)).toThrow('Payment amount cannot exceed invoice total');
        });
    });
    describe('Overdue Detection', () => {
        test('should detect overdue invoices', () => {
            const overdueInvoice = {
                ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData),
                dueDate: new Date('2023-12-01'), // Past date
                state: invoice_engine_1.InvoiceState.SENT,
            };
            expect(invoice_engine_1.invoiceEngine.isOverdue(overdueInvoice)).toBe(true);
            expect(invoice_engine_1.invoiceEngine.getDaysOverdue(overdueInvoice)).toBeGreaterThan(0);
        });
        test('should not mark paid invoices as overdue', () => {
            const paidInvoice = {
                ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData),
                dueDate: new Date('2023-12-01'), // Past date
                state: invoice_engine_1.InvoiceState.PAID,
            };
            expect(invoice_engine_1.invoiceEngine.isOverdue(paidInvoice)).toBe(false);
        });
        test('should handle invoices without due date', () => {
            const noDueDateInvoice = {
                ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData),
                dueDate: undefined,
            };
            expect(invoice_engine_1.invoiceEngine.isOverdue(noDueDateInvoice)).toBe(false);
            expect(invoice_engine_1.invoiceEngine.getDaysOverdue(noDueDateInvoice)).toBe(0);
        });
    });
    describe('Payment Terms Generation', () => {
        test('should generate default payment terms', () => {
            const terms = invoice_engine_1.invoiceEngine.generatePaymentTerms('customer-123');
            expect(terms.dueDate).toBeInstanceOf(Date);
            expect(terms.dueDate.getTime()).toBeGreaterThan(new Date().getTime());
            expect(terms.terms).toContain('30 days');
        });
        test('should generate custom payment terms', () => {
            const terms = invoice_engine_1.invoiceEngine.generatePaymentTerms('customer-123', 15);
            const expectedDueDate = new Date();
            expectedDueDate.setDate(expectedDueDate.getDate() + 15);
            expect(terms.dueDate.getDate()).toBe(expectedDueDate.getDate());
            expect(terms.terms).toContain('15 days');
        });
    });
    describe('Batch Operations', () => {
        test('should batch calculate multiple invoices', () => {
            const invoices = [
                mockInvoiceData,
                { ...mockInvoiceData, number: 'INV-2024-0002' },
                { ...mockInvoiceData, number: 'INV-2024-0003' },
            ];
            const calculatedInvoices = invoice_engine_1.invoiceEngine.batchCalculateInvoices(invoices);
            expect(calculatedInvoices).toHaveLength(3);
            calculatedInvoices.forEach((invoice, index) => {
                expect(invoice.grandTotal).toBe(61000);
                expect(invoice.state).toBe(invoice_engine_1.InvoiceState.DRAFT);
            });
        });
    });
    describe('Invoice Summary Generation', () => {
        test('should generate accurate invoice summary', () => {
            const invoices = [
                { ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData), state: invoice_engine_1.InvoiceState.PAID },
                { ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData), state: invoice_engine_1.InvoiceState.SENT, grandTotal: 30000 },
                { ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData), state: invoice_engine_1.InvoiceState.DRAFT, grandTotal: 45000 },
            ];
            const summary = invoice_engine_1.invoiceEngine.generateInvoiceSummary(invoices);
            expect(summary.totalInvoices).toBe(3);
            expect(summary.totalAmount).toBe(136000); // 61000 + 30000 + 45000
            expect(summary.averageAmount).toBeCloseTo(45333.33, 2);
            expect(summary.stateDistribution[invoice_engine_1.InvoiceState.PAID]).toBe(1);
            expect(summary.stateDistribution[invoice_engine_1.InvoiceState.SENT]).toBe(1);
            expect(summary.stateDistribution[invoice_engine_1.InvoiceState.DRAFT]).toBe(1);
        });
    });
    describe('Utility Functions', () => {
        test('should format invoice number correctly', () => {
            expect(invoice_engine_1.invoiceUtils.formatInvoiceNumber('inv-2024-0001')).toBe('INV-2024-0001');
        });
        test('should calculate payment percentage correctly', () => {
            expect(invoice_engine_1.invoiceUtils.getPaymentPercentage(5000, 10000)).toBe(50);
            expect(invoice_engine_1.invoiceUtils.getPaymentPercentage(0, 10000)).toBe(0);
            expect(invoice_engine_1.invoiceUtils.getPaymentPercentage(10000, 0)).toBe(0);
        });
        test('should calculate invoice age correctly', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const age = invoice_engine_1.invoiceUtils.getInvoiceAge(yesterday);
            expect(age).toBeGreaterThanOrEqual(1);
            expect(age).toBeLessThanOrEqual(2); // Allow for timezone differences
        });
        test('should determine approval requirements correctly', () => {
            const lowValueInvoice = { ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData), grandTotal: 50000 };
            const highValueInvoice = { ...invoice_engine_1.invoiceEngine.calculateInvoice(mockInvoiceData), grandTotal: 150000 };
            expect(invoice_engine_1.invoiceUtils.requiresApproval(lowValueInvoice)).toBe(false);
            expect(invoice_engine_1.invoiceUtils.requiresApproval(highValueInvoice)).toBe(true);
        });
        test('should calculate late fees correctly', () => {
            const lateFee = invoice_engine_1.invoiceUtils.calculateLateFee(10000, 30, 2); // 2% annual rate
            expect(lateFee).toBeCloseTo(16.44, 2); // (10000 * 0.02 * 30) / 365
        });
    });
});
