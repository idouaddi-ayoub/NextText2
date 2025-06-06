'use client';

import { useEffect, useState } from 'react';
import { BoxEntry } from '@/store/boxStore';
import { useBoxStore } from '@/store/boxStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BoxesGraphProps {
  selectedBoxType: BoxEntry['boxType'] | 'all';
}

interface GraphDataPoint {
  date: string;
  'Nombre de boîtes': number;
  'Coût total': number;
  'Marge totale': number;
}

export default function BoxesGraph({ selectedBoxType }: BoxesGraphProps) {
  const entries = useBoxStore((state) => state.entries);
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);

  useEffect(() => {
    const filteredEntries = selectedBoxType === 'all'
      ? entries
      : entries.filter(entry => entry.boxType === selectedBoxType);

    const data = filteredEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      'Nombre de boîtes': entry.numberOfBoxes,
      'Coût total': entry.totalCost,
      'Marge totale': entry.totalMargin
    }));

    setGraphData(data);
  }, [entries, selectedBoxType]);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Nombre de boîtes" stroke="#8884d8" />
          <Line type="monotone" dataKey="Coût total" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Marge totale" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 