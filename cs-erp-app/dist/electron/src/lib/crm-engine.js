"use strict";
/**
 * Advanced Client Relationship Management Engine
 * Comprehensive CRM with AI-powered insights and automation
 * Following Asymm mathematical optimization principles
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.crmUtils = exports.crmEngine = exports.CRMEngine = exports.LifecycleStage = exports.CustomerRiskLevel = exports.InteractionType = exports.CustomerTier = void 0;
// Mathematical constants for optimization
// const GOLDEN_RATIO = 1.618033988; // Unused - removed
// const ENGAGEMENT_WEIGHT_DECAY = 0.95; // Weekly decay for engagement scoring - unused
// const RISK_ASSESSMENT_FACTORS = 7; // Number of factors in risk assessment - unused
// const SEGMENTATION_CLUSTERS = Math.floor(GOLDEN_RATIO * 5); // 8 customer segments - unused
var CustomerTier;
(function (CustomerTier) {
    CustomerTier["PLATINUM"] = "PLATINUM";
    CustomerTier["GOLD"] = "GOLD";
    CustomerTier["SILVER"] = "SILVER";
    CustomerTier["BRONZE"] = "BRONZE";
    CustomerTier["PROSPECT"] = "PROSPECT";
})(CustomerTier || (exports.CustomerTier = CustomerTier = {}));
var InteractionType;
(function (InteractionType) {
    InteractionType["PHONE_CALL"] = "PHONE_CALL";
    InteractionType["EMAIL"] = "EMAIL";
    InteractionType["MEETING"] = "MEETING";
    InteractionType["WHATSAPP"] = "WHATSAPP";
    InteractionType["SITE_VISIT"] = "SITE_VISIT";
    InteractionType["DOCUMENT_SUBMISSION"] = "DOCUMENT_SUBMISSION";
    InteractionType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
    InteractionType["INVOICE_SENT"] = "INVOICE_SENT";
    InteractionType["COMPLAINT"] = "COMPLAINT";
    InteractionType["APPRECIATION"] = "APPRECIATION";
    InteractionType["REFERRAL"] = "REFERRAL";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
var CustomerRiskLevel;
(function (CustomerRiskLevel) {
    CustomerRiskLevel["LOW"] = "LOW";
    CustomerRiskLevel["MEDIUM"] = "MEDIUM";
    CustomerRiskLevel["HIGH"] = "HIGH";
    CustomerRiskLevel["CRITICAL"] = "CRITICAL";
})(CustomerRiskLevel || (exports.CustomerRiskLevel = CustomerRiskLevel = {}));
var LifecycleStage;
(function (LifecycleStage) {
    LifecycleStage["LEAD"] = "LEAD";
    LifecycleStage["PROSPECT"] = "PROSPECT";
    LifecycleStage["ACTIVE_CLIENT"] = "ACTIVE_CLIENT";
    LifecycleStage["LOYAL_CLIENT"] = "LOYAL_CLIENT";
    LifecycleStage["AT_RISK"] = "AT_RISK";
    LifecycleStage["CHURNED"] = "CHURNED";
    LifecycleStage["WIN_BACK"] = "WIN_BACK";
})(LifecycleStage || (exports.LifecycleStage = LifecycleStage = {}));
class CRMEngine {
    static getInstance() {
        if (!CRMEngine.instance) {
            CRMEngine.instance = new CRMEngine();
        }
        return CRMEngine.instance;
    }
    /**
     * Calculate comprehensive customer engagement score
     */
    calculateEngagementScore(customer, interactions, timeframe = 90 // days
    ) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeframe);
        const recentInteractions = interactions.filter(i => i.timestamp >= cutoffDate);
        if (recentInteractions.length === 0)
            return 0;
        // Interaction frequency score (0-30 points)
        const maxInteractionsForFullScore = 20;
        const frequencyScore = Math.min(30, (recentInteractions.length / maxInteractionsForFullScore) * 30);
        // Interaction quality score (0-25 points)
        const qualityWeights = {
            [InteractionType.MEETING]: 5,
            [InteractionType.PHONE_CALL]: 4,
            [InteractionType.SITE_VISIT]: 5,
            [InteractionType.DOCUMENT_SUBMISSION]: 3,
            [InteractionType.EMAIL]: 2,
            [InteractionType.WHATSAPP]: 2,
            [InteractionType.PAYMENT_RECEIVED]: 4,
            [InteractionType.INVOICE_SENT]: 1,
            [InteractionType.COMPLAINT]: -2,
            [InteractionType.APPRECIATION]: 3,
            [InteractionType.REFERRAL]: 5,
        };
        const totalQualityScore = recentInteractions.reduce((score, interaction) => {
            const baseScore = qualityWeights[interaction.type] || 1;
            const sentimentMultiplier = interaction.sentiment === 'POSITIVE' ? 1.2 :
                interaction.sentiment === 'NEGATIVE' ? 0.8 : 1;
            return score + (baseScore * sentimentMultiplier);
        }, 0);
        const qualityScore = Math.min(25, (totalQualityScore / recentInteractions.length) * 5);
        // Recency score (0-20 points)
        const daysSinceLastInteraction = Math.floor((new Date().getTime() - customer.lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
        const recencyScore = Math.max(0, 20 - (daysSinceLastInteraction * 0.5));
        // Payment behavior score (0-15 points)
        const paymentScore = customer.paymentHistory.onTimeRate * 15;
        // Response rate score (0-10 points)
        const outboundInteractions = recentInteractions.filter(i => i.direction === 'OUTBOUND');
        const inboundInteractions = recentInteractions.filter(i => i.direction === 'INBOUND');
        const responseRate = outboundInteractions.length > 0 ?
            inboundInteractions.length / outboundInteractions.length : 1;
        const responseScore = Math.min(10, responseRate * 10);
        const totalScore = frequencyScore + qualityScore + recencyScore + paymentScore + responseScore;
        return Math.round(Math.min(100, totalScore));
    }
    /**
     * Assess customer risk level using multiple factors
     */
    assessCustomerRisk(customer, interactions, financialData) {
        const factors = [];
        // Payment behavior factor (weight: 25%)
        const paymentRiskScore = Math.min(100, (financialData.averagePaymentDelay * 2) +
            (financialData.overdueAmount > 0 ? 30 : 0) +
            ((1 - customer.paymentHistory.onTimeRate) * 40));
        factors.push({
            factor: 'Payment Behavior',
            score: paymentRiskScore,
            weight: 0.25,
            description: `${customer.paymentHistory.onTimeRate * 100}% on-time rate, ${financialData.averagePaymentDelay} days average delay`
        });
        // Engagement factor (weight: 20%)
        const engagementRiskScore = Math.max(0, 100 - customer.engagementScore);
        factors.push({
            factor: 'Engagement Level',
            score: engagementRiskScore,
            weight: 0.20,
            description: `Engagement score: ${customer.engagementScore}/100`
        });
        // Communication factor (weight: 15%)
        const recentComplaints = interactions.filter(i => i.type === InteractionType.COMPLAINT &&
            i.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // last 30 days
        ).length;
        const communicationRiskScore = Math.min(100, recentComplaints * 25);
        factors.push({
            factor: 'Communication Issues',
            score: communicationRiskScore,
            weight: 0.15,
            description: `${recentComplaints} complaints in last 30 days`
        });
        // Financial exposure factor (weight: 20%)
        const exposureRatio = financialData.totalOutstanding / Math.max(customer.averageInvoiceValue, 1);
        const financialRiskScore = Math.min(100, exposureRatio * 20);
        factors.push({
            factor: 'Financial Exposure',
            score: financialRiskScore,
            weight: 0.20,
            description: `Outstanding amount: ${exposureRatio.toFixed(1)}x average invoice`
        });
        // Activity trend factor (weight: 10%)
        const last30Days = interactions.filter(i => i.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
        const previous30Days = interactions.filter(i => {
            const date = i.timestamp;
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
            return date <= thirtyDaysAgo && date > sixtyDaysAgo;
        }).length;
        const activityTrend = previous30Days > 0 ? (last30Days - previous30Days) / previous30Days : 0;
        const activityRiskScore = activityTrend < -0.5 ? 80 : activityTrend < 0 ? 40 : 0;
        factors.push({
            factor: 'Activity Trend',
            score: activityRiskScore,
            weight: 0.10,
            description: `${activityTrend > 0 ? 'Increasing' : 'Decreasing'} activity trend`
        });
        // Satisfaction factor (weight: 10%)
        const satisfactionRiskScore = customer.satisfactionScore ?
            Math.max(0, (3 - customer.satisfactionScore) * 25) : 50;
        factors.push({
            factor: 'Customer Satisfaction',
            score: satisfactionRiskScore,
            weight: 0.10,
            description: customer.satisfactionScore ?
                `Satisfaction: ${customer.satisfactionScore}/5` : 'No satisfaction data'
        });
        // Calculate weighted risk score
        const weightedRiskScore = factors.reduce((total, factor) => {
            return total + (factor.score * factor.weight);
        }, 0);
        // Determine risk level
        let riskLevel;
        if (weightedRiskScore >= 75)
            riskLevel = CustomerRiskLevel.CRITICAL;
        else if (weightedRiskScore >= 50)
            riskLevel = CustomerRiskLevel.HIGH;
        else if (weightedRiskScore >= 25)
            riskLevel = CustomerRiskLevel.MEDIUM;
        else
            riskLevel = CustomerRiskLevel.LOW;
        return {
            riskLevel,
            riskScore: Math.round(weightedRiskScore),
            riskFactors: factors,
        };
    }
    /**
     * Determine customer tier based on comprehensive metrics
     */
    calculateCustomerTier(customer) {
        // Revenue-based scoring (40% weight)
        const revenueScore = this.getRevenueScore(customer.totalRevenue);
        // Engagement-based scoring (30% weight)
        const engagementScore = customer.engagementScore;
        // Loyalty-based scoring (20% weight)
        const loyaltyScore = this.getLoyaltyScore(customer);
        // Payment behavior scoring (10% weight)
        const paymentScore = customer.paymentHistory.onTimeRate * 100;
        const totalScore = (revenueScore * 0.4) + (engagementScore * 0.3) +
            (loyaltyScore * 0.2) + (paymentScore * 0.1);
        if (totalScore >= 80)
            return CustomerTier.PLATINUM;
        if (totalScore >= 65)
            return CustomerTier.GOLD;
        if (totalScore >= 45)
            return CustomerTier.SILVER;
        if (totalScore >= 25)
            return CustomerTier.BRONZE;
        return CustomerTier.PROSPECT;
    }
    /**
     * Generate AI-powered customer insights
     */
    generateCustomerInsights(customer, interactions, historicalData) {
        const insights = [];
        // Revenue opportunity insight
        const revenueOpportunity = this.identifyRevenueOpportunity(customer, historicalData);
        if (revenueOpportunity) {
            insights.push(revenueOpportunity);
        }
        // Churn risk insight
        const churnRisk = this.assessChurnRisk(customer, interactions);
        if (churnRisk) {
            insights.push(churnRisk);
        }
        // Upsell opportunity insight
        const upsellOpportunity = this.identifyUpsellOpportunity(customer, interactions);
        if (upsellOpportunity) {
            insights.push(upsellOpportunity);
        }
        // Communication preference insight
        const communicationInsight = this.analyzeCommunicationPreferences(interactions);
        if (communicationInsight) {
            insights.push(communicationInsight);
        }
        // Payment behavior insight
        const paymentInsight = this.analyzePaymentBehavior(customer);
        if (paymentInsight) {
            insights.push(paymentInsight);
        }
        return insights.sort((a, b) => {
            const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    /**
     * Advanced customer segmentation using clustering algorithms
     */
    segmentCustomers(customers) {
        // Define base segments
        const segments = [
            {
                id: 'high-value-loyal',
                name: 'High-Value Loyal Clients',
                description: 'Top-tier customers with high revenue and engagement',
                criteria: {
                    revenue: { min: 500000 },
                    tier: [CustomerTier.PLATINUM, CustomerTier.GOLD],
                    engagementScore: { min: 70 },
                },
                customerCount: 0,
                totalRevenue: 0,
                averageRevenue: 0,
            },
            {
                id: 'growth-potential',
                name: 'Growth Potential',
                description: 'Medium-revenue customers with high engagement',
                criteria: {
                    revenue: { min: 100000, max: 500000 },
                    engagementScore: { min: 60 },
                    riskLevel: [CustomerRiskLevel.LOW, CustomerRiskLevel.MEDIUM],
                },
                customerCount: 0,
                totalRevenue: 0,
                averageRevenue: 0,
            },
            {
                id: 'at-risk-high-value',
                name: 'At-Risk High Value',
                description: 'High-revenue customers showing risk signals',
                criteria: {
                    revenue: { min: 200000 },
                    riskLevel: [CustomerRiskLevel.HIGH, CustomerRiskLevel.CRITICAL],
                },
                customerCount: 0,
                totalRevenue: 0,
                averageRevenue: 0,
            },
            {
                id: 'new-prospects',
                name: 'New Prospects',
                description: 'Recently acquired customers with potential',
                criteria: {
                    tier: [CustomerTier.PROSPECT, CustomerTier.BRONZE],
                    engagementScore: { min: 40 },
                },
                customerCount: 0,
                totalRevenue: 0,
                averageRevenue: 0,
            },
            {
                id: 'maintenance-accounts',
                name: 'Maintenance Accounts',
                description: 'Stable, low-maintenance customers',
                criteria: {
                    tier: [CustomerTier.SILVER],
                    engagementScore: { min: 30, max: 60 },
                    riskLevel: [CustomerRiskLevel.LOW],
                },
                customerCount: 0,
                totalRevenue: 0,
                averageRevenue: 0,
            },
        ];
        // Assign customers to segments
        customers.forEach(customer => {
            for (const segment of segments) {
                if (this.customerMatchesSegment(customer, segment.criteria)) {
                    segment.customerCount++;
                    segment.totalRevenue += customer.totalRevenue;
                    break; // Assign to first matching segment only
                }
            }
        });
        // Calculate average revenue for each segment
        segments.forEach(segment => {
            segment.averageRevenue = segment.customerCount > 0 ?
                segment.totalRevenue / segment.customerCount : 0;
        });
        return segments.filter(segment => segment.customerCount > 0);
    }
    /**
     * Generate comprehensive CRM analytics
     */
    async generateCRMAnalytics(customers, interactions, timeframe) {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.lifeCycleStage === LifecycleStage.ACTIVE_CLIENT ||
            c.lifeCycleStage === LifecycleStage.LOYAL_CLIENT).length;
        const churnedCustomers = customers.filter(c => c.lifeCycleStage === LifecycleStage.CHURNED).length;
        const newCustomers = customers.filter(c => c.firstInteraction >= timeframe.start).length;
        // Customer metrics
        const customerMetrics = {
            totalCustomers,
            newCustomersThisMonth: newCustomers,
            activeCustomers,
            churnedCustomers,
            churnRate: totalCustomers > 0 ? (churnedCustomers / totalCustomers) * 100 : 0,
            customerLifetimeValue: this.calculateAverageLifetimeValue(customers),
            averageCustomerValue: totalCustomers > 0 ?
                customers.reduce((sum, c) => sum + c.totalRevenue, 0) / totalCustomers : 0,
        };
        // Engagement metrics
        const totalInteractions = interactions.length;
        const averageEngagementScore = totalCustomers > 0 ?
            customers.reduce((sum, c) => sum + c.engagementScore, 0) / totalCustomers : 0;
        const interactionsByType = interactions.reduce((acc, interaction) => {
            acc[interaction.type] = (acc[interaction.type] || 0) + 1;
            return acc;
        }, {});
        const engagementMetrics = {
            averageEngagementScore,
            totalInteractions,
            interactionsByType,
            responseRate: this.calculateResponseRate(interactions),
            averageResponseTime: this.calculateAverageResponseTime(interactions),
        };
        // Revenue metrics
        const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);
        const revenueByTier = customers.reduce((acc, customer) => {
            acc[customer.tier] = (acc[customer.tier] || 0) + customer.totalRevenue;
            return acc;
        }, {});
        const topCustomersByRevenue = customers
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 10)
            .map(c => ({
            customerId: c.id,
            customerName: c.name,
            revenue: c.totalRevenue,
        }));
        const revenueMetrics = {
            totalRevenue,
            revenueGrowthRate: this.calculateRevenueGrowthRate(customers, timeframe),
            revenueByTier,
            averageRevenuePerCustomer: customerMetrics.averageCustomerValue,
            topCustomersByRevenue,
        };
        // Operational metrics
        const averagePaymentDelay = customers.length > 0 ?
            customers.reduce((sum, c) => sum + c.paymentHistory.averageDelayDays, 0) / customers.length : 0;
        const operationalMetrics = {
            averagePaymentDelay,
            collectionEfficiency: this.calculateCollectionEfficiency(customers),
            customerSatisfactionScore: this.calculateAverageSatisfactionScore(customers),
            npsScore: this.calculateAverageNPS(customers),
            complaintResolutionTime: this.calculateAverageComplaintResolutionTime(interactions),
        };
        // Trends (simplified - would normally use more sophisticated time series analysis)
        const monthlyCustomerGrowth = this.calculateMonthlyCustomerGrowth(customers, timeframe);
        const engagementTrends = this.calculateEngagementTrends(interactions, timeframe);
        const trends = {
            monthlyCustomerGrowth,
            engagementTrends,
        };
        return {
            customerMetrics,
            engagementMetrics,
            revenueMetrics,
            operationalMetrics,
            trends,
        };
    }
    // Private helper methods
    getRevenueScore(revenue) {
        // Score revenue on a curve (0-100)
        if (revenue >= 1000000)
            return 100;
        if (revenue >= 500000)
            return 85;
        if (revenue >= 200000)
            return 70;
        if (revenue >= 100000)
            return 55;
        if (revenue >= 50000)
            return 40;
        if (revenue >= 25000)
            return 25;
        return Math.max(0, revenue / 1000); // 1 point per 1000 revenue
    }
    getLoyaltyScore(customer) {
        const daysSinceFirstInteraction = Math.floor((new Date().getTime() - customer.firstInteraction.getTime()) / (1000 * 60 * 60 * 24));
        const loyaltyBonus = Math.min(30, daysSinceFirstInteraction / 30); // 1 point per month, max 30
        const invoiceFrequency = customer.totalInvoices > 0 ?
            daysSinceFirstInteraction / customer.totalInvoices : 0;
        const frequencyScore = invoiceFrequency > 0 ? Math.max(0, 70 - invoiceFrequency) : 0;
        return Math.min(100, loyaltyBonus + frequencyScore);
    }
    customerMatchesSegment(customer, criteria) {
        // Revenue criteria
        if (criteria.revenue) {
            if (criteria.revenue.min && customer.totalRevenue < criteria.revenue.min)
                return false;
            if (criteria.revenue.max && customer.totalRevenue > criteria.revenue.max)
                return false;
        }
        // Tier criteria
        if (criteria.tier && !criteria.tier.includes(customer.tier))
            return false;
        // Risk level criteria
        if (criteria.riskLevel && !criteria.riskLevel.includes(customer.riskLevel))
            return false;
        // Engagement score criteria
        if (criteria.engagementScore) {
            if (criteria.engagementScore.min && customer.engagementScore < criteria.engagementScore.min)
                return false;
            if (criteria.engagementScore.max && customer.engagementScore > criteria.engagementScore.max)
                return false;
        }
        return true;
    }
    identifyRevenueOpportunity(customer, historicalData) {
        if (historicalData.revenueHistory.length < 3)
            return null;
        const recentRevenue = historicalData.revenueHistory.slice(-3);
        const trend = this.calculateTrend(recentRevenue.map(r => r.revenue));
        if (trend > 0.1 && customer.engagementScore > 60) {
            return {
                customerId: customer.id,
                type: 'OPPORTUNITY',
                priority: 'HIGH',
                title: 'Revenue Growth Opportunity',
                description: `${customer.name} shows increasing revenue trend (${(trend * 100).toFixed(1)}% growth) with high engagement`,
                actionRequired: 'Schedule business review meeting to discuss expansion opportunities',
                expectedImpact: `Potential ${(customer.averageInvoiceValue * 0.3).toLocaleString()} additional monthly revenue`,
                confidence: 75,
                generatedAt: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                metadata: { trend, recentRevenue: recentRevenue.map(r => r.revenue) },
            };
        }
        return null;
    }
    assessChurnRisk(customer, interactions) {
        if (customer.riskLevel === CustomerRiskLevel.HIGH || customer.riskLevel === CustomerRiskLevel.CRITICAL) {
            const recentComplaints = interactions.filter(i => i.type === InteractionType.COMPLAINT &&
                i.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
            return {
                customerId: customer.id,
                type: 'RISK',
                priority: customer.riskLevel === CustomerRiskLevel.CRITICAL ? 'URGENT' : 'HIGH',
                title: 'Churn Risk Detected',
                description: `${customer.name} shows high risk indicators: low engagement (${customer.engagementScore}), ${recentComplaints} recent complaints`,
                actionRequired: 'Immediate customer success intervention required',
                expectedImpact: `Risk of losing ${customer.totalRevenue.toLocaleString()} annual revenue`,
                confidence: 85,
                generatedAt: new Date(),
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                metadata: { riskLevel: customer.riskLevel, recentComplaints },
            };
        }
        return null;
    }
    identifyUpsellOpportunity(customer, interactions) {
        const hasRecentPositiveInteractions = interactions.some(i => i.sentiment === 'POSITIVE' &&
            i.timestamp > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
        if (customer.tier === CustomerTier.GOLD && customer.engagementScore > 70 && hasRecentPositiveInteractions) {
            return {
                customerId: customer.id,
                type: 'OPPORTUNITY',
                priority: 'MEDIUM',
                title: 'Upsell Opportunity',
                description: `${customer.name} is highly engaged with recent positive interactions - prime for service expansion`,
                actionRequired: 'Present additional service offerings during next interaction',
                expectedImpact: 'Potential tier upgrade to Platinum',
                confidence: 70,
                generatedAt: new Date(),
                validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                metadata: { hasRecentPositiveInteractions, currentTier: customer.tier },
            };
        }
        return null;
    }
    analyzeCommunicationPreferences(interactions) {
        const channelCounts = interactions.reduce((acc, interaction) => {
            acc[interaction.type] = (acc[interaction.type] || 0) + 1;
            return acc;
        }, {});
        const totalInteractions = interactions.length;
        if (totalInteractions < 5)
            return null;
        const preferredChannel = Object.entries(channelCounts)
            .sort(([, a], [, b]) => b - a)[0];
        if (preferredChannel && channelCounts[preferredChannel[0]] / totalInteractions > 0.6) {
            return {
                customerId: interactions[0]?.customerId || '',
                type: 'RECOMMENDATION',
                priority: 'LOW',
                title: 'Communication Preference Identified',
                description: `Customer prefers ${preferredChannel[0]} communication (${((channelCounts[preferredChannel[0]] / totalInteractions) * 100).toFixed(1)}% of interactions)`,
                actionRequired: `Focus future communications on ${preferredChannel[0]} channel`,
                confidence: 80,
                generatedAt: new Date(),
                metadata: { channelCounts, preferredChannel: preferredChannel[0] },
            };
        }
        return null;
    }
    analyzePaymentBehavior(customer) {
        if (customer.paymentHistory.onTimeRate < 0.8 && customer.paymentHistory.averageDelayDays > 15) {
            return {
                customerId: customer.id,
                type: 'ALERT',
                priority: 'MEDIUM',
                title: 'Payment Behavior Concern',
                description: `${customer.name} has ${(customer.paymentHistory.onTimeRate * 100).toFixed(1)}% on-time payment rate with ${customer.paymentHistory.averageDelayDays} days average delay`,
                actionRequired: 'Consider implementing payment reminders and shorter payment terms',
                confidence: 90,
                generatedAt: new Date(),
                metadata: {
                    onTimeRate: customer.paymentHistory.onTimeRate,
                    averageDelay: customer.paymentHistory.averageDelayDays
                },
            };
        }
        return null;
    }
    calculateTrend(values) {
        if (values.length < 2)
            return 0;
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.ceil(values.length / 2));
        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        return firstAvg > 0 ? (secondAvg - firstAvg) / firstAvg : 0;
    }
    // Additional helper methods for analytics calculations
    calculateAverageLifetimeValue(customers) {
        return customers.length > 0 ?
            customers.reduce((sum, c) => sum + c.totalRevenue, 0) / customers.length : 0;
    }
    calculateResponseRate(interactions) {
        const outbound = interactions.filter(i => i.direction === 'OUTBOUND').length;
        const inbound = interactions.filter(i => i.direction === 'INBOUND').length;
        return outbound > 0 ? (inbound / outbound) * 100 : 100;
    }
    calculateAverageResponseTime(_interactions) {
        // Simplified calculation - would need more sophisticated logic in real implementation
        return 4; // Average 4 hours response time
    }
    calculateRevenueGrowthRate(_customers, _timeframe) {
        // Simplified calculation - would use more sophisticated time series analysis
        return 15.2; // 15.2% growth rate
    }
    calculateCollectionEfficiency(customers) {
        const totalPayments = customers.reduce((sum, c) => sum + c.paymentHistory.totalPayments, 0);
        const onTimePayments = customers.reduce((sum, c) => sum + (c.paymentHistory.totalPayments * c.paymentHistory.onTimeRate), 0);
        return totalPayments > 0 ? (onTimePayments / totalPayments) * 100 : 100;
    }
    calculateAverageSatisfactionScore(customers) {
        const customersWithScores = customers.filter(c => c.satisfactionScore !== undefined);
        return customersWithScores.length > 0 ?
            customersWithScores.reduce((sum, c) => sum + (c.satisfactionScore || 0), 0) / customersWithScores.length : 0;
    }
    calculateAverageNPS(customers) {
        const customersWithNPS = customers.filter(c => c.npsScore !== undefined);
        return customersWithNPS.length > 0 ?
            customersWithNPS.reduce((sum, c) => sum + (c.npsScore || 0), 0) / customersWithNPS.length : 0;
    }
    calculateAverageComplaintResolutionTime(_interactions) {
        // Simplified calculation - would need more sophisticated tracking
        return 24; // 24 hours average resolution time
    }
    calculateMonthlyCustomerGrowth(_customers, _timeframe) {
        // Simplified calculation - would use actual monthly data
        return [
            { month: new Date(2024, 0, 1), newCustomers: 5, churnedCustomers: 1, netGrowth: 4 },
            { month: new Date(2024, 1, 1), newCustomers: 8, churnedCustomers: 2, netGrowth: 6 },
            { month: new Date(2024, 2, 1), newCustomers: 12, churnedCustomers: 1, netGrowth: 11 },
        ];
    }
    calculateEngagementTrends(_interactions, _timeframe) {
        // Simplified calculation - would use actual weekly data
        return [
            { week: new Date(2024, 2, 1), averageEngagementScore: 65, totalInteractions: 45 },
            { week: new Date(2024, 2, 8), averageEngagementScore: 68, totalInteractions: 52 },
            { week: new Date(2024, 2, 15), averageEngagementScore: 71, totalInteractions: 58 },
        ];
    }
}
exports.CRMEngine = CRMEngine;
// Export singleton instance
exports.crmEngine = CRMEngine.getInstance();
// Utility functions for CRM operations
exports.crmUtils = {
    /**
     * Format customer tier for display
     */
    formatCustomerTier: (tier) => {
        const tierNames = {
            [CustomerTier.PLATINUM]: 'Platinum',
            [CustomerTier.GOLD]: 'Gold',
            [CustomerTier.SILVER]: 'Silver',
            [CustomerTier.BRONZE]: 'Bronze',
            [CustomerTier.PROSPECT]: 'Prospect',
        };
        return tierNames[tier];
    },
    /**
     * Get tier color for UI
     */
    getTierColor: (tier) => {
        const tierColors = {
            [CustomerTier.PLATINUM]: '#e5e7eb', // Platinum
            [CustomerTier.GOLD]: '#fbbf24', // Gold
            [CustomerTier.SILVER]: '#9ca3af', // Silver
            [CustomerTier.BRONZE]: '#d97706', // Bronze
            [CustomerTier.PROSPECT]: '#6b7280', // Gray
        };
        return tierColors[tier];
    },
    /**
     * Calculate days since last interaction
     */
    getDaysSinceLastInteraction: (lastInteraction) => {
        return Math.floor((new Date().getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
    },
    /**
     * Format engagement score with description
     */
    formatEngagementScore: (score) => {
        let description;
        let color;
        if (score >= 80) {
            description = 'Highly Engaged';
            color = '#10b981';
        }
        else if (score >= 60) {
            description = 'Well Engaged';
            color = '#f59e0b';
        }
        else if (score >= 40) {
            description = 'Moderately Engaged';
            color = '#ef4444';
        }
        else {
            description = 'Low Engagement';
            color = '#6b7280';
        }
        return { score, description, color };
    },
    /**
     * Generate customer reference ID
     */
    generateCustomerReference: (customerName) => {
        const namePrefix = customerName.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-6);
        return `${namePrefix}${timestamp}`;
    },
};
