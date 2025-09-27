/**
 * Main API Router - Company Secretary ERP
 * Combines all feature routers into the main app router
 */

import { createTRPCRouter } from "./trpc";
import { invoiceRouter } from "./routers/invoice";
import { customerRouter } from "./routers/customer";
import { paymentRouter } from "./routers/payment";
import { companyRouter } from "./routers/company";
import { serviceRouter } from "./routers/service";
import { complianceRouter } from "./routers/compliance";
import { communicationRouter } from "./routers/communication";
import { dashboardOptimizedRouter as dashboardRouter } from "./routers/dashboard-optimized";

/**
 * This is the primary router for the CS ERP application
 * All routers added here will be accessible throughout the application
 */
export const appRouter = createTRPCRouter({
  invoice: invoiceRouter,
  customer: customerRouter,
  payment: paymentRouter,
  company: companyRouter,
  service: serviceRouter,
  compliance: complianceRouter,
  communication: communicationRouter,
  dashboard: dashboardRouter,
});

// Export the type definition for TypeScript
export type AppRouter = typeof appRouter;
