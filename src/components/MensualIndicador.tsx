import React, { useState, useEffect } from "react";
import LineChartIndicadores from "./LineChartIndicadores"; // 👈 Cambiado
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const INDICADORES = [
  { label: "% Ocupación", value: "occupancyRate" },
 { label: "Derrama Económica", value: "economicImpact" },
  { label: "Afluencia Turística", value: "touristFlow" },
];

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function toDate(mes: string, anio: number) {
  const idx = MESES.findIndex(m => m.toLowerCase() === mes.toLowerCase());
  return new Date(anio, idx, 1);
}

const MensualIndicador: React.FC = () => {
  interface MensualData {
    municipality: string;
    month: string;
    year: number;
    occupancyRate?: number;
    roomOffer?: number;
    touristFlow?: number;
    [key: string]: string | number | undefined;
  }
  
  const [data, setData] = useState<MensualData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros controlados
  const [indicador, setIndicador] = useState(INDICADORES[0].value);
  const [municipio, setMunicipio] = useState<string>("");
  const [mesInicio, setMesInicio] = useState<string>("Enero");
  const [anioInicio, setAnioInicio] = useState<number>(2021);
  const [mesFin, setMesFin] = useState<string>("Diciembre");
  const [anioFin, setAnioFin] = useState<number>(2024);

  const [filtros, setFiltros] = useState({
    indicador: INDICADORES[0].value,
    municipio: "",
    mesInicio: "Enero",
    anioInicio: 2021,
    mesFin: "Diciembre",
    anioFin: 2024,
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/monthly-stats`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then(rawData => setData(rawData))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const municipios = [...new Set(data.map(d => d.municipality).filter(Boolean))];
  const anios = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

  const fechaIni = toDate(filtros.mesInicio, filtros.anioInicio);
  const fechaFin = toDate(filtros.mesFin, filtros.anioFin);

  // Filtro de datos
  const dataFiltrada = data
    .filter(d => {
      if (!d.month || !d.year) return false;
      const f = toDate(d.month, d.year);
      const municipioOK = !filtros.municipio || d.municipality === filtros.municipio;
      return f >= fechaIni && f <= fechaFin && municipioOK;
    })
    // Ordena por año y mes (importante para las líneas)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return MESES.indexOf(a.month) - MESES.indexOf(b.month);
    });

  function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(dataFiltrada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mensual");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "indicadores_mensual.xlsx");
  }

  function handleAplicarFiltro() {
    setFiltros({
      indicador,
      municipio,
      mesInicio,
      anioInicio,
      mesFin,
      anioFin,
    });
  }
  function handleResetFiltro() {
    setIndicador(INDICADORES[0].value);
    setMunicipio("");
    setMesInicio("Enero");
    setAnioInicio(2021);
    setMesFin("Diciembre");
    setAnioFin(2024);
    setFiltros({
      indicador: INDICADORES[0].value,
      municipio: "",
      mesInicio: "Enero",
      anioInicio: 2021,
      mesFin: "Diciembre",
      anioFin: 2024,
    });
  }

  // Crea un eje X amigable (Mes/Año)
  const dataParaGrafica = dataFiltrada.map(d => ({
    ...d,
    mesAnio: `${d.month} ${d.year}`
  }));

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* GRÁFICA */}
      <div className="flex-1 bg-white rounded-xl p-6 shadow h-fit min-h-[500px] flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">Indicador Turístico</h2>
        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataParaGrafica.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay datos para este filtro.</div>
        ) : (
          <LineChartIndicadores
            data={dataParaGrafica}
            dataKey={filtros.indicador}
            xKey="mesAnio"
            labelX="Mes/Año"
            labelY={INDICADORES.find(i => i.value === filtros.indicador)?.label || ""}
          />
        )}
      </div>
      {/* FILTROS */}
      <aside className="w-full md:w-96 bg-white rounded-xl shadow-lg p-8 h-fit mt-8 md:mt-0 text-gray-800">
        <h3 className="text-2xl font-bold mb-5 text-gray-700">Filtrar datos</h3>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Municipio</label>
          <select className="w-full border px-3 py-2 rounded" value={municipio} onChange={e => setMunicipio(e.target.value)}>
            <option value="">Todos</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Indicador</label>
          <select className="w-full border px-3 py-2 rounded" value={indicador} onChange={e => setIndicador(e.target.value)}>
            {INDICADORES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Fecha de inicio</label>
          <div className="flex gap-2">
            <select className="border px-2 py-1 rounded" value={mesInicio} onChange={e => setMesInicio(e.target.value)}>
              {MESES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="border px-2 py-1 rounded" value={anioInicio} onChange={e => setAnioInicio(Number(e.target.value))}>
              {anios.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Fecha de fin</label>
          <div className="flex gap-2">
            <select className="border px-2 py-1 rounded" value={mesFin} onChange={e => setMesFin(e.target.value)}>
              {MESES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="border px-2 py-1 rounded" value={anioFin} onChange={e => setAnioFin(Number(e.target.value))}>
              {anios.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
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

export default MensualIndicador;
