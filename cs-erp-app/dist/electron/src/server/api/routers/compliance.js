"use strict";
/**
 * Compliance Management tRPC Router
 * Handles compliance tracking, templates, alerts, and reporting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const compliance_engine_1 = require("../../../lib/compliance-engine");
const id_generator_1 = require("@/lib/id-generator");
// Validation schemas
const complianceCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    customerId: zod_1.z.string().optional(),
    complianceType: zod_1.z.enum([
        'ROC_FILING', 'BOARD_MEETING', 'AGM', 'EGM', 'AUDIT',
        'TAX_FILING', 'REGULATORY', 'STATUTORY', 'PERIODIC', 'ONE_TIME'
    ]),
    category: zod_1.z.enum([
        'CORPORATE_GOVERNANCE', 'REGULATORY_COMPLIANCE', 'TAX_COMPLIANCE',
        'AUDIT_COMPLIANCE', 'BOARD_MATTERS', 'SHAREHOLDER_MATTERS',
        'SECRETARIAL_COMPLIANCE', 'ANNUAL_COMPLIANCE', 'QUARTERLY_COMPLIANCE',
        'MONTHLY_COMPLIANCE'
    ]),
    dueDate: zod_1.z.date(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    frequency: zod_1.z.enum([
        'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY',
        'HALF_YEARLY', 'ANNUALLY', 'BI_ANNUALLY', 'ON_DEMAND'
    ]).optional(),
    isRecurring: zod_1.z.boolean().default(false),
    reminderDays: zod_1.z.number().default(7),
    estimatedCost: zod_1.z.number().optional(),
    rocForm: zod_1.z.string().optional(),
    rocSection: zod_1.z.string().optional(),
    applicableAct: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
});
exports.complianceRouter = (0, trpc_1.createTRPCRouter)({
    // ================== COMPLIANCE ITEMS ==================
    /**
     * Get all compliance items with filtering and pagination
     */
    getAll: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        page: zod_1.z.number().default(1),
        limit: zod_1.z.number().default(20),
        customerId: zod_1.z.string().optional(),
        status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
        category: zod_1.z.string().optional(),
        complianceType: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
        dueDateFrom: zod_1.z.date().optional(),
        dueDateTo: zod_1.z.date().optional(),
        sortBy: zod_1.z.enum(['dueDate', 'priority', 'status', 'createdAt']).default('dueDate'),
        sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
    }))
        .query(async ({ ctx, input }) => {
        if (!ctx.companyId) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Company ID required',
            });
        }
        const { page, limit, sortBy, sortOrder, ...filters } = input;
        const skip = (page - 1) * limit;
        // Build where clause
        const where = {
            companyId: ctx.companyId,
        };
        if (filters.customerId)
            where.customerId = filters.customerId;
        if (filters.status)
            where.status = filters.status;
        if (filters.category)
            where.category = filters.category;
        if (filters.complianceType)
            where.complianceType = filters.complianceType;
        if (filters.priority)
            where.priority = filters.priority;
        // Date range filter
        if (filters.dueDateFrom || filters.dueDateTo) {
            where.dueDate = {};
            if (filters.dueDateFrom)
                where.dueDate.gte = filters.dueDateFrom;
            if (filters.dueDateTo)
                where.dueDate.lte = filters.dueDateTo;
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
                ? compliance_engine_1.ComplianceEngine.calculatePenalty(compliance.complianceType, daysOverdue, compliance.estimatedCost || 0)
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
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(async ({ ctx, input }) => {
        const compliance = await ctx.db.complianceItem.findFirst({
            where: {
                id: input.id,
                companyId: ctx.companyId,
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
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Compliance item not found',
            });
        }
        return compliance;
    }),
    /**
     * Create new compliance item
     */
    create: trpc_1.protectedProcedure
        .input(complianceCreateSchema)
        .mutation(async ({ ctx, input }) => {
        if (!ctx.companyId) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Company ID required',
            });
        }
        // Auto-calculate priority if not provided
        const priority = input.priority || compliance_engine_1.ComplianceEngine.calculatePriority(input.complianceType, input.dueDate);
        const compliance = await ctx.db.complianceItem.create({
            data: {
                id: id_generator_1.idGenerator.compliance(),
                ...input,
                companyId: ctx.companyId,
                priority: priority,
                nextDueDate: input.isRecurring && input.frequency
                    ? compliance_engine_1.ComplianceEngine.calculateNextDueDate(input.dueDate, input.frequency)
                    : undefined,
            },
            include: {
                customer: true,
                template: true,
            },
        });
        // Create activity log
        await ctx.db.complianceActivity.create({
            data: {
                id: id_generator_1.idGenerator.complianceActivity(),
                complianceId: compliance.id,
                activityType: compliance_engine_1.ActivityType.CREATED,
                description: `Compliance item created: ${compliance.title}`,
                performedBy: 'System', // In real app, would be current user
            },
        });
        return compliance;
    }),
    /**
     * Update compliance item
     */
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
        dueDate: zod_1.z.date().optional(),
        completedDate: zod_1.z.date().optional(),
        actualCost: zod_1.z.number().optional(),
        completionNotes: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input;
        const existingCompliance = await ctx.db.complianceItem.findFirst({
            where: {
                id,
                companyId: ctx.companyId,
            },
        });
        if (!existingCompliance) {
            throw new server_1.TRPCError({
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
        let activityType = compliance_engine_1.ActivityType.UPDATED;
        if (updateData.status) {
            activityDescription = `Status changed to ${updateData.status}`;
            activityType = compliance_engine_1.ActivityType.STATUS_CHANGED;
            if (updateData.status === 'COMPLETED') {
                activityType = compliance_engine_1.ActivityType.COMPLETED;
                activityDescription = `Compliance item completed`;
            }
        }
        await ctx.db.complianceActivity.create({
            data: {
                id: id_generator_1.idGenerator.complianceActivity(),
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
    getDashboard: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        dateRange: zod_1.z.enum(['thisWeek', 'thisMonth', 'thisQuarter', 'thisYear']).default('thisMonth'),
    }))
        .query(async ({ ctx, input }) => {
        const now = new Date();
        let startDate;
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
                companyId: ctx.companyId,
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
        const stats = compliance_engine_1.ComplianceEngine.calculateStats(compliances);
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
                    companyId: ctx.companyId,
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
    initializeDefaultTemplates: trpc_1.protectedProcedure
        .mutation(async ({ ctx }) => {
        if (!ctx.companyId) {
            throw new server_1.TRPCError({
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
        const defaultTemplates = compliance_engine_1.ComplianceEngine.getDefaultTemplates();
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
                        id: id_generator_1.idGenerator.complianceTemplate(),
                        ...templateData,
                        companyId: ctx.companyId,
                    },
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
    getTemplates: trpc_1.protectedProcedure
        .query(async ({ ctx }) => {
        const templates = await ctx.db.complianceTemplate.findMany({
            where: {
                companyId: ctx.companyId,
                isActive: true,
            },
            orderBy: { title: 'asc' },
        });
        return templates;
    }),
    /**
     * Get upcoming compliance deadlines (next 7 days)
     */
    getUpcoming: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        days: zod_1.z.number().min(1).max(30).default(7),
        limit: zod_1.z.number().min(1).max(50).default(10),
    }).optional())
        .query(async ({ ctx, input }) => {
        if (!ctx.companyId) {
            throw new server_1.TRPCError({
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
            const daysUntilDue = Math.ceil((compliance.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
    /**
     * Delete a compliance item
     */
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.companyId) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Company ID required',
            });
        }
        // Verify the compliance belongs to this company
        const compliance = await ctx.db.complianceItem.findFirst({
            where: {
                id: input.id,
                companyId: ctx.companyId,
            },
        });
        if (!compliance) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Compliance item not found',
            });
        }
        // Delete the compliance item (cascade will handle related records)
        await ctx.db.complianceItem.delete({
            where: { id: input.id },
        });
        return { success: true };
    }),
    /**
     * Mark compliance as complete
     */
    markComplete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        actualCost: zod_1.z.number().optional(),
        completionNotes: zod_1.z.string().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.companyId) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Company ID required',
            });
        }
        // Verify the compliance belongs to this company
        const compliance = await ctx.db.complianceItem.findFirst({
            where: {
                id: input.id,
                companyId: ctx.companyId,
            },
        });
        if (!compliance) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Compliance item not found',
            });
        }
        // Update compliance status to COMPLETED
        const completedCompliance = await ctx.db.complianceItem.update({
            where: { id: input.id },
            data: {
                status: 'COMPLETED',
                completedDate: new Date(),
                actualCost: input.actualCost,
            },
        });
        // Create activity log
        await ctx.db.complianceActivity.create({
            data: {
                complianceId: input.id,
                activityType: 'COMPLETED',
                description: input.completionNotes || 'Compliance item marked as completed',
                activityDate: new Date(),
                performedBy: 'System',
            },
        });
        return completedCompliance;
    }),
});
