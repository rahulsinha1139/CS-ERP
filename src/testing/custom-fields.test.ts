/**
 * CUSTOM FIELDS WORKFLOW TESTS (Phase 3B)
 * Tests service templates with custom fields and invoice line custom data
 * Run with: npx vitest run src/testing/custom-fields.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { idGenerator } from '@/lib/id-generator';
import { CS_SERVICE_TEMPLATES } from '@/lib/service-template-definitions';

const prisma = new PrismaClient();

const companyId = 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b';
let testTemplateId: string;
let testInvoiceId: string;
let testCustomerId: string;

describe('Custom Fields Workflow Tests', () => {
  beforeAll(async () => {
    // Create test customer
    const customer = await prisma.customer.create({
      data: {
        id: idGenerator.customer(),
        name: 'TEST_CUSTOMFIELDS Customer Ltd',
        email: 'customfields-test@example.com',
        phone: '+91-9876543210',
        gstin: '29ABCDE1234F1Z5',
        stateCode: '29',
        companyId,
      }
    });
    testCustomerId = customer.id;
  });

  afterAll(async () => {
    // Clean up
    if (testInvoiceId) await prisma.invoice.delete({ where: { id: testInvoiceId } }).catch(() => {});
    if (testCustomerId) await prisma.customer.delete({ where: { id: testCustomerId } }).catch(() => {});
    if (testTemplateId) await prisma.serviceTemplate.delete({ where: { id: testTemplateId } }).catch(() => {});
    await prisma.$disconnect();
  });

  describe('Service Template Custom Fields', () => {
    it('CREATE - Should create service template with custom fields', async () => {
      const template = await prisma.serviceTemplate.create({
        data: {
          id: idGenerator.generate(),
          name: 'Company Incorporation with Custom Fields',
          description: 'Full company incorporation service',
          defaultRate: 25000,
          gstRate: 18,
          hsnSac: '998399',
          category: 'INCORPORATION',
          companyId,
          customFields: [
            {
              name: 'companyName',
              label: 'Company Name',
              type: 'text',
              required: true,
              placeholder: 'Enter proposed company name'
            },
            {
              name: 'cin',
              label: 'CIN',
              type: 'text',
              required: true,
              placeholder: 'U12345KA2020PTC123456',
              helpText: 'Corporate Identification Number'
            },
            {
              name: 'incorporationDate',
              label: 'Date of Incorporation',
              type: 'date',
              required: true
            },
            {
              name: 'authorizedCapital',
              label: 'Authorized Capital',
              type: 'currency',
              required: true
            }
          ]
        }
      });

      testTemplateId = template.id;

      expect(template).toBeDefined();
      expect(template.customFields).toBeDefined();
      expect(Array.isArray(template.customFields)).toBe(true);
      expect((template.customFields as any[]).length).toBe(4);
      console.log('✓ Service template with custom fields created');
    });

    it('READ - Should retrieve template with custom fields', async () => {
      const template = await prisma.serviceTemplate.findUnique({
        where: { id: testTemplateId }
      });

      expect(template).toBeDefined();
      expect(template?.customFields).toBeDefined();

      const fields = template?.customFields as any[];
      expect(fields.length).toBe(4);
      expect(fields[0].name).toBe('companyName');
      expect(fields[1].name).toBe('cin');
      expect(fields[2].name).toBe('incorporationDate');
      expect(fields[3].name).toBe('authorizedCapital');

      console.log('✓ Template custom fields retrieved successfully');
    });

    it('UPDATE - Should add more custom fields to existing template', async () => {
      const currentFields = (await prisma.serviceTemplate.findUnique({
        where: { id: testTemplateId },
        select: { customFields: true }
      }))?.customFields as any[];

      const updated = await prisma.serviceTemplate.update({
        where: { id: testTemplateId },
        data: {
          customFields: [
            ...currentFields,
            {
              name: 'paidUpCapital',
              label: 'Paid-Up Capital',
              type: 'currency',
              required: false
            }
          ]
        }
      });

      expect((updated.customFields as any[]).length).toBe(5);
      console.log('✓ Custom field added to template');
    });
  });

  describe('Invoice with Custom Field Data', () => {
    it('CREATE - Should create invoice with custom field data', async () => {
      const invoice = await prisma.invoice.create({
        data: {
          id: idGenerator.invoice(),
          number: 'INV-CUSTOMFIELDS-001',
          customerId: testCustomerId,
          companyId,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'DRAFT',
          subtotal: 25000,
          cgstAmount: 2250,
          sgstAmount: 2250,
          igstAmount: 0,
          totalTax: 4500,
          grandTotal: 29500,
          paidAmount: 0,
          lines: {
            create: [{
              id: idGenerator.generate(),
              description: 'Company Incorporation Services',
              quantity: 1,
              rate: 25000,
              amount: 25000,
              hsnSac: '998399',
              gstRate: 18,
              isReimbursement: false,
              customFieldData: {
                companyName: 'TechStartup Private Limited',
                cin: 'U12345KA2025PTC987654',
                incorporationDate: '2025-01-15',
                authorizedCapital: 1000000,
                paidUpCapital: 100000
              }
            }]
          }
        },
        include: {
          lines: true
        }
      });

      testInvoiceId = invoice.id;

      expect(invoice).toBeDefined();
      expect(invoice.lines.length).toBe(1);
      expect(invoice.lines[0]?.customFieldData).toBeDefined();

      const customData = invoice.lines[0]?.customFieldData as any;
      expect(customData.companyName).toBe('TechStartup Private Limited');
      expect(customData.cin).toBe('U12345KA2025PTC987654');
      expect(customData.incorporationDate).toBe('2025-01-15');
      expect(customData.authorizedCapital).toBe(1000000);

      console.log('✓ Invoice with custom field data created');
    });

    it('READ - Should retrieve invoice line custom data', async () => {
      const invoice = await prisma.invoice.findUnique({
        where: { id: testInvoiceId },
        include: { lines: true }
      });

      expect(invoice).toBeDefined();
      expect(invoice?.lines.length).toBe(1);

      const customData = invoice?.lines[0]?.customFieldData as any;
      expect(customData).toBeDefined();
      expect(customData.companyName).toBe('TechStartup Private Limited');
      expect(customData.cin).toBe('U12345KA2025PTC987654');

      console.log('✓ Custom field data retrieved from invoice line');
    });

    it('UPDATE - Should modify custom field data', async () => {
      const invoice = await prisma.invoice.findUnique({
        where: { id: testInvoiceId },
        include: { lines: true }
      });

      const lineId = invoice?.lines[0]?.id;
      expect(lineId).toBeDefined();

      await prisma.invoiceLine.update({
        where: { id: lineId },
        data: {
          customFieldData: {
            companyName: 'TechStartup Private Limited',
            cin: 'U12345KA2025PTC987654',
            incorporationDate: '2025-01-15',
            authorizedCapital: 1000000,
            paidUpCapital: 500000  // Updated from 100000 to 500000
          }
        }
      });

      const updated = await prisma.invoiceLine.findUnique({
        where: { id: lineId }
      });

      const customData = updated?.customFieldData as any;
      expect(customData.paidUpCapital).toBe(500000);

      console.log('✓ Custom field data updated successfully');
    });
  });

  describe('Pre-defined CS Service Templates', () => {
    it('Should have Company Incorporation template', () => {
      const template = CS_SERVICE_TEMPLATES.find(t => t.name.includes('Company Incorporation'));

      expect(template).toBeDefined();
      expect(template?.customFields).toBeDefined();
      expect(template?.customFields!.length).toBeGreaterThan(0);

      const cinField = template?.customFields?.find(f => f.name === 'cin');
      expect(cinField).toBeDefined();
      expect(cinField?.required).toBe(true);

      console.log('✓ Company Incorporation template validated');
    });

    it('Should have Director Appointment template', () => {
      const template = CS_SERVICE_TEMPLATES.find(t => t.name.includes('Director Appointment'));

      expect(template).toBeDefined();
      expect(template?.customFields).toBeDefined();

      const dinField = template?.customFields?.find(f => f.name === 'din');
      expect(dinField).toBeDefined();
      expect(dinField?.validation?.pattern).toBeDefined();

      console.log('✓ Director Appointment template validated');
    });

    it('Should have ROC Annual Filing template', () => {
      const template = CS_SERVICE_TEMPLATES.find(t => t.name.includes('ROC Annual Filing'));

      expect(template).toBeDefined();
      expect(template?.customFields).toBeDefined();

      const formNumberField = template?.customFields?.find(f => f.name === 'formNumber');
      expect(formNumberField).toBeDefined();
      expect(formNumberField?.type).toBe('select');

      console.log('✓ ROC Annual Filing template validated');
    });

    it('Should validate all 10 CS service templates', () => {
      expect(CS_SERVICE_TEMPLATES.length).toBe(10);

      const templateNames = CS_SERVICE_TEMPLATES.map(t => t.name);
      console.log('✓ All 10 CS service templates present:', templateNames);
    });

    it('Should have proper field validation patterns', () => {
      const incorporationTemplate = CS_SERVICE_TEMPLATES.find(t =>
        t.name.includes('Company Incorporation')
      );

      const cinField = incorporationTemplate?.customFields?.find(f => f.name === 'cin');
      expect(cinField?.validation?.pattern).toBeDefined();

      const directorTemplate = CS_SERVICE_TEMPLATES.find(t =>
        t.name.includes('Director Appointment')
      );

      const dinField = directorTemplate?.customFields?.find(f => f.name === 'din');
      const panField = directorTemplate?.customFields?.find(f => f.name === 'pan');

      expect(dinField?.validation?.pattern).toBeDefined();
      expect(panField?.validation?.pattern).toBeDefined();

      console.log('✓ Validation patterns present for CIN, DIN, PAN');
    });
  });

  describe('Custom Fields Edge Cases', () => {
    it('Should handle null customFieldData gracefully', async () => {
      const invoice = await prisma.invoice.create({
        data: {
          id: idGenerator.invoice(),
          number: 'INV-NOCUSTOMFIELDS-001',
          customerId: testCustomerId,
          companyId,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'DRAFT',
          subtotal: 10000,
          cgstAmount: 900,
          sgstAmount: 900,
          igstAmount: 0,
          totalTax: 1800,
          grandTotal: 11800,
          paidAmount: 0,
          lines: {
            create: [{
              id: idGenerator.generate(),
              description: 'Basic Compliance Service',
              quantity: 1,
              rate: 10000,
              amount: 10000,
              hsnSac: '998399',
              gstRate: 18,
              isReimbursement: false,
              // No customFieldData provided
            }]
          }
        },
        include: { lines: true }
      });

      expect(invoice.lines[0]?.customFieldData).toBeNull();

      // Clean up
      await prisma.invoice.delete({ where: { id: invoice.id } });

      console.log('✓ Null custom field data handled gracefully');
    });

    it('Should handle empty customFieldData object', async () => {
      const invoice = await prisma.invoice.create({
        data: {
          id: idGenerator.invoice(),
          number: 'INV-EMPTYCUSTOMFIELDS-001',
          customerId: testCustomerId,
          companyId,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'DRAFT',
          subtotal: 10000,
          cgstAmount: 900,
          sgstAmount: 900,
          igstAmount: 0,
          totalTax: 1800,
          grandTotal: 11800,
          paidAmount: 0,
          lines: {
            create: [{
              id: idGenerator.generate(),
              description: 'Basic Compliance Service',
              quantity: 1,
              rate: 10000,
              amount: 10000,
              hsnSac: '998399',
              gstRate: 18,
              isReimbursement: false,
              customFieldData: {}
            }]
          }
        },
        include: { lines: true }
      });

      const customData = invoice.lines[0]?.customFieldData as any;
      expect(customData).toBeDefined();
      expect(Object.keys(customData).length).toBe(0);

      // Clean up
      await prisma.invoice.delete({ where: { id: invoice.id } });

      console.log('✓ Empty custom field data handled gracefully');
    });
  });
});
