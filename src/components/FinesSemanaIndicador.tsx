import React, { useState, useEffect } from "react";
import LineChartIndicadores from "./LineChartIndicadores";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// --- INDICADORES DISPONIBLES --- //
const INDICADORES = [
  { label: "% Ocupación", value: "occupancy_rate" },
  { label: "Derrama económica", value: "economic_impact" },
  { label: "Afluencia turística", value: "tourist_flow" },
];

// --- LIMPIADOR SOLO PARA PORCENTAJE ---
function sanitizeOccupancyRate(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num < 0) return 0;
  if (num > 100 && num < 1000) return +(num / 10).toFixed(2);
  if (num >= 1000) return +(num / 100).toFixed(2);
  return +num.toFixed(2);
}

// --- INTERFAZ DE DATOS --- //
interface FinesSemanaRecord {
  id: number;
  year: number;
  bridge_name: string;
  municipality: string;
  occupancy_rate: number | null;
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
  [key: string]: string | number | null;
}

const FinesSemanaIndicadorLineal: React.FC = () => {
  const [data, setData] = useState<FinesSemanaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ESTADO DE FILTROS --- //
  const [indicador, setIndicador] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [fin, setFin] = useState<string>("");
  const [anioInicio, setAnioInicio] = useState<string>("");
  const [anioFin, setAnioFin] = useState<string>("");

  const [filtros, setFiltros] = useState({
    indicador: "",
    municipio: "",
    fin: "",
    anioInicio: "",
    anioFin: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/long-weekend-stats`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then((rawData: FinesSemanaRecord[]) => {
        // Limpieza solo del campo porcentaje
        const cleanData = rawData.map(d => ({
          ...d,
          occupancy_rate: sanitizeOccupancyRate(d.occupancy_rate),
        }));
        setData(cleanData);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // --- LISTAS ÚNICAS PARA FILTROS --- //
  const anios = [
    ...new Set(data.map(d => d.year).filter(x => !!x))
  ].sort((a, b) => a - b);
  const fines = filtros.anioInicio
    ? [
        ...new Set(
          data
            .filter(d => d.year === Number(filtros.anioInicio))
            .map(d => d.bridge_name)
        ),
      ]
    : [...new Set(data.map(d => d.bridge_name))];
  const municipios = [...new Set(data.map(d => d.municipality))];

  // --- FILTRADO DE DATOS --- //
  const dataFiltrada = data.filter(d => {
    const añoOK =
      (!filtros.anioInicio || d.year >= Number(filtros.anioInicio)) &&
      (!filtros.anioFin || d.year <= Number(filtros.anioFin));
    const filtroFin = !filtros.fin || d.bridge_name === filtros.fin;
    const filtroMunicipio = !filtros.municipio || d.municipality === filtros.municipio;
    return añoOK && filtroFin && filtroMunicipio;
  });

  // --- Prepara los datos para la gráfica: eje X = fin de semana largo + año --- //
  const dataParaGrafica = dataFiltrada
    .map(d => ({
      ...d,
      finAnio: `${d.bridge_name} ${d.year}`,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.bridge_name.localeCompare(b.bridge_name);
    });

  // --- EXPORTAR A EXCEL --- //
  function exportToExcel() {
    const indicadorSeleccionado = filtros.indicador as keyof FinesSemanaRecord;

    if (!indicadorSeleccionado) {
      alert("Seleccione un indicador para exportar.");
      return;
    }

    const etiqueta = INDICADORES.find(i => i.value === indicadorSeleccionado)?.label || indicadorSeleccionado;

    const dataLimpia = dataParaGrafica.map(obj => ({
      Año: obj.year,
      Municipio: obj.municipality,
      "Fin de semana largo": obj.bridge_name,
      [etiqueta]: (obj as FinesSemanaRecord)[indicadorSeleccionado]
    }));

    const ws = XLSX.utils.json_to_sheet(dataLimpia);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FinesSemanaLineal");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `fines_semana_${indicadorSeleccionado}.xlsx`
    );
  }

  // --- ACCIONES DE FILTROS --- //
  function handleAplicarFiltro() {
    setFiltros({
      indicador,
      municipio,
      fin,
      anioInicio,
      anioFin,
    });
  }
  function handleResetFiltro() {
    setIndicador("");
    setMunicipio("");
    setFin("");
    setAnioInicio("");
    setAnioFin("");
    setFiltros({ indicador: "", municipio: "", fin: "", anioInicio: "", anioFin: "" });
  }

  function getTituloGrafica() {
    const indLabel = INDICADORES.find(i => i.value === filtros.indicador)?.label || "";
    let añoTxt = "";
    const añosUnicos = [
      ...new Set(dataParaGrafica.map(d => d.year).filter(Boolean))
    ].sort((a, b) => a - b);
    if (añosUnicos.length) {
      if (añosUnicos.length === 1) añoTxt = `(${añosUnicos[0]})`;
      else añoTxt = `(${añosUnicos[0]} - ${añosUnicos[añosUnicos.length - 1]})`;
    }
    return `Evolución "${indLabel}" en Fines de Semana Largos ${añoTxt}`;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      <div className="flex-1 bg-white rounded-xl p-8 shadow h-[600px] flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Fines de semana largos 
        </h2>
   
        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataParaGrafica.length === 0 || !filtros.indicador ? (
          <div className="text-center text-gray-500 py-10">
            No hay datos para este filtro.
          </div>
        ) : (
          <LineChartIndicadores
            data={dataParaGrafica}
            dataKey={filtros.indicador}
            xKey="finAnio"
            labelX="Fin de Semana Largo"
            labelY={INDICADORES.find(i => i.value === filtros.indicador)?.label || ""}
            titulo={getTituloGrafica()}
          />
        )}
      </div>

      <aside className="w-full md:w-auto bg-white rounded-xl shadow p-6 h-fit">
        <h3 className="text-xl font-semibold mb-4 text-black">Filtros fines de semana</h3>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-black ">Indicador</label>
          <select
            className="w-full border px-3 py-2 rounded text-black"
            value={indicador}
            onChange={e => setIndicador(e.target.value)}
          >
            <option value="">Seleccione un indicador</option>
            {INDICADORES.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex gap-2">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold text-black">Año inicio</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={anioInicio}
              onChange={e => setAnioInicio(e.target.value)}
            >
              <option value="">Seleccione</option>
              {anios.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-semibold text-black">Año fin</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={anioFin}
              onChange={e => setAnioFin(e.target.value)}
            >
              <option value="">Seleccione</option>
              {anios.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-black">Fines de semana largos</label>
          <select
              className="border px-3 py-2 rounded text-black"
              value={fin}
              onChange={e => setFin(e.target.value)}
            >
              <option value="">Seleccione</option>
              {fines.map(fv => (
                <option key={fv} value={fv}>{fv}</option>
              ))}
            </select>

        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-black">Municipio</label>
          <select
            className="w-full border px-3 py-2 rounded text-black"
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
          >
            <option value="">Seleccione</option>
            {municipios.map(m => (
              <option key={m} value={m}>{m}</option>
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

export default FinesSemanaIndicadorLineal;
