"use strict";
/**
 * Main API Router - Company Secretary ERP
 * Combines all feature routers into the main app router
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const invoice_1 = require("./routers/invoice");
const customer_1 = require("./routers/customer");
const payment_1 = require("./routers/payment");
const company_1 = require("./routers/company");
const service_1 = require("./routers/service");
const compliance_1 = require("./routers/compliance");
const communication_1 = require("./routers/communication");
const dashboard_optimized_1 = require("./routers/dashboard-optimized");
const attachment_1 = require("./routers/attachment");
const invoice_group_1 = require("./routers/invoice-group");
/**
 * This is the primary router for the CS ERP application
 * All routers added here will be accessible throughout the application
 */
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    invoice: invoice_1.invoiceRouter,
    customer: customer_1.customerRouter,
    payment: payment_1.paymentRouter,
    company: company_1.companyRouter,
    service: service_1.serviceRouter,
    compliance: compliance_1.complianceRouter,
    communication: communication_1.communicationRouter,
    dashboard: dashboard_optimized_1.dashboardOptimizedRouter,
    attachment: attachment_1.attachmentRouter,
    invoiceGroup: invoice_group_1.invoiceGroupRouter,
});
