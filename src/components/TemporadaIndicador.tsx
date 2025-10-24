import React, { useState, useEffect } from "react";
import LineChartIndicadores from "./LineChartIndicadores"; // Aquí debe estar la corrección del formato
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const INDICADORES = [
  { label: "% Ocupación", value: "occupancyRate" },
  { label: "Derrama económica", value: "economicImpact" },
  { label: "Afluencia turística", value: "touristFlow" },
];

const normalizarTemporada = (nombre: string = ""): string => {
  const s = nombre.normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (/semana.*santa|pascua|santa\b/.test(s)) return "Semana Santa y Pascua";
  if (/verano/.test(s)) return "Verano";
  if (/invierno/.test(s)) return "Invierno";
  if (/septiembre/.test(s)) return "Septiembre";
  if (/noviembre/.test(s)) return "Noviembre";
  if (/diciembre/.test(s)) return "Diciembre";
  // fallback: capitaliza
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
};

const temporadaAbreviada = (nombre: string) => {
  const dict: Record<string, string> = {
    "Semana Santa y Pascua": "S. Santa",
    "Verano": "Verano",
    "Septiembre": "Sept",
    "Noviembre": "Nov",
    "Diciembre": "Dic",
    "Invierno": "Inv.",
  };
  return dict[nombre] || (nombre ? nombre.split(" ")[0] : nombre);
};

const SEASON_ORDER = [
  "Semana Santa y Pascua",
  "Verano",
  "Septiembre",
  "Noviembre",
  "Diciembre",
  "Invierno",
];

type TemporadaData = {
  municipality: string;
  season: string;
  year: number;
  occupancyRate?: number;
  economicImpact?: number;
  touristFlow?: number;
  seasonCanonical?: string; 
  [key: string]: unknown;
};

