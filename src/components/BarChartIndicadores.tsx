import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface Props {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  labelX: string;
  labelY: string;
  barLabel: string;
  color?: string;
}

const BarChartIndicadores: React.FC<Props> = ({
  data,
  dataKey,
  xKey,
  labelX,
  labelY,
  barLabel,
  color = "#ec4899"
}) => (
  <div className="w-full h-[500px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} label={{ value: labelX, position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: labelY, angle: -90, position: "insideLeft", offset: 10 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} name={barLabel} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartIndicadores;
