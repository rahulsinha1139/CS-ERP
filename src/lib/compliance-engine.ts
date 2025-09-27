/**
 * Advanced Compliance Engine for Company Secretary ERP
 * Handles ROC filings, deadlines, alerts, and automated compliance tracking
 */

// Types for compliance calculations
export interface ComplianceItem {
  id: string;
  title: string;
  complianceType: ComplianceType;
  category: ComplianceCategory;
  dueDate: Date;
  status: ComplianceStatus;
  priority: Priority;
  frequency?: ComplianceFrequency;
  isRecurring: boolean;
  customerId?: string;
  nextDueDate?: Date;
  reminderDays: number;
  estimatedCost?: number;
  actualCost?: number;
  rocForm?: string;
  penalty?: number;
}

export interface ComplianceTemplate {
  id: string;
  title: string;
  complianceType: ComplianceType;
  category: ComplianceCategory;
  frequency: ComplianceFrequency;
  defaultDays: number;
  reminderDays: number;
  estimatedCost?: number;
  rocForm?: string;
  instructions?: string;
  checklist: string[];
  requiredDocs: string[];
}

export interface ComplianceAlert {
  id: string;
  complianceId: string;
  alertType: AlertType;
  message: string;
  reminderDays: number;
  escalationLevel: number;
  scheduledFor?: Date;
}

export interface ComplianceStats {
  totalCompliances: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  upcomingDeadlines: number;
  criticalAlerts: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  completionRate: number;
  averageCompletionTime: number;
}

export interface ComplianceDashboard {
  stats: ComplianceStats;
  upcomingDeadlines: ComplianceItem[];
  overdueItems: ComplianceItem[];
  criticalAlerts: ComplianceAlert[];
  recentActivities: ComplianceActivity[];
  monthlyTrends: MonthlyComplianceTrend[];
}

export interface ComplianceActivity {
  id: string;
  complianceId: string;
  activityType: ActivityType;
  description: string;
  activityDate: Date;
  performedBy?: string;
}

export interface MonthlyComplianceTrend {
  month: string;
  completed: number;
  created: number;
  overdue: number;
  avgCompletionTime: number;
}

// Enums (matching Prisma schema)
export enum ComplianceType {
  ROC_FILING = 'ROC_FILING',
  BOARD_MEETING = 'BOARD_MEETING',
  AGM = 'AGM',
  EGM = 'EGM',
  AUDIT = 'AUDIT',
  TAX_FILING = 'TAX_FILING',
  REGULATORY = 'REGULATORY',
  STATUTORY = 'STATUTORY',
  PERIODIC = 'PERIODIC',
  ONE_TIME = 'ONE_TIME'
}

export enum ComplianceCategory {
  CORPORATE_GOVERNANCE = 'CORPORATE_GOVERNANCE',
  REGULATORY_COMPLIANCE = 'REGULATORY_COMPLIANCE',
  TAX_COMPLIANCE = 'TAX_COMPLIANCE',
  AUDIT_COMPLIANCE = 'AUDIT_COMPLIANCE',
  BOARD_MATTERS = 'BOARD_MATTERS',
  SHAREHOLDER_MATTERS = 'SHAREHOLDER_MATTERS',
  SECRETARIAL_COMPLIANCE = 'SECRETARIAL_COMPLIANCE',
  ANNUAL_COMPLIANCE = 'ANNUAL_COMPLIANCE',
  QUARTERLY_COMPLIANCE = 'QUARTERLY_COMPLIANCE',
  MONTHLY_COMPLIANCE = 'MONTHLY_COMPLIANCE'
}

export enum ComplianceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  ANNUALLY = 'ANNUALLY',
  BI_ANNUALLY = 'BI_ANNUALLY',
  ON_DEMAND = 'ON_DEMAND'
}

export enum ComplianceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ActivityType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED',
  ESCALATED = 'ESCALATED',
  ASSIGNED = 'ASSIGNED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  REMINDER_SENT = 'REMINDER_SENT',
  COMMENT_ADDED = 'COMMENT_ADDED',
  STATUS_CHANGED = 'STATUS_CHANGED'
}

