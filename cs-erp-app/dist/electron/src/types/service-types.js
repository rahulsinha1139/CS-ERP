"use strict";
/**
 * Service Type Definitions for Custom Invoice Columns
 * Supports 7 different CS practice service types with flexible column structures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_TYPE_OPTIONS = exports.SERVICE_TYPE_LABELS = exports.ServiceType = void 0;
exports.isROCFilingData = isROCFilingData;
exports.isSecretarialAuditData = isSecretarialAuditData;
exports.isBoardMeetingData = isBoardMeetingData;
exports.isTrademarkIPData = isTrademarkIPData;
exports.isLegalDraftingData = isLegalDraftingData;
exports.isRetainerData = isRetainerData;
exports.isDueDiligenceData = isDueDiligenceData;
// ============================================
// SERVICE TYPE ENUM
// ============================================
var ServiceType;
(function (ServiceType) {
    ServiceType["ROC_FILING"] = "ROC_FILING";
    ServiceType["SECRETARIAL_AUDIT"] = "SECRETARIAL_AUDIT";
    ServiceType["BOARD_MEETING"] = "BOARD_MEETING";
    ServiceType["TRADEMARK_IP"] = "TRADEMARK_IP";
    ServiceType["LEGAL_DRAFTING"] = "LEGAL_DRAFTING";
    ServiceType["RETAINER"] = "RETAINER";
    ServiceType["DUE_DILIGENCE"] = "DUE_DILIGENCE";
    ServiceType["GENERAL"] = "GENERAL";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
exports.SERVICE_TYPE_LABELS = {
    [ServiceType.ROC_FILING]: 'ROC Filing & MCA Compliance',
    [ServiceType.SECRETARIAL_AUDIT]: 'Secretarial Audit',
    [ServiceType.BOARD_MEETING]: 'Board/AGM Services',
    [ServiceType.TRADEMARK_IP]: 'Trademark & IP Services',
    [ServiceType.LEGAL_DRAFTING]: 'Legal Drafting',
    [ServiceType.RETAINER]: 'Retainer Services',
    [ServiceType.DUE_DILIGENCE]: 'Due Diligence',
    [ServiceType.GENERAL]: 'General Professional Services',
};
exports.SERVICE_TYPE_OPTIONS = [
    {
        value: ServiceType.GENERAL,
        label: 'General Professional Services',
        description: 'Standard single-line service without custom columns',
    },
    {
        value: ServiceType.ROC_FILING,
        label: 'ROC Filing & MCA Compliance',
        description: 'ROC forms with SRN, dates, government and professional fees',
    },
    {
        value: ServiceType.SECRETARIAL_AUDIT,
        label: 'Secretarial Audit',
        description: 'Annual/quarterly audits with deliverables and hours',
    },
    {
        value: ServiceType.BOARD_MEETING,
        label: 'Board/AGM Services',
        description: 'Meeting support with notices, minutes, and form filings',
    },
    {
        value: ServiceType.TRADEMARK_IP,
        label: 'Trademark & IP Services',
        description: 'Trademark applications with class, government fees',
    },
    {
        value: ServiceType.LEGAL_DRAFTING,
        label: 'Legal Drafting',
        description: 'Document drafting with pages, revisions, delivery dates',
    },
    {
        value: ServiceType.RETAINER,
        label: 'Retainer Services',
        description: 'Monthly/quarterly retainer with contracted hours',
    },
    {
        value: ServiceType.DUE_DILIGENCE,
        label: 'Due Diligence',
        description: 'DD services with scope, documents reviewed, reports',
    },
];
// ============================================
// TYPE GUARDS
// ============================================
function isROCFilingData(data) {
    return 'totalGovtFees' in data && 'totalProfessionalFees' in data && 'rows' in data;
}
function isSecretarialAuditData(data) {
    return 'totalFees' in data && 'rows' in data && 'totalHours' in data;
}
function isBoardMeetingData(data) {
    return 'totalFees' in data && 'rows' in data && !('totalHours' in data) && !('totalGovtFees' in data);
}
function isTrademarkIPData(data) {
    return 'totalGovtFees' in data && 'totalProfessionalFees' in data;
}
function isLegalDraftingData(data) {
    return 'totalFees' in data && 'totalPages' in data;
}
function isRetainerData(data) {
    return 'totalHours' in data && 'totalFees' in data;
}
function isDueDiligenceData(data) {
    return 'totalDocuments' in data && 'totalFees' in data;
}
