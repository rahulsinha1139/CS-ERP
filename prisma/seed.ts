/**
 * Database Seeding Script
 * Creates initial data for development and testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default company
  const company = await prisma.company.upsert({
    where: { email: 'admin@cslaw.com' },
    update: {},
    create: {
      name: 'CS Law Associates',
      email: 'admin@cslaw.com',
      phone: '+91-9876543210',
      address: '123 Business District, Mumbai, Maharashtra, 400001',
      gstin: '27ABCDE1234F1Z5',
      stateCode: '27',
      website: 'https://cslaw.com',
    },
  });

  console.log('✅ Company created:', company.name);

  // Create default user
  const user = await prisma.user.upsert({
    where: { email: 'admin@cslaw.com' },
    update: {},
    create: {
      email: 'admin@cslaw.com',
      name: 'Admin User',
      role: 'ADMIN',
      companyId: company.id,
    },
  });

  console.log('✅ User created:', user.name);

  // Create service templates
  const serviceTemplates = [
    {
      name: 'Company Incorporation',
      description: 'Complete company registration and incorporation services',
      defaultRate: 15000,
      gstRate: 18,
      hsnSac: '998311',
      category: 'Incorporation',
    },
    {
      name: 'Annual Compliance',
      description: 'Annual filing and compliance management',
      defaultRate: 25000,
      gstRate: 18,
      hsnSac: '998311',
      category: 'Compliance',
    },
    {
      name: 'Board Meeting Support',
      description: 'Board meeting organization and documentation',
      defaultRate: 5000,
      gstRate: 18,
      hsnSac: '998311',
      category: 'Meetings',
    },
    {
      name: 'Legal Advisory',
      description: 'General legal consultation and advisory services',
      defaultRate: 3000,
      gstRate: 18,
      hsnSac: '998311',
      category: 'Advisory',
    },
    {
      name: 'Document Drafting',
      description: 'Legal document preparation and review',
      defaultRate: 2000,
      gstRate: 18,
      hsnSac: '998311',
      category: 'Documentation',
    },
  ];

  for (const template of serviceTemplates) {
    await prisma.serviceTemplate.upsert({
      where: {
        id: `${company.id}-${template.name.replace(/\s+/g, '-').toLowerCase()}`,
      },
      update: {},
      create: {
        id: `${company.id}-${template.name.replace(/\s+/g, '-').toLowerCase()}`,
        ...template,
        companyId: company.id,
      },
    });
  }

  console.log('✅ Service templates created');

  // Create sample customers
  const customers = [
    {
      name: 'Tech Innovations Pvt Ltd',
      email: 'contact@techinnovations.com',
      phone: '+91-9876543211',
      address: '456 Tech Park, Bangalore, Karnataka, 560001',
      gstin: '29ABCDE1234F1Z6',
      stateCode: '29',
      creditLimit: 50000,
      creditDays: 30,
    },
    {
      name: 'Global Trading Company',
      email: 'info@globaltrading.com',
      phone: '+91-9876543212',
      address: '789 Trade Center, Delhi, Delhi, 110001',
      gstin: '07ABCDE1234F1Z7',
      stateCode: '07',
      creditLimit: 100000,
      creditDays: 45,
    },
    {
      name: 'Manufacturing Solutions Ltd',
      email: 'admin@manufacturingsolutions.com',
      phone: '+91-9876543213',
      address: '321 Industrial Area, Pune, Maharashtra, 411001',
      gstin: '27ABCDE1234F1Z8',
      stateCode: '27',
      creditLimit: 75000,
      creditDays: 30,
    },
    {
      name: 'Startup Ventures Pvt Ltd',
      email: 'hello@startupventures.com',
      phone: '+91-9876543214',
      address: '654 Startup Hub, Chennai, Tamil Nadu, 600001',
      gstin: '33ABCDE1234F1Z9',
      stateCode: '33',
      creditLimit: 25000,
      creditDays: 15,
    },
  ];

  const createdCustomers = [];
  for (const customer of customers) {
    const createdCustomer = await prisma.customer.upsert({
      where: {
        id: `${company.id}-${customer.name.replace(/\s+/g, '-').toLowerCase()}`,
      },
      update: {},
      create: {
        id: `${company.id}-${customer.name.replace(/\s+/g, '-').toLowerCase()}`,
        ...customer,
        companyId: company.id,
      },
    });
    createdCustomers.push(createdCustomer);
  }

  console.log('✅ Sample customers created');

  // Create sample recurring contracts
  const contracts = [
    {
      customerId: createdCustomers[0].id,
      serviceTemplateId: serviceTemplates[1].name, // Will be resolved
      description: 'Monthly compliance management',
      amount: 8000,
      frequency: 'MONTHLY' as const,
      escalationRate: 5,
      startDate: new Date('2024-01-01'),
      nextBillingDate: new Date('2024-02-01'),
      autoInvoice: true,
      terms: 'Net 30 days payment terms',
    },
    {
      customerId: createdCustomers[1].id,
      serviceTemplateId: serviceTemplates[3].name, // Will be resolved
      description: 'Quarterly legal advisory retainer',
      amount: 15000,
      frequency: 'QUARTERLY' as const,
      escalationRate: 8,
      startDate: new Date('2024-01-01'),
      nextBillingDate: new Date('2024-04-01'),
      autoInvoice: true,
      terms: 'Net 45 days payment terms',
    },
  ];

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const serviceTemplate = await prisma.serviceTemplate.findFirst({
      where: {
        companyId: company.id,
        name: contract.serviceTemplateId as string,
      },
    });

    await prisma.recurringContract.create({
      data: {
        ...contract,
        serviceTemplateId: serviceTemplate?.id,
        companyId: company.id,
      },
    });
  }

  console.log('✅ Sample recurring contracts created');

  // Create sample invoices
  const invoiceTemplates = [
    {
      customerId: createdCustomers[0].id,
      status: 'SENT' as const,
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-14'),
      lines: [
        {
          description: 'Company incorporation services',
          quantity: 1,
          rate: 15000,
          gstRate: 18,
          hsnSac: '998311',
        },
      ],
    },
    {
      customerId: createdCustomers[1].id,
      status: 'PAID' as const,
      issueDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-19'),
      lines: [
        {
          description: 'Legal advisory consultation',
          quantity: 4,
          rate: 3000,
          gstRate: 18,
          hsnSac: '998311',
        },
        {
          description: 'Document review',
          quantity: 2,
          rate: 2000,
          gstRate: 18,
          hsnSac: '998311',
        },
      ],
    },
  ];

  let invoiceCounter = 1;
  for (const invoiceTemplate of invoiceTemplates) {
    const { lines, ...invoiceData } = invoiceTemplate;

    // Calculate amounts
    let subtotal = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    const customer = createdCustomers.find(c => c.id === invoiceTemplate.customerId);
    const isInterstate = customer?.stateCode !== company.stateCode;

    const processedLines = lines.map(line => {
      const amount = line.quantity * line.rate;
      subtotal += amount;

      const taxAmount = (amount * line.gstRate) / 100;
      if (isInterstate) {
        igstAmount += taxAmount;
      } else {
        cgstAmount += taxAmount / 2;
        sgstAmount += taxAmount / 2;
      }

      return {
        ...line,
        amount,
      };
    });

    const totalTax = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = subtotal + totalTax;

    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        number: `INV-2024-${invoiceCounter.toString().padStart(3, '0')}`,
        companyId: company.id,
        subtotal: Math.round(subtotal * 100) / 100,
        cgstAmount: Math.round(cgstAmount * 100) / 100,
        sgstAmount: Math.round(sgstAmount * 100) / 100,
        igstAmount: Math.round(igstAmount * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        grandTotal: Math.round(grandTotal * 100) / 100,
        paidAmount: invoiceData.status === 'PAID' ? Math.round(grandTotal * 100) / 100 : 0,
        lines: {
          create: processedLines,
        },
      },
    });

    invoiceCounter++;

    // Create payment for paid invoices
    if (invoiceData.status === 'PAID') {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          companyId: company.id,
          amount: invoice.grandTotal,
          paymentDate: new Date('2024-01-25'),
          method: 'BANK_TRANSFER',
          reference: 'TXN123456789',
          notes: 'Payment received via bank transfer',
        },
      });
    }
  }

  console.log('✅ Sample invoices and payments created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary:
    - Company: ${company.name}
    - Users: 1
    - Service Templates: ${serviceTemplates.length}
    - Customers: ${customers.length}
    - Recurring Contracts: ${contracts.length}
    - Invoices: ${invoiceTemplates.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });