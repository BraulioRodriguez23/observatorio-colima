import React, { useState, useEffect } from "react";
import LineChartIndicadores from "./LineChartIndicadores";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const INDICADORES = [
  { label: "% Ocupación", value: "occupancyRate" },
  { label: "Derrama económica", value: "economicImpact" },
  { label: "Afluencia turística", value: "touristFlow" },
];

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface MensualData {
  municipality: string;
  month: string;
  year: number;
  occupancyRate?: number;
  economicImpact?: number;
  touristFlow?: number;
  [key: string]: string | number | undefined;
}

function toDate(mes: string, anio: number) {
  const idx = MESES.findIndex(m => m.toLowerCase() === mes.toLowerCase());
  return new Date(anio, idx, 1);
}

const MensualIndicador: React.FC = () => {
  const [data, setData] = useState<MensualData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [indicador, setIndicador] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [mesInicio, setMesInicio] = useState<string>("Enero");
  const [anioInicio, setAnioInicio] = useState<number>(2021);
  const [mesFin, setMesFin] = useState<string>("Diciembre");
  const [anioFin, setAnioFin] = useState<number>(2024);

  const [filtros, setFiltros] = useState({
    indicador: "",
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
      .then((rawData: MensualData[]) => {
        setData(rawData);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const municipios = [...new Set(data.map(d => d.municipality).filter(Boolean))];
  const anios = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);

  const fechaIni = toDate(filtros.mesInicio, filtros.anioInicio);
  const fechaFin = toDate(filtros.mesFin, filtros.anioFin);

  const dataFiltrada = data
    .filter((d) => {
      if (!d.month || !d.year) return false;
      const f = toDate(d.month, d.year);
      const municipioOK = !filtros.municipio || d.municipality === filtros.municipio;
      return f >= fechaIni && f <= fechaFin && municipioOK;
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return MESES.indexOf(a.month) - MESES.indexOf(b.month);
    })
    .map((d) => ({
      ...d,
      mesAnio: `${d.month} ${d.year}`,
    }));

  function exportToExcel() {
    const indicadorSeleccionado = filtros.indicador as keyof MensualData;
    if (!indicadorSeleccionado) {
      alert("Por favor, seleccione un indicador para exportar.");
      return;
    }
    const etiqueta = INDICADORES.find(i => i.value === indicadorSeleccionado)?.label || indicadorSeleccionado;
    const dataLimpia = dataFiltrada.map(obj => ({
      Año: obj.year,
      Municipio: obj.municipality,
      Mes: obj.month,
      [etiqueta]: (obj as MensualData)[indicadorSeleccionado] ?? "N/A"
    }));

    const ws = XLSX.utils.json_to_sheet(dataLimpia);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "IndicadoresMensuales");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `mensual_${indicadorSeleccionado}.xlsx`
    );
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
    setIndicador("");
    setMunicipio("");
    setMesInicio("Enero");
    setAnioInicio(2021);
    setMesFin("Diciembre");
    setAnioFin(2024);
    setFiltros({
      indicador: "",
      municipio: "",
      mesInicio: "Enero",
      anioInicio: 2021,
      mesFin: "Diciembre",
      anioFin: 2024,
    });
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      <div className="flex-1 bg-white rounded-xl p-6 shadow h-fit min-h-[500px] flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">Indicador turístico</h2>
        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataFiltrada.length === 0 || !filtros.indicador ? (
          <div className="text-center text-gray-500 py-10">No hay datos para este filtro.</div>
        ) : (
          
          <LineChartIndicadores
            data={dataFiltrada}
            dataKey={filtros.indicador}
            xKey="mesAnio"
            labelX="Mes"
            labelY={INDICADORES.find(i => i.value === filtros.indicador)?.label || ""}
            titulo="Evolución por Mes"
          />
        )}
      </div>
      <aside className="w-full md:w-96 bg-white rounded-xl shadow-lg p-8 h-fit mt-8 md:mt-0 text-gray-800">
        <h3 className="text-2xl font-bold mb-5 text-gray-700">Filtrar datos</h3>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Indicador</label>
          <select className="w-full border px-3 py-2 rounded" value={indicador} onChange={e => setIndicador(e.target.value)}>
            <option value="">Seleccione</option>
            {INDICADORES.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Municipio</label>
          <select className="w-full border px-3 py-2 rounded" value={municipio} onChange={e => setMunicipio(e.target.value)}>
            <option value="">Seleccione</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
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
        <button
          onClick={exportToExcel}
          className={`w-full bg-green-500 text-white font-bold py-2 rounded-lg shadow hover:bg-green-600 transition`}
        >
          Exportar a Excel
        </button>
      </aside>
    </div>
  );
};

export default MensualIndicador;
