import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = ["#EF476F", "#118AB2", "#06D6A0", "#FFD166", "#073B4C"];

const formatNumber = (num: number | null | undefined) =>
  typeof num === "number"
    ? num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "--";

import type { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-xl shadow-lg bg-white px-4 py-3 border border-gray-200 min-w-[180px]">
      <div className="font-bold text-gray-800 text-base mb-1">{row.temporadaCompleta || row.mesAnio || row.season}</div>
      <div className="text-gray-600 text-sm">
        {row.municipality && (<><b>Municipio:</b> {row.municipality}<br /></>)}
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
  temporadaCompleta?: string;
  mesAnio?: string;
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

// Obtiene el rango min-max automático de los valores numéricos, con un pequeño margen visual
function getDomain(data: ChartData[], dataKey: string): [number, number] {
  const nums = data.map(d => Number(d[dataKey])).filter(v => isFinite(v));
  if (!nums.length) return [0, 1];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === max) return [0, max === 0 ? 1 : max * 1.1];
  // deja un 10% extra arriba y abajo si es posible
  return [Math.floor(min - (max - min) * 0.1), Math.ceil(max + (max - min) * 0.1)];
}

const LineChartIndicadores: React.FC<Props> = ({
  data,
  dataKey,
  xKey,
  labelX,
  labelY,
  titulo = "Evolución por Temporada"
}) => {
  const domain = getDomain(data, dataKey);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-center text-pink-700 mb-2">{titulo}</h2>
      <ResponsiveContainer width="100%" height={470}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 3" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 14 }}
            interval="preserveStartEnd"
            minTickGap={18}
          >
            <Label value={labelX} offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis
            domain={domain}
            tick={{ fontSize: 14 }}
          >
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
};

export default LineChartIndicadores;
