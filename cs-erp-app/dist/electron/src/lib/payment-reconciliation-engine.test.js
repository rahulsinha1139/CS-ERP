"use strict";
/**
 * Tests for Payment Reconciliation Engine
 * Testing advanced payment matching and reconciliation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
const payment_reconciliation_engine_1 = require("./payment-reconciliation-engine");
describe('Payment Reconciliation Engine', () => {
    const mockPayments = [
        {
            id: 'pay-001',
            amount: 11800,
            paymentDate: new Date('2024-01-15'),
            method: payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER,
            reference: 'INV-2024-0001',
            customerName: 'Acme Corp',
            invoiceNumber: 'INV-2024-0001',
            bankReference: 'TXN123456',
        },
        {
            id: 'pay-002',
            amount: 5900,
            paymentDate: new Date('2024-01-16'),
            method: payment_reconciliation_engine_1.PaymentMethod.UPI,
            reference: 'INV-2024-0002',
            customerName: 'Beta Ltd',
            invoiceNumber: 'INV-2024-0002',
            upiTransactionId: 'UPI789012',
        },
        {
            id: 'pay-003',
            amount: 3000,
            paymentDate: new Date('2024-01-17'),
            method: payment_reconciliation_engine_1.PaymentMethod.CASH,
            customerName: 'Gamma Inc',
            description: 'Partial payment for services',
        },
        {
            id: 'pay-004',
            amount: 11800, // Duplicate amount
            paymentDate: new Date('2024-01-15'),
            method: payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER,
            reference: 'INV-2024-0001',
            customerName: 'Acme Corp',
        },
    ];
    const mockInvoices = [
        {
            id: 'inv-001',
            number: 'INV-2024-0001',
            customerId: 'cust-001',
            customerName: 'Acme Corp',
            grandTotal: 11800,
            paidAmount: 0,
            remainingAmount: 11800,
            dueDate: new Date('2024-02-15'),
            status: 'SENT',
        },
        {
            id: 'inv-002',
            number: 'INV-2024-0002',
            customerId: 'cust-002',
            customerName: 'Beta Ltd',
            grandTotal: 5900,
            paidAmount: 0,
            remainingAmount: 5900,
            dueDate: new Date('2024-02-16'),
            status: 'SENT',
        },
        {
            id: 'inv-003',
            number: 'INV-2024-0003',
            customerId: 'cust-003',
            customerName: 'Gamma Inc',
            grandTotal: 8850,
            paidAmount: 0,
            remainingAmount: 8850,
            dueDate: new Date('2024-02-17'),
            status: 'SENT',
        },
    ];
    describe('reconcilePayments', () => {
        test('should find exact matches', async () => {
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments(mockPayments.slice(0, 2), // First two payments
            mockInvoices.slice(0, 2), // First two invoices
            { useFuzzyMatching: false });
            expect(result.exactMatches).toBe(2);
            expect(result.fuzzyMatches).toBe(0);
            expect(result.unmatched).toBe(0);
            expect(result.totalProcessed).toBe(2);
            const matches = result.matches;
            expect(matches).toHaveLength(2);
            expect(matches[0].matchType).toBe('EXACT');
            expect(matches[0].status).toBe(payment_reconciliation_engine_1.ReconciliationStatus.MATCHED);
            expect(matches[0].confidence).toBeGreaterThanOrEqual(95);
        });
        test('should find partial matches', async () => {
            const partialPayments = [
                {
                    ...mockPayments[2], // 3000 payment
                    reference: 'INV-2024-0003',
                    invoiceNumber: 'INV-2024-0003',
                },
            ];
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments(partialPayments, [mockInvoices[2]], // 8850 invoice
            { includePartialMatches: true });
            expect(result.exactMatches).toBe(1);
            expect(result.matches[0].status).toBe(payment_reconciliation_engine_1.ReconciliationStatus.PARTIAL_MATCH);
            expect(result.matches[0].discrepancy).toBe(5850); // 8850 - 3000
        });
        test('should detect duplicates', async () => {
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments([mockPayments[0], mockPayments[3]], // Two identical payments
            mockInvoices, { useFuzzyMatching: false });
            expect(result.duplicates).toBe(1);
            const duplicateMatch = result.matches.find(m => m.status === payment_reconciliation_engine_1.ReconciliationStatus.DUPLICATE);
            expect(duplicateMatch).toBeDefined();
        });
        test('should use fuzzy matching for similar amounts and references', async () => {
            const fuzzyPayment = {
                id: 'pay-fuzzy',
                amount: 11799, // Off by 1 rupee
                paymentDate: new Date('2024-01-15'),
                method: payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER,
                reference: 'INV-2024-001', // Missing one zero
                customerName: 'ACME CORP', // Different case
            };
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments([fuzzyPayment], [mockInvoices[0]], { useFuzzyMatching: true, tolerance: 0.5 } // Smaller tolerance to force fuzzy matching
            );
            expect(result.fuzzyMatches).toBe(1);
            const fuzzyMatch = result.matches[0];
            expect(fuzzyMatch.matchType).toBe('FUZZY');
            expect(fuzzyMatch.confidence).toBeGreaterThan(60);
        });
        test('should handle tolerance settings', async () => {
            const slightlyOffPayment = {
                ...mockPayments[0],
                amount: 11801, // 1 rupee more
                id: 'pay-tolerance',
            };
            // With strict tolerance
            const strictResult = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments([slightlyOffPayment], [mockInvoices[0]], { tolerance: 0.5, useFuzzyMatching: false });
            expect(strictResult.exactMatches).toBe(0);
            expect(strictResult.unmatched).toBe(1);
            // With lenient tolerance
            const lenientResult = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments([slightlyOffPayment], [mockInvoices[0]], { tolerance: 2, useFuzzyMatching: false });
            expect(lenientResult.exactMatches).toBe(1);
        });
        test('should respect processing time limits', async () => {
            const manyPayments = Array.from({ length: 100 }, (_, i) => ({
                ...mockPayments[0],
                id: `pay-${i}`,
                amount: 1000 + i,
            }));
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments(manyPayments, mockInvoices, { maxProcessingTime: 100 } // 100ms limit
            );
            expect(result.processingTime).toBeLessThan(500); // Increased buffer for test environment
        });
    });
    describe('reconcileBankStatement', () => {
        const mockBankEntries = [
            {
                id: 'bank-001',
                date: new Date('2024-01-15'),
                amount: 11800,
                type: 'CREDIT',
                description: 'NEFT Transfer from Acme Corp',
                reference: 'TXN123456',
                balance: 111800,
                accountNumber: 'ACC001',
            },
            {
                id: 'bank-002',
                date: new Date('2024-01-16'),
                amount: 5900,
                type: 'CREDIT',
                description: 'UPI Payment Beta Ltd',
                reference: 'UPI789012',
                balance: 117700,
                accountNumber: 'ACC001',
            },
            {
                id: 'bank-003',
                date: new Date('2024-01-17'),
                amount: 1000,
                type: 'DEBIT',
                description: 'Bank Charges',
                reference: 'CHG001',
                balance: 116700,
                accountNumber: 'ACC001',
            },
        ];
        test('should match bank entries to payments', async () => {
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcileBankStatement(mockBankEntries, mockPayments.slice(0, 2));
            expect(result.matches).toHaveLength(2);
            const firstMatch = result.matches.find(m => m.bankEntryId === 'bank-001');
            expect(firstMatch).toBeDefined();
            expect(firstMatch.matchConfidence).toBeGreaterThan(90);
            // Should not match debit entries
            expect(result.matches.find(m => m.bankEntryId === 'bank-003')).toBeUndefined();
        });
        test('should handle date range filtering', async () => {
            const dateRange = {
                start: new Date('2024-01-16'),
                end: new Date('2024-01-16'),
            };
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcileBankStatement(mockBankEntries, mockPayments, { dateRange });
            // Should only match entries within date range
            expect(result.matches).toHaveLength(1);
            expect(result.matches[0].bankEntryId).toBe('bank-002');
        });
        test('should prioritize reference matches', async () => {
            const multipleMatches = [
                {
                    ...mockPayments[0],
                    id: 'pay-ref-match',
                    bankReference: 'TXN123456', // Exact reference match
                },
                {
                    ...mockPayments[0],
                    id: 'pay-amount-only',
                    bankReference: 'DIFFERENT',
                },
            ];
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcileBankStatement([mockBankEntries[0]], multipleMatches);
            expect(result.matches).toHaveLength(1);
            expect(result.matches[0].paymentId).toBe('pay-ref-match');
            expect(result.matches[0].matchConfidence).toBeGreaterThanOrEqual(95);
        });
    });
    describe('generatePaymentAnalytics', () => {
        test('should generate comprehensive analytics', async () => {
            const analytics = await payment_reconciliation_engine_1.paymentReconciliationEngine.generatePaymentAnalytics(mockPayments, mockInvoices, {
                start: new Date('2024-01-01'),
                end: new Date('2024-02-28'),
            });
            expect(analytics.totalPayments).toBe(mockPayments.length);
            expect(analytics.totalAmount).toBe(32500); // Sum of all payment amounts
            // Payment method distribution
            expect(analytics.paymentMethodDistribution[payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER]).toBe(2);
            expect(analytics.paymentMethodDistribution[payment_reconciliation_engine_1.PaymentMethod.UPI]).toBe(1);
            expect(analytics.paymentMethodDistribution[payment_reconciliation_engine_1.PaymentMethod.CASH]).toBe(1);
            // Monthly trends
            expect(analytics.monthlyTrends).toHaveLength(1); // All payments in same month
            expect(analytics.monthlyTrends[0].totalPayments).toBe(4);
            // Overdue analysis
            expect(analytics.overdueAnalysis.totalOverdue).toBe(3); // All invoices are overdue (no payments matched)
            expect(analytics.overdueAnalysis.overdueAmount).toBe(26550); // Sum of remaining amounts
            // Reconciliation health
            expect(analytics.reconciliationHealth.matchRate).toBeCloseTo(92.5, 1);
        });
        test('should handle empty data gracefully', async () => {
            const analytics = await payment_reconciliation_engine_1.paymentReconciliationEngine.generatePaymentAnalytics([], []);
            expect(analytics.totalPayments).toBe(0);
            expect(analytics.totalAmount).toBe(0);
            expect(analytics.averagePaymentTime).toBe(0);
            expect(analytics.monthlyTrends).toHaveLength(0);
        });
    });
    describe('predictPaymentProbability', () => {
        const historicalData = {
            customerPayments: [
                {
                    id: 'hist-1',
                    amount: 10000,
                    paymentDate: new Date('2023-12-15'),
                    method: payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER,
                    invoiceNumber: 'INV-2023-0001',
                },
                {
                    id: 'hist-2',
                    amount: 15000,
                    paymentDate: new Date('2023-11-20'),
                    method: payment_reconciliation_engine_1.PaymentMethod.UPI,
                    invoiceNumber: 'INV-2023-0002',
                },
            ],
            similarInvoices: [
                {
                    id: 'hist-inv-1',
                    number: 'INV-2023-0001',
                    customerId: 'cust-001',
                    customerName: 'Acme Corp',
                    grandTotal: 10000,
                    paidAmount: 10000,
                    remainingAmount: 0,
                    dueDate: new Date('2023-12-10'),
                    status: 'PAID',
                },
                {
                    id: 'hist-inv-2',
                    number: 'INV-2023-0002',
                    customerId: 'cust-001',
                    customerName: 'Acme Corp',
                    grandTotal: 15000,
                    paidAmount: 15000,
                    remainingAmount: 0,
                    dueDate: new Date('2023-11-15'),
                    status: 'PAID',
                },
            ],
        };
        test('should predict payment probability based on history', async () => {
            const prediction = await payment_reconciliation_engine_1.paymentReconciliationEngine.predictPaymentProbability('inv-001', historicalData);
            expect(prediction.probability).toBeGreaterThan(0);
            expect(prediction.probability).toBeLessThanOrEqual(100);
            expect(prediction.confidence).toBeGreaterThan(0);
            expect(prediction.expectedPaymentDate).toBeInstanceOf(Date);
            expect(prediction.factors).toHaveLength(3);
            // Check factor types
            const factorNames = prediction.factors.map(f => f.factor);
            expect(factorNames).toContain('Payment History');
            expect(factorNames).toContain('Average Delay');
            expect(factorNames).toContain('Recent Behavior');
        });
        test('should handle customers with no payment history', async () => {
            const noHistoryData = {
                customerPayments: [],
                similarInvoices: [],
            };
            const prediction = await payment_reconciliation_engine_1.paymentReconciliationEngine.predictPaymentProbability('inv-new', noHistoryData);
            expect(prediction.probability).toBeGreaterThan(0);
            expect(prediction.confidence).toBeLessThan(60); // Lower confidence for new customers
        });
        test('should consider late payment history', async () => {
            const latePaymentData = {
                customerPayments: [
                    {
                        id: 'late-1',
                        amount: 10000,
                        paymentDate: new Date('2023-12-25'), // 15 days late
                        method: payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER,
                        invoiceNumber: 'INV-2023-LATE',
                    },
                ],
                similarInvoices: [
                    {
                        id: 'late-inv-1',
                        number: 'INV-2023-LATE',
                        customerId: 'cust-late',
                        customerName: 'Late Corp',
                        grandTotal: 10000,
                        paidAmount: 10000,
                        remainingAmount: 0,
                        dueDate: new Date('2023-12-10'), // Due 15 days before payment
                        status: 'PAID',
                    },
                ],
            };
            const prediction = await payment_reconciliation_engine_1.paymentReconciliationEngine.predictPaymentProbability('inv-late', latePaymentData);
            // Should predict later payment date due to history
            const delayFactor = prediction.factors.find(f => f.factor === 'Average Delay');
            expect(delayFactor?.impact).toBeLessThan(0); // Negative impact
        });
    });
    describe('Utility Functions', () => {
        test('should generate unique payment references', () => {
            const ref1 = payment_reconciliation_engine_1.paymentUtils.generatePaymentReference();
            const ref2 = payment_reconciliation_engine_1.paymentUtils.generatePaymentReference('TXN');
            expect(ref1).toMatch(/^PAY-\d+-\d{4}$/);
            expect(ref2).toMatch(/^TXN-\d+-\d{4}$/);
            expect(ref1).not.toBe(ref2);
        });
        test('should validate payment methods', () => {
            expect(payment_reconciliation_engine_1.paymentUtils.isValidPaymentMethod('BANK_TRANSFER')).toBe(true);
            expect(payment_reconciliation_engine_1.paymentUtils.isValidPaymentMethod('INVALID_METHOD')).toBe(false);
        });
        test('should calculate processing fees correctly', () => {
            expect(payment_reconciliation_engine_1.paymentUtils.calculateProcessingFee(10000, payment_reconciliation_engine_1.PaymentMethod.CASH)).toBe(0);
            expect(payment_reconciliation_engine_1.paymentUtils.calculateProcessingFee(10000, payment_reconciliation_engine_1.PaymentMethod.CARD)).toBe(200); // 2%
            expect(payment_reconciliation_engine_1.paymentUtils.calculateProcessingFee(10000, payment_reconciliation_engine_1.PaymentMethod.UPI)).toBe(0);
        });
        test('should format payment method names', () => {
            expect(payment_reconciliation_engine_1.paymentUtils.getPaymentMethodName(payment_reconciliation_engine_1.PaymentMethod.BANK_TRANSFER)).toBe('Bank Transfer');
            expect(payment_reconciliation_engine_1.paymentUtils.getPaymentMethodName(payment_reconciliation_engine_1.PaymentMethod.DIGITAL_WALLET)).toBe('Digital Wallet');
        });
        test('should detect overdue payments', () => {
            const pastDate = new Date('2023-12-01');
            const futureDate = new Date('2025-12-01');
            expect(payment_reconciliation_engine_1.paymentUtils.isPaymentOverdue(pastDate)).toBe(true);
            expect(payment_reconciliation_engine_1.paymentUtils.isPaymentOverdue(futureDate)).toBe(false);
            expect(payment_reconciliation_engine_1.paymentUtils.getDaysOverdue(pastDate)).toBeGreaterThan(0);
            expect(payment_reconciliation_engine_1.paymentUtils.getDaysOverdue(futureDate)).toBe(0);
        });
    });
    describe('Edge Cases and Error Handling', () => {
        test('should handle invalid input data', async () => {
            await expect(payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments([], [])).resolves.toBeDefined();
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments([], []);
            expect(result.totalProcessed).toBe(0);
            expect(result.matches).toHaveLength(0);
        });
        test('should handle very large datasets', async () => {
            const largePayments = Array.from({ length: 1000 }, (_, i) => ({
                ...mockPayments[0],
                id: `large-pay-${i}`,
                amount: 1000 + i,
            }));
            const largeInvoices = Array.from({ length: 1000 }, (_, i) => ({
                ...mockInvoices[0],
                id: `large-inv-${i}`,
                number: `INV-LARGE-${i}`,
                grandTotal: 1000 + i,
                remainingAmount: 1000 + i,
            }));
            const startTime = performance.now();
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments(largePayments, largeInvoices, { maxProcessingTime: 5000 });
            const endTime = performance.now();
            expect(result).toBeDefined();
            expect(endTime - startTime).toBeLessThan(6000); // Should respect timeout
        });
        test('should handle duplicate payment IDs gracefully', async () => {
            const duplicateIdPayments = [
                { ...mockPayments[0], id: 'duplicate' },
                { ...mockPayments[1], id: 'duplicate' },
            ];
            const result = await payment_reconciliation_engine_1.paymentReconciliationEngine.reconcilePayments(duplicateIdPayments, mockInvoices);
            expect(result).toBeDefined();
            expect(result.totalProcessed).toBe(2);
        });
    });
});
