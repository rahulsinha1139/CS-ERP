/**
 * Zod Validation Schemas for Service Types
 * Comprehensive validation for all 7 CS practice service types
 */

import { z } from 'zod';
import { ServiceType } from '@/types/service-types';

// ============================================
// 1. ROC FILING VALIDATORS
// ============================================

export const rocFilingRowSchema = z.object({
  formName: z.string().min(1, 'Form name is required'),
  srn: z.string().optional(),
  filingDate: z.string().optional(),
  govtFees: z.number().nonnegative('Government fees must be non-negative'),
  professionalFees: z.number().nonnegative('Professional fees must be non-negative'),
});

export const rocFilingServiceDataSchema = z.object({
  rows: z.array(rocFilingRowSchema).min(1, 'At least one ROC form is required'),
  totalGovtFees: z.number().nonnegative(),
  totalProfessionalFees: z.number().nonnegative(),
});

// ============================================
// 2. SECRETARIAL AUDIT VALIDATORS
// ============================================

export const secretarialAuditRowSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  auditType: z.string().min(1, 'Audit type is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  hours: z.number().positive().optional(),
  fee: z.number().positive('Fee must be positive'),
});

export const secretarialAuditServiceDataSchema = z.object({
  rows: z.array(secretarialAuditRowSchema).min(1, 'At least one audit service is required'),
  totalFees: z.number().nonnegative(),
  totalHours: z.number().nonnegative().optional(),
});

// ============================================
// 3. BOARD/AGM MEETING VALIDATORS
// ============================================

export const boardMeetingRowSchema = z.object({
  meetingType: z.string().min(1, 'Meeting type is required'),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  noticePreparation: z.boolean(),
  minutesDrafting: z.boolean(),
  formsField: z.string().optional(),
  fee: z.number().positive('Fee must be positive'),
});

export const boardMeetingServiceDataSchema = z.object({
  rows: z.array(boardMeetingRowSchema).min(1, 'At least one meeting is required'),
  totalFees: z.number().nonnegative(),
});

// ============================================
// 4. TRADEMARK/IP VALIDATORS
// ============================================

export const trademarkIPRowSchema = z.object({
  applicationNumber: z.string().optional(),
  class: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  filingDate: z.string().optional(),
  govtFees: z.number().nonnegative('Government fees must be non-negative'),
  professionalFees: z.number().nonnegative('Professional fees must be non-negative'),
});

export const trademarkIPServiceDataSchema = z.object({
  rows: z.array(trademarkIPRowSchema).min(1, 'At least one trademark/IP entry is required'),
  totalGovtFees: z.number().nonnegative(),
  totalProfessionalFees: z.number().nonnegative(),
});

// ============================================
// 5. LEGAL DRAFTING VALIDATORS
// ============================================

export const legalDraftingRowSchema = z.object({
  documentType: z.string().min(1, 'Document type is required'),
  pages: z.number().positive().optional(),
  revisions: z.number().nonnegative('Revisions must be non-negative'),
  deliveryDate: z.string().optional(),
  fee: z.number().positive('Fee must be positive'),
});

export const legalDraftingServiceDataSchema = z.object({
  rows: z.array(legalDraftingRowSchema).min(1, 'At least one document is required'),
  totalFees: z.number().nonnegative(),
  totalPages: z.number().nonnegative().optional(),
});

// ============================================
// 6. RETAINER VALIDATORS
// ============================================

export const retainerRowSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  hours: z.number().positive('Hours must be positive'),
  ratePerHour: z.number().positive('Rate per hour must be positive'),
  servicesIncluded: z.string().min(1, 'Services included is required'),
  fee: z.number().positive('Fee must be positive'),
});

export const retainerServiceDataSchema = z.object({
  rows: z.array(retainerRowSchema).min(1, 'At least one retainer period is required'),
  totalFees: z.number().nonnegative(),
  totalHours: z.number().nonnegative(),
});

// ============================================
// 7. DUE DILIGENCE VALIDATORS
// ============================================

