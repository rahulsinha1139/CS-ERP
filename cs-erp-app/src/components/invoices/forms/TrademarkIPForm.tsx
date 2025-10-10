/**
 * Trademark & IP Service Form
 * Multi-row form for trademark applications with class, government and professional fees
 */

import React, { useState } from 'react';
import { TrademarkIPServiceData, TrademarkIPRow } from '@/types/service-types';
import { calculateTrademarkIPTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface TrademarkIPFormProps {
  data: TrademarkIPServiceData;
  onChange: (data: TrademarkIPServiceData) => void;
}

export const TrademarkIPForm: React.FC<TrademarkIPFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<TrademarkIPRow[]>(data.rows.length > 0 ? data.rows : [
    { description: '', applicationNumber: '', class: '', filingDate: '', govtFees: 0, professionalFees: 0 }
  ]);

  const updateRows = (newRows: TrademarkIPRow[]) => {
    setRows(newRows);
    const totals = calculateTrademarkIPTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { description: '', applicationNumber: '', class: '', filingDate: '', govtFees: 0, professionalFees: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) updateRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof TrademarkIPRow, value: string | number) => {
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Description</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Application No.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Class</th>
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
                    value={row.description}
                    onChange={(e) => updateRow(index, 'description', e.target.value)}
                    placeholder="Brand name/logo"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.applicationNumber || ''}
                    onChange={(e) => updateRow(index, 'applicationNumber', e.target.value)}
                    placeholder="TM-123456"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.class || ''}
                    onChange={(e) => updateRow(index, 'class', e.target.value)}
                    placeholder="45"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="date"
                    value={row.filingDate || ''}
                    onChange={(e) => updateRow(index, 'filingDate', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.govtFees}
                    onChange={(e) => updateRow(index, 'govtFees', parseFloat(e.target.value) || 0)}
                    placeholder="4500"
                    min="0"
                    step="100"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.professionalFees}
                    onChange={(e) => updateRow(index, 'professionalFees', parseFloat(e.target.value) || 0)}
                    placeholder="10000"
                    min="0"
                    step="500"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(index)} className="text-red-600 hover:text-red-800">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 font-semibold">
              <td colSpan={4} className="px-3 py-2 text-right text-sm">Total:</td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalGovtFees.toFixed(2)}</td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalProfessionalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AuraButton type="button" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add Another Application
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
