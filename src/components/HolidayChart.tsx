import React from 'react';
import {Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import type { HolidayStat } from '../hooks/useHolidayStats';

interface HolidayChartProps {
  stats: HolidayStat[];
  category: keyof HolidayStat;
}

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

export const HolidayChart: React.FC<HolidayChartProps> = ({ stats, category }) => {
  const aggregated = stats.reduce((acc, cur) => {
    acc[cur.month] = (acc[cur.month] || 0) + (cur[category] as number);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(aggregated).map(([month, value]) => ({ month, value }));

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, bottom: 20 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={COLORS[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
