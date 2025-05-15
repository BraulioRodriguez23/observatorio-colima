// src/components/admincomponets/ExcelChart.tsx
import React, { useContext } from 'react';
import { ExcelContext } from '../../context/ExcelContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const ExcelChart: React.FC = () => {
  const { rows } = useContext(ExcelContext);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />  {/* ajusta según tu Excel */}
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3182ce" />
      </BarChart>
    </ResponsiveContainer>
  );
};
