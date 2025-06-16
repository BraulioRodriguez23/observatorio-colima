import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/piedepagina";
import MensualIndicador from "../components/MensualIndicador";
import TemporadaIndicador from "../components/TemporadaIndicador";
import FinesSemanaIndicador from "../components/FinesSemanaIndicador";
import imagenfondo from '../images/Tecomán-Estero El chupadero.jpg';

const TABS = [
  { label: "Corte mensual", value: "mensual" },
  { label: "Temporadas vacacionales", value: "temporada" },
  { label: "Fines de semana largos", value: "puentes" },
];

// Aquí tu arreglo de PDFs
const PDF_BUTTONS = [
  {
    id: 1,
    title: "Establecimientos hospitalarios por municipio",
    fileName: "ESTABLECIMIENTOS_HOSP_POR_MUNICIPIO.xlsx",
    category: "hospitalidad",
    link: "https://juqxtlpbddiyfihjajux.supabase.co/storage/v1/object/public/pdfs-front//ESTABLECIMIENTOS%20HOSP%20POR%20MUNICIPIO.xlsx%20-%20ESTABLECIMIENTOS%20HOSP%20POR%20MUNIC.pdf"
  },
  {
    id: 2,
    title: "Indicadores de cruceros",
    fileName: "Indicadores de cruceros (descargable).xlsx",
    category: "cruceros",
    link: "https://juqxtlpbddiyfihjajux.supabase.co/storage/v1/object/public/pdfs-front//Indicadores%20de%20cruceros%20(descargable).xlsx%20-%20Indicadores%20de%20cruceros.pdf"
  },
  {
    id: 3,
    title: "Personal ocupado estatal",
    fileName: "Personal ocupado estatal.pdf",
    category: "personal",
    link: "https://juqxtlpbddiyfihjajux.supabase.co/storage/v1/object/public/pdfs-front//Personal%20ocupado%20estatal%20(1).pdf"
  },
  {
    id: 4,
    title: "PIBE tabla",
    fileName: "PIBE TABLA (descargable).xlsx",
    category: "PIBE TABLA",
    link: "https://juqxtlpbddiyfihjajux.supabase.co/storage/v1/object/public/pdfs-front//PIBE%20TABLA%20(descargable).xlsx%20-%20PIBE%20Estatal.pdf"
  },
  {
    id: 5,
    title: "Tabla histórica de indicadores turísticos clave 2004-2024",
    fileName: "Tabla histórica de indicadores turísticos clave 2004-2024.xlsx",
    category: "historicos",
    link: "https://juqxtlpbddiyfihjajux.supabase.co/storage/v1/object/public/pdfs-front//ilovepdf_merged-1.pdf"
  }
];

const IndicadoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);

  // Función para abrir PDF en nueva ventana
  const handlePdfClick = (url: string, title: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`PDF "${title}" no disponible temporalmente`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
       <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={imagenfondo}
            alt="Turismo Colima"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 bg-black/40 rounded-xl p-6">
          <h1 className="text-5xxl md:text-6xl font-bold text-white mb-4 animate-slide-up">
           Indicadores
          </h1>
          {/* <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto">
            Perfil y grado de satisfacción de turistas que visitan el Estado
          </p> */}
        </div>
      </section>

      {/* Tabs de indicadores */}
      <div className="flex justify-center mt-6 mb-2">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`px-6 py-2 rounded-lg border-b-4 mx-2 transition-all duration-200 ${
              activeTab === tab.value
                ? "bg-pink-100 border-pink-500 text-pink-700 font-bold"
                : "bg-white border-transparent text-gray-500 hover:text-pink-600"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido principal de indicadores */}
      <main className="flex-grow max-w-7xl mx-auto w-full py-10">
        {activeTab === "mensual" && <MensualIndicador />}
        {activeTab === "puentes" && <FinesSemanaIndicador />}
        {activeTab === "temporada" && <TemporadaIndicador />}
      </main>

      {/* Sección de PDFs adicionales */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 bg-white rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Documentos Adicionales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PDF_BUTTONS.map((button) => (
            <button
              key={button.id}
              onClick={() => handlePdfClick(button.link, button.title)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-lg ${
                button.link
                  ? 'border-pink-200 bg-pink-50 hover:border-pink-400 hover:bg-pink-100'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-400 opacity-75 cursor-not-allowed'
              }`}
              disabled={!button.link}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  button.link ? 'bg-pink-500' : 'bg-gray-400'
                }`}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${button.link ? 'text-gray-800' : 'text-gray-500'}`}>
                    {button.title}
                  </h3>
                  <p className={`text-xs ${button.link ? 'text-gray-600' : 'text-gray-400'}`}>
                    {button.link ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Estos documentos se abren en una nueva ventana.
            Si algún documento no está disponible, contacta al administrador para subirlo.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndicadoresPage;
