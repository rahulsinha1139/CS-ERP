/**
 * Secretarial Audit Service Form
 * Multi-row form for audit services with period, type, deliverables, hours
 */

import React, { useState } from 'react';
import { SecretarialAuditServiceData, SecretarialAuditRow } from '@/types/service-types';
import { calculateSecretarialAuditTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface SecretarialAuditFormProps {
  data: SecretarialAuditServiceData;
  onChange: (data: SecretarialAuditServiceData) => void;
}

export const SecretarialAuditForm: React.FC<SecretarialAuditFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<SecretarialAuditRow[]>(data.rows.length > 0 ? data.rows : [
    { period: '', auditType: 'Annual', deliverables: '', hours: 0, fee: 0 }
  ]);

  const updateRows = (newRows: SecretarialAuditRow[]) => {
    setRows(newRows);
    const totals = calculateSecretarialAuditTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { period: '', auditType: 'Annual', deliverables: '', hours: 0, fee: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) updateRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof SecretarialAuditRow, value: string | number) => {
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Audit Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Deliverables</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Hours</th>
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
                    placeholder="FY 2024-25"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <select
                    value={row.auditType}
                    onChange={(e) => updateRow(index, 'auditType', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Annual">Annual</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-yearly">Half-yearly</option>
                  </select>
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.deliverables}
                    onChange={(e) => updateRow(index, 'deliverables', e.target.value)}
                    placeholder="Form MR-3, Audit Report"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.hours || ''}
                    onChange={(e) => updateRow(index, 'hours', parseFloat(e.target.value) || 0)}
                    placeholder="40"
                    min="0"
                    step="0.5"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.fee}
                    onChange={(e) => updateRow(index, 'fee', parseFloat(e.target.value) || 0)}
                    placeholder="25000"
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
              <td colSpan={3} className="px-3 py-2 text-right text-sm">Total:</td>
              <td className="px-3 py-2 text-sm border-r">{data.totalHours?.toFixed(1) || '0.0'} hrs</td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AuraButton type="button" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add Another Audit
      </AuraButton>
    </div>
  );
};
