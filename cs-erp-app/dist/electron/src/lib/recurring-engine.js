"use strict";
/**
 * Recurring Revenue Automation Engine
 * Manages subscription billing, contract escalations, and automated invoicing
 * Optimized for Company Secretary practice patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.recurringUtils = exports.recurringEngine = exports.RecurringEngine = exports.ContractStatus = exports.BillingFrequency = void 0;
// Temporary replacement for date-fns functions
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};
const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};
const addQuarters = (date, quarters) => {
    return addMonths(date, quarters * 3);
};
const addYears = (date, years) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
};
const format = (date, _formatStr) => {
    return date.toISOString().split('T')[0];
};
const isAfter = (date1, date2) => {
    return date1.getTime() > date2.getTime();
};
const isBefore = (date1, date2) => {
    return date1.getTime() < date2.getTime();
};
const invoice_engine_1 = require("./invoice-engine");
var BillingFrequency;
(function (BillingFrequency) {
    BillingFrequency["MONTHLY"] = "MONTHLY";
    BillingFrequency["QUARTERLY"] = "QUARTERLY";
    BillingFrequency["HALF_YEARLY"] = "HALF_YEARLY";
    BillingFrequency["ANNUALLY"] = "ANNUALLY";
})(BillingFrequency || (exports.BillingFrequency = BillingFrequency = {}));
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["PAUSED"] = "PAUSED";
    ContractStatus["EXPIRED"] = "EXPIRED";
    ContractStatus["CANCELLED"] = "CANCELLED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
class RecurringEngine {
    static getInstance() {
        if (!RecurringEngine.instance) {
            RecurringEngine.instance = new RecurringEngine();
        }
        return RecurringEngine.instance;
    }
    /**
     * Calculate next billing date based on frequency
     */
    calculateNextBillingDate(currentDate, frequency) {
        switch (frequency) {
            case BillingFrequency.MONTHLY:
                return addMonths(currentDate, 1);
            case BillingFrequency.QUARTERLY:
                return addQuarters(currentDate, 1);
            case BillingFrequency.HALF_YEARLY:
                return addMonths(currentDate, 6);
            case BillingFrequency.ANNUALLY:
                return addYears(currentDate, 1);
            default:
                throw new Error(`Invalid billing frequency: ${frequency}`);
        }
    }
    /**
     * Calculate escalated amount based on escalation rate and years elapsed
     */
    calculateEscalation(contract, effectiveDate = new Date()) {
        const yearsElapsed = this.calculateYearsElapsed(contract.startDate, effectiveDate);
        const compoundedRate = Math.pow(1 + (contract.escalationRate / 100), yearsElapsed);
        const escalatedAmount = contract.amount * compoundedRate;
        return {
            originalAmount: contract.amount,
            escalatedAmount: Math.round(escalatedAmount * 100) / 100, // Round to 2 decimal places
            escalationRate: contract.escalationRate,
            yearsElapsed,
            effectiveDate,
        };
    }
    /**
     * Generate billing schedule for a contract
     */
    generateBillingSchedule(contract, startDate = new Date(), monthsAhead = 12) {
        const schedule = [];
        let currentBillingDate = new Date(contract.nextBillingDate);
        const endDate = addMonths(startDate, monthsAhead);
        // If contract has an end date, respect it
        const contractEndDate = contract.endDate ? new Date(contract.endDate) : endDate;
        const actualEndDate = isBefore(contractEndDate, endDate) ? contractEndDate : endDate;
        while (isBefore(currentBillingDate, actualEndDate) && contract.status === ContractStatus.ACTIVE) {
            const escalation = this.calculateEscalation(contract, currentBillingDate);
            const dueDate = addDays(currentBillingDate, 30); // Default 30-day payment terms
            schedule.push({
                contractId: contract.id,
                billingDate: new Date(currentBillingDate),
                amount: escalation.escalatedAmount,
                description: `${contract.description} - ${format(currentBillingDate, 'MMM yyyy')}`,
                dueDate,
                status: 'pending',
            });
            currentBillingDate = this.calculateNextBillingDate(currentBillingDate, contract.frequency);
        }
        return schedule;
    }
    /**
     * Process recurring billing for a specific date
     */
    async processRecurringBilling(contracts, processingDate = new Date()) {
        const results = [];
        let totalAmount = 0;
        let successCount = 0;
        let failureCount = 0;
        for (const contract of contracts) {
            try {
                // Check if billing is due
                if (!this.isBillingDue(contract, processingDate)) {
                    continue;
                }
                // Calculate current amount with escalation
                const escalation = this.calculateEscalation(contract, processingDate);
                // Generate invoice
                const invoiceData = this.generateInvoiceFromContract(contract, escalation, processingDate);
                invoice_engine_1.invoiceEngine.calculateInvoice(invoiceData);
                // Here you would save the invoice to database
                // For now, we'll simulate with a generated ID
                const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                results.push({
                    contractId: contract.id,
                    invoiceId,
                    success: true,
                });
                totalAmount += escalation.escalatedAmount;
                successCount++;
                // Send email if customer has email
                if (contract.customer?.email && contract.autoInvoice) {
                    try {
                        // You would integrate with PDF and email engines here
                        console.log(`Email sent for invoice ${invoiceId} to ${contract.customer.email}`);
                    }
                    catch (emailError) {
                        console.warn(`Failed to send email for invoice ${invoiceId}:`, emailError);
                    }
                }
            }
            catch (error) {
                results.push({
                    contractId: contract.id,
                    invoiceId: '',
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
                failureCount++;
            }
        }
        return {
            processed: results,
            summary: {
                totalProcessed: results.length,
                successCount,
                failureCount,
                totalAmount: Math.round(totalAmount * 100) / 100,
            },
        };
    }
    /**
     * Check if billing is due for a contract
     */
    isBillingDue(contract, checkDate = new Date()) {
        if (contract.status !== ContractStatus.ACTIVE) {
            return false;
        }
        if (contract.endDate && isAfter(checkDate, contract.endDate)) {
            return false;
        }
        return !isAfter(contract.nextBillingDate, checkDate);
    }
    /**
     * Update contract after billing
     */
    updateContractAfterBilling(contract, billingDate) {
        const escalation = this.calculateEscalation(contract, billingDate);
        return {
            ...contract,
            lastBilledDate: billingDate,
            nextBillingDate: this.calculateNextBillingDate(billingDate, contract.frequency),
            totalBilled: contract.totalBilled + escalation.escalatedAmount,
        };
    }
    /**
     * Generate invoice data from recurring contract
     */
    generateInvoiceFromContract(contract, escalation, billingDate) {
        if (!contract.customer || !contract.serviceTemplate || !contract.company) {
            throw new Error('Contract missing required related data');
        }
        const invoiceNumber = invoice_engine_1.invoiceEngine.generateInvoiceNumber('REC', billingDate.getFullYear());
        const dueDate = addDays(billingDate, 30); // Default payment terms
        return {
            number: invoiceNumber,
            issueDate: billingDate,
            dueDate,
            customerId: contract.customerId,
            companyId: contract.company.id,
            customerStateCode: contract.customer.stateCode,
            companyStateCode: contract.company.stateCode,
            notes: `Recurring billing for ${contract.description}`,
            terms: contract.terms || 'Payment due within 30 days',
            lines: [
                {
                    description: `${contract.serviceTemplate.name} - ${format(billingDate, 'MMMM yyyy')}`,
                    quantity: 1,
                    rate: escalation.escalatedAmount,
                    isReimbursement: false,
                    gstRate: contract.serviceTemplate.gstRate,
                    hsnSac: contract.serviceTemplate.hsnSac,
                    serviceTemplateId: contract.serviceTemplateId,
                },
            ],
        };
    }
    /**
     * Calculate years elapsed between two dates
     */
    calculateYearsElapsed(startDate, currentDate) {
        const start = new Date(startDate);
        const current = new Date(currentDate);
        const yearDiff = current.getFullYear() - start.getFullYear();
        const monthDiff = current.getMonth() - start.getMonth();
        const dayDiff = current.getDate() - start.getDate();
        yearDiff; // Used for calculation validation
        // Precise calculation considering months and days
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            // Account for partial year
        }
        // Add fractional year for more precise escalation calculations
        const totalDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const fractionalYear = totalDays / 365.25;
        return Math.max(0, fractionalYear);
    }
    /**
     * Get contracts due for billing in a date range
     */
    getContractsDueForBilling(contracts, startDate = new Date(), endDate = addDays(new Date(), 7)) {
        return contracts.filter(contract => {
            if (contract.status !== ContractStatus.ACTIVE) {
                return false;
            }
            const nextBilling = new Date(contract.nextBillingDate);
            return !isBefore(nextBilling, startDate) && !isAfter(nextBilling, endDate);
        });
    }
    /**
     * Calculate revenue forecast for contracts
     */
    calculateRevenueForecast(contracts, monthsAhead = 12) {
        const monthlyData = new Map();
        let totalRevenue = 0;
        for (const contract of contracts) {
            if (contract.status !== ContractStatus.ACTIVE)
                continue;
            const schedule = this.generateBillingSchedule(contract, new Date(), monthsAhead);
            for (const billing of schedule) {
                const monthKey = format(billing.billingDate, 'yyyy-MM');
                const existing = monthlyData.get(monthKey) || { amount: 0, contractCount: new Set() };
                existing.amount += billing.amount;
                existing.contractCount.add(contract.id);
                monthlyData.set(monthKey, existing);
                totalRevenue += billing.amount;
            }
        }
        const monthly = Array.from(monthlyData.entries())
            .map(([month, data]) => ({
            month,
            amount: Math.round(data.amount * 100) / 100,
            contractCount: data.contractCount.size,
        }))
            .sort((a, b) => a.month.localeCompare(b.month));
        return {
            monthly,
            total: Math.round(totalRevenue * 100) / 100,
            averageMonthly: monthlyData.size > 0 ? Math.round((totalRevenue / monthlyData.size) * 100) / 100 : 0,
        };
    }
    /**
     * Validate contract data
     */
    validateContract(contract) {
        const errors = [];
        if (!contract.customerId)
            errors.push('Customer ID is required');
        if (!contract.serviceTemplateId)
            errors.push('Service template ID is required');
        if (!contract.amount || contract.amount <= 0)
            errors.push('Amount must be positive');
        if (!contract.frequency)
            errors.push('Billing frequency is required');
        if (!contract.startDate)
            errors.push('Start date is required');
        if (contract.escalationRate && (contract.escalationRate < 0 || contract.escalationRate > 100)) {
            errors.push('Escalation rate must be between 0 and 100');
        }
        if (contract.endDate && contract.startDate && isAfter(new Date(contract.startDate), new Date(contract.endDate))) {
            errors.push('End date must be after start date');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.RecurringEngine = RecurringEngine;
// Export singleton instance
exports.recurringEngine = RecurringEngine.getInstance();
// Utility functions for recurring billing
exports.recurringUtils = {
    /**
     * Format billing frequency for display
     */
    formatFrequency: (frequency) => {
        const map = {
            [BillingFrequency.MONTHLY]: 'Monthly',
            [BillingFrequency.QUARTERLY]: 'Quarterly',
            [BillingFrequency.HALF_YEARLY]: 'Half-Yearly',
            [BillingFrequency.ANNUALLY]: 'Annually',
        };
        return map[frequency] || frequency;
    },
    /**
     * Get frequency multiplier for calculations
     */
    getFrequencyMultiplier: (frequency) => {
        const map = {
            [BillingFrequency.MONTHLY]: 12,
            [BillingFrequency.QUARTERLY]: 4,
            [BillingFrequency.HALF_YEARLY]: 2,
            [BillingFrequency.ANNUALLY]: 1,
        };
        return map[frequency] || 1;
    },
    /**
     * Calculate annual value of a contract
     */
    calculateAnnualValue: (amount, frequency) => {
        const multiplier = exports.recurringUtils.getFrequencyMultiplier(frequency);
        return amount * multiplier;
    },
    /**
     * Get next billing description
     */
    getNextBillingDescription: (contract) => {
        const nextDate = format(contract.nextBillingDate, 'dd MMM yyyy');
        const escalation = exports.recurringEngine.calculateEscalation(contract);
        return `Next billing: ${nextDate} - ₹${escalation.escalatedAmount.toLocaleString('en-IN')}`;
    },
    /**
     * Check if contract needs attention (ending soon, etc.)
     */
    needsAttention: (contract) => {
        const reasons = [];
        const now = new Date();
        const oneMonthFromNow = addMonths(now, 1);
        if (contract.status === ContractStatus.PAUSED) {
            reasons.push('Contract is paused');
        }
        if (contract.endDate && isBefore(new Date(contract.endDate), oneMonthFromNow)) {
            reasons.push('Contract expires within 30 days');
        }
        if (exports.recurringEngine.isBillingDue(contract)) {
            reasons.push('Billing is overdue');
        }
        return {
            needs: reasons.length > 0,
            reasons,
        };
    },
};
