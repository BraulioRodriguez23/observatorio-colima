import React, { useState, useEffect } from "react";
import BarChartIndicadores from "./BarChartIndicadores";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// --- INDICADORES DISPONIBLES --- //
const INDICADORES = [
  { label: "Tasa de ocupación", value: "occupancy_rate" },
  { label: "Oferta cuartos", value: "room_offer" },
  { label: "Cuartos ocupados", value: "occupied_rooms" },
  { label: "Cuartos disponibles", value: "available_rooms" },
  { label: "Estadía promedio", value: "average_stay" },
  { label: "Densidad ocupación", value: "occupancy_density" },
  { label: "Noches", value: "nights" },
  { label: "Turistas noche", value: "tourists_per_night" },
  { label: "Gasto promedio diario", value: "daily_avg_spending" },
  { label: "Derrama económica", value: "economic_impact" },
  { label: "Afluencia turística", value: "tourist_flow" },
];

// --- INTERFAZ DE DATOS --- //
interface FinesSemanaRecord {
  id: number;
  year: number;
  bridge_name: string;
  municipality: string;
  occupancy_rate: number;
  room_offer: number;
  occupied_rooms: number;
  available_rooms: number;
  average_stay: number;
  occupancy_density: number;
  nights: number;
  tourists_per_night: number;
  daily_avg_spending: number;
  economic_impact: number;
  tourist_flow: number;
  [key: string]: string | number;
}

// --- COMPONENTE PRINCIPAL --- //
const FinesSemanaIndicador: React.FC = () => {
  const [data, setData] = useState<FinesSemanaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ESTADO DE FILTROS --- //
  const [indicador, setIndicador] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [fin, setFin] = useState<string>("");
  const [anio, setAnio] = useState<string>("");

  const [filtros, setFiltros] = useState({
    indicador: "",
    municipio: "",
    fin: "",
    anio: "",
  });

  // --- CARGA DE DATOS --- //
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/long-weekend-stats`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then((rawData: FinesSemanaRecord[]) => setData(rawData))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // --- LISTAS ÚNICAS PARA FILTROS --- //
  const anios = [...new Set(data.map(d => d.year))].sort((a, b) => a - b);
  const fines = filtros.anio
    ? [
        ...new Set(
          data
            .filter(d => d.year === Number(filtros.anio))
            .map(d => d.bridge_name)
        ),
      ]
    : [...new Set(data.map(d => d.bridge_name))];
  const municipios = [...new Set(data.map(d => d.municipality))];

  // --- FILTRADO DE DATOS --- //
  const dataFiltrada = data.filter(d => {
    const filtroAnio = !filtros.anio || d.year === Number(filtros.anio);
    const filtroFin = !filtros.fin || d.bridge_name === filtros.fin;
    const filtroMunicipio = !filtros.municipio || d.municipality === filtros.municipio;
    return filtroAnio && filtroFin && filtroMunicipio;
  });

  // --- EXPORTAR A EXCEL --- //
  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(dataFiltrada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FinesSemana");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "fines_semana_indicadores.xlsx"
    );
  }

  // --- ACCIONES DE FILTROS --- //
  function handleAplicarFiltro() {
    setFiltros({ indicador, municipio, fin, anio });
  }
  function handleResetFiltro() {
    setIndicador("");
    setMunicipio("");
    setFin("");
    setAnio("");
    setFiltros({ indicador: "", municipio: "", fin: "", anio: "" });
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      <div className="flex-1 bg-white rounded-xl p-8 shadow h-[600px] flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Fines de Semana Largos
        </h2>

        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataFiltrada.length === 0 || !filtros.indicador ? (
          <div className="text-center text-gray-500 py-10">
            No hay datos para este filtro.
          </div>
        ) : (
          <BarChartIndicadores
            data={dataFiltrada}
            dataKey={filtros.indicador}
            xKey="municipality"
            labelX="Municipio"
            labelY={
              INDICADORES.find(i => i.value === filtros.indicador)?.label || ""
            }
            barLabel={
              INDICADORES.find(i => i.value === filtros.indicador)?.label || ""
            }
          />
        )}
      </div>

      <aside className="w-full md:w-80 bg-white rounded-xl shadow p-6 h-fit">
        <h3 className="text-xl font-semibold mb-4">Filtros Fines de Semana</h3>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Año</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={anio}
            onChange={e => setAnio(e.target.value)}
          >
            <option value="">Todos los años</option>
            {anios.map(a => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Fin de semana</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={fin}
            onChange={e => setFin(e.target.value)}
          >
            <option value="">Todos</option>
            {fines.map(fv => (
              <option key={fv} value={fv}>
                {fv}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Municipio</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
          >
            <option value="">Todos</option>
            {municipios.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Indicador</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={indicador}
            onChange={e => setIndicador(e.target.value)}
          >
            <option value="">Selecciona un indicador</option>
            {INDICADORES.map(i => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAplicarFiltro}
            className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            Aplicar
          </button>
          <button
            onClick={handleResetFiltro}
            className="flex-1 border border-pink-600 text-pink-600 py-2 rounded hover:bg-pink-50"
          >
            Reiniciar
          </button>
        </div>

        <button
          onClick={exportToExcel}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Exportar a Excel
        </button>
      </aside>
    </div>
  );
};

export default FinesSemanaIndicador;
