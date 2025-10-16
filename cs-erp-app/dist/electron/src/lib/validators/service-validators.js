"use strict";
/**
 * Zod Validation Schemas for Service Types
 * Comprehensive validation for all 7 CS practice service types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceLineItemSchema = exports.serviceDataSchema = exports.dueDiligenceServiceDataSchema = exports.dueDiligenceRowSchema = exports.retainerServiceDataSchema = exports.retainerRowSchema = exports.legalDraftingServiceDataSchema = exports.legalDraftingRowSchema = exports.trademarkIPServiceDataSchema = exports.trademarkIPRowSchema = exports.boardMeetingServiceDataSchema = exports.boardMeetingRowSchema = exports.secretarialAuditServiceDataSchema = exports.secretarialAuditRowSchema = exports.rocFilingServiceDataSchema = exports.rocFilingRowSchema = void 0;
exports.validateServiceData = validateServiceData;
exports.getServiceDataErrors = getServiceDataErrors;
exports.calculateROCFilingTotals = calculateROCFilingTotals;
exports.calculateSecretarialAuditTotals = calculateSecretarialAuditTotals;
exports.calculateBoardMeetingTotals = calculateBoardMeetingTotals;
exports.calculateTrademarkIPTotals = calculateTrademarkIPTotals;
exports.calculateLegalDraftingTotals = calculateLegalDraftingTotals;
exports.calculateRetainerTotals = calculateRetainerTotals;
exports.calculateDueDiligenceTotals = calculateDueDiligenceTotals;
const zod_1 = require("zod");
const service_types_1 = require("@/types/service-types");
// ============================================
// 1. ROC FILING VALIDATORS
// ============================================
exports.rocFilingRowSchema = zod_1.z.object({
    formName: zod_1.z.string().min(1, 'Form name is required'),
    srn: zod_1.z.string().optional(),
    filingDate: zod_1.z.string().optional(),
    govtFees: zod_1.z.number().nonnegative('Government fees must be non-negative'),
    professionalFees: zod_1.z.number().nonnegative('Professional fees must be non-negative'),
});
exports.rocFilingServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.rocFilingRowSchema).min(1, 'At least one ROC form is required'),
    totalGovtFees: zod_1.z.number().nonnegative(),
    totalProfessionalFees: zod_1.z.number().nonnegative(),
});
// ============================================
// 2. SECRETARIAL AUDIT VALIDATORS
// ============================================
exports.secretarialAuditRowSchema = zod_1.z.object({
    period: zod_1.z.string().min(1, 'Period is required'),
    auditType: zod_1.z.string().min(1, 'Audit type is required'),
    deliverables: zod_1.z.string().min(1, 'Deliverables are required'),
    hours: zod_1.z.number().positive().optional(),
    fee: zod_1.z.number().positive('Fee must be positive'),
});
exports.secretarialAuditServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.secretarialAuditRowSchema).min(1, 'At least one audit service is required'),
    totalFees: zod_1.z.number().nonnegative(),
    totalHours: zod_1.z.number().nonnegative().optional(),
});
// ============================================
// 3. BOARD/AGM MEETING VALIDATORS
// ============================================
exports.boardMeetingRowSchema = zod_1.z.object({
    meetingType: zod_1.z.string().min(1, 'Meeting type is required'),
    meetingDate: zod_1.z.string().min(1, 'Meeting date is required'),
    noticePreparation: zod_1.z.boolean(),
    minutesDrafting: zod_1.z.boolean(),
    formsField: zod_1.z.string().optional(),
    fee: zod_1.z.number().positive('Fee must be positive'),
});
exports.boardMeetingServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.boardMeetingRowSchema).min(1, 'At least one meeting is required'),
    totalFees: zod_1.z.number().nonnegative(),
});
// ============================================
// 4. TRADEMARK/IP VALIDATORS
// ============================================
exports.trademarkIPRowSchema = zod_1.z.object({
    applicationNumber: zod_1.z.string().optional(),
    class: zod_1.z.string().optional(),
    description: zod_1.z.string().min(1, 'Description is required'),
    filingDate: zod_1.z.string().optional(),
    govtFees: zod_1.z.number().nonnegative('Government fees must be non-negative'),
    professionalFees: zod_1.z.number().nonnegative('Professional fees must be non-negative'),
});
exports.trademarkIPServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.trademarkIPRowSchema).min(1, 'At least one trademark/IP entry is required'),
    totalGovtFees: zod_1.z.number().nonnegative(),
    totalProfessionalFees: zod_1.z.number().nonnegative(),
});
// ============================================
// 5. LEGAL DRAFTING VALIDATORS
// ============================================
exports.legalDraftingRowSchema = zod_1.z.object({
    documentType: zod_1.z.string().min(1, 'Document type is required'),
    pages: zod_1.z.number().positive().optional(),
    revisions: zod_1.z.number().nonnegative('Revisions must be non-negative'),
    deliveryDate: zod_1.z.string().optional(),
    fee: zod_1.z.number().positive('Fee must be positive'),
});
exports.legalDraftingServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.legalDraftingRowSchema).min(1, 'At least one document is required'),
    totalFees: zod_1.z.number().nonnegative(),
    totalPages: zod_1.z.number().nonnegative().optional(),
});
// ============================================
// 6. RETAINER VALIDATORS
// ============================================
exports.retainerRowSchema = zod_1.z.object({
    period: zod_1.z.string().min(1, 'Period is required'),
    hours: zod_1.z.number().positive('Hours must be positive'),
    ratePerHour: zod_1.z.number().positive('Rate per hour must be positive'),
    servicesIncluded: zod_1.z.string().min(1, 'Services included is required'),
    fee: zod_1.z.number().positive('Fee must be positive'),
});
exports.retainerServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.retainerRowSchema).min(1, 'At least one retainer period is required'),
    totalFees: zod_1.z.number().nonnegative(),
    totalHours: zod_1.z.number().nonnegative(),
});
// ============================================
// 7. DUE DILIGENCE VALIDATORS
// ============================================
exports.dueDiligenceRowSchema = zod_1.z.object({
    scope: zod_1.z.string().min(1, 'Scope is required'),
    documentsReviewed: zod_1.z.number().nonnegative('Documents reviewed must be non-negative'),
    reportType: zod_1.z.string().min(1, 'Report type is required'),
    timeline: zod_1.z.string().min(1, 'Timeline is required'),
    fee: zod_1.z.number().positive('Fee must be positive'),
});
exports.dueDiligenceServiceDataSchema = zod_1.z.object({
    rows: zod_1.z.array(exports.dueDiligenceRowSchema).min(1, 'At least one due diligence entry is required'),
    totalFees: zod_1.z.number().nonnegative(),
    totalDocuments: zod_1.z.number().nonnegative(),
});
// ============================================
// UNION VALIDATOR FOR ALL SERVICE TYPES
// ============================================
exports.serviceDataSchema = zod_1.z.union([
    exports.rocFilingServiceDataSchema,
    exports.secretarialAuditServiceDataSchema,
    exports.boardMeetingServiceDataSchema,
    exports.trademarkIPServiceDataSchema,
    exports.legalDraftingServiceDataSchema,
    exports.retainerServiceDataSchema,
    exports.dueDiligenceServiceDataSchema,
]);
// ============================================
// VALIDATION FUNCTION
// ============================================
function validateServiceData(serviceType, data) {
    try {
        switch (serviceType) {
            case service_types_1.ServiceType.ROC_FILING:
                exports.rocFilingServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.SECRETARIAL_AUDIT:
                exports.secretarialAuditServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.BOARD_MEETING:
                exports.boardMeetingServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.TRADEMARK_IP:
                exports.trademarkIPServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.LEGAL_DRAFTING:
                exports.legalDraftingServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.RETAINER:
                exports.retainerServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.DUE_DILIGENCE:
                exports.dueDiligenceServiceDataSchema.parse(data);
                return true;
            case service_types_1.ServiceType.GENERAL:
                return true; // No custom validation needed
            default:
                return false;
        }
    }
    catch (error) {
        console.error('Service data validation failed:', error);
        return false;
    }
}
// ============================================
// HELPER: GET VALIDATION ERRORS
// ============================================
function getServiceDataErrors(serviceType, data) {
    const errors = [];
    try {
        switch (serviceType) {
            case service_types_1.ServiceType.ROC_FILING:
                exports.rocFilingServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.SECRETARIAL_AUDIT:
                exports.secretarialAuditServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.BOARD_MEETING:
                exports.boardMeetingServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.TRADEMARK_IP:
                exports.trademarkIPServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.LEGAL_DRAFTING:
                exports.legalDraftingServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.RETAINER:
                exports.retainerServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.DUE_DILIGENCE:
                exports.dueDiligenceServiceDataSchema.parse(data);
                break;
            case service_types_1.ServiceType.GENERAL:
                // No validation needed
                break;
            default:
                errors.push('Invalid service type');
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                errors.push(`${path}: ${err.message}`);
            });
        }
        else {
            errors.push('Unknown validation error');
        }
    }
    return errors;
}
// ============================================
// INVOICE LINE WITH SERVICE DATA VALIDATOR
// ============================================
exports.serviceLineItemSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    description: zod_1.z.string().min(1, 'Description is required'),
    quantity: zod_1.z.number().positive('Quantity must be positive'),
    rate: zod_1.z.number().nonnegative('Rate must be non-negative'),
    amount: zod_1.z.number().nonnegative('Amount must be non-negative'),
    gstRate: zod_1.z.number().nonnegative('GST rate must be non-negative'),
    serviceType: zod_1.z.nativeEnum(service_types_1.ServiceType).optional(),
    serviceData: exports.serviceDataSchema.optional(),
});
// ============================================
// CALCULATOR HELPERS
// ============================================
function calculateROCFilingTotals(rows) {
    const totalGovtFees = rows.reduce((sum, row) => sum + row.govtFees, 0);
    const totalProfessionalFees = rows.reduce((sum, row) => sum + row.professionalFees, 0);
    return { totalGovtFees, totalProfessionalFees };
}
function calculateSecretarialAuditTotals(rows) {
    const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
    const totalHours = rows.reduce((sum, row) => sum + (row.hours || 0), 0);
    return { totalFees, totalHours };
}
function calculateBoardMeetingTotals(rows) {
    const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
    return { totalFees };
}
function calculateTrademarkIPTotals(rows) {
    const totalGovtFees = rows.reduce((sum, row) => sum + row.govtFees, 0);
    const totalProfessionalFees = rows.reduce((sum, row) => sum + row.professionalFees, 0);
    return { totalGovtFees, totalProfessionalFees };
}
function calculateLegalDraftingTotals(rows) {
    const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
    const totalPages = rows.reduce((sum, row) => sum + (row.pages || 0), 0);
    return { totalFees, totalPages };
}
function calculateRetainerTotals(rows) {
    const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
    const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
    return { totalFees, totalHours };
}
function calculateDueDiligenceTotals(rows) {
    const totalFees = rows.reduce((sum, row) => sum + row.fee, 0);
    const totalDocuments = rows.reduce((sum, row) => sum + row.documentsReviewed, 0);
    return { totalFees, totalDocuments };
}
