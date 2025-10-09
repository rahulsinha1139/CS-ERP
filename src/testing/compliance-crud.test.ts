/**
 * COMPLIANCE CRUD INTEGRATION TESTS
 * Tests all compliance management operations (Phase 3A)
 * Run with: npx vitest run src/testing/compliance-crud.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { idGenerator } from '@/lib/id-generator';

const prisma = new PrismaClient();

const companyId = 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b';
let testComplianceId: string;
let testTemplateId: string;
let testActivityId: string;
let testAlertId: string;

describe('Compliance Management CRUD Tests', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    // First find test compliance items
    const testItems = await prisma.complianceItem.findMany({
      where: { title: { contains: 'TEST_COMPLIANCE' } },
      select: { id: true }
    });
    const testItemIds = testItems.map(item => item.id);

    // Delete related records first
    if (testItemIds.length > 0) {
      await prisma.complianceAlert.deleteMany({ where: { itemId: { in: testItemIds } } });
      await prisma.complianceActivity.deleteMany({ where: { itemId: { in: testItemIds } } });
    }

    // Then delete items and templates
    await prisma.complianceItem.deleteMany({ where: { title: { contains: 'TEST_COMPLIANCE' } } });
    await prisma.complianceTemplate.deleteMany({ where: { title: { contains: 'TEST_COMPLIANCE' } } });
  });

  afterAll(async () => {
    // Clean up test data
    if (testAlertId) await prisma.complianceAlert.delete({ where: { id: testAlertId } }).catch(() => {});
    if (testActivityId) await prisma.complianceActivity.delete({ where: { id: testActivityId } }).catch(() => {});
    if (testComplianceId) await prisma.complianceItem.delete({ where: { id: testComplianceId } }).catch(() => {});
    if (testTemplateId) await prisma.complianceTemplate.delete({ where: { id: testTemplateId } }).catch(() => {});
    await prisma.$disconnect();
  });

  describe('Compliance Template Module', () => {
    it('CREATE - Should create a compliance template', async () => {
      const template = await prisma.complianceTemplate.create({
        data: {
          id: idGenerator.generate(),
          title: 'TEST_COMPLIANCE Annual Filing Template',
          description: 'Template for ROC annual filings',
          category: 'ANNUAL_COMPLIANCE',
          frequency: 'ANNUAL',
          complianceType: 'MANDATORY', defaultDays: 30,
          companyId,
        }
      });

      testTemplateId = template.id;

      expect(template).toBeDefined();
      expect(template.title).toBe('TEST_COMPLIANCE Annual Filing Template');
      expect(template.frequency).toBe('ANNUAL');
      expect(template.defaultDays).toBe(30);
      console.log('✓ Compliance template created:', template.id);
    });

    it('READ - Should retrieve template by ID', async () => {
      const template = await prisma.complianceTemplate.findUnique({
        where: { id: testTemplateId },
        include: {
          items: true
        }
      });

      expect(template).toBeDefined();
      expect(template?.title).toBe('TEST_COMPLIANCE Annual Filing Template');
      console.log('✓ Compliance template retrieved:', template?.id);
    });

    it('UPDATE - Should update template details', async () => {
      const updated = await prisma.complianceTemplate.update({
        where: { id: testTemplateId },
        data: {
          defaultDays: 45,
          description: 'Updated template description'
        }
      });

      expect(updated.defaultDays).toBe(45);
      expect(updated.description).toBe('Updated template description');
      console.log('✓ Compliance template updated');
    });
  });

  describe('Compliance Item Module', () => {
    it('CREATE - Should create a compliance item', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 60); // 60 days from now

      const item = await prisma.complianceItem.create({
        data: {
          id: idGenerator.compliance(),
          title: 'TEST_COMPLIANCE - Annual Return Filing (Form MGT-7)',
          description: 'Annual return to be filed with ROC',
          category: 'ANNUAL_COMPLIANCE',
          priority: 'HIGH',
          status: 'PENDING',
          dueDate: dueDate,
          companyId,
        }
      });

      testComplianceId = item.id;

      expect(item).toBeDefined();
      expect(item.title).toContain('TEST_COMPLIANCE');
      expect(item.status).toBe('PENDING');
      expect(item.priority).toBe('HIGH');
      console.log('✓ Compliance item created:', item.id);
    });

    it('READ - Should retrieve compliance item by ID', async () => {
      const item = await prisma.complianceItem.findUnique({
        where: { id: testComplianceId },
        include: {
          activities: true,
          alerts: true
        }
      });

      expect(item).toBeDefined();
      expect(item?.title).toContain('TEST_COMPLIANCE');
      console.log('✓ Compliance item retrieved:', item?.id);
    });

    it('READ - Should list compliance items by status', async () => {
      const items = await prisma.complianceItem.findMany({
        where: {
          companyId,
          status: 'PENDING'
        },
        orderBy: { dueDate: 'asc' }
      });

      expect(items.length).toBeGreaterThan(0);
      console.log('✓ Pending compliance items found:', items.length);
    });

    it('READ - Should filter compliance items by category', async () => {
      const items = await prisma.complianceItem.findMany({
        where: {
          companyId,
          category: 'ANNUAL_COMPLIANCE'
        }
      });

      expect(items.length).toBeGreaterThan(0);
      console.log('✓ ROC Filing items found:', items.length);
    });

    it('UPDATE - Should update compliance item status', async () => {
      const updated = await prisma.complianceItem.update({
        where: { id: testComplianceId },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });

      expect(updated.status).toBe('IN_PROGRESS');
      expect(updated.startedAt).toBeDefined();
      console.log('✓ Compliance status updated to IN_PROGRESS');
    });

    it('UPDATE - Should mark compliance as completed', async () => {
      const updated = await prisma.complianceItem.update({
        where: { id: testComplianceId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          completionNotes: 'Filed successfully with SRN: TEST123456'
        }
      });

      expect(updated.status).toBe('COMPLETED');
      expect(updated.completedAt).toBeDefined();
      expect(updated.completionNotes).toContain('TEST123456');
      console.log('✓ Compliance marked as completed');
    });
  });

  describe('Compliance Activity Module', () => {
    it('CREATE - Should log compliance activity', async () => {
      const activity = await prisma.complianceActivity.create({
        data: {
          id: idGenerator.generate(),
          itemId: testComplianceId,
          type: 'STATUS_CHANGE',
          description: 'Status changed from PENDING to COMPLETED',
          metadata: {
            previousStatus: 'PENDING',
            newStatus: 'COMPLETED',
            changedBy: 'admin'
          },
        }
      });

      testActivityId = activity.id;

      expect(activity).toBeDefined();
      expect(activity.type).toBe('STATUS_CHANGE');
      console.log('✓ Compliance activity logged:', activity.id);
    });

    it('READ - Should retrieve activities for compliance item', async () => {
      const activities = await prisma.complianceActivity.findMany({
        where: { itemId: testComplianceId },
        orderBy: { createdAt: 'desc' }
      });

      expect(activities.length).toBeGreaterThan(0);
      console.log('✓ Activities retrieved for compliance:', activities.length);
    });
  });

  describe('Compliance Alert Module', () => {
    it('CREATE - Should create compliance alert', async () => {
      // First set item back to pending with upcoming due date
      await prisma.complianceItem.update({
        where: { id: testComplianceId },
        data: {
          status: 'PENDING',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      });

      const alert = await prisma.complianceAlert.create({
        data: {
          id: idGenerator.generate(),
          itemId: testComplianceId,
          type: 'UPCOMING_DEADLINE',
          message: 'Annual return filing due in 7 days',
          severity: 'WARNING',
          isRead: false,
          companyId,
        }
      });

      testAlertId = alert.id;

      expect(alert).toBeDefined();
      expect(alert.type).toBe('UPCOMING_DEADLINE');
      expect(alert.severity).toBe('WARNING');
      console.log('✓ Compliance alert created:', alert.id);
    });

    it('READ - Should retrieve unread alerts', async () => {
      const alerts = await prisma.complianceAlert.findMany({
        where: {
          companyId,
          isRead: false
        },
        include: {
          item: true
        }
      });

      expect(alerts.length).toBeGreaterThan(0);
      console.log('✓ Unread alerts found:', alerts.length);
    });

    it('UPDATE - Should mark alert as read', async () => {
      const updated = await prisma.complianceAlert.update({
        where: { id: testAlertId },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });

      expect(updated.isRead).toBe(true);
      expect(updated.readAt).toBeDefined();
      console.log('✓ Alert marked as read');
    });
  });

  describe('Advanced Compliance Queries', () => {
    it('Should get overdue compliance items', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const overdueItems = await prisma.complianceItem.findMany({
        where: {
          companyId,
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          dueDate: { lt: new Date() }
        }
      });

      expect(overdueItems).toBeDefined();
      console.log('✓ Overdue items found:', overdueItems.length);
    });

    it('Should get upcoming deadlines (next 30 days)', async () => {
      const now = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

      const upcomingItems = await prisma.complianceItem.findMany({
        where: {
          companyId,
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          dueDate: {
            gte: now,
            lte: thirtyDaysLater
          }
        },
        orderBy: { dueDate: 'asc' }
      });

      expect(upcomingItems).toBeDefined();
      console.log('✓ Upcoming deadlines (30 days):', upcomingItems.length);
    });

    it('Should calculate compliance completion rate', async () => {
      const result = await prisma.complianceItem.groupBy({
        by: ['status'],
        where: { companyId },
        _count: true
      });

      const totalItems = result.reduce((sum, group) => sum + group._count, 0);
      const completedItems = result.find(g => g.status === 'COMPLETED')?._count || 0;
      const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

      expect(result).toBeDefined();
      console.log('✓ Compliance completion rate:', `${completionRate.toFixed(1)}%`);
    });

    it('Should get compliance summary by category', async () => {
      const summary = await prisma.complianceItem.groupBy({
        by: ['category', 'status'],
        where: { companyId },
        _count: true
      });

      expect(summary).toBeDefined();
      console.log('✓ Compliance summary by category:', summary.length, 'groups');
    });
  });

  describe('DELETE Operations', () => {
    it('DELETE - Should delete compliance alert', async () => {
      await prisma.complianceAlert.delete({
        where: { id: testAlertId }
      });

      const alert = await prisma.complianceAlert.findUnique({
        where: { id: testAlertId }
      });

      expect(alert).toBeNull();
      console.log('✓ Compliance alert deleted');
    });

    it('DELETE - Should delete compliance activity', async () => {
      await prisma.complianceActivity.delete({
        where: { id: testActivityId }
      });

      const activity = await prisma.complianceActivity.findUnique({
        where: { id: testActivityId }
      });

      expect(activity).toBeNull();
      console.log('✓ Compliance activity deleted');
    });

    it('DELETE - Should delete compliance item', async () => {
      await prisma.complianceItem.delete({
        where: { id: testComplianceId }
      });

      const item = await prisma.complianceItem.findUnique({
        where: { id: testComplianceId }
      });

      expect(item).toBeNull();
      console.log('✓ Compliance item deleted');
    });

    it('DELETE - Should delete compliance template', async () => {
      await prisma.complianceTemplate.delete({
        where: { id: testTemplateId }
      });

      const template = await prisma.complianceTemplate.findUnique({
        where: { id: testTemplateId }
      });

      expect(template).toBeNull();
      console.log('✓ Compliance template deleted');
    });
  });
});
