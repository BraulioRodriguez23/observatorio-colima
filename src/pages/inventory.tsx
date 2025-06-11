import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/piedepagina";
import MensualIndicador from "../components/MensualIndicador";
import TemporadaIndicador from "../components/TemporadaIndicador";
import FinesSemanaIndicador from "../components/FinesSemanaIndicador";

const TABS = [
  { label: "Corte mensual", value: "mensual" },
  { label: "Temporadas vacacionales", value: "temporada" },
  { label: "Fines de semana largos", value: "puentes" },
];

// Configuración de los PDFs que quieres mostrar
const PDF_BUTTONS = [
  {
    id: 1,
    title: "Establecimientos hospitalarios por municipio",
    fileName: "ESTABLECIMIENTOS HOSP POR MUNICIPIO.xlsx",
    category: "hospitales"
  },
  {
    id: 2, 
    title: "Indicadores de cruceros",
    fileName: "Indicadores de cruceros (descargable).xlsx",
    category: "cruceros"
  },
  {
    id: 3,
    title: "Personal ocupado estatal",
    fileName: "Personal ocupado estatal.pdf", 
    category: "personal"
  },
  {
    id: 4,
    title: "Tabla histórica de indicadores turísticos",
    fileName: "Tabla histórica de indicadores turísticos clave 2004-2024.xlsx",
    category: "historicos"
  }
];

interface PdfDocument {
  id: number;
  title: string;
  url: string;
  category: string;
}

const IndicadoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL!;

  // Función para obtener los PDFs del backend filtrados por categoría
  const fetchPdfsByCategory = async (categories: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/pdfs-Front`);
      if (!response.ok) throw new Error('Error al cargar los PDFs');
      
      const allPdfs: PdfDocument[] = await response.json();
      
      // Filtrar solo los PDFs que coincidan con nuestras categorías o títulos
      const filteredPdfs = allPdfs.filter(pdf => 
        categories.some(category => 
          pdf.category?.toLowerCase().includes(category.toLowerCase()) ||
          PDF_BUTTONS.some(button => 
            pdf.title.toLowerCase().includes(button.title.toLowerCase()) ||
            button.fileName.toLowerCase().includes(pdf.title.toLowerCase())
          )
        )
      );
      
      setPdfDocuments(filteredPdfs);
    } catch (err) {
      setError('Error al cargar los documentos PDF');
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los PDFs al montar el componente
  useEffect(() => {
    const categories = PDF_BUTTONS.map(button => button.category);
    fetchPdfsByCategory(categories);
  }, []);

  // Función para abrir PDF en nueva ventana
  const handlePdfClick = (url: string, title: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`PDF "${title}" no disponible temporalmente`);
    }
  };

  // Función para encontrar el PDF correspondiente por título
  const findPdfByTitle = (buttonTitle: string, fileName: string) => {
    return pdfDocuments.find(pdf => 
      pdf.title.toLowerCase().includes(buttonTitle.toLowerCase()) ||
      buttonTitle.toLowerCase().includes(pdf.title.toLowerCase()) ||
      pdf.title.toLowerCase().includes(fileName.toLowerCase()) ||
      fileName.toLowerCase().includes(pdf.title.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
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
        
        {loading && (
          <div className="text-center py-4">
            <span className="text-gray-600">Cargando documentos...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <span className="text-red-600">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PDF_BUTTONS.map((button) => {
              const correspondingPdf = findPdfByTitle(button.title, button.fileName);
              
              return (
                <button
                  key={button.id}
                  onClick={() => {
                    if (correspondingPdf) {
                      handlePdfClick(correspondingPdf.url, correspondingPdf.title);
                    } else {
                      alert(`PDF "${button.title}" no encontrado en el sistema`);
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-lg ${
                    correspondingPdf 
                      ? 'border-pink-200 bg-pink-50 hover:border-pink-400 hover:bg-pink-100' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-400 opacity-75 cursor-not-allowed'
                  }`}
                  disabled={!correspondingPdf}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      correspondingPdf ? 'bg-pink-500' : 'bg-gray-400'
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
                      <h3 className={`font-semibold text-sm mb-1 ${
                        correspondingPdf ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {button.title}
                      </h3>
                      <p className={`text-xs ${
                        correspondingPdf ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {correspondingPdf ? 'Disponible' : 'No disponible'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Mensaje informativo */}
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