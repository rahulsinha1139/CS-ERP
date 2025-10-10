/**
 * Board/AGM Meeting Service Form
 * Multi-row form for meeting services with notice, minutes, forms filed
 */

import React, { useState } from 'react';
import { BoardMeetingServiceData, BoardMeetingRow } from '@/types/service-types';
import { calculateBoardMeetingTotals } from '@/lib/validators/service-validators';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus, X } from 'lucide-react';

interface BoardMeetingFormProps {
  data: BoardMeetingServiceData;
  onChange: (data: BoardMeetingServiceData) => void;
}

export const BoardMeetingForm: React.FC<BoardMeetingFormProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<BoardMeetingRow[]>(data.rows.length > 0 ? data.rows : [
    { meetingType: 'Board Meeting', meetingDate: '', noticePreparation: true, minutesDrafting: true, formsField: '', fee: 0 }
  ]);

  const updateRows = (newRows: BoardMeetingRow[]) => {
    setRows(newRows);
    const totals = calculateBoardMeetingTotals(newRows);
    onChange({ rows: newRows, ...totals });
  };

  const addRow = () => {
    updateRows([...rows, { meetingType: 'Board Meeting', meetingDate: '', noticePreparation: true, minutesDrafting: true, formsField: '', fee: 0 }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) updateRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof BoardMeetingRow, value: string | number | boolean) => {
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Meeting Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Date</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-r">Notice</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-r">Minutes</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Forms Filed</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-r">Fee (₹)</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-700" style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-2 border-r">
                  <select
                    value={row.meetingType}
                    onChange={(e) => updateRow(index, 'meetingType', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Board Meeting">Board Meeting</option>
                    <option value="AGM">AGM</option>
                    <option value="EGM">EGM</option>
                  </select>
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="date"
                    value={row.meetingDate}
                    onChange={(e) => updateRow(index, 'meetingDate', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 text-center border-r">
                  <input
                    type="checkbox"
                    checked={row.noticePreparation}
                    onChange={(e) => updateRow(index, 'noticePreparation', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </td>
                <td className="px-2 py-2 text-center border-r">
                  <input
                    type="checkbox"
                    checked={row.minutesDrafting}
                    onChange={(e) => updateRow(index, 'minutesDrafting', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.formsField || ''}
                    onChange={(e) => updateRow(index, 'formsField', e.target.value)}
                    placeholder="MGT-14"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    value={row.fee}
                    onChange={(e) => updateRow(index, 'fee', parseFloat(e.target.value) || 0)}
                    placeholder="5000"
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
              <td colSpan={5} className="px-3 py-2 text-right text-sm">Total:</td>
              <td className="px-3 py-2 text-sm border-r">₹{data.totalFees.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AuraButton type="button" variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add Another Meeting
      </AuraButton>
    </div>
  );
};
