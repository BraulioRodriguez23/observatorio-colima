import React, { useState, useEffect } from "react";
import Header from '../components/header';
import Footer from '../components/piedepagina';

const TABS = [
  { label: "Corte Mensual", value: "mensual" },
  { label: "Temporadas vacacionales", value: "temporada" },
  { label: "Fines de semana largos", value: "puentes" },
  
];

const DESCARGABLES: Record<string, { label: string; value: string }[]> = {
  mensual: [
    { label: "Establecimientos de hospedaje", value: "hospedaje" },
    { label: "Personal ocupado", value: "personal" },
    { label: "PIBE", value: "pibe" },
    { label: "Histórico principales indicadores", value: "historico" },
    { label: "Cruceros", value: "cruceros" },
  ],
  temporada: [
    { label: "Temporada: Reporte general", value: "temp_general" },
  ],
  puentes: [
    { label: "Puentes: Estadísticas completas", value: "puentes_completo" },
  ],
  cruceros: [
    { label: "Cruceros: Reporte anual", value: "cruceros_anual" },
  ],
};

interface ExcelIndicator {
  id: number;
  year: number;
  municipio?: string;
  mes?: string;
  temporada?: string;
  puente?: string;
  ocupacion?: number;
}

const endpointByType: Record<string, string> = {
  mensual: "monthly-stats",
  temporada: "season-stats",
  puentes: "info-injection",
  cruceros: "cruceros-stats",
};

const IndicadoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].value);
  const [activeDesc, setActiveDesc] = useState(DESCARGABLES[TABS[0].value][0].value);
  const [data, setData] = useState<ExcelIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData([]);
    const endpoint = endpointByType[activeTab];
    fetch(`${import.meta.env.VITE_API_BASE_URL}/${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Nivel 1: Tabs */}
          <div className="flex space-x-4 mb-4 justify-center">
            {TABS.map(tab => (
              <button
                key={tab.value}
                className={`px-6 py-2 rounded-t-lg border-b-4 transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'bg-pink-100 border-pink-500 text-pink-700 font-bold'
                    : 'bg-white border-transparent text-gray-500 hover:text-pink-600'
                }`}
                onClick={() => {
                  setActiveTab(tab.value);
                  setActiveDesc(DESCARGABLES[tab.value][0]?.value || '');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Nivel 2: Descargables */}
          <div className="flex space-x-4 mb-8 justify-center bg-white p-4 rounded-lg shadow">
            {DESCARGABLES[activeTab].map(item => (
              <button
                key={item.value}
                className={`px-4 py-1 rounded-full transition-colors ${
                  activeDesc === item.value
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-pink-100'
                }`}
                onClick={() => setActiveDesc(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Contenido */}
          {loading && <div className="text-center py-10">Cargando...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}

          {!loading && !error && (
            data.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No hay datos para este tipo.</div>
            ) : (
              <table className="min-w-full border mt-4">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Año</th>
                    <th className="border px-2 py-1">Municipio</th>
                    {activeTab === "mensual" && <th className="border px-2 py-1">Mes</th>}
                    {activeTab === "temporada" && <th className="border px-2 py-1">Temporada</th>}
                    {activeTab === "puentes" && <th className="border px-2 py-1">Puente</th>}
                    <th className="border px-2 py-1">% Ocupación</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id}>
                      <td className="border px-2 py-1">{row.year}</td>
                      <td className="border px-2 py-1">{row.municipio}</td>
                      {activeTab === "mensual" && <td className="border px-2 py-1">{row.mes}</td>}
                      {activeTab === "temporada" && <td className="border px-2 py-1">{row.temporada}</td>}
                      {activeTab === "puentes" && <td className="border px-2 py-1">{row.puente}</td>}
                      <td className="border px-2 py-1">{row.ocupacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IndicadoresPage;
