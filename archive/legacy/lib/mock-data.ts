/**
 * Mock Data Service - Temporary solution for client demonstration
 * Provides client data from CSV directly in the app
 */

// Comprehensive financial summary interface matching the original router
export interface FinancialSummary {
  totalInvoices: number;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  // Optional fields that exist in getById but not getAll
  partiallyPaidInvoices?: number;
  unpaidInvoices?: number;
  averageInvoiceValue?: number;
  paymentRate?: number;
  lastPaymentDate?: Date;
  lastInvoiceDate?: Date;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gstin?: string;
  stateCode?: string;
  creditLimit?: number;
  creditDays?: number;
  createdAt: Date;
  companyId: string;
  financialSummary?: FinancialSummary;
}

export interface MockInvoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE';
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  outstandingAmount: number;
  isOverdue: boolean;
  daysPastDue: number;
}

// Client data from CSV
const csvClientData = [
  { name: 'JINDAL PHOTO LIMITED', email: 'cs_jphoto@jindalgroup.com' },
  { name: 'JINDAL SPORTS PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'ADORABLE ALLOYS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'AGILE PROPERTIES LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CHAMPAK NIKETAN PVT LTD', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED FINVEST & HOLDINGS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED BUILDWELL LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED REALCON PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONSOLIDATED REALTORS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL FLEXIFILMS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL MEADOWS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL POLY INVESTMENT AND FINANCE COMPANY LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONCATENATE ADVEST ADVISORY PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL FOOTBALL PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CONCATENATE IMAGING ADVEST PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'VIGIL FARMS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'JINDAL REALTORS LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'SNAP PACK PRIVATE LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'CLIFF PROPBUILD LIMITED', email: 'corporate_sectt@jindalgroup.com' },
  { name: 'LUCKY HOLDINGS', email: 'corporate_sectt@jindalgroup.com' },
];

// Generate mock customers with realistic Indian business data
export const mockCustomers: MockCustomer[] = csvClientData.map((client, index) => {
  const id = `cust_${String(index + 1).padStart(3, '0')}`;
  const gstin = `27${String(Math.random()).substring(2, 12).padStart(10, '0')}5F1Z${index % 10}`;
  const phone = `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`;

  // Generate realistic financial data
  const totalInvoices = Math.floor(Math.random() * 12) + 3; // 3-15 invoices
  const totalBilled = (50000 + Math.floor(Math.random() * 500000)) * totalInvoices; // 50K-550K per invoice
  const paymentRate = Math.random() > 0.8 ? 1.0 : (Math.random() * 0.7 + 0.3); // 30-100% payment rate
  const totalPaid = totalBilled * paymentRate;
  const totalOutstanding = totalBilled - totalPaid;

  const paidInvoices = Math.floor(totalInvoices * paymentRate);
  const pendingInvoices = totalInvoices - paidInvoices;
  const overdueInvoices = Math.floor(pendingInvoices * (Math.random() > 0.7 ? 0.3 : 0));

  return {
    id,
    name: client.name,
    email: client.email,
    phone,
    address: 'Mumbai, Maharashtra, India',
    gstin,
    stateCode: '27', // Maharashtra
    creditLimit: 500000 + Math.floor(Math.random() * 2000000), // 5L-25L
    creditDays: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Last year
    companyId: 'default-company',
    financialSummary: {
      totalInvoices,
      totalBilled: Math.round(totalBilled),
      totalPaid: Math.round(totalPaid),
      totalOutstanding: Math.round(totalOutstanding),
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      // Basic summary only - detailed fields added in getById
    },
  };
});

// Generate mock invoices for the customers
export const mockInvoices: MockInvoice[] = [];

mockCustomers.forEach((customer, customerIndex) => {
  const invoiceCount = customer.financialSummary?.totalInvoices || 5;

  for (let i = 0; i < invoiceCount; i++) {
    const invoiceId = `inv_${customerIndex}_${i}`;
    const issueDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000); // Last 6 months
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days payment terms

    const subtotal = 50000 + Math.floor(Math.random() * 200000); // 50K-250K
    const taxAmount = subtotal * 0.18; // 18% GST
    const grandTotal = subtotal + taxAmount;

    // Determine payment status
    let paidAmount = 0;
    let status: MockInvoice['status'] = 'SENT';
    let paymentStatus: MockInvoice['paymentStatus'] = 'UNPAID';

    const random = Math.random();
    if (random > 0.7) {
      // Fully paid
      paidAmount = grandTotal;
      status = 'PAID';
      paymentStatus = 'PAID';
    } else if (random > 0.5) {
      // Partially paid
      paidAmount = grandTotal * (0.3 + Math.random() * 0.4); // 30-70%
      status = 'PARTIALLY_PAID';
      paymentStatus = 'PARTIALLY_PAID';
    } else if (dueDate < new Date() && random > 0.3) {
      // Overdue
      status = 'OVERDUE';
      paymentStatus = 'UNPAID';
    }

    const isOverdue = status === 'OVERDUE';
    const daysPastDue = isOverdue
      ? Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    mockInvoices.push({
      id: invoiceId,
      number: `INV-2024-${String(customerIndex * 10 + i + 1).padStart(4, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      issueDate,
      dueDate,
      subtotal,
      taxAmount,
      grandTotal,
      paidAmount,
      status,
      paymentStatus,
      outstandingAmount: grandTotal - paidAmount,
      isOverdue,
      daysPastDue,
    });
  }
});

// Mock service functions
export class MockDataService {
  // Customer functions
  static getAllCustomers() {
    return {
      customers: mockCustomers,
      pagination: {
        total: mockCustomers.length,
        page: 1,
        pages: 1,
        totalPages: 1,
        totalCount: mockCustomers.length,
      },
    };
  }

  static getCustomerById(id: string) {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const customerInvoices = mockInvoices.filter(inv => inv.customerId === id);

    // Calculate comprehensive financial metrics for detailed view
    const totalBilled = customerInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalPaid = customerInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = totalBilled - totalPaid;

    const paidInvoices = customerInvoices.filter(inv => inv.paymentStatus === 'PAID').length;
    const partiallyPaidInvoices = customerInvoices.filter(inv => inv.paymentStatus === 'PARTIALLY_PAID').length;
    const unpaidInvoices = customerInvoices.filter(inv => inv.paymentStatus === 'UNPAID').length;
    const overdueInvoices = customerInvoices.filter(inv => inv.isOverdue).length;

    const enhancedFinancialSummary: FinancialSummary = {
      totalInvoices: customerInvoices.length,
      totalBilled: Math.round(totalBilled),
      totalPaid: Math.round(totalPaid),
      totalOutstanding: Math.round(totalOutstanding),
      paidInvoices,
      pendingInvoices: customerInvoices.length - paidInvoices,
      overdueInvoices,
      partiallyPaidInvoices,
      unpaidInvoices,
      averageInvoiceValue: customerInvoices.length > 0
        ? Math.round(totalBilled / customerInvoices.length)
        : 0,
      paymentRate: totalBilled > 0
        ? Math.round((totalPaid / totalBilled) * 10000) / 100
        : 0,
      lastPaymentDate: customerInvoices
        .filter(inv => inv.paidAmount > 0)
        .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())[0]?.issueDate,
      lastInvoiceDate: customerInvoices
        .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())[0]?.issueDate,
    };

    return {
      ...customer,
      financialSummary: enhancedFinancialSummary,
      invoices: customerInvoices,
      timeline: [
        ...customerInvoices.map(inv => ({
          id: inv.id,
          type: 'INVOICE' as const,
          date: inv.issueDate,
          amount: inv.grandTotal,
          description: `Invoice ${inv.number} created`,
          status: inv.status,
        })),
        // Add some payment timeline entries for paid invoices
        ...customerInvoices
          .filter(inv => inv.paidAmount > 0)
          .map(inv => ({
            id: `payment-${inv.id}`,
            type: 'PAYMENT' as const,
            date: new Date(inv.issueDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date after invoice
            amount: inv.paidAmount,
            description: `Payment received for Invoice ${inv.number}`,
            status: 'COMPLETED' as const,
          })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20),
    };
  }

  static getCustomerList() {
    return mockCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      gstin: c.gstin,
      stateCode: c.stateCode,
    }));
  }

  static createCustomer(data: Partial<MockCustomer>) {
    const newId = `cust_${String(mockCustomers.length + 1).padStart(3, '0')}`;
    const newCustomer: MockCustomer = {
      id: newId,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      address: data.address,
      gstin: data.gstin,
      stateCode: data.stateCode,
      creditLimit: data.creditLimit,
      creditDays: data.creditDays,
      createdAt: new Date(),
      companyId: 'default-company',
      financialSummary: {
        totalInvoices: 0,
        totalBilled: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        // Basic structure only - matches the interface
      },
    };

    mockCustomers.push(newCustomer);
    return newCustomer;
  }

  // Invoice functions
  static getInvoicesByCustomer(customerId: string, status = 'ALL') {
    let invoices = mockInvoices.filter(inv => inv.customerId === customerId);

    if (status !== 'ALL') {
      if (status === 'OVERDUE') {
        invoices = invoices.filter(inv => inv.status === 'OVERDUE');
      } else {
        invoices = invoices.filter(inv => inv.paymentStatus === status);
      }
    }

    return invoices;
  }

  static getTopCustomers(limit = 10) {
    return mockCustomers
      .sort((a, b) => (b.financialSummary?.totalBilled || 0) - (a.financialSummary?.totalBilled || 0))
      .slice(0, limit)
      .map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        totalRevenue: c.financialSummary?.totalBilled || 0,
        totalPaid: c.financialSummary?.totalPaid || 0,
        totalOutstanding: c.financialSummary?.totalOutstanding || 0,
        invoiceCount: c.financialSummary?.totalInvoices || 0,
      }));
  }
}

export default MockDataService;