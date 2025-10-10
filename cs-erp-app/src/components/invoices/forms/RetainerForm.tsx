/**
 * Retainer Service Form
 * Multi-row form for retainer services with period, hours, hourly rate, services included
 */

import React, { useState } from 'react';
import { RetainerServiceData, RetainerRow } from '@/types/service-types';
import { calculateRetainerTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface RetainerFormProps {
  data: RetainerServiceData;
  onChange: (data: RetainerServiceData) => void;
}

export const RetainerForm: React.FC<RetainerFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<RetainerRow[]>(data.rows.length > 0 ? data.rows : [
    { period: '', hours: 0, ratePerHour: 0, servicesIncluded: '', fee: 0 }
  ]);

  const updateRows = (newRows: RetainerRow[]) => {
    setRows(newRows);
    const totals = calculateRetainerTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { period: '', hours: 0, ratePerHour: 0, servicesIncluded: '', fee: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) updateRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof RetainerRow, value: string | number) => {
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Period</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Hours</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Rate/Hour (₹)</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Services Included</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Fee (₹)</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700" style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.period}
                    onChange={(e) => updateRow(index, 'period', e.target.value)}
                    placeholder="January 2025"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.hours || ''}
                    onChange={(e) => updateRow(index, 'hours', parseFloat(e.target.value) || 0)}
                    placeholder="20"
                    min="0"
                    step="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.ratePerHour || ''}
                    onChange={(e) => updateRow(index, 'ratePerHour', parseFloat(e.target.value) || 0)}
                    placeholder="2000"
                    min="0"
                    step="100"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.servicesIncluded}
                    onChange={(e) => updateRow(index, 'servicesIncluded', e.target.value)}
                    placeholder="Advisory, Compliance, Board Support"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.fee}
                    onChange={(e) => updateRow(index, 'fee', parseFloat(e.target.value) || 0)}
                    placeholder="40000"
                    min="0"
                    step="1000"
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
              <td className="px-3 py-2 text-right text-sm">Total:</td>
              <td className="px-3 py-2 text-sm border-r">{data.totalHours} hrs</td>
              <td colSpan={2} className="px-3 py-2 text-sm border-r"></td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AuraButton type="button" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add Another Period
      </AuraButton>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900">Retainer Summary</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Hours:</span>
            <span className="ml-2 font-semibold">{data.totalHours} hours</span>
          </div>
          <div>
            <span className="text-blue-700">Total Fees:</span>
            <span className="ml-2 font-semibold">₹{data.totalFees.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
