/**
 * Legal Drafting Service Form
 * Multi-row form for legal document drafting with pages, revisions, delivery dates
 */

import React, { useState } from 'react';
import { LegalDraftingServiceData, LegalDraftingRow } from '@/types/service-types';
import { calculateLegalDraftingTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface LegalDraftingFormProps {
  data: LegalDraftingServiceData;
  onChange: (data: LegalDraftingServiceData) => void;
}

export const LegalDraftingForm: React.FC<LegalDraftingFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<LegalDraftingRow[]>(data.rows.length > 0 ? data.rows : [
    { documentType: '', pages: 0, revisions: 1, deliveryDate: '', fee: 0 }
  ]);

  const updateRows = (newRows: LegalDraftingRow[]) => {
    setRows(newRows);
    const totals = calculateLegalDraftingTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { documentType: '', pages: 0, revisions: 1, deliveryDate: '', fee: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) updateRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof LegalDraftingRow, value: string | number) => {
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Document Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Pages</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Revisions</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Delivery Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Fee (₹)</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700" style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-2 border-r">
                  <select
                    value={row.documentType}
                    onChange={(e) => updateRow(index, 'documentType', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Agreement">Agreement</option>
                    <option value="MOU">MOU</option>
                    <option value="Resolution">Resolution</option>
                    <option value="Policy">Policy</option>
                    <option value="Contract">Contract</option>
                    <option value="Legal Notice">Legal Notice</option>
                    <option value="Affidavit">Affidavit</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.pages || ''}
                    onChange={(e) => updateRow(index, 'pages', parseFloat(e.target.value) || 0)}
                    placeholder="10"
                    min="0"
                    step="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.revisions}
                    onChange={(e) => updateRow(index, 'revisions', parseFloat(e.target.value) || 0)}
                    placeholder="1"
                    min="0"
                    step="1"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="date"
                    value={row.deliveryDate || ''}
                    onChange={(e) => updateRow(index, 'deliveryDate', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.fee}
                    onChange={(e) => updateRow(index, 'fee', parseFloat(e.target.value) || 0)}
                    placeholder="15000"
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
              <td className="px-3 py-2 text-right text-sm">Total:</td>
              <td className="px-3 py-2 text-sm border-r">{data.totalPages || 0} pages</td>
              <td colSpan={2} className="px-3 py-2 text-sm border-r"></td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AuraButton type="button" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add Another Document
      </AuraButton>
    </div>
  );
};
