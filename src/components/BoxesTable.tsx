'use client';
<div className="bg-red-500 text-white p-4">TEST - This should be red</div>
import { useState, useEffect } from 'react';
import { BoxEntry } from '@/store/boxStore';
import { useBoxStore } from '@/store/boxStore';

interface BoxesTableProps {
  selectedBoxType: BoxEntry['boxType'] | 'all';
  onBoxTypeChange: (type: BoxEntry['boxType'] | 'all') => void;
}

export default function BoxesTable({ selectedBoxType, onBoxTypeChange }: BoxesTableProps) {
  const entries = useBoxStore((state) => state.entries);
  const [filteredEntries, setFilteredEntries] = useState<BoxEntry[]>([]);

  useEffect(() => {
    if (selectedBoxType === 'all') {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(entry => entry.boxType === selectedBoxType));
    }
  }, [entries, selectedBoxType]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Liste des boîtes</h2>
        <select
          value={selectedBoxType}
          onChange={(e) => onBoxTypeChange(e.target.value as BoxEntry['boxType'] | 'all')}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="all">Tous les types</option>
          <option value="Regard normal">Regard normal</option>
          <option value="Regard double">Regard double</option>
          <option value="Regard de chasse">Regard de chasse</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de boîte
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de boîtes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coût total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.boxType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.numberOfBoxes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.totalCost} MAD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 