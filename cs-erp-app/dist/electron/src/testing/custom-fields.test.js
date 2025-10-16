"use strict";
/**
 * CUSTOM FIELDS WORKFLOW TESTS (Phase 3B)
 * Tests service templates with custom fields and invoice line custom data
 * Run with: npx vitest run src/testing/custom-fields.test.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_1 = require("@prisma/client");
const id_generator_1 = require("@/lib/id-generator");
const service_template_definitions_1 = require("@/lib/service-template-definitions");
const prisma = new client_1.PrismaClient();
const companyId = 'c1ad463d-13a4-4b11-9a4f-a8ab5d3c979b';
let testTemplateId;
let testInvoiceId;
let testCustomerId;
(0, vitest_1.describe)('Custom Fields Workflow Tests', () => {
    (0, vitest_1.beforeAll)(async () => {
        // Create test customer
        const customer = await prisma.customer.create({
            data: {
                id: id_generator_1.idGenerator.customer(),
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
    (0, vitest_1.afterAll)(async () => {
        // Clean up
        if (testInvoiceId)
            await prisma.invoice.delete({ where: { id: testInvoiceId } }).catch(() => { });
        if (testCustomerId)
            await prisma.customer.delete({ where: { id: testCustomerId } }).catch(() => { });
        if (testTemplateId)
            await prisma.serviceTemplate.delete({ where: { id: testTemplateId } }).catch(() => { });
        await prisma.$disconnect();
    });
    (0, vitest_1.describe)('Service Template Custom Fields', () => {
        (0, vitest_1.it)('CREATE - Should create service template with custom fields', async () => {
            const template = await prisma.serviceTemplate.create({
                data: {
                    id: id_generator_1.idGenerator.generate(),
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
            (0, vitest_1.expect)(template).toBeDefined();
            (0, vitest_1.expect)(template.customFields).toBeDefined();
            (0, vitest_1.expect)(Array.isArray(template.customFields)).toBe(true);
            (0, vitest_1.expect)(template.customFields.length).toBe(4);
            console.log('✓ Service template with custom fields created');
        });
        (0, vitest_1.it)('READ - Should retrieve template with custom fields', async () => {
            const template = await prisma.serviceTemplate.findUnique({
                where: { id: testTemplateId }
            });
            (0, vitest_1.expect)(template).toBeDefined();
            (0, vitest_1.expect)(template?.customFields).toBeDefined();
            const fields = template?.customFields;
            (0, vitest_1.expect)(fields.length).toBe(4);
            (0, vitest_1.expect)(fields[0].name).toBe('companyName');
            (0, vitest_1.expect)(fields[1].name).toBe('cin');
            (0, vitest_1.expect)(fields[2].name).toBe('incorporationDate');
            (0, vitest_1.expect)(fields[3].name).toBe('authorizedCapital');
            console.log('✓ Template custom fields retrieved successfully');
        });
        (0, vitest_1.it)('UPDATE - Should add more custom fields to existing template', async () => {
            const currentFields = (await prisma.serviceTemplate.findUnique({
                where: { id: testTemplateId },
                select: { customFields: true }
            }))?.customFields;
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
            (0, vitest_1.expect)(updated.customFields.length).toBe(5);
            console.log('✓ Custom field added to template');
        });
    });
    (0, vitest_1.describe)('Invoice with Custom Field Data', () => {
        (0, vitest_1.it)('CREATE - Should create invoice with custom field data', async () => {
            const invoice = await prisma.invoice.create({
                data: {
                    id: id_generator_1.idGenerator.invoice(),
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
                                id: id_generator_1.idGenerator.generate(),
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
            (0, vitest_1.expect)(invoice).toBeDefined();
            (0, vitest_1.expect)(invoice.lines.length).toBe(1);
            (0, vitest_1.expect)(invoice.lines[0]?.customFieldData).toBeDefined();
            const customData = invoice.lines[0]?.customFieldData;
            (0, vitest_1.expect)(customData.companyName).toBe('TechStartup Private Limited');
            (0, vitest_1.expect)(customData.cin).toBe('U12345KA2025PTC987654');
            (0, vitest_1.expect)(customData.incorporationDate).toBe('2025-01-15');
            (0, vitest_1.expect)(customData.authorizedCapital).toBe(1000000);
            console.log('✓ Invoice with custom field data created');
        });
        (0, vitest_1.it)('READ - Should retrieve invoice line custom data', async () => {
            const invoice = await prisma.invoice.findUnique({
                where: { id: testInvoiceId },
                include: { lines: true }
            });
            (0, vitest_1.expect)(invoice).toBeDefined();
            (0, vitest_1.expect)(invoice?.lines.length).toBe(1);
            const customData = invoice?.lines[0]?.customFieldData;
            (0, vitest_1.expect)(customData).toBeDefined();
            (0, vitest_1.expect)(customData.companyName).toBe('TechStartup Private Limited');
            (0, vitest_1.expect)(customData.cin).toBe('U12345KA2025PTC987654');
            console.log('✓ Custom field data retrieved from invoice line');
        });
        (0, vitest_1.it)('UPDATE - Should modify custom field data', async () => {
            const invoice = await prisma.invoice.findUnique({
                where: { id: testInvoiceId },
                include: { lines: true }
            });
            const lineId = invoice?.lines[0]?.id;
            (0, vitest_1.expect)(lineId).toBeDefined();
            await prisma.invoiceLine.update({
                where: { id: lineId },
                data: {
                    customFieldData: {
                        companyName: 'TechStartup Private Limited',
                        cin: 'U12345KA2025PTC987654',
                        incorporationDate: '2025-01-15',
                        authorizedCapital: 1000000,
                        paidUpCapital: 500000 // Updated from 100000 to 500000
                    }
                }
            });
            const updated = await prisma.invoiceLine.findUnique({
                where: { id: lineId }
            });
            const customData = updated?.customFieldData;
            (0, vitest_1.expect)(customData.paidUpCapital).toBe(500000);
            console.log('✓ Custom field data updated successfully');
        });
    });
    (0, vitest_1.describe)('Pre-defined CS Service Templates', () => {
        (0, vitest_1.it)('Should have Company Incorporation template', () => {
            const template = service_template_definitions_1.CS_SERVICE_TEMPLATES.find(t => t.name.includes('Company Incorporation'));
            (0, vitest_1.expect)(template).toBeDefined();
            (0, vitest_1.expect)(template?.customFields).toBeDefined();
            (0, vitest_1.expect)(template?.customFields.length).toBeGreaterThan(0);
            const cinField = template?.customFields?.find(f => f.name === 'cin');
            (0, vitest_1.expect)(cinField).toBeDefined();
            (0, vitest_1.expect)(cinField?.required).toBe(true);
            console.log('✓ Company Incorporation template validated');
        });
        (0, vitest_1.it)('Should have Director Appointment template', () => {
            const template = service_template_definitions_1.CS_SERVICE_TEMPLATES.find(t => t.name.includes('Director Appointment'));
            (0, vitest_1.expect)(template).toBeDefined();
            (0, vitest_1.expect)(template?.customFields).toBeDefined();
            const dinField = template?.customFields?.find(f => f.name === 'din');
            (0, vitest_1.expect)(dinField).toBeDefined();
            (0, vitest_1.expect)(dinField?.validation?.pattern).toBeDefined();
            console.log('✓ Director Appointment template validated');
        });
        (0, vitest_1.it)('Should have ROC Annual Filing template', () => {
            const template = service_template_definitions_1.CS_SERVICE_TEMPLATES.find(t => t.name.includes('ROC Annual Filing'));
            (0, vitest_1.expect)(template).toBeDefined();
            (0, vitest_1.expect)(template?.customFields).toBeDefined();
            const formNumberField = template?.customFields?.find(f => f.name === 'formNumber');
            (0, vitest_1.expect)(formNumberField).toBeDefined();
            (0, vitest_1.expect)(formNumberField?.type).toBe('select');
            console.log('✓ ROC Annual Filing template validated');
        });
        (0, vitest_1.it)('Should validate all 10 CS service templates', () => {
            (0, vitest_1.expect)(service_template_definitions_1.CS_SERVICE_TEMPLATES.length).toBe(10);
            const templateNames = service_template_definitions_1.CS_SERVICE_TEMPLATES.map(t => t.name);
            console.log('✓ All 10 CS service templates present:', templateNames);
        });
        (0, vitest_1.it)('Should have proper field validation patterns', () => {
            const incorporationTemplate = service_template_definitions_1.CS_SERVICE_TEMPLATES.find(t => t.name.includes('Company Incorporation'));
            const cinField = incorporationTemplate?.customFields?.find(f => f.name === 'cin');
            (0, vitest_1.expect)(cinField?.validation?.pattern).toBeDefined();
            const directorTemplate = service_template_definitions_1.CS_SERVICE_TEMPLATES.find(t => t.name.includes('Director Appointment'));
            const dinField = directorTemplate?.customFields?.find(f => f.name === 'din');
            const panField = directorTemplate?.customFields?.find(f => f.name === 'pan');
            (0, vitest_1.expect)(dinField?.validation?.pattern).toBeDefined();
            (0, vitest_1.expect)(panField?.validation?.pattern).toBeDefined();
            console.log('✓ Validation patterns present for CIN, DIN, PAN');
        });
    });
    (0, vitest_1.describe)('Custom Fields Edge Cases', () => {
        (0, vitest_1.it)('Should handle null customFieldData gracefully', async () => {
            const invoice = await prisma.invoice.create({
                data: {
                    id: id_generator_1.idGenerator.invoice(),
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
                                id: id_generator_1.idGenerator.generate(),
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
            (0, vitest_1.expect)(invoice.lines[0]?.customFieldData).toBeNull();
            // Clean up
            await prisma.invoice.delete({ where: { id: invoice.id } });
            console.log('✓ Null custom field data handled gracefully');
        });
        (0, vitest_1.it)('Should handle empty customFieldData object', async () => {
            const invoice = await prisma.invoice.create({
                data: {
                    id: id_generator_1.idGenerator.invoice(),
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
                                id: id_generator_1.idGenerator.generate(),
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
            const customData = invoice.lines[0]?.customFieldData;
            (0, vitest_1.expect)(customData).toBeDefined();
            (0, vitest_1.expect)(Object.keys(customData).length).toBe(0);
            // Clean up
            await prisma.invoice.delete({ where: { id: invoice.id } });
            console.log('✓ Empty custom field data handled gracefully');
        });
    });
});
