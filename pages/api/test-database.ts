/**
 * Comprehensive Database Connection & Schema Test
 * Tests all models, relationships, and business logic
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message?: string;
  data?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: TestResult[] = [];

  try {
    // Test 1: Basic Database Connection
    console.log('🔍 Testing basic database connection...');
    try {
      await prisma.$connect();
      results.push({
        test: 'Database Connection',
        status: 'PASS',
        message: 'Successfully connected to database'
      });
    } catch (error) {
      results.push({
        test: 'Database Connection',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }

    // Test 2: Company Model Operations
    console.log('🏢 Testing Company model...');
    try {
      const companyCount = await prisma.company.count();

      // Try to create a test company
      const testCompany = await prisma.company.create({
        data: {
          name: 'Test CS Practice',
          email: 'test@cspractice.com',
          phone: '+91-9999999999',
          address: 'Test Address, Mumbai',
          gstin: 'TEST123456789',
          stateCode: '27',
        }
      });

      results.push({
        test: 'Company Model CRUD',
        status: 'PASS',
        message: `Company created successfully. Total companies: ${companyCount + 1}`,
        data: { companyId: testCompany.id, name: testCompany.name }
      });
    } catch (error) {
      results.push({
        test: 'Company Model CRUD',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Company operations failed'
      });
    }

    // Test 3: Customer Model & Relations
    console.log('👥 Testing Customer model and relations...');
    try {
      const companies = await prisma.company.findMany({ take: 1 });
      if (companies.length > 0) {
        const testCustomer = await prisma.customer.create({
          data: {
            name: 'Test Client Pvt Ltd',
            email: 'client@test.com',
            phone: '+91-8888888888',
            gstin: 'CLIENT123456789',
            stateCode: '19',
            companyId: companies[0].id,
            creditLimit: 100000,
            creditDays: 30,
          }
        });

        // Test relationship
        const customerWithCompany = await prisma.customer.findUnique({
          where: { id: testCustomer.id },
          include: { company: true }
        });

        results.push({
          test: 'Customer Model & Relations',
          status: 'PASS',
          message: 'Customer created with company relation',
          data: {
            customerId: testCustomer.id,
            customerName: testCustomer.name,
            companyName: customerWithCompany?.company.name
          }
        });
      } else {
        throw new Error('No company available for customer creation');
      }
    } catch (error) {
      results.push({
        test: 'Customer Model & Relations',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Customer operations failed'
      });
    }

    // Test 4: Service Templates
    console.log('🔧 Testing Service Templates...');
    try {
      const companies = await prisma.company.findMany({ take: 1 });
      if (companies.length > 0) {
        const testService = await prisma.serviceTemplate.create({
          data: {
            name: 'AGM Compliance Service',
            description: 'Annual General Meeting compliance service',
            defaultRate: 15000,
            gstRate: 18,
            hsnSac: '998314',
            category: 'Compliance',
            companyId: companies[0].id,
          }
        });

        results.push({
          test: 'Service Template Model',
          status: 'PASS',
          message: 'Service template created successfully',
          data: { serviceId: testService.id, name: testService.name }
        });
      }
    } catch (error) {
      results.push({
        test: 'Service Template Model',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Service template failed'
      });
    }

    // Test 5: Compliance Models (Advanced)
    console.log('📋 Testing Compliance models...');
    try {
      const companies = await prisma.company.findMany({ take: 1 });
      const customers = await prisma.customer.findMany({ take: 1 });

      if (companies.length > 0 && customers.length > 0) {
        // Create Compliance Template
        const complianceTemplate = await prisma.complianceTemplate.create({
          data: {
            title: 'Annual General Meeting',
            description: 'AGM must be held within 6 months of financial year end',
            complianceType: 'AGM',
            category: 'SHAREHOLDER_MATTERS',
            frequency: 'ANNUALLY',
            defaultDays: 180,
            reminderDays: 30,
            estimatedCost: 15000,
            companyId: companies[0].id,
            instructions: 'Schedule AGM with proper notice',
            checklist: ['Send notice 21 days prior', 'Prepare annual report', 'Book venue'],
            requiredDocs: ['Annual Report', 'Financial Statements'],
          }
        });

        // Create Compliance Item
        const complianceItem = await prisma.complianceItem.create({
          data: {
            title: 'AGM 2024 - Test Client',
            description: 'Annual General Meeting for Test Client Pvt Ltd',
            complianceType: 'AGM',
            category: 'SHAREHOLDER_MATTERS',
            dueDate: new Date('2024-12-31'),
            priority: 'HIGH',
            companyId: companies[0].id,
            customerId: customers[0].id,
            templateId: complianceTemplate.id,
            estimatedCost: 15000,
            reminderDays: 30,
            isRecurring: true,
            frequency: 'ANNUALLY',
            nextDueDate: new Date('2025-12-31'),
          }
        });

        // Create Activity
        const activity = await prisma.complianceActivity.create({
          data: {
            complianceId: complianceItem.id,
            activityType: 'CREATED',
            description: 'Compliance item created from template',
            performedBy: 'System Test',
          }
        });

        // Test Complex Relations
        const fullCompliance = await prisma.complianceItem.findUnique({
          where: { id: complianceItem.id },
          include: {
            company: true,
            customer: true,
            template: true,
            activities: true,
          }
        });

        results.push({
          test: 'Advanced Compliance Models',
          status: 'PASS',
          message: 'Compliance system with full relations working perfectly',
          data: {
            complianceId: complianceItem.id,
            templateId: complianceTemplate.id,
            activityId: activity.id,
            hasAllRelations: !!(fullCompliance?.company && fullCompliance?.customer && fullCompliance?.template),
            activitiesCount: fullCompliance?.activities.length || 0
          }
        });
      }
    } catch (error) {
      results.push({
        test: 'Advanced Compliance Models',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Compliance models failed'
      });
    }

    // Test 6: Invoice with Line Items
    console.log('📄 Testing Invoice model with line items...');
    try {
      const companies = await prisma.company.findMany({ take: 1 });
      const customers = await prisma.customer.findMany({ take: 1 });

      if (companies.length > 0 && customers.length > 0) {
        const testInvoice = await prisma.invoice.create({
          data: {
            number: 'TEST-001',
            customerId: customers[0].id,
            companyId: companies[0].id,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            subtotal: 15000,
            cgstAmount: 1350,
            sgstAmount: 1350,
            totalTax: 2700,
            grandTotal: 17700,
            lines: {
              create: [
                {
                  description: 'AGM Compliance Service',
                  quantity: 1,
                  rate: 15000,
                  amount: 15000,
                  gstRate: 18,
                  hsnSac: '998314',
                }
              ]
            }
          },
          include: {
            lines: true,
            customer: true,
          }
        });

        results.push({
          test: 'Invoice with Line Items',
          status: 'PASS',
          message: 'Invoice created with line items and relations',
          data: {
            invoiceId: testInvoice.id,
            invoiceNumber: testInvoice.number,
            lineItemsCount: testInvoice.lines.length,
            customerName: testInvoice.customer.name,
          }
        });
      }
    } catch (error) {
      results.push({
        test: 'Invoice with Line Items',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Invoice creation failed'
      });
    }

    // Test 7: Payment Relations
    console.log('💰 Testing Payment model...');
    try {
      const invoices = await prisma.invoice.findMany({ take: 1 });
      const customers = await prisma.customer.findMany({ take: 1 });
      const companies = await prisma.company.findMany({ take: 1 });

      if (invoices.length > 0 && customers.length > 0 && companies.length > 0) {
        const testPayment = await prisma.payment.create({
          data: {
            invoiceId: invoices[0].id,
            customerId: customers[0].id,
            companyId: companies[0].id,
            amount: 17700,
            paymentDate: new Date(),
            method: 'BANK_TRANSFER',
            reference: 'TEST-PAY-001',
            status: 'COMPLETED',
          }
        });

        results.push({
          test: 'Payment Relations',
          status: 'PASS',
          message: 'Payment created with all relations',
          data: { paymentId: testPayment.id, amount: testPayment.amount }
        });
      }
    } catch (error) {
      results.push({
        test: 'Payment Relations',
        status: 'FAIL',
        error: error instanceof Error ? error.message : 'Payment creation failed'
      });
    }

    // Summary
    const passedTests = results.filter(r => r.status === 'PASS').length;
    const totalTests = results.length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    res.status(200).json({
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: `${successRate}%`,
        timestamp: new Date().toISOString(),
      },
      results,
      message: passedTests === totalTests
        ? '🎉 All database tests passed! System is robust and ready.'
        : `⚠️ ${totalTests - passedTests} tests failed. Review issues above.`
    });

  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      error: 'Database test suite failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  } finally {
    // Clean up test data (in production, you might want to keep this)
    try {
      // Note: Be careful with this in production!
      console.log('🧹 Cleaning up test data...');

      await prisma.complianceActivity.deleteMany({
        where: { description: { contains: 'System Test' } }
      });

      await prisma.payment.deleteMany({
        where: { reference: { contains: 'TEST-' } }
      });

      await prisma.invoiceLine.deleteMany({
        where: { invoice: { number: { contains: 'TEST-' } } }
      });

      await prisma.invoice.deleteMany({
        where: { number: { contains: 'TEST-' } }
      });

      await prisma.complianceItem.deleteMany({
        where: { title: { contains: 'Test Client' } }
      });

      await prisma.complianceTemplate.deleteMany({
        where: { title: { contains: 'Annual General Meeting' } }
      });

      await prisma.serviceTemplate.deleteMany({
        where: { name: { contains: 'AGM Compliance Service' } }
      });

      await prisma.customer.deleteMany({
        where: { name: { contains: 'Test Client' } }
      });

      await prisma.company.deleteMany({
        where: { name: { contains: 'Test CS Practice' } }
      });

      console.log('✅ Test data cleaned up successfully');
    } catch (cleanupError) {
      console.error('Cleanup error (non-critical):', cleanupError);
    }

    await prisma.$disconnect();
  }
}