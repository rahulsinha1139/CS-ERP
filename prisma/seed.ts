/**
 * Production-Ready Database Seeding Script
 * Creates comprehensive CS practice data with UUIDs
 */

import { PrismaClient } from '@prisma/client';
import { idGenerator } from '../src/lib/id-generator';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seeding with UUIDs...\n');

  // ===== COMPANY =====
  const companyId = idGenerator.generate();
  const company = await prisma.company.upsert({
    where: { email: 'contact@pragnyacs.com' },
    update: {},
    create: {
      id: companyId,
      name: 'Pragnya Pradhan & Associates',
      email: 'contact@pragnyacs.com',
      phone: '+91-9876543210',
      address: '123 Professional Chambers, Law Garden, Ahmedabad, Gujarat, 380006',
      gstin: '24ABCDE1234F1Z5',
      stateCode: '24', // Gujarat
      website: 'https://pragnyacs.com',
    },
  });

  console.log('✅ Company created:', company.name);

  // ===== USER =====
  const userId = idGenerator.generate();
  const user = await prisma.user.upsert({
    where: { email: 'pragnya@pragnyacs.com' },
    update: {},
    create: {
      id: userId,
      email: 'pragnya@pragnyacs.com',
      name: 'Mrs. Pragnya Pradhan',
      role: 'ADMIN',
      companyId: company.id,
    },
  });

  console.log('✅ User created:', user.name);

  // ===== SERVICE TEMPLATES =====
  const services = [
    // ROC Filings
    { name: 'Company Incorporation (New)', rate: 15000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'Annual Return (MGT-7)', rate: 5000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'Financial Statements Filing (AOC-4)', rate: 4000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'DIR-3 KYC Filing', rate: 1000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'Change in Directors (DIR-12)', rate: 3000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'Change in Registered Office (INC-22)', rate: 5000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'Increase in Authorized Capital', rate: 8000, hsn: '998311', cat: 'ROC Filing' },
    { name: 'LLP Annual Filing (Form 11)', rate: 4000, hsn: '998311', cat: 'ROC Filing' },

    // Compliance Services
    { name: 'Annual Compliance Package', rate: 25000, hsn: '998311', cat: 'Compliance' },
    { name: 'Board Meeting Support', rate: 5000, hsn: '998311', cat: 'Meetings' },
    { name: 'AGM Conduct & Filing', rate: 8000, hsn: '998311', cat: 'Meetings' },
    { name: 'EGM Conduct & Filing', rate: 6000, hsn: '998311', cat: 'Meetings' },
    { name: 'Secretarial Audit (MGT-8)', rate: 20000, hsn: '998311', cat: 'Audit' },
    { name: 'Secretarial Standards Compliance', rate: 12000, hsn: '998311', cat: 'Compliance' },

    // Advisory
    { name: 'Legal Advisory (Per Hour)', rate: 3000, hsn: '998311', cat: 'Advisory' },
    { name: 'Corporate Restructuring Advisory', rate: 50000, hsn: '998311', cat: 'Advisory' },
    { name: 'Merger & Acquisition Support', rate: 100000, hsn: '998311', cat: 'Advisory' },

    // Documentation
    { name: 'Board Resolution Drafting', rate: 2000, hsn: '998311', cat: 'Documentation' },
    { name: 'Shareholder Agreement', rate: 15000, hsn: '998311', cat: 'Documentation' },
    { name: 'MOU/Agreement Drafting', rate: 5000, hsn: '998311', cat: 'Documentation' },
  ];

  const createdServices = [];
  for (const svc of services) {
    const service = await prisma.serviceTemplate.create({
      data: {
        id: idGenerator.serviceTemplate(),
        name: svc.name,
        description: `Professional ${svc.cat} service`,
        defaultRate: svc.rate,
        gstRate: 18,
        hsnSac: svc.hsn,
        category: svc.cat,
        companyId: company.id,
      },
    });
    createdServices.push(service);
  }

  console.log(`✅ Service templates created: ${createdServices.length}`);

  // ===== CUSTOMERS =====
  const customers = [
    {
      name: 'TechCorp Solutions Pvt Ltd',
      email: 'cfo@techcorp.com',
      phone: '+91-9876501001',
      address: '456 Tech Park, Whitefield, Bangalore, Karnataka, 560066',
      gstin: '29ABCDE1234F1Z6',
      stateCode: '29', // Interstate
      creditLimit: 100000,
      creditDays: 45,
    },
    {
      name: 'Gujarat Textiles Private Limited',
      email: 'admin@gjtextiles.com',
      phone: '+91-9876502002',
      address: '789 Industrial Estate, GIDC Vatva, Ahmedabad, Gujarat, 382445',
      gstin: '24BCDEF2345G2A7',
      stateCode: '24', // Intrastate
      creditLimit: 150000,
      creditDays: 30,
    },
    {
      name: 'Mumbai Finance & Investments Ltd',
      email: 'legal@mumbaifi.com',
      phone: '+91-9876503003',
      address: '321 Nariman Point, Mumbai, Maharashtra, 400021',
      gstin: '27CDEFG3456H3B8',
      stateCode: '27', // Interstate
      creditLimit: 200000,
      creditDays: 60,
    },
    {
      name: 'Ahmedabad Realty Developers LLP',
      email: 'info@amdrealty.com',
      phone: '+91-9876504004',
      address: '654 SG Highway, Bodakdev, Ahmedabad, Gujarat, 380054',
      gstin: '24DEFGH4567I4C9',
      stateCode: '24', // Intrastate
      creditLimit: 80000,
      creditDays: 30,
    },
    {
      name: 'Startup Innovations Private Limited',
      email: 'founder@startupinn.com',
      phone: '+91-9876505005',
      address: '987 Startup Hub, HSR Layout, Bangalore, Karnataka, 560102',
      gstin: '29EFGHI5678J5D0',
      stateCode: '29', // Interstate
      creditLimit: 50000,
      creditDays: 15,
    },
    {
      name: 'Gujarat Exports Corporation',
      email: 'exports@gujexports.com',
      phone: '+91-9876506006',
      address: '147 Port Road, Kandla, Gujarat, 370210',
      gstin: '24FGHIJ6789K6E1',
      stateCode: '24', // Intrastate
      creditLimit: 120000,
      creditDays: 30,
    },
  ];

  const createdCustomers = [];
  for (const cust of customers) {
    const customer = await prisma.customer.create({
      data: {
        id: idGenerator.customer(),
        ...cust,
        companyId: company.id,
        whatsappNumber: cust.phone,
      },
    });
    createdCustomers.push(customer);
  }

  console.log(`✅ Customers created: ${createdCustomers.length}`);

  // ===== INVOICES & PAYMENTS =====
  const invoices = [];
  const payments = [];

  // Helper function for GST calculation
  const calculateGST = (lines: any[], isInterstate: boolean) => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    lines.forEach(line => {
      const amt = line.qty * line.rate;
      subtotal += amt;
      const tax = (amt * line.gst) / 100;

      if (isInterstate) {
        igst += tax;
      } else {
        cgst += tax / 2;
        sgst += tax / 2;
      }
    });

    const totalTax = cgst + sgst + igst;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      cgstAmount: Math.round(cgst * 100) / 100,
      sgstAmount: Math.round(sgst * 100) / 100,
      igstAmount: Math.round(igst * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      grandTotal: Math.round((subtotal + totalTax) * 100) / 100,
    };
  };

  // Invoice 1: TechCorp - PAID (Interstate)
  const inv1Lines = [
    { desc: 'Company Incorporation (New)', qty: 1, rate: 15000, gst: 18, hsn: '998311' },
    { desc: 'Board Meeting Support', qty: 2, rate: 5000, gst: 18, hsn: '998311' },
  ];
  const inv1Calc = calculateGST(inv1Lines, true); // Interstate
  const invoice1 = await prisma.invoice.create({
    data: {
      id: idGenerator.invoice(),
      number: 'INV-2024-001',
      status: 'PAID',
      issueDate: new Date('2024-11-01'),
      dueDate: new Date('2024-12-16'),
      customerId: createdCustomers[0]!.id,
      companyId: company.id,
      ...inv1Calc,
      paidAmount: inv1Calc.grandTotal,
      placeOfSupply: 'Karnataka',
      terms: 'Net 45 days from invoice date',
      lines: {
        create: inv1Lines.map(l => ({
          id: idGenerator.invoiceLine(),
          description: l.desc,
          quantity: l.qty,
          rate: l.rate,
          amount: l.qty * l.rate,
          gstRate: l.gst,
          hsnSac: l.hsn,
        })),
      },
    },
  });
  invoices.push(invoice1);

  // Payment for Invoice 1
  await prisma.payment.create({
    data: {
      id: idGenerator.payment(),
      invoiceId: invoice1.id,
      customerId: invoice1.customerId,
      companyId: company.id,
      amount: invoice1.grandTotal,
      paymentDate: new Date('2024-11-25'),
      method: 'BANK_TRANSFER',
      reference: 'NEFT/UTR1234567890',
      notes: 'Full payment received via NEFT',
      status: 'COMPLETED',
    },
  });

  // Invoice 2: Gujarat Textiles - PARTIALLY_PAID (Intrastate)
  const inv2Lines = [
    { desc: 'Annual Compliance Package', qty: 1, rate: 25000, gst: 18, hsn: '998311' },
    { desc: 'AGM Conduct & Filing', qty: 1, rate: 8000, gst: 18, hsn: '998311' },
    { desc: 'Secretarial Audit (MGT-8)', qty: 1, rate: 20000, gst: 18, hsn: '998311' },
  ];
  const inv2Calc = calculateGST(inv2Lines, false); // Intrastate
  const invoice2 = await prisma.invoice.create({
    data: {
      id: idGenerator.invoice(),
      number: 'INV-2024-002',
      status: 'PARTIALLY_PAID',
      issueDate: new Date('2024-11-10'),
      dueDate: new Date('2024-12-10'),
      customerId: createdCustomers[1]!.id,
      companyId: company.id,
      ...inv2Calc,
      paidAmount: 30000,
      placeOfSupply: 'Gujarat',
      terms: 'Net 30 days',
      lines: {
        create: inv2Lines.map(l => ({
          id: idGenerator.invoiceLine(),
          description: l.desc,
          quantity: l.qty,
          rate: l.rate,
          amount: l.qty * l.rate,
          gstRate: l.gst,
          hsnSac: l.hsn,
        })),
      },
    },
  });
  invoices.push(invoice2);

  // Partial payment for Invoice 2
  await prisma.payment.create({
    data: {
      id: idGenerator.payment(),
      invoiceId: invoice2.id,
      customerId: invoice2.customerId,
      companyId: company.id,
      amount: 30000,
      paymentDate: new Date('2024-11-20'),
      method: 'CHEQUE',
      reference: 'CHQ#567890',
      notes: 'Partial payment - Cheque cleared',
      status: 'COMPLETED',
    },
  });

  // Invoice 3: Mumbai Finance - SENT (Interstate)
  const inv3Lines = [
    { desc: 'Secretarial Audit (MGT-8)', qty: 1, rate: 20000, gst: 18, hsn: '998311' },
    { desc: 'Board Resolution Drafting', qty: 5, rate: 2000, gst: 18, hsn: '998311' },
  ];
  const inv3Calc = calculateGST(inv3Lines, true);
  const invoice3 = await prisma.invoice.create({
    data: {
      id: idGenerator.invoice(),
      number: 'INV-2024-003',
      status: 'SENT',
      issueDate: new Date('2024-11-20'),
      dueDate: new Date('2025-01-19'),
      customerId: createdCustomers[2]!.id,
      companyId: company.id,
      ...inv3Calc,
      paidAmount: 0,
      placeOfSupply: 'Maharashtra',
      terms: 'Net 60 days',
      lines: {
        create: inv3Lines.map(l => ({
          id: idGenerator.invoiceLine(),
          description: l.desc,
          quantity: l.qty,
          rate: l.rate,
          amount: l.qty * l.rate,
          gstRate: l.gst,
          hsnSac: l.hsn,
        })),
      },
    },
  });
  invoices.push(invoice3);

  // Invoice 4: Ahmedabad Realty - OVERDUE (Intrastate)
  const inv4Lines = [
    { desc: 'Company Incorporation (New)', qty: 1, rate: 15000, gst: 18, hsn: '998311' },
  ];
  const inv4Calc = calculateGST(inv4Lines, false);
  const invoice4 = await prisma.invoice.create({
    data: {
      id: idGenerator.invoice(),
      number: 'INV-2024-004',
      status: 'OVERDUE',
      issueDate: new Date('2024-10-01'),
      dueDate: new Date('2024-10-31'),
      customerId: createdCustomers[3]!.id,
      companyId: company.id,
      ...inv4Calc,
      paidAmount: 0,
      placeOfSupply: 'Gujarat',
      terms: 'Net 30 days',
      lines: {
        create: inv4Lines.map(l => ({
          id: idGenerator.invoiceLine(),
          description: l.desc,
          quantity: l.qty,
          rate: l.rate,
          amount: l.qty * l.rate,
          gstRate: l.gst,
          hsnSac: l.hsn,
        })),
      },
    },
  });
  invoices.push(invoice4);

  console.log(`✅ Invoices created: ${invoices.length}`);
  console.log(`✅ Payments recorded: 2`);

  // ===== COMPLIANCE ITEMS =====
  const complianceItems = [
    {
      customerId: createdCustomers[1]!.id,
      title: 'Annual Return Filing (MGT-7) - FY 2023-24',
      desc: 'File MGT-7 with ROC within 60 days from AGM',
      type: 'ROC_FILING',
      category: 'ANNUAL_COMPLIANCE',
      due: new Date('2024-12-31'),
      priority: 'HIGH',
      freq: 'ANNUALLY',
      cost: 5000,
      form: 'MGT-7',
    },
    {
      customerId: createdCustomers[1]!.id,
      title: 'Financial Statements Filing (AOC-4)',
      desc: 'File audited financial statements with ROC',
      type: 'ROC_FILING',
      category: 'ANNUAL_COMPLIANCE',
      due: new Date('2024-12-31'),
      priority: 'HIGH',
      freq: 'ANNUALLY',
      cost: 4000,
      form: 'AOC-4',
    },
    {
      customerId: createdCustomers[0]!.id,
      title: 'Board Meeting - Q4 FY 2024-25',
      desc: 'Conduct quarterly board meeting and prepare minutes',
      type: 'BOARD_MEETING',
      category: 'BOARD_MATTERS',
      due: new Date('2025-03-25'),
      priority: 'MEDIUM',
      freq: 'QUARTERLY',
      cost: 5000,
    },
    {
      customerId: createdCustomers[2]!.id,
      title: 'Annual General Meeting - FY 2023-24',
      desc: 'Conduct AGM within 6 months from end of FY',
      type: 'AGM',
      category: 'SHAREHOLDER_MATTERS',
      due: new Date('2024-09-30'),
      priority: 'CRITICAL',
      freq: 'ANNUALLY',
      cost: 8000,
      status: 'COMPLETED',
      completed: new Date('2024-09-15'),
    },
    {
      customerId: createdCustomers[3]!.id,
      title: 'DIR-3 KYC for all Directors',
      desc: 'Annual KYC filing for all active directors',
      type: 'REGULATORY',
      category: 'REGULATORY_COMPLIANCE',
      due: new Date('2025-04-30'),
      priority: 'HIGH',
      freq: 'ANNUALLY',
      cost: 3000,
      form: 'DIR-3 KYC',
    },
  ];

  for (const comp of complianceItems) {
    await prisma.complianceItem.create({
      data: {
        id: idGenerator.compliance(),
        companyId: company.id,
        customerId: comp.customerId,
        title: comp.title,
        description: comp.desc,
        complianceType: comp.type as any,
        category: comp.category as any,
        dueDate: comp.due,
        priority: comp.priority as any,
        frequency: comp.freq as any,
        estimatedCost: comp.cost,
        rocForm: comp.form,
        status: comp.status as any || 'PENDING',
        completedDate: comp.completed,
        isRecurring: true,
      },
    });
  }

  console.log(`✅ Compliance items created: ${complianceItems.length}`);

  console.log('\n🎉 Production database seeding completed successfully!\n');
  console.log('📊 SUMMARY:');
  console.log(`   🏢 Company: ${company.name}`);
  console.log(`   👤 Users: 1 (${user.name})`);
  console.log(`   📋 Service Templates: ${createdServices.length}`);
  console.log(`   👥 Customers: ${createdCustomers.length}`);
  console.log(`   📄 Invoices: ${invoices.length}`);
  console.log(`   💰 Payments: 2`);
  console.log(`   ⚖️  Compliance Items: ${complianceItems.length}`);
  console.log('\n✅ System ready for production use with UUID-based IDs!\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
