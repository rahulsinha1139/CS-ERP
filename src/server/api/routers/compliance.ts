/**
 * Compliance Management tRPC Router
 * Handles compliance tracking, templates, alerts, and reporting
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ComplianceEngine, ComplianceType, Priority, ComplianceFrequency, ActivityType, ComplianceCategory, type ComplianceItem } from "../../../lib/compliance-engine";
import { type Prisma } from "@prisma/client";
import { idGenerator } from "@/lib/id-generator";

// Validation schemas
const complianceCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  customerId: z.string().optional(),
  complianceType: z.enum([
    'ROC_FILING', 'BOARD_MEETING', 'AGM', 'EGM', 'AUDIT',
    'TAX_FILING', 'REGULATORY', 'STATUTORY', 'PERIODIC', 'ONE_TIME'
  ]),
  category: z.enum([
    'CORPORATE_GOVERNANCE', 'REGULATORY_COMPLIANCE', 'TAX_COMPLIANCE',
    'AUDIT_COMPLIANCE', 'BOARD_MATTERS', 'SHAREHOLDER_MATTERS',
    'SECRETARIAL_COMPLIANCE', 'ANNUAL_COMPLIANCE', 'QUARTERLY_COMPLIANCE',
    'MONTHLY_COMPLIANCE'
  ]),
  dueDate: z.date(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  frequency: z.enum([
    'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY',
    'HALF_YEARLY', 'ANNUALLY', 'BI_ANNUALLY', 'ON_DEMAND'
  ]).optional(),
  isRecurring: z.boolean().default(false),
  reminderDays: z.number().default(7),
  estimatedCost: z.number().optional(),
  rocForm: z.string().optional(),
  rocSection: z.string().optional(),
  applicableAct: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const complianceRouter = createTRPCRouter({

  // ================== COMPLIANCE ITEMS ==================

  /**
   * Get all compliance items with filtering and pagination
   */
  getAll: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      customerId: z.string().optional(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
      category: z.string().optional(),
      complianceType: z.string().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
      dueDateFrom: z.date().optional(),
      dueDateTo: z.date().optional(),
      sortBy: z.enum(['dueDate', 'priority', 'status', 'createdAt']).default('dueDate'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      const { page, limit, sortBy, sortOrder, ...filters } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.ComplianceItemWhereInput = {
        companyId: ctx.companyId,
      };

      if (filters.customerId) where.customerId = filters.customerId;
      if (filters.status) where.status = filters.status;
      if (filters.category) where.category = filters.category as ComplianceCategory;
      if (filters.complianceType) where.complianceType = filters.complianceType as ComplianceType;
      if (filters.priority) where.priority = filters.priority;

      // Date range filter
      if (filters.dueDateFrom || filters.dueDateTo) {
        where.dueDate = {};
        if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom;
        if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo;
      }

      // Get compliance items
      const [compliances, totalCount] = await Promise.all([
        ctx.db.complianceItem.findMany({
          where,
          include: {
            customer: true,
            template: true,
            activities: {
              orderBy: { createdAt: 'desc' },
              take: 3,
            },
          },
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        ctx.db.complianceItem.count({ where }),
      ]);

      // Calculate penalties for overdue items
      const now = new Date();
      const enhancedCompliances = compliances.map(compliance => {
        const daysOverdue = compliance.status === 'OVERDUE' || compliance.dueDate < now
          ? Math.ceil((now.getTime() - compliance.dueDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        const penalty = daysOverdue > 0
          ? ComplianceEngine.calculatePenalty(
              compliance.complianceType as ComplianceType,
              daysOverdue,
              compliance.estimatedCost || 0
            )
          : 0;

        return {
          ...compliance,
          daysOverdue: Math.max(0, daysOverdue),
          calculatedPenalty: penalty,
        };
      });

      return {
        compliances: enhancedCompliances,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  /**
   * Get single compliance item by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const compliance = await ctx.db.complianceItem.findFirst({
        where: {
          id: input.id,
          companyId: ctx.companyId!,
        },
        include: {
          customer: true,
          template: true,
          activities: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!compliance) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Compliance item not found',
        });
      }

      return compliance;
    }),

  /**
   * Create new compliance item
   */
  create: protectedProcedure
    .input(complianceCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      // Auto-calculate priority if not provided
      const priority = input.priority || ComplianceEngine.calculatePriority(
        input.complianceType as ComplianceType,
        input.dueDate
      );

      const compliance = await ctx.db.complianceItem.create({
        data: {
          id: idGenerator.compliance(),
          ...input,
          companyId: ctx.companyId,
          priority: priority as Priority,
          nextDueDate: input.isRecurring && input.frequency
            ? ComplianceEngine.calculateNextDueDate(input.dueDate, input.frequency as ComplianceFrequency)
            : undefined,
        } as Prisma.ComplianceItemUncheckedCreateInput,
        include: {
          customer: true,
          template: true,
        },
      });

      // Create activity log
      await ctx.db.complianceActivity.create({
        data: {
          id: idGenerator.complianceActivity(),
          complianceId: compliance.id,
          activityType: ActivityType.CREATED,
          description: `Compliance item created: ${compliance.title}`,
          performedBy: 'System', // In real app, would be current user
        },
      });

      return compliance;
    }),

  /**
   * Update compliance item
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
      dueDate: z.date().optional(),
      completedDate: z.date().optional(),
      actualCost: z.number().optional(),
      completionNotes: z.string().optional(),
      assignedTo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingCompliance = await ctx.db.complianceItem.findFirst({
        where: {
          id,
          companyId: ctx.companyId!,
        },
      });

      if (!existingCompliance) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Compliance item not found',
        });
      }

      // If marking as completed, set completion date
      if (updateData.status === 'COMPLETED' && !updateData.completedDate) {
        updateData.completedDate = new Date();
      }

      const updatedCompliance = await ctx.db.complianceItem.update({
        where: { id },
        data: updateData,
        include: {
          customer: true,
        },
      });

      // Create activity log
      let activityDescription = `Compliance item updated`;
      let activityType: ActivityType = ActivityType.UPDATED;

      if (updateData.status) {
        activityDescription = `Status changed to ${updateData.status}`;
        activityType = ActivityType.STATUS_CHANGED;

        if (updateData.status === 'COMPLETED') {
          activityType = ActivityType.COMPLETED;
          activityDescription = `Compliance item completed`;
        }
      }

      await ctx.db.complianceActivity.create({
        data: {
          id: idGenerator.complianceActivity(),
          complianceId: id,
          activityType,
          description: activityDescription,
          performedBy: 'System',
        },
      });

      return updatedCompliance;
    }),

  /**
   * Get compliance dashboard data
   */
  getDashboard: protectedProcedure
    .input(z.object({
      dateRange: z.enum(['thisWeek', 'thisMonth', 'thisQuarter', 'thisYear']).default('thisMonth'),
    }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      // Calculate date range
      switch (input.dateRange) {
        case 'thisWeek':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'thisQuarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      // Get all compliance items
      const compliances = await ctx.db.complianceItem.findMany({
        where: {
          companyId: ctx.companyId!,
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          customer: true,
        },
        orderBy: { dueDate: 'asc' },
      });

      // Calculate statistics using our engine
      const stats = ComplianceEngine.calculateStats(compliances as ComplianceItem[]);

      // Get upcoming deadlines (next 7 days)
      const upcomingDeadlines = compliances
        .filter(c => {
          const daysUntilDue = Math.ceil((c.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilDue <= 7 && daysUntilDue > 0 && c.status !== 'COMPLETED';
        })
        .slice(0, 10);

      // Get overdue items
      const overdueItems = compliances
        .filter(c => c.dueDate < now && c.status !== 'COMPLETED')
        .slice(0, 10);

      // Get recent activities
      const recentActivities = await ctx.db.complianceActivity.findMany({
        where: {
          compliance: {
            companyId: ctx.companyId!,
          },
        },
        include: {
          compliance: {
            include: {
              customer: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return {
        stats,
        upcomingDeadlines,
        overdueItems,
        recentActivities,
        totalCompliances: compliances.length,
      };
    }),

  /**
   * Get default templates and initialize them
   */
  initializeDefaultTemplates: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      // Check if company exists, create if it doesn't (for testing)
      let company = await ctx.db.company.findUnique({
        where: { id: ctx.companyId }
      });

      if (!company) {
        // Create a test company for testing purposes
        company = await ctx.db.company.create({
          data: {
            id: ctx.companyId,
            name: 'Test Company',
            email: 'test@company.com',
            stateCode: '29',
          }
        });
      }

      const defaultTemplates = ComplianceEngine.getDefaultTemplates();
      const createdTemplates = [];

      for (const templateData of defaultTemplates) {
        const existingTemplate = await ctx.db.complianceTemplate.findFirst({
          where: {
            title: templateData.title,
            companyId: ctx.companyId,
          },
        });

        if (!existingTemplate) {
          const template = await ctx.db.complianceTemplate.create({
            data: {
              id: idGenerator.complianceTemplate(),
              ...templateData,
              companyId: ctx.companyId,
            } as Prisma.ComplianceTemplateUncheckedCreateInput,
          });
          createdTemplates.push(template);
        }
      }

      return {
        created: createdTemplates.length,
        templates: createdTemplates,
      };
    }),

  /**
   * Get compliance templates
   */
  getTemplates: protectedProcedure
    .query(async ({ ctx }) => {
      const templates = await ctx.db.complianceTemplate.findMany({
        where: {
          companyId: ctx.companyId!,
          isActive: true,
        },
        orderBy: { title: 'asc' },
      });

      return templates;
    }),

  /**
   * Get upcoming compliance deadlines (next 7 days)
   */
  getUpcoming: protectedProcedure
    .input(z.object({
      days: z.number().min(1).max(30).default(7),
      limit: z.number().min(1).max(50).default(10),
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.companyId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Company ID required',
        });
      }

      const now = new Date();
      const daysAhead = input?.days || 7;
      const limit = input?.limit || 10;

      // Calculate future date
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + daysAhead);

      const upcomingCompliances = await ctx.db.complianceItem.findMany({
        where: {
          companyId: ctx.companyId,
          status: { not: 'COMPLETED' },
          dueDate: {
            gte: now,
            lte: futureDate,
          },
        },
        include: {
          customer: true,
          template: true,
        },
        orderBy: { dueDate: 'asc' },
        take: limit,
      });

      // Calculate days until due for each item
      const enhancedCompliances = upcomingCompliances.map(compliance => {
        const daysUntilDue = Math.ceil(
          (compliance.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          ...compliance,
          daysUntilDue: Math.max(0, daysUntilDue),
        };
      });

      return {
        compliances: enhancedCompliances,
        totalCount: enhancedCompliances.length,
        daysAhead,
      };
    }),

});
