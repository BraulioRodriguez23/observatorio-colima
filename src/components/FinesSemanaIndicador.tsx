import React, { useState, useEffect } from "react";
import BarChartIndicadores from "./BarChartIndicadores";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Campos de la tabla de fines de semana largos
export interface FinesSemanaRecord {
  id: number;
  year: number;
  fin: string;
  municipio: string;
  ocupacion: number;
  oferta_cuartos: number;
  cuartos_ocupados: number;
  cuartos_disponibles: number;
  estadia: number;
  densidad: number;
  noches: number;
  turistas_noche: number;
  gasto_promedio: number;
  derrama: number;
  afluencia: number;
  [key: string]: string | number;
}

const INDICADORES = [
  { label: "Tasa de ocupación", value: "ocupacion" },
  { label: "Oferta cuartos", value: "oferta_cuartos" },
  { label: "Cuartos ocupados", value: "cuartos_ocupados" },
  { label: "Cuartos disponibles", value: "cuartos_disponibles" },
  { label: "Estadía promedio", value: "estadia" },
  { label: "Densidad ocupación", value: "densidad" },
  { label: "Noches", value: "noches" },
  { label: "Turistas noche", value: "turistas_noche" },
  { label: "Gasto promedio diario", value: "gasto_promedio" },
  { label: "Derrama económica", value: "derrama" },
  { label: "Afluencia turística", value: "afluencia" },
];

const FinesSemanaIndicador: React.FC = () => {
  const [data, setData] = useState<FinesSemanaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros locales
  const [anio, setAnio] = useState<string>("");
  const [fin, setFin] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [indicador, setIndicador] = useState<string>(INDICADORES[0].value);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/info-injection`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then((rawData) => {
        const mapped: FinesSemanaRecord[] = rawData.map((d: unknown) => {
          const record = d as Record<string, unknown>;
          return {
            id: record.id as number,
            year: record.year as number,
            fin: (record.bridgeName ?? record.fin ?? "") as string,
            municipio: record.municipality as string,
            ocupacion: record.occupancyRate as number,
            oferta_cuartos: record.roomOffer as number,
            cuartos_ocupados: record.occupiedRooms as number,
            cuartos_disponibles: (record.availableBeds ?? record.availableRooms ?? 0) as number,
            estadia: record.stay as number,
            densidad: record.density as number,
            noches: (record.nights ?? 3) as number,
            turistas_noche: record.touristsPerNight as number,
            gasto_promedio: (record.gpd ?? record.avgSpending ?? 0) as number,
            derrama: record.economicImpact as number,
            afluencia: record.touristFlow as number,
          };
        });
        setData(mapped);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const anios = [...new Set(data.map(d => d.year))].sort();
  const fines = anio ? [...new Set(data.filter(d => d.year === Number(anio)).map(d => d.fin))] : [];
  const municipios = [...new Set(data.map(d => d.municipio))];

  // Filtrado
  let dataFiltrada = data;
  if (anio) dataFiltrada = dataFiltrada.filter(d => d.year === Number(anio));
  if (fin) dataFiltrada = dataFiltrada.filter(d => d.fin === fin);
  if (municipio) dataFiltrada = dataFiltrada.filter(d => d.municipio === municipio);

  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(dataFiltrada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FinesSemana");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "fines_semana_indicadores.xlsx");
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-white rounded-xl p-8 shadow h-[600px] flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Fines de Semana Largos</h2>
        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataFiltrada.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay datos.</div>
        ) : (
          <BarChartIndicadores
            data={dataFiltrada}
            dataKey={indicador}
            xKey="municipio"
            labelX="Municipio"
            labelY={INDICADORES.find(i => i.value === indicador)?.label || ""}
            barLabel={INDICADORES.find(i => i.value === indicador)?.label || ""}
          />
        )}
      </div>
      <aside className="w-full md:w-80 bg-white rounded-xl shadow p-6 h-fit">
        <h3 className="text-xl font-semibold mb-4">Filtros Fines de Semana</h3>
        <select className="w-full mb-4" value={anio} onChange={e => setAnio(e.target.value)}>
          <option value="">Todos los años</option>
          {anios.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="w-full mb-4" value={fin} onChange={e => setFin(e.target.value)} disabled={!anio}>
          <option value="">Todos los fines de semana</option>
          {fines.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select className="w-full mb-4" value={municipio} onChange={e => setMunicipio(e.target.value)}>
          <option value="">Todos los municipios</option>
          {municipios.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="w-full mb-4" value={indicador} onChange={e => setIndicador(e.target.value)}>
          {INDICADORES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>
        <button className="w-full bg-green-500 text-white py-2 rounded-lg" onClick={exportToExcel}>Exportar a Excel</button>
      </aside>
    </div>
  );
};

export default FinesSemanaIndicador;