export const dueDiligenceRowSchema = z.object({
  scope: z.string().min(1, 'Scope is required'),
  documentsReviewed: z.number().nonnegative('Documents reviewed must be non-negative'),
  reportType: z.string().min(1, 'Report type is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  fee: z.number().positive('Fee must be positive'),
});

export const dueDiligenceServiceDataSchema = z.object({
  rows: z.array(dueDiligenceRowSchema).min(1, 'At least one due diligence entry is required'),
  totalFees: z.number().nonnegative(),
  totalDocuments: z.number().nonnegative(),
});

// ============================================
// UNION VALIDATOR FOR ALL SERVICE TYPES
// ============================================

export const serviceDataSchema = z.union([
  rocFilingServiceDataSchema,
  secretarialAuditServiceDataSchema,
  boardMeetingServiceDataSchema,
  trademarkIPServiceDataSchema,
  legalDraftingServiceDataSchema,
  retainerServiceDataSchema,
  dueDiligenceServiceDataSchema,
]);

// ============================================
// VALIDATION FUNCTION
// ============================================

export function validateServiceData(serviceType: ServiceType, data: unknown): boolean {
  try {
    switch (serviceType) {
      case ServiceType.ROC_FILING:
        rocFilingServiceDataSchema.parse(data);
        return true;

      case ServiceType.SECRETARIAL_AUDIT:
        secretarialAuditServiceDataSchema.parse(data);
        return true;

      case ServiceType.BOARD_MEETING:
        boardMeetingServiceDataSchema.parse(data);
        return true;

      case ServiceType.TRADEMARK_IP:
        trademarkIPServiceDataSchema.parse(data);
        return true;

      case ServiceType.LEGAL_DRAFTING:
        legalDraftingServiceDataSchema.parse(data);
        return true;

      case ServiceType.RETAINER:
        retainerServiceDataSchema.parse(data);
        return true;

      case ServiceType.DUE_DILIGENCE:
        dueDiligenceServiceDataSchema.parse(data);
        return true;

      case ServiceType.GENERAL:
        return true; // No custom validation needed

      default:
        return false;
    }
  } catch (error) {
    console.error('Service data validation failed:', error);
    return false;
  }
}

// ============================================
// HELPER: GET VALIDATION ERRORS
// ============================================

export function getServiceDataErrors(
  serviceType: ServiceType,
  data: unknown
): string[] {
  const errors: string[] = [];

  try {
    switch (serviceType) {
      case ServiceType.ROC_FILING:
        rocFilingServiceDataSchema.parse(data);
        break;

      case ServiceType.SECRETARIAL_AUDIT:
        secretarialAuditServiceDataSchema.parse(data);
        break;

      case ServiceType.BOARD_MEETING:
        boardMeetingServiceDataSchema.parse(data);
        break;

      case ServiceType.TRADEMARK_IP:
        trademarkIPServiceDataSchema.parse(data);
        break;

      case ServiceType.LEGAL_DRAFTING:
        legalDraftingServiceDataSchema.parse(data);
        break;

      case ServiceType.RETAINER:
        retainerServiceDataSchema.parse(data);
        break;

      case ServiceType.DUE_DILIGENCE:
        dueDiligenceServiceDataSchema.parse(data);
        break;

      case ServiceType.GENERAL:
        // No validation needed
        break;

      default:
        errors.push('Invalid service type');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors.push(`${path}: ${err.message}`);
      });
    } else {
      errors.push('Unknown validation error');
    }
  }

  return errors;
}

// ============================================
// INVOICE LINE WITH SERVICE DATA VALIDATOR
// ============================================

export const serviceLineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  rate: z.number().nonnegative('Rate must be non-negative'),
  amount: z.number().nonnegative('Amount must be non-negative'),
  gstRate: z.number().nonnegative('GST rate must be non-negative'),
  serviceType: z.nativeEnum(ServiceType).optional(),
  serviceData: serviceDataSchema.optional(),
});

// ============================================
// CALCULATOR HELPERS
// ============================================

export function calculateROCFilingTotals(rows: z.infer<typeof rocFilingRowSchema>[]) {
  const totalGovtFees = rows.reduce((sum, row) => sum + row.govtFees, 0);
  const totalProfessionalFees = rows.reduce((sum, row) => sum + row.professionalFees, 0);
  return { totalGovtFees, totalProfessionalFees };
}

export function calculateSecretarialAuditTotals(rows: z.infer<typeof secretarialAuditRowSchema>[]) {
  const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
  const totalHours = rows.reduce((sum, row) => sum + (row.hours || 0), 0);
  return { totalFees, totalHours };
}

export function calculateBoardMeetingTotals(rows: z.infer<typeof boardMeetingRowSchema>[]) {
  const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
  return { totalFees };
}

export function calculateTrademarkIPTotals(rows: z.infer<typeof trademarkIPRowSchema>[]) {
  const totalGovtFees = rows.reduce((sum, row) => sum + row.govtFees, 0);
  const totalProfessionalFees = rows.reduce((sum, row) => sum + row.professionalFees, 0);
  return { totalGovtFees, totalProfessionalFees };
}

export function calculateLegalDraftingTotals(rows: z.infer<typeof legalDraftingRowSchema>[]) {
  const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
  const totalPages = rows.reduce((sum, row) => sum + (row.pages || 0), 0);
  return { totalFees, totalPages };
}

export function calculateRetainerTotals(rows: z.infer<typeof retainerRowSchema>[]) {
  const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  return { totalFees, totalHours };
}

export function calculateDueDiligenceTotals(rows: z.infer<typeof dueDiligenceRowSchema>[]) {
  const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
  const totalDocuments = rows.reduce((sum, row) => sum + row.documentsReviewed, 0);
  return { totalFees, totalDocuments };
}