export enum AlertType {
  UPCOMING_DEADLINE = 'UPCOMING_DEADLINE',
  OVERDUE_ITEM = 'OVERDUE_ITEM',
  CRITICAL_ALERT = 'CRITICAL_ALERT',
  REMINDER = 'REMINDER',
  ESCALATION = 'ESCALATION',
  COMPLETION_REQUIRED = 'COMPLETION_REQUIRED'
}

/**
 * Advanced Compliance Engine Class
 */
export class ComplianceEngine {

  /**
   * Calculate next due date for recurring compliance items
   */
  static calculateNextDueDate(
    currentDueDate: Date,
    frequency: ComplianceFrequency
  ): Date {
    const nextDate = new Date(currentDueDate);

    switch (frequency) {
      case ComplianceFrequency.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case ComplianceFrequency.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case ComplianceFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case ComplianceFrequency.QUARTERLY:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case ComplianceFrequency.HALF_YEARLY:
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case ComplianceFrequency.ANNUALLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case ComplianceFrequency.BI_ANNUALLY:
        nextDate.setFullYear(nextDate.getFullYear() + 2);
        break;
      default:
        // For ON_DEMAND, return same date
        break;
    }

    return nextDate;
  }

  /**
   * Determine priority based on compliance type and due date
   */
  static calculatePriority(
    complianceType: ComplianceType,
    dueDate: Date,
    currentDate: Date = new Date()
  ): Priority {
    const daysUntilDue = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    // ROC filings and AGMs are always high priority
    if (complianceType === ComplianceType.ROC_FILING || complianceType === ComplianceType.AGM) {
      return daysUntilDue <= 3 ? Priority.CRITICAL : Priority.HIGH;
    }

    // Board meetings are medium-high priority
    if (complianceType === ComplianceType.BOARD_MEETING || complianceType === ComplianceType.EGM) {
      return daysUntilDue <= 2 ? Priority.HIGH : Priority.MEDIUM;
    }

    // Tax filings are critical if overdue
    if (complianceType === ComplianceType.TAX_FILING) {
      if (daysUntilDue < 0) return Priority.CRITICAL;
      if (daysUntilDue <= 5) return Priority.HIGH;
      return Priority.MEDIUM;
    }

    // General priority based on days until due
    if (daysUntilDue < 0) return Priority.CRITICAL;
    if (daysUntilDue <= 2) return Priority.HIGH;
    if (daysUntilDue <= 7) return Priority.MEDIUM;
    return Priority.LOW;
  }

  /**
   * Calculate penalties for overdue compliance items
   */
  static calculatePenalty(
    complianceType: ComplianceType,
    daysOverdue: number,
    baseAmount: number = 0
  ): number {
    if (daysOverdue <= 0) return 0;

    let penalty = 0;

    switch (complianceType) {
      case ComplianceType.ROC_FILING:
        // ROC filing penalties: ₹100 per day, max ₹1,00,000
        penalty = Math.min(daysOverdue * 100, 100000);
        break;

      case ComplianceType.AGM:
        // AGM delay penalty: ₹100 per day for first month, then ₹300 per day
        if (daysOverdue <= 30) {
          penalty = daysOverdue * 100;
        } else {
          penalty = 3000 + (daysOverdue - 30) * 300;
        }
        penalty = Math.min(penalty, 500000);
        break;

      case ComplianceType.BOARD_MEETING:
        // Board meeting penalties are generally lower
        penalty = Math.min(daysOverdue * 50, 10000);
        break;

      case ComplianceType.TAX_FILING:
        // Tax filing penalties vary, using base amount
        penalty = Math.min(daysOverdue * Math.max(baseAmount * 0.001, 100), 50000);
        break;

      default:
        // Generic penalty calculation
        penalty = Math.min(daysOverdue * 25, 5000);
        break;
    }

    return penalty;
  }

