import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label
} from "recharts";

const COLORS = ["#EF476F", "#118AB2", "#06D6A0", "#FFD166", "#073B4C"];

const formatNumber = (num: number | null | undefined) =>
  typeof num === "number"
    ? num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "--";

// Tooltip UX-friendly
import type { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-xl shadow-lg bg-white px-4 py-3 border border-gray-200 min-w-[180px]">
      <div className="font-bold text-gray-800 text-base mb-1">{row.season}</div>
      <div className="text-gray-600 text-sm">
        <b>Municipio:</b> {row.municipality}<br/>
        <b>{payload[0].name}:</b>{" "}
        <span style={{ color: payload[0].stroke }}>
          {formatNumber(payload[0].value)}
        </span>
      </div>
    </div>
  );
};

interface ChartData {
  [key: string]: string | number | null | undefined;
  season?: string;
  municipality?: string;
}

interface Props {
  data: ChartData[];
  dataKey: string;
  xKey: string;
  labelX: string;
  labelY: string;
  titulo?: string;
}

const LineChartIndicadores: React.FC<Props> = ({
  data,
  dataKey,
  xKey,
  labelX,
  labelY,
  titulo = "Evolución por Temporada"
}) => (
  <div>
    <h2 className="text-xl md:text-2xl font-bold text-center text-pink-700 mb-2">{titulo}</h2>
    <ResponsiveContainer width="100%" height={420}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="4 3" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 14 }}>
          <Label value={labelX} offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis tick={{ fontSize: 14 }}>
          <Label value={labelY} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 16 }} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={COLORS[0]}
          strokeWidth={3}
          dot={{ r: 4, stroke: COLORS[0], strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 7 }}
          name={labelY}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineChartIndicadores;
