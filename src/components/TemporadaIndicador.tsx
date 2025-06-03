import React, { useState, useEffect } from "react";
import BarChartIndicadores from "./BarChartIndicadores";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const INDICADORES = [
  { label: "% Ocupación", value: "occupancyRate" },
  { label: "Oferta Cuartos", value: "roomOffer" },
  { label: "Cuartos Ocupados", value: "occupiedRooms" },
  { label: "Ctos. Disp.", value: "availableRooms" },
  { label: "Estadía", value: "stay" },
  { label: "Densidad", value: "density" },
  { label: "Turistas Noche", value: "touristsPerNight" },
  { label: "Gasto promedio por persona", value: "avgSpending" },
  { label: "Derrama Económica", value: "economicImpact" },
  { label: "Afluencia Turística", value: "touristFlow" },
];

const TemporadaIndicador: React.FC = () => {
  interface TemporadaData {
    municipality: string;
    season: string;
    occupancyRate?: number;
    roomOffer?: number;
    occupiedRooms?: number;
    availableRooms?: number;
    stay?: number;
    density?: number;
    touristsPerNight?: number;
    avgSpending?: number;
    economicImpact?: number;
    touristFlow?: number;
    [key: string]: string | number | undefined;
  }
  
    const [data, setData] = useState<TemporadaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [indicador, setIndicador] = useState(INDICADORES[0].value);
  const [municipio, setMunicipio] = useState<string>("");
  const [temporada, setTemporada] = useState<string>("");

  const [filtros, setFiltros] = useState({
    indicador: INDICADORES[0].value,
    municipio: "",
    temporada: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/season-stats`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then(rawData => setData(rawData))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const municipios = [...new Set(data.map(d => d.municipality).filter(Boolean))];
  const temporadas = [...new Set(data.map(d => d.season).filter(Boolean))];

  const dataFiltrada = data.filter(d => {
    const municipioOK = !filtros.municipio || d.municipality === filtros.municipio;
    const temporadaOK = !filtros.temporada || d.season === filtros.temporada;
    return municipioOK && temporadaOK;
  });

  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(dataFiltrada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Temporadas");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "temporadas_indicadores.xlsx");
  }

  function handleAplicarFiltro() {
    setFiltros({
      indicador,
      municipio,
      temporada,
    });
  }
  function handleResetFiltro() {
    setIndicador(INDICADORES[0].value);
    setMunicipio("");
    setTemporada("");
    setFiltros({
      indicador: INDICADORES[0].value,
      municipio: "",
      temporada: "",
    });
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-white rounded-xl p-10 shadow h-[680px] flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-8">Temporadas Vacacionales</h2>
        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataFiltrada.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay datos para este filtro.</div>
        ) : (
          <BarChartIndicadores
            data={dataFiltrada}
            dataKey={filtros.indicador}
            xKey="season"
            labelX="Temporada"
            labelY={INDICADORES.find(i => i.value === filtros.indicador)?.label || ""}
            barLabel={INDICADORES.find(i => i.value === filtros.indicador)?.label || ""}
          />
        )}
      </div>
      {/* FILTROS */}
      <aside className="w-full md:w-96 bg-white rounded-xl shadow-lg p-8 h-fit mt-8 md:mt-0">
        <h3 className="text-2xl font-bold mb-5 text-gray-700">Filtrar datos</h3>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Municipio</label>
          <select className="w-full border px-3 py-2 rounded" value={municipio} onChange={e => setMunicipio(e.target.value)}>
            <option value="">Todos</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Temporada</label>
          <select className="w-full border px-3 py-2 rounded" value={temporada} onChange={e => setTemporada(e.target.value)}>
            <option value="">Todas</option>
            {temporadas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Indicador</label>
          <select className="w-full border px-3 py-2 rounded" value={indicador} onChange={e => setIndicador(e.target.value)}>
            {INDICADORES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition mb-3"
          onClick={handleAplicarFiltro}>
          Aplicar filtro
        </button>
        <button className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 transition mb-3"
          onClick={handleResetFiltro}>
          Limpiar filtros
        </button>
        <button className="w-full bg-green-500 text-white font-bold py-2 rounded-lg shadow hover:bg-green-600 transition"
          onClick={exportToExcel}>
          Exportar a Excel
        </button>
      </aside>
    </div>
  );
};

export default TemporadaIndicador;
