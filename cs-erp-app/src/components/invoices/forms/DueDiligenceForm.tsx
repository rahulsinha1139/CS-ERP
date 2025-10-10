/**
 * Due Diligence Service Form
 * Multi-row form for due diligence services with scope, documents, report type, timeline
 */

import React, { useState } from 'react';
import { DueDiligenceServiceData, DueDiligenceRow } from '@/types/service-types';
import { calculateDueDiligenceTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface DueDiligenceFormProps {
  data: DueDiligenceServiceData;
  onChange: (data: DueDiligenceServiceData) => void;
}

export const DueDiligenceForm: React.FC<DueDiligenceFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<DueDiligenceRow[]>(data.rows.length > 0 ? data.rows : [
    { scope: '', documentsReviewed: 0, reportType: 'Comprehensive Report', timeline: '', fee: 0 }
  ]);

  const updateRows = (newRows: DueDiligenceRow[]) => {
    setRows(newRows);
    const totals = calculateDueDiligenceTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { scope: '', documentsReviewed: 0, reportType: 'Comprehensive Report', timeline: '', fee: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) updateRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof DueDiligenceRow, value: string | number) => {
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Scope</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Docs Reviewed</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Report Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Timeline</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Fee (₹)</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700" style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-2 border-r">
                  <select
                    value={row.scope}
                    onChange={(e) => updateRow(index, 'scope', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Scope</option>
                    <option value="Financial DD">Financial DD</option>
                    <option value="Legal DD">Legal DD</option>
                    <option value="Secretarial DD">Secretarial DD</option>
                    <option value="Tax DD">Tax DD</option>
                    <option value="Comprehensive DD">Comprehensive DD</option>
                    <option value="Limited DD">Limited DD</option>
                  </select>
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.documentsReviewed || ''}
                    onChange={(e) => updateRow(index, 'documentsReviewed', parseFloat(e.target.value) || 0)}
                    placeholder="50"
                    min="0"
                    step="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <select
                    value={row.reportType}
                    onChange={(e) => updateRow(index, 'reportType', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Comprehensive Report">Comprehensive Report</option>
                    <option value="Summary Report">Summary Report</option>
                    <option value="Detailed Report">Detailed Report</option>
                    <option value="Executive Summary">Executive Summary</option>
                  </select>
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.timeline}
                    onChange={(e) => updateRow(index, 'timeline', e.target.value)}
                    placeholder="15 days"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.fee}
                    onChange={(e) => updateRow(index, 'fee', parseFloat(e.target.value) || 0)}
                    placeholder="75000"
                    min="0"
                    step="5000"
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
              <td className="px-3 py-2 text-sm border-r">{data.totalDocuments} docs</td>
              <td colSpan={2} className="px-3 py-2 text-sm border-r"></td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AuraButton type="button" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add Another DD Scope
      </AuraButton>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900">Due Diligence Summary</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Documents:</span>
            <span className="ml-2 font-semibold">{data.totalDocuments}</span>
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
