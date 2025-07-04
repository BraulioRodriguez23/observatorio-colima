import React, { useState, useEffect } from "react";
import LineChartIndicadores from "./LineChartIndicadores";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const INDICADORES = [
  { label: "% Ocupación", value: "occupancyRate" },
  { label: "Derrama económica", value: "economicImpact" },
  { label: "Afluencia turística", value: "touristFlow" },
];

const temporadaAbreviada = (nombre: string) => {
  const dict = {
    "Semana santa y pascua": "S. Santa",
    "Semana santa": "S. Santa",
    "Verano": "Verano",
    "Septiembre": "Sept",
    "Noviembre": "Nov",
    "Diciembre": "Dic",
    "Invierno": "Inv.",
  } as const;
  return (dict as Record<string, string>)[nombre] || nombre.split(" ")[0];
};

type TemporadaData = {
  municipality?: string;
  season?: string;
  año?: number;
  year?: number;
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
  [key: string]: unknown;
};

const TemporadaIndicador = () => {
  const [data, setData] = useState<TemporadaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [indicador, setIndicador] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [temporada, setTemporada] = useState("");
  const [añoInicio, setAñoInicio] = useState("");
  const [añoFin, setAñoFin] = useState("");

  const [filtros, setFiltros] = useState({
    indicador: "",
    municipio: "",
    temporada: "",
    añoInicio: "",
    añoFin: "",
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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const municipios = [...new Set(data.map(d => d.municipality).filter(Boolean))];
  const temporadas = [...new Set(data.map(d => d.season).filter(Boolean))];
  const años = [
    ...new Set(
      data.map(d => Number(d.año ?? d.year)).filter(x => !isNaN(x))
    ),
  ].sort((a, b) => Number(a) - Number(b));

  const dataFiltrada = data.filter(d => {
    const municipioOK = !filtros.municipio || d.municipality === filtros.municipio;
    const temporadaOK = !filtros.temporada || d.season === filtros.temporada;
    const añoDato = Number(d.año ?? d.year);
    let añoOK = true;
    if (filtros.añoInicio && filtros.añoFin) {
      añoOK = añoDato >= Number(filtros.añoInicio) && añoDato <= Number(filtros.añoFin);
    } else if (filtros.añoInicio) {
      añoOK = añoDato >= Number(filtros.añoInicio);
    } else if (filtros.añoFin) {
      añoOK = añoDato <= Number(filtros.añoFin);
    }
    return municipioOK && temporadaOK && añoOK;
  });

  const dataFiltradaConCorto = dataFiltrada.map(d => ({
    ...d,
    temporadaCorta: temporadaAbreviada(d.season ?? ""),
    temporadaCompleta: `${d.season} ${d.año ?? d.year}`,
    occupancyRate:
      typeof d.occupancyRate === "number" && d.occupancyRate > 100 && d.occupancyRate < 1000
        ? Math.floor(Number(d.occupancyRate) / 10)
        : typeof d.occupancyRate === "number" && d.occupancyRate >= 1000
        ? Math.floor(Number(d.occupancyRate) / 100)
        : d.occupancyRate
  }));

function exportToExcel() {
  const indicadorSeleccionado = filtros.indicador as keyof TemporadaData;

  if (!indicadorSeleccionado) {
    alert("Seleccione un indicador para exportar.");
    return;
  }

  const etiqueta = INDICADORES.find(i => i.value === indicadorSeleccionado)?.label || indicadorSeleccionado;

  const datosFiltrados = dataFiltradaConCorto.map((fila) => ({
    Año: fila.año ?? fila.year,
    Municipio: fila.municipality,
    Temporada: fila.season,
    [etiqueta]: (fila as Record<string, unknown>)[indicadorSeleccionado]
  }));

  const ws = XLSX.utils.json_to_sheet(datosFiltrados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Temporadas");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), `temporadas_${indicadorSeleccionado}.xlsx`);
}



  function handleAplicarFiltro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFiltros({ indicador, municipio, temporada, añoInicio, añoFin });
  }

  interface Filtros {
    indicador: string;
    municipio: string;
    temporada: string;
    añoInicio: string;
    añoFin: string;
  }

  function handleResetFiltro(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setIndicador("");
    setMunicipio("");
    setTemporada("");
    setAñoInicio("");
    setAñoFin("");
    setFiltros({
      indicador: "",
      municipio: "",
      temporada: "",
      añoInicio: "",
      añoFin: "",
    } as Filtros);
  }

  function getTituloGrafica() {
    const indLabel = INDICADORES.find(i => i.value === filtros.indicador)?.label || "";
    let añoTxt = "";
    const añosUnicos = [
      ...new Set(dataFiltrada.map(d => Number(d.año ?? d.year)).filter(Boolean))
    ].sort((a, b) => a - b);
    if (añosUnicos.length) {
      if (añosUnicos.length === 1) añoTxt = `(${añosUnicos[0]})`;
      else añoTxt = `(${añosUnicos[0]} - ${añosUnicos[añosUnicos.length - 1]})`;
    }
    return `Evolución del indicador "${indLabel}"` +
      (filtros.municipio ? " en " + filtros.municipio : "") +
      " " + añoTxt;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* GRÁFICA */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col justify-center mx-auto" style={{ maxWidth: "1100px" }}>
        <h2 className="text-4xl font-bold text-center text-pink-600 mb-8">Temporadas vacacionales</h2>
        {loading ? (
          <div className="text-center py-20">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : dataFiltradaConCorto.length === 0 || !filtros.indicador ? (
          <div className="text-center text-gray-500 py-10">
            No hay valores válidos para este indicador en las temporadas seleccionadas.
          </div>
        ) : (
          <LineChartIndicadores
            data={dataFiltradaConCorto}
            dataKey={filtros.indicador}
            xKey="temporadaCorta"
            labelX="Temporada"
            labelY={INDICADORES.find(i => i.value === filtros.indicador)?.label || ""}
            titulo={getTituloGrafica()}
          />
        )}
      </div>
      {/* FILTROS */}
      <aside className="w-full md:w-96 bg-white rounded-xl shadow-lg p-8 h-fit mt-8 md:mt-0">
        <h3 className="text-2xl font-bold mb-5 text-gray-700">Filtrar datos</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAplicarFiltro}>
          {/* Indicador */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold text-black">Indicador</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={indicador}
              onChange={e => setIndicador(e.target.value)}
            >
              <option value="">Seleccione</option>
              {INDICADORES.map(i => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          {/* Temporada */}
          <div>
            <label className="block mb-1 font-semibold text-black">Temporada</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={temporada}
              onChange={e => setTemporada(e.target.value)}
            >
              <option value="">Todas</option>
              {temporadas.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {/* Municipio */}
          <div>
            <label className="block mb-1 font-semibold text-black">Municipio</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
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
          {/* Año inicio */}
          <div>
            <label className="block mb-1 font-semibold text-black">Año inicio</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={añoInicio}
              onChange={e => setAñoInicio(e.target.value)}
            >
              <option value="">--</option>
              {años.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          {/* Año fin */}
          <div>
            <label className="block mb-1 font-semibold text-black">Año fin</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={añoFin}
              onChange={e => setAñoFin(e.target.value)}
            >
              <option value="">--</option>
              {años.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          {/* Botones */}
          <div className="col-span-1 md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition mb-2"
            >
              Aplicar filtro
            </button>
            <button
              type="button"
              className="w-1/2 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 transition mb-2"
              onClick={handleResetFiltro}
            >
              Limpiar filtros
            </button>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="button"
              className="w-full bg-green-500 text-white font-bold py-2 rounded-lg shadow hover:bg-green-600 transition"
              onClick={exportToExcel}
            >
              Exportar a Excel
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default TemporadaIndicador;
