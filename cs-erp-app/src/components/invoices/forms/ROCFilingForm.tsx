/**
 * ROC Filing Service Form
 * Multi-row form for ROC forms with SRN, dates, government and professional fees
 */

import React, { useState } from 'react';
import { ROCFilingServiceData, ROCFilingRow } from '@/types/service-types';
import { calculateROCFilingTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface ROCFilingFormProps {
  data: ROCFilingServiceData;
  onChange: (data: ROCFilingServiceData) => void;
}

export const ROCFilingForm: React.FC<ROCFilingFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<ROCFilingRow[]>(data.rows.length > 0 ? data.rows : [
    { formName: '', srn: '', filingDate: '', govtFees: 0, professionalFees: 0 }
  ]);

  const updateRows = (newRows: ROCFilingRow[]) => {
    setRows(newRows);
    const totals = calculateROCFilingTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { formName: '', srn: '', filingDate: '', govtFees: 0, professionalFees: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      updateRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof ROCFilingRow, value: string | number) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    updateRows(newRows);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">ROC Form</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">SRN</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Filing Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Govt Fees (₹)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Prof. Fees (₹)</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700" style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.formName}
                    onChange={(e) => updateRow(index, 'formName', e.target.value)}
                    placeholder="MGT-7"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.srn || ''}
                    onChange={(e) => updateRow(index, 'srn', e.target.value)}
                    placeholder="A12345678"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="date"
                    value={row.filingDate || ''}
                    onChange={(e) => updateRow(index, 'filingDate', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.govtFees}
                    onChange={(e) => updateRow(index, 'govtFees', parseFloat(e.target.value) || 0)}
                    placeholder="200"
                    min="0"
                    step="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.professionalFees}
                    onChange={(e) => updateRow(index, 'professionalFees', parseFloat(e.target.value) || 0)}
                    placeholder="5000"
                    min="0"
                    step="100"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove row"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
              <td colSpan={3} className="px-3 py-2 text-right text-sm">Total:</td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalGovtFees.toFixed(2)}</td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalProfessionalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <AuraButton
        type="button"
        variant="secondary"
        size="sm"
        icon={<Plus className="h-4 w-4" />}
        onClick={addRow}
      >
        Add Another Form
      </AuraButton>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900">Summary</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Govt Fees:</span>
            <span className="ml-2 font-semibold">₹{data.totalGovtFees.toFixed(2)}</span>
            <span className="ml-2 text-xs text-blue-600">(No GST)</span>
          </div>
          <div>
            <span className="text-blue-700">Total Prof. Fees:</span>
            <span className="ml-2 font-semibold">₹{data.totalProfessionalFees.toFixed(2)}</span>
            <span className="ml-2 text-xs text-blue-600">(GST applicable)</span>
          </div>
        </div>
        <div className="pt-2 border-t border-blue-200">
          <span className="text-blue-900 font-semibold">Grand Total:</span>
          <span className="ml-2 text-lg font-bold text-blue-900">
            ₹{(data.totalGovtFees + data.totalProfessionalFees).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
