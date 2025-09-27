/**
 * Invoice Form Component
 * Advanced form with real-time GST calculations and line item management
 */

import React, { useState, useEffect, memo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/trpc-client';
import { gstEngine } from '../../lib/gst-engine';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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

interface InvoiceResult {
  id: string;
  number: string;
  customerId: string;
  status: string;
  total: number;
}

interface CalculationResult {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterstate: boolean;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  gstin?: string;
  state?: string;
}

interface ServiceTemplate {
  id: string;
  name: string;
  baseAmount: number;
  gstRate: number;
  hsnSac?: string;
}

interface InvoiceFormProps {
  invoiceId?: string;
  onSuccess?: (invoice: InvoiceResult) => void;
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
  const { data: customers } = (api as any).customer.getList.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
  const { data: serviceTemplates } = (api as any).service.getTemplates.useQuery(undefined, {
    staleTime: 1000 * 60 * 15, // 15 minutes (templates rarely change)
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
  const { data: company } = (api as any).company.getCurrent.useQuery(undefined, {
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 20, // 20 minutes
  });

  // Get customer for calculations
  const selectedCustomerId = form.watch('customerId');
  const selectedCustomer = customers?.find((c: Customer) => c.id === selectedCustomerId);

  // Watch form values for real-time calculations
  const watchedLines = form.watch('lines');
  const placeOfSupply = form.watch('placeOfSupply');

  // Real-time GST calculations
  useEffect(() => {
    if (!company || !watchedLines?.length) {
      setCalculationResults([]);
      return;
    }

    const results = watchedLines.map((line, index) => {
      if (!line.description || !line.quantity || line.rate === undefined) {
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
        customerStateCode: selectedCustomer?.stateCode,
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
  }, [watchedLines, company, selectedCustomer, placeOfSupply, form]);

  // Mutations
  const createInvoiceMutation = (api as any).invoice.create.useMutation({
    onSuccess: (data: InvoiceResult) => {
      onSuccess?.(data);
    },
  });

  const updateInvoiceMutation = (api as any).invoice.update.useMutation({
    onSuccess: (data: InvoiceResult) => {
      onSuccess?.(data);
    },
  });

  // Form submission
  const onSubmit = (data: InvoiceFormData) => {
    const formattedData = {
      ...data,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      lines: data.lines.map(line => ({
        ...line,
        quantity: Number(line.quantity),
        rate: Number(line.rate),
        gstRate: Number(line.gstRate),
      })),
    };

    if (invoiceId) {
      updateInvoiceMutation.mutate({ id: invoiceId, ...formattedData });
    } else {
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
    const template = serviceTemplates?.find((t: ServiceTemplate) => t.id === templateId);
    if (template) {
      form.setValue(`lines.${lineIndex}.description`, template.name);
      form.setValue(`lines.${lineIndex}.rate`, template.defaultRate);
      form.setValue(`lines.${lineIndex}.gstRate`, template.gstRate);
      form.setValue(`lines.${lineIndex}.hsnSac`, template.hsnSac || '');
      form.setValue(`lines.${lineIndex}.serviceTemplateId`, templateId);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer *</label>
              <select
                {...form.register('customerId')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Customer</option>
                {customers?.map((customer: Customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.gstin && `(${customer.gstin})`}
                  </option>
                ))}
              </select>
              {form.formState.errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Issue Date *</label>
              <Input
                type="date"
                {...form.register('issueDate')}
                error={form.formState.errors.issueDate?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                {...form.register('dueDate')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Place of Supply</label>
              <Input
                {...form.register('placeOfSupply')}
                placeholder="State code (e.g., 27 for Maharashtra)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              {...form.register('notes')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Additional notes for the invoice"
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" variant="outline" onClick={addLineItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Service Template</label>
                    <select
                      onChange={(e) => fillFromTemplate(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Template</option>
                      {serviceTemplates?.map((template: ServiceTemplate) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <Input
                      {...form.register(`lines.${index}.description`)}
                      placeholder="Service description"
                      error={form.formState.errors.lines?.[index]?.description?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity *</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register(`lines.${index}.quantity`, { valueAsNumber: true })}
                      error={form.formState.errors.lines?.[index]?.quantity?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Rate *</label>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register(`lines.${index}.rate`, { valueAsNumber: true })}
                      error={form.formState.errors.lines?.[index]?.rate?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">GST Rate (%)</label>
                    <select
                      {...form.register(`lines.${index}.gstRate`, { valueAsNumber: true })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">HSN/SAC</label>
                    <Input
                      {...form.register(`lines.${index}.hsnSac`)}
                      placeholder="HSN/SAC code"
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
        </CardContent>
      </Card>

      {/* Invoice Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={createInvoiceMutation.isLoading || updateInvoiceMutation.isLoading}
          className="flex-1"
        >
          {createInvoiceMutation.isLoading || updateInvoiceMutation.isLoading ? (
            'Saving...'
          ) : (
            invoiceId ? 'Update Invoice' : 'Create Invoice'
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

// Memoize component for performance
export default memo(InvoiceForm);