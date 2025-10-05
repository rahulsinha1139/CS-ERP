/**
 * Invoice Form Component
 * Advanced form with real-time GST calculations and line item management
 */

import React, { useState, useEffect, memo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/utils/api';
import { gstEngine } from '../../lib/gst-engine';
import { AuraCard, AuraCardContent } from '../ui/aura-card';
import { AuraButton } from '../ui/aura-button';
import { AuraInput } from '../ui/aura-input';
import { AuraSelect } from '../ui/aura-select';
import { formatCurrency } from '../../lib/utils';
import { Plus, Trash2, Calculator } from 'lucide-react';

// Form validation schema
const invoiceFormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().optional(),
  placeOfSupply: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  lines: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0.01, 'Quantity must be positive'),
    rate: z.number().min(0, 'Rate cannot be negative'),
    isReimbursement: z.boolean(),
    gstRate: z.number().min(0).max(100),
    hsnSac: z.string().optional(),
    serviceTemplateId: z.string().optional(),
  })).min(1, 'At least one line item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;



interface CalculationResult {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterstate: boolean;
}




interface InvoiceFormProps {
  invoiceId?: string;
  onSuccess?: (invoice: { id: string }) => void;
  onCancel?: () => void;
}

function InvoiceForm({ invoiceId, onSuccess, onCancel }: InvoiceFormProps) {
  const [calculationResults, setCalculationResults] = useState<CalculationResult[]>([]);
  const [invoiceTotals, setInvoiceTotals] = useState({
    subtotal: 0,
    taxableValue: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    totalTax: 0,
    grandTotal: 0,
    isInterstate: false,
  });
  const [showCustomServiceDialog, setShowCustomServiceDialog] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | null>(null);
  const [customService, setCustomService] = useState({
    name: '',
    rate: 0,
    gstRate: 18,
    hsnSac: '',
    saveAsTemplate: false,
  });

  // Form setup
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split('T')[0],
      lines: [{
        description: '',
        quantity: 1,
        rate: 0,
        isReimbursement: false,
        gstRate: 18,
        hsnSac: '',
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  // Data fetching with optimized caching
  const { data: customers } = api.customer.getList.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
  const { data: serviceTemplates } = api.service.getTemplates.useQuery(undefined, {
    staleTime: 1000 * 60 * 15, // 15 minutes (templates rarely change)
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
  const { data: company } = api.company.getCurrent.useQuery(undefined, {
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });

  // Get customer for calculations
  const selectedCustomerId = form.watch('customerId');
  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);

  // Watch form values for real-time calculations
  const watchedLines = form.watch('lines');
  const placeOfSupply = form.watch('placeOfSupply');

  // Real-time GST calculations
  useEffect(() => {
    if (!company || !watchedLines?.length) {
      setCalculationResults([]);
      setInvoiceTotals({
        subtotal: 0,
        taxableValue: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalTax: 0,
        grandTotal: 0,
        isInterstate: false,
      });
      return;
    }

    const results = watchedLines.map((line) => {
      // Calculate even if description is empty, as long as we have quantity and rate
      if (line.quantity === undefined || line.quantity <= 0 || line.rate === undefined) {
        return {
          taxableValue: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0,
          grandTotal: 0,
          isInterstate: false,
        };
      }

      const calculation = gstEngine.calculateGST({
        amount: line.quantity * line.rate,
        gstRate: line.gstRate || 0,
        isReimbursement: line.isReimbursement || false,
        companyStateCode: company.stateCode,
        customerStateCode: selectedCustomer?.stateCode ?? undefined,
        placeOfSupply: placeOfSupply,
      });

      return calculation;
    });

    setCalculationResults(results);

    // Calculate invoice totals
    const totals = gstEngine.calculateInvoiceTotals(results);
    const isInterstate = results.some(r => r.isInterstate);

    setInvoiceTotals({
      subtotal: totals.subtotal,
      taxableValue: totals.totalTaxableValue,
      cgstAmount: totals.totalCGST,
      sgstAmount: totals.totalSGST,
      igstAmount: totals.totalIGST,
      totalTax: totals.totalTax,
      grandTotal: totals.grandTotal,
      isInterstate,
    });
  }, [watchedLines, company, selectedCustomer, placeOfSupply]);

  // Mutations
    const createInvoiceMutation = api.invoice.create.useMutation({
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });

  const updateInvoiceMutation = api.invoice.update.useMutation({
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });

  const createServiceMutation = api.service.create.useMutation({
    onSuccess: () => {
      // Service saved successfully
    },
  });

  // Form submission
  const onSubmit = (data: InvoiceFormData) => {
    const formattedData = {
      ...data,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      lines: data.lines.map(line => {
        // Don't send serviceTemplateId - templates are mock data not in database
        const { serviceTemplateId, ...lineWithoutTemplate } = line;
        return {
          ...lineWithoutTemplate,
          quantity: Number(line.quantity),
          rate: Number(line.rate),
          gstRate: Number(line.gstRate),
          // Sanitize empty strings to undefined for optional fields
          hsnSac: line.hsnSac && line.hsnSac.trim() !== '' ? line.hsnSac : undefined,
        };
      }),
    };

    if (invoiceId) {
      // Update existing invoice
      updateInvoiceMutation.mutate({ id: invoiceId, ...formattedData });
    } else {
      // Create new invoice
      createInvoiceMutation.mutate(formattedData);
    }
  };

  const addLineItem = () => {
    append({
      description: '',
      quantity: 1,
      rate: 0,
      isReimbursement: false,
      gstRate: 18,
      hsnSac: '',
    });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const fillFromTemplate = (lineIndex: number, templateId: string) => {
    if (templateId === 'CUSTOM') {
      // Open custom service dialog
      setCurrentLineIndex(lineIndex);
      setCustomService({
        name: '',
        rate: 0,
        gstRate: 18,
        hsnSac: '',
        saveAsTemplate: false,
      });
      setShowCustomServiceDialog(true);
      return;
    }

    const template = serviceTemplates?.find((t) => t.id.toString() === templateId);
    if (template) {
      form.setValue(`lines.${lineIndex}.description`, template.name);
      form.setValue(`lines.${lineIndex}.rate`, template.baseAmount);
      form.setValue(`lines.${lineIndex}.gstRate`, template.gstRate);
      form.setValue(`lines.${lineIndex}.hsnSac`, template.hsn || '');
      // Note: We don't set serviceTemplateId because templates are mock data, not in DB
    }
  };

  const handleCustomServiceSave = () => {
    if (!customService.name || currentLineIndex === null) return;

    // Fill the current line with custom service details
    form.setValue(`lines.${currentLineIndex}.description`, customService.name);
    form.setValue(`lines.${currentLineIndex}.rate`, customService.rate);
    form.setValue(`lines.${currentLineIndex}.gstRate`, customService.gstRate);
    form.setValue(`lines.${currentLineIndex}.hsnSac`, customService.hsnSac);

    // If user wants to save as template
    if (customService.saveAsTemplate) {
      createServiceMutation.mutate({
        name: customService.name,
        description: customService.name,
        baseAmount: customService.rate,
        gstRate: customService.gstRate,
        hsn: customService.hsnSac,
        category: 'custom',
      });
    }

    // Close dialog
    setShowCustomServiceDialog(false);
    setCurrentLineIndex(null);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Invoice Details */}
      <AuraCard>
        <AuraCardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AuraSelect
                {...form.register('customerId')}
                label="Customer *"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              >
                <option value="">Select Customer</option>
                {customers?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.gstin && `(${customer.gstin})`}
                  </option>
                ))}
              </AuraSelect>
              {form.formState.errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerId.message}</p>
              )}
            </div>

            <div>
              <AuraInput
                type="date"
                {...form.register('issueDate')}
                label="Issue Date *"
                error={form.formState.errors.issueDate?.message}
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
            </div>

            <div>
              <AuraInput
                type="date"
                {...form.register('dueDate')}
                label="Due Date"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
            </div>

            <div>
              <AuraInput
                {...form.register('placeOfSupply')}
                label="Place of Supply"
                placeholder="State code (e.g., 27 for Maharashtra)"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Notes</label>
            <textarea
              {...form.register('notes')}
              className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              rows={2}
              placeholder="Additional notes for the invoice"
            />
          </div>
        </AuraCardContent>
      </AuraCard>

      {/* Line Items */}
      <AuraCard>
        <AuraCardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
            <AuraButton type="button" variant="secondary" onClick={addLineItem} icon={<Plus className="h-4 w-4" />}>
              Add Item
            </AuraButton>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <AuraButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      Remove
                    </AuraButton>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <AuraSelect
                      onChange={(e) => fillFromTemplate(index, e.target.value)}
                      label="Service Template (Optional)"
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    >
                      <option value="">Select Template</option>
                      {serviceTemplates?.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                      <option value="CUSTOM" className="font-semibold text-blue-600">+ Add Custom Service...</option>
                    </AuraSelect>
                  </div>

                  <div className="md:col-span-2">
                    <AuraInput
                      {...form.register(`lines.${index}.description`)}
                      label="Description *"
                      placeholder="Service description"
                      error={form.formState.errors.lines?.[index]?.description?.message}
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    />
                  </div>

                  <div>
                    <AuraInput
                      type="number"
                      step="0.01"
                      {...form.register(`lines.${index}.quantity`, { valueAsNumber: true })}
                      label="Quantity *"
                      error={form.formState.errors.lines?.[index]?.quantity?.message}
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
                    />
                  </div>

                  <div>
                    <AuraInput
                      type="number"
                      step="0.01"
                      {...form.register(`lines.${index}.rate`, { valueAsNumber: true })}
                      label="Rate *"
                      error={form.formState.errors.lines?.[index]?.rate?.message}
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                    />
                  </div>

                  <div>
                    <AuraSelect
                      {...form.register(`lines.${index}.gstRate`, { valueAsNumber: true })}
                      label="GST Rate (%)"
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </AuraSelect>
                  </div>

                  <div>
                    <AuraInput
                      {...form.register(`lines.${index}.hsnSac`)}
                      label="HSN/SAC"
                      placeholder="HSN/SAC code"
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...form.register(`lines.${index}.isReimbursement`)}
                        className="mr-2"
                      />
                      <span className="text-sm">Reimbursement</span>
                    </label>
                  </div>
                </div>

                {/* Real-time calculation display */}
                {calculationResults[index] && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Tax Calculation</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Taxable Value:</span>
                        <span className="font-medium ml-2">
                          {formatCurrency(calculationResults[index].taxableValue)}
                        </span>
                      </div>
                      {calculationResults[index].isInterstate ? (
                        <div>
                          <span className="text-gray-600">IGST:</span>
                          <span className="font-medium ml-2">
                            {formatCurrency(calculationResults[index].igst)}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-gray-600">CGST:</span>
                            <span className="font-medium ml-2">
                              {formatCurrency(calculationResults[index].cgst)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">SGST:</span>
                            <span className="font-medium ml-2">
                              {formatCurrency(calculationResults[index].sgst)}
                            </span>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-gray-600">Line Total:</span>
                        <span className="font-medium ml-2">
                          {formatCurrency(calculationResults[index].grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AuraCardContent>
      </AuraCard>

      {/* Invoice Totals */}
      <AuraCard>
        <AuraCardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoiceTotals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxable Value:</span>
              <span className="font-medium">{formatCurrency(invoiceTotals.taxableValue)}</span>
            </div>
            {invoiceTotals.isInterstate ? (
              <div className="flex justify-between">
                <span>IGST:</span>
                <span className="font-medium">{formatCurrency(invoiceTotals.igstAmount)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>CGST:</span>
                  <span className="font-medium">{formatCurrency(invoiceTotals.cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST:</span>
                  <span className="font-medium">{formatCurrency(invoiceTotals.sgstAmount)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Grand Total:</span>
              <span className="text-blue-600">{formatCurrency(invoiceTotals.grandTotal)}</span>
            </div>
          </div>
        </AuraCardContent>
      </AuraCard>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <AuraButton
          type="submit"
          variant="primary"
          disabled={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
          isLoading={createInvoiceMutation.isPending || updateInvoiceMutation.isPending}
          className="flex-1"
          icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
        >
          {invoiceId ? 'Update Invoice' : 'Create Invoice'}
        </AuraButton>
        {onCancel && (
          <AuraButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </AuraButton>
        )}
      </div>

      {/* Custom Service Dialog */}
      {showCustomServiceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Service</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Service Name *</label>
                <input
                  type="text"
                  value={customService.name}
                  onChange={(e) => setCustomService(prev => ({ ...prev, name: e.target.value }))}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Rate *</label>
                <input
                  type="number"
                  step="0.01"
                  value={customService.rate}
                  onChange={(e) => setCustomService(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">GST Rate (%)</label>
                <select
                  value={customService.gstRate}
                  onChange={(e) => setCustomService(prev => ({ ...prev, gstRate: parseInt(e.target.value) }))}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">HSN/SAC Code</label>
                <input
                  type="text"
                  value={customService.hsnSac}
                  onChange={(e) => setCustomService(prev => ({ ...prev, hsnSac: e.target.value }))}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Enter HSN/SAC code"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <input
                  type="checkbox"
                  id="saveAsTemplate"
                  checked={customService.saveAsTemplate}
                  onChange={(e) => setCustomService(prev => ({ ...prev, saveAsTemplate: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saveAsTemplate" className="text-sm text-gray-700 cursor-pointer">
                  Save as template for future use
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <AuraButton
                type="button"
                variant="primary"
                onClick={handleCustomServiceSave}
                disabled={!customService.name || customService.rate <= 0}
              >
                Add Service
              </AuraButton>
              <AuraButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCustomServiceDialog(false);
                  setCurrentLineIndex(null);
                }}
              >
                Cancel
              </AuraButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

// Memoize component for performance
export default memo(InvoiceForm);