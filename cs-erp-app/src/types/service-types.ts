/**
 * Service Type Definitions for Custom Invoice Columns
 * Supports 7 different CS practice service types with flexible column structures
 */

// ============================================
// SERVICE TYPE ENUM
// ============================================

export enum ServiceType {
  ROC_FILING = 'ROC_FILING',
  SECRETARIAL_AUDIT = 'SECRETARIAL_AUDIT',
  BOARD_MEETING = 'BOARD_MEETING',
  TRADEMARK_IP = 'TRADEMARK_IP',
  LEGAL_DRAFTING = 'LEGAL_DRAFTING',
  RETAINER = 'RETAINER',
  DUE_DILIGENCE = 'DUE_DILIGENCE',
  GENERAL = 'GENERAL', // Default - no custom columns
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.ROC_FILING]: 'ROC Filing & MCA Compliance',
  [ServiceType.SECRETARIAL_AUDIT]: 'Secretarial Audit',
  [ServiceType.BOARD_MEETING]: 'Board/AGM Services',
  [ServiceType.TRADEMARK_IP]: 'Trademark & IP Services',
  [ServiceType.LEGAL_DRAFTING]: 'Legal Drafting',
  [ServiceType.RETAINER]: 'Retainer Services',
  [ServiceType.DUE_DILIGENCE]: 'Due Diligence',
  [ServiceType.GENERAL]: 'General Professional Services',
};

// ============================================
// 1. ROC FILING SERVICE
// ============================================

export interface ROCFilingRow {
  formName: string; // MGT-7, AOC-4, DIR-3 KYC, etc.
  srn?: string; // Service Request Number
  filingDate?: string; // ISO date string
  govtFees: number; // Government/MCA fees (usually no GST)
  professionalFees: number; // Professional fees (GST applicable)
}

export interface ROCFilingServiceData {
  rows: ROCFilingRow[];
  totalGovtFees: number;
  totalProfessionalFees: number;
}

// ============================================
// 2. SECRETARIAL AUDIT SERVICE
// ============================================

export interface SecretarialAuditRow {
  period: string; // "FY 2024-25", "Q1 FY 2025-26"
  auditType: string; // "Annual", "Quarterly", "Half-yearly"
  deliverables: string; // "Form MR-3, Audit Report, Compliance Certificate"
  hours?: number; // Optional: billable hours
  fee: number;
}

export interface SecretarialAuditServiceData {
  rows: SecretarialAuditRow[];
  totalFees: number;
  totalHours?: number;
}

// ============================================
// 3. BOARD/AGM MEETING SERVICE
// ============================================

export interface BoardMeetingRow {
  meetingType: string; // "Board Meeting", "AGM", "EGM"
  meetingDate: string; // ISO date string
  noticePreparation: boolean;
  minutesDrafting: boolean;
  formsField?: string; // e.g., "MGT-14, MGT-15"
  fee: number;
}

export interface BoardMeetingServiceData {
  rows: BoardMeetingRow[];
  totalFees: number;
}

// ============================================
// 4. TRADEMARK/IP SERVICE
// ============================================

export interface TrademarkIPRow {
  applicationNumber?: string;
  class?: string; // Trademark class number
  description: string; // What is being protected
  filingDate?: string;
  govtFees: number;
  professionalFees: number;
}

export interface TrademarkIPServiceData {
  rows: TrademarkIPRow[];
  totalGovtFees: number;
  totalProfessionalFees: number;
}

// ============================================
// 5. LEGAL DRAFTING SERVICE
// ============================================

export interface LegalDraftingRow {
  documentType: string; // "Agreement", "MOU", "Resolution", "Policy"
  pages?: number;
  revisions: number; // Number of revision rounds included
  deliveryDate?: string;
  fee: number;
}

export interface LegalDraftingServiceData {
  rows: LegalDraftingRow[];
  totalFees: number;
  totalPages?: number;
}

// ============================================
// 6. RETAINER SERVICE
// ============================================

export interface RetainerRow {
  period: string; // "January 2025", "Q1 2025"
  hours: number; // Contracted hours
  ratePerHour: number;
  servicesIncluded: string; // Comma-separated list
  fee: number;
}

export interface RetainerServiceData {
  rows: RetainerRow[];
  totalFees: number;
  totalHours: number;
}

// ============================================
// 7. DUE DILIGENCE SERVICE
// ============================================

export interface DueDiligenceRow {
  scope: string; // "Financial DD", "Legal DD", "Secretarial DD"
  documentsReviewed: number;
  reportType: string; // "Comprehensive Report", "Summary Report"
  timeline: string; // "15 days", "1 month"
  fee: number;
}

export interface DueDiligenceServiceData {
  rows: DueDiligenceRow[];
  totalFees: number;
  totalDocuments: number;
}

// ============================================
// UNION TYPE FOR ALL SERVICE DATA
// ============================================

export type ServiceData =
  | ROCFilingServiceData
  | SecretarialAuditServiceData
  | BoardMeetingServiceData
  | TrademarkIPServiceData
  | LegalDraftingServiceData
  | RetainerServiceData
  | DueDiligenceServiceData;

// ============================================
// INVOICE LINE WITH SERVICE DATA
// ============================================

export interface ServiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  serviceType?: ServiceType;
  serviceData?: ServiceData;
}

// ============================================
// HELPER TYPES
// ============================================

export interface ServiceTypeOption {
  value: ServiceType;
  label: string;
  description: string;
  icon?: string;
}

export const SERVICE_TYPE_OPTIONS: ServiceTypeOption[] = [
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

export function isROCFilingData(data: ServiceData): data is ROCFilingServiceData {
  return 'totalGovtFees' in data && 'totalProfessionalFees' in data && 'rows' in data;
}

export function isSecretarialAuditData(data: ServiceData): data is SecretarialAuditServiceData {
  return 'totalFees' in data && 'rows' in data && 'totalHours' in data;
}

export function isBoardMeetingData(data: ServiceData): data is BoardMeetingServiceData {
  return 'totalFees' in data && 'rows' in data && !('totalHours' in data) && !('totalGovtFees' in data);
}

export function isTrademarkIPData(data: ServiceData): data is TrademarkIPServiceData {
  return 'totalGovtFees' in data && 'totalProfessionalFees' in data;
}

export function isLegalDraftingData(data: ServiceData): data is LegalDraftingServiceData {
  return 'totalFees' in data && 'totalPages' in data;
}

export function isRetainerData(data: ServiceData): data is RetainerServiceData {
  return 'totalHours' in data && 'totalFees' in data;
}

export function isDueDiligenceData(data: ServiceData): data is DueDiligenceServiceData {
  return 'totalDocuments' in data && 'totalFees' in data;
}