  /**
   * Generate alerts for compliance items
   */
  static generateAlerts(
    compliance: ComplianceItem,
    currentDate: Date = new Date()
  ): ComplianceAlert[] {
    const alerts: ComplianceAlert[] = [];
    const daysUntilDue = Math.ceil((compliance.dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    // Overdue alert
    if (daysUntilDue < 0) {
      alerts.push({
        id: `alert-overdue-${compliance.id}`,
        complianceId: compliance.id,
        alertType: AlertType.OVERDUE_ITEM,
        message: `${compliance.title} is ${Math.abs(daysUntilDue)} days overdue`,
        reminderDays: Math.abs(daysUntilDue),
        escalationLevel: Math.min(Math.floor(Math.abs(daysUntilDue) / 7) + 1, 5),
        scheduledFor: currentDate
      });
    }

    // Upcoming deadline alert
    else if (daysUntilDue <= compliance.reminderDays) {
      alerts.push({
        id: `alert-upcoming-${compliance.id}`,
        complianceId: compliance.id,
        alertType: AlertType.UPCOMING_DEADLINE,
        message: `${compliance.title} is due in ${daysUntilDue} days`,
        reminderDays: daysUntilDue,
        escalationLevel: 1,
        scheduledFor: currentDate
      });
    }

    // Critical priority alert
    if (compliance.priority === Priority.CRITICAL) {
      alerts.push({
        id: `alert-critical-${compliance.id}`,
        complianceId: compliance.id,
        alertType: AlertType.CRITICAL_ALERT,
        message: `Critical compliance item: ${compliance.title}`,
        reminderDays: 0,
        escalationLevel: 3,
        scheduledFor: currentDate
      });
    }

    return alerts;
  }

  /**
   * Calculate compliance statistics
   */
  static calculateStats(compliances: ComplianceItem[]): ComplianceStats {
    const now = new Date();

    const stats = {
      totalCompliances: compliances.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      upcomingDeadlines: 0,
      criticalAlerts: 0,
      totalEstimatedCost: 0,
      totalActualCost: 0,
      completionRate: 0,
      averageCompletionTime: 0
    };

    let totalCompletionTime = 0;
    let completedCount = 0;

    compliances.forEach(compliance => {
      // Status counts
      switch (compliance.status) {
        case ComplianceStatus.PENDING:
          stats.pending++;
          break;
        case ComplianceStatus.IN_PROGRESS:
          stats.inProgress++;
          break;
        case ComplianceStatus.COMPLETED:
          stats.completed++;
          completedCount++;
          break;
        case ComplianceStatus.OVERDUE:
          stats.overdue++;
          break;
      }

      // Check if overdue (regardless of status)
      if (compliance.dueDate < now && compliance.status !== ComplianceStatus.COMPLETED) {
        stats.overdue++;
      }

      // Check upcoming deadlines (next 7 days)
      const daysUntilDue = Math.ceil((compliance.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDue <= 7 && daysUntilDue > 0 && compliance.status !== ComplianceStatus.COMPLETED) {
        stats.upcomingDeadlines++;
      }

      // Critical alerts
      if (compliance.priority === Priority.CRITICAL) {
        stats.criticalAlerts++;
      }

      // Financial tracking
      stats.totalEstimatedCost += compliance.estimatedCost || 0;
      stats.totalActualCost += compliance.actualCost || 0;
    });

    // Completion rate
    stats.completionRate = stats.totalCompliances > 0
      ? (stats.completed / stats.totalCompliances) * 100
      : 0;

    // Average completion time (simplified - would need created date in real implementation)
    stats.averageCompletionTime = completedCount > 0 ? totalCompletionTime / completedCount : 0;

    return stats;
  }

  /**
   * Get predefined compliance templates for CS practices
   */
  static getDefaultTemplates(): Partial<ComplianceTemplate>[] {
    return [
      {
        title: 'Annual General Meeting (AGM)',
        complianceType: ComplianceType.AGM,
        category: ComplianceCategory.SHAREHOLDER_MATTERS,
        frequency: ComplianceFrequency.ANNUALLY,
        defaultDays: 180, // 6 months from financial year end
        reminderDays: 30,
        estimatedCost: 15000,
        instructions: 'AGM must be held within 6 months from the end of financial year',
        checklist: [
          'Send AGM notice 21 days in advance',
          'Prepare Annual Report',
          'Finalize audited financial statements',
          'Arrange venue and logistics',
          'File MGT-15 within 30 days after AGM'
        ],
        requiredDocs: ['Annual Report', 'Audited Financial Statements', 'Notice of AGM']
      },
      {
        title: 'Board Meeting - Quarterly',
        complianceType: ComplianceType.BOARD_MEETING,
        category: ComplianceCategory.BOARD_MATTERS,
        frequency: ComplianceFrequency.QUARTERLY,
        defaultDays: 90,
        reminderDays: 7,
        estimatedCost: 5000,
        instructions: 'Board meetings must be held at least once in every quarter',
        checklist: [
          'Send meeting notice 7 days in advance',
          'Prepare agenda and board papers',
          'Conduct meeting with quorum',
          'Record minutes within 30 days'
        ],
        requiredDocs: ['Meeting Notice', 'Agenda', 'Board Resolution', 'Minutes']
      },
      {
        title: 'Form AOC-4 Filing',
        complianceType: ComplianceType.ROC_FILING,
        category: ComplianceCategory.REGULATORY_COMPLIANCE,
        frequency: ComplianceFrequency.ANNUALLY,
        defaultDays: 240, // 8 months from FY end
        reminderDays: 30,
        estimatedCost: 8000,
        rocForm: 'AOC-4',
        instructions: 'Annual filing of financial statements and other documents',
        checklist: [
          'Prepare audited financial statements',
          'Board approval for adoption of accounts',
          'AGM approval of financial statements',
          'File AOC-4 within 30 days of AGM'
        ],
        requiredDocs: ['Audited Financial Statements', 'Board Resolution', 'AGM Resolution']
      },
      {
        title: 'Form MGT-7 Filing',
        complianceType: ComplianceType.ROC_FILING,
        category: ComplianceCategory.REGULATORY_COMPLIANCE,
        frequency: ComplianceFrequency.ANNUALLY,
        defaultDays: 60, // Within 60 days of AGM
        reminderDays: 15,
        estimatedCost: 5000,
        rocForm: 'MGT-7',
        instructions: 'Annual return filing with ROC',
        checklist: [
          'Prepare annual return as per MGT-7',
          'Update member details',
          'Include details of board meetings',
          'File within 60 days of AGM'
        ],
        requiredDocs: ['Annual Return', 'Updated Member Register']
      },
      {
        title: 'DIR-3 KYC Filing',
        complianceType: ComplianceType.ROC_FILING,
        category: ComplianceCategory.REGULATORY_COMPLIANCE,
        frequency: ComplianceFrequency.ANNUALLY,
        defaultDays: 120, // By 30th April every year
        reminderDays: 30,
        estimatedCost: 3000,
        rocForm: 'DIR-3 KYC',
        instructions: 'Annual KYC filing for all directors',
        checklist: [
          'Collect KYC documents from all directors',
          'Verify PAN and Aadhaar details',
          'File DIR-3 KYC for each director',
          'Obtain acknowledgment receipts'
        ],
        requiredDocs: ['PAN Card', 'Aadhaar Card', 'Photograph', 'Address Proof']
      }
    ];
  }

  /**
   * Create compliance items from templates
   */
  static createComplianceFromTemplate(
    template: ComplianceTemplate,
    customerId: string,
    financialYearEnd: Date = new Date()
  ): Partial<ComplianceItem> {
    const dueDate = new Date(financialYearEnd);
    dueDate.setDate(dueDate.getDate() + template.defaultDays);

    const nextDueDate = template.frequency !== ComplianceFrequency.ON_DEMAND
      ? this.calculateNextDueDate(dueDate, template.frequency)
      : undefined;

    return {
      title: template.title,
      complianceType: template.complianceType,
      category: template.category,
      dueDate,
      status: ComplianceStatus.PENDING,
      priority: this.calculatePriority(template.complianceType, dueDate),
      frequency: template.frequency,
      isRecurring: template.frequency !== ComplianceFrequency.ON_DEMAND,
      nextDueDate,
      reminderDays: template.reminderDays,
      estimatedCost: template.estimatedCost,
      rocForm: template.rocForm,
      customerId
    };
  }
}

// Export the singleton instance
export const complianceEngine = new ComplianceEngine();