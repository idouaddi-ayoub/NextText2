'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useBoxStore } from '@/store/boxStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function GraphsPage() {
  const getStatsByType = useBoxStore((state) => state.getStatsByType);
  const stats = getStatsByType();
  
  const boxTypes = ['Regard double', 'Regard de chasse', 'Regard normal'];
  const colors = [
    'rgba(59, 130, 246, 0.7)', // Blue
    'rgba(16, 185, 129, 0.7)', // Green
    'rgba(249, 115, 22, 0.7)', // Orange
  ];
  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(249, 115, 22, 1)',
  ];

  const marginAdvancementData = {
    labels: boxTypes,
    datasets: [
      {
        label: 'Avancement de marge',
        data: boxTypes.map(type => stats[type]?.totalMargin || 0),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const totalCostData = {
    labels: boxTypes,
    datasets: [
      {
        label: 'Coût total',
        data: boxTypes.map(type => stats[type]?.totalCost || 0),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const totalMargin = boxTypes.reduce((acc, type) => acc + (stats[type]?.totalMargin || 0), 0);
  const totalMarginPercentageData = {
    labels: boxTypes,
    datasets: [
      {
        data: boxTypes.map(type => ((stats[type]?.totalMargin || 0) / totalMargin) * 100),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 16,
        },
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold' as const,
        },
        padding: 16,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-6">
      <h2 className="text-2xl font-bold mb-8">Graphiques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Avancement de marge par type de boîte</h3>
          <Bar
            options={{
              ...options,
              plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'MAD' } },
            }}
            data={marginAdvancementData}
          />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Coût total par type de boîte</h3>
          <Bar
            options={{
              ...options,
              plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'MAD' } },
            }}
            data={totalCostData}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-6 text-gray-800 text-center">Pourcentage de marge total par type de boîte</h3>
        <div className="max-w-md mx-auto">
          <Pie
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: { ...options.plugins.title, text: '%' },
              },
            }}
            data={totalMarginPercentageData}
          />
        </div>
      </div>
    </div>
  );
} 