// FUNCIÓN DE DESDUPLICACIÓN (mantiene la corrección anterior)
const deduplicateData = (data: TemporadaData[]): TemporadaData[] => {
    const uniqueMap = new Map<string, TemporadaData>();

    data.forEach(d => {
        const canonicalSeason = normalizarTemporada(d.season);
        const uniqueKey = `${d.municipality}-${canonicalSeason}-${d.year}`;
        
        if (!uniqueMap.has(uniqueKey)) {
            uniqueMap.set(uniqueKey, {
                ...d,
                seasonCanonical: canonicalSeason,
            });
        }
    });

    return Array.from(uniqueMap.values());
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

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    indicador: "",
    municipio: "",
    temporada: "",
    añoInicio: "",
    añoFin: "",
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/season-stats`;
    if (!apiUrl) {
        setError("Error de configuración: La URL de la API no está definida.");
        setLoading(false);
        return;
    }

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then((rawData: TemporadaData[]) => {
        // Aplicar desduplicación
        const uniqueData = deduplicateData(rawData);
        setData(uniqueData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []); 

  const municipios = [...new Set(data.map(d => d.municipality).filter(Boolean))];
  const temporadas = [...new Set(data.map(d => d.seasonCanonical as string).filter(Boolean))];
  const años = [
    ...new Set(
      data.map(d => Number(d.year)).filter(x => !isNaN(x))
    ),
  ].sort((a, b) => Number(a) - Number(b));

  const dataFiltrada = data.filter(d => {
    const municipioOK = !filtrosAplicados.municipio || d.municipality === filtrosAplicados.municipio;
    const temporadaOK = !filtrosAplicados.temporada || d.seasonCanonical === filtrosAplicados.temporada;
    const añoDato = Number(d.year);
    let añoOK = true;
    if (filtrosAplicados.añoInicio && filtrosAplicados.añoFin) {
      añoOK = añoDato >= Number(filtrosAplicados.añoInicio) && añoDato <= Number(filtrosAplicados.añoFin);
    } else if (filtrosAplicados.añoInicio) {
      añoOK = añoDato >= Number(filtrosAplicados.añoInicio);
    } else if (filtrosAplicados.añoFin) {
      añoOK = añoDato <= Number(filtrosAplicados.añoFin);
    }
    return municipioOK && temporadaOK && añoOK;
  });

  // Asegurar que solo haya un municipio en los datos finales si no se seleccionó uno (mantiene la corrección anterior).
  let dataConUnMunicipio = dataFiltrada;
  const municipiosEnDataFiltrada = [...new Set(dataFiltrada.map(d => d.municipality))].filter(Boolean);
  
  if (!filtrosAplicados.municipio && municipiosEnDataFiltrada.length > 1) {
    const primerMunicipio = municipiosEnDataFiltrada[0];
    dataConUnMunicipio = dataFiltrada.filter(d => d.municipality === primerMunicipio);
  }

  // Ordenamiento
  const dataFiltradaConCorto = dataConUnMunicipio
    .map(d => ({
      ...d,
      seasonCanonical: String(d.seasonCanonical ?? ""),
      temporadaCorta: temporadaAbreviada(String(d.seasonCanonical ?? "")),
      temporadaCompleta: `${String(d.seasonCanonical ?? "")} ${d.year}`,
    }))
    .sort((a, b) => {
        if (a.year !== b.year) {
            return Number(a.year) - Number(b.year);
        }
        const indexA = SEASON_ORDER.indexOf(a.seasonCanonical);
        const indexB = SEASON_ORDER.indexOf(b.seasonCanonical);
        
        if (indexA === -1 || indexB === -1) {
            return a.seasonCanonical.localeCompare(b.seasonCanonical);
        }

        return indexA - indexB;
    });

  function exportToExcel() {
    const indicadorSeleccionado = filtrosAplicados.indicador as keyof TemporadaData;
    if (!indicadorSeleccionado) {
      alert("Seleccione un indicador para exportar.");
      return;
    }
    const etiqueta = INDICADORES.find(i => i.value === indicadorSeleccionado)?.label || indicadorSeleccionado;
    const datosFiltrados = dataFiltrada.map((fila) => ({
      Año: fila.year,
      Municipio: fila.municipality,
      Temporada: fila.seasonCanonical,
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
    setFiltrosAplicados({ indicador, municipio, temporada, añoInicio, añoFin });
  }

  function handleResetFiltro(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setIndicador("");
    setMunicipio("");
    setTemporada("");
    setAñoInicio("");
    setAñoFin("");
    setFiltrosAplicados({
      indicador: "",
      municipio: "",
      temporada: "",
      añoInicio: "",
      añoFin: "",
    });
  }

  function getTituloGrafica() {
    const indLabel = INDICADORES.find(i => i.value === filtrosAplicados.indicador)?.label || "";
    let añoTxt = "";
    const añosUnicos = [
      ...new Set(dataFiltradaConCorto.map(d => Number(d.year)).filter(Boolean))
    ].sort((a, b) => a - b);
    if (añosUnicos.length) {
      if (añosUnicos.length === 1) añoTxt = `(${añosUnicos[0]})`;
      else añoTxt = `(${añosUnicos[0]} - ${añosUnicos[añosUnicos.length - 1]})`;
    }
    
    const municipioGraficado = filtrosAplicados.municipio || (municipiosEnDataFiltrada.length > 0 ? municipiosEnDataFiltrada[0] : "");

    return `Evolución del indicador "${indLabel}"` +
      (municipioGraficado ? " en " + municipioGraficado : " (Múltiples Municipios)") +
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
        ) :
          (!filtrosAplicados.indicador && !filtrosAplicados.municipio && !filtrosAplicados.temporada && !filtrosAplicados.añoInicio && !filtrosAplicados.añoFin) ? (
            <div className="text-center text-gray-500 py-10">
              Seleccione al menos un filtro para ver los datos.
            </div>
          ) :
            (dataFiltradaConCorto.length === 0 || !filtrosAplicados.indicador) ? (
              <div className="text-center text-gray-500 py-10">
                No hay valores válidos para este indicador en las temporadas seleccionadas.
              </div>
            ) : (
              <LineChartIndicadores
                data={dataFiltradaConCorto}
                dataKey={filtrosAplicados.indicador}
                xKey="temporadaCompleta"
                labelX="Temporada"
                labelY={INDICADORES.find(i => i.value === filtrosAplicados.indicador)?.label || ""}
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
          <div className="col-span-1 md:col-span-2 relative">
            <label className="block mb-1 font-semibold text-black">Temporada</label>
            <select
              className="w-full appearance-none border px-3 py-2 pr-10 rounded text-black"
              value={temporada}
              onChange={e => setTemporada(e.target.value)}
            >
              <option value="">Seleccione</option>
              {temporadas.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-[55%] translate-y-2 text-gray-500 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold text-black">Municipio</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={municipio}
              onChange={e => setMunicipio(e.target.value)}
            >
              <option value="">Seleccione</option>
              {municipios.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-black">Año inicio</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={añoInicio}
              onChange={e => setAñoInicio(e.target.value)}
            >
              <option value="">Seleccione</option>
              {años.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black">Año fin</label>
            <select
              className="w-full border px-3 py-2 rounded text-black"
              value={añoFin}
              onChange={e => setAñoFin(e.target.value)}
            >
              <option value="">Seleccione</option>
              {años.map(a => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          {/* Botones */}
          <div className="col-span-1 md:col-span-2 flex gap-2 pt-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Aplicar filtro
            </button>
            <button
              type="button"
              className="w-1/2 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 transition"
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
              disabled={!filtrosAplicados.indicador}
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