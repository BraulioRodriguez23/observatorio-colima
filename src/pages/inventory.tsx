import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/piedepagina";
import MensualIndicador from "../components/MensualIndicador";
import TemporadaIndicador from "../components/TemporadaIndicador";
import FinesSemanaIndicador from "../components/FinesSemanaIndicador";
import imagenfondo from "../images/Tecomán-Estero El chupadero.jpg";

// --- Tipo para PDFs ---
interface PdfItem {
  id: number;
  title: string;
  fileUrl: string;
  category?: string;
}

const TABS = [
  { label: "Corte mensual", value: "mensual" },
  { label: "Temporadas vacacionales", value: "temporada" },
  { label: "Fines de semana largos", value: "puentes" },
];

const IndicadoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://observatorio-api-dhp4.vercel.app/pdfs-front");
        if (!response.ok) throw new Error("Error al cargar los PDFs");
        const data = await response.json();
        setPdfs(data);
      } catch {
        setError("No se pudieron cargar los PDFs");
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  const handlePdfClick = (url: string, title: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert(`PDF "${title}" no disponible temporalmente`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Imagen de encabezado */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={imagenfondo}
            alt="Turismo Colima"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4 bg-black/40 rounded-xl p-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
            Indicadores
          </h1>
        </div>
      </section>

      {/* Tabs de indicadores */}
      <div className="flex justify-center mt-6 mb-2">
        {TABS.map((tab) => (
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

      {/* Contenido principal */}
      <main className="flex-grow max-w-7xl mx-auto w-full py-10">
        {activeTab === "mensual" && <MensualIndicador />}
        {activeTab === "puentes" && <FinesSemanaIndicador />}
        {activeTab === "temporada" && <TemporadaIndicador />}
      </main>

      {/* PDFs adicionales */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 bg-white rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Documentos adicionales
        </h2>

        {loading && (
          <p className="text-center text-gray-600 py-4">Cargando documentos...</p>
        )}
        {error && (
          <p className="text-center text-red-600 py-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pdfs.map((button) => (
            <button
              key={button.id}
              onClick={() => handlePdfClick(button.fileUrl, button.title)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-lg ${
                button.fileUrl
                  ? "border-pink-200 bg-pink-50 hover:border-pink-400 hover:bg-pink-100"
                  : "border-gray-200 bg-gray-50 hover:border-gray-400 opacity-75 cursor-not-allowed"
              }`}
              disabled={!button.fileUrl}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    button.fileUrl ? "bg-pink-500" : "bg-gray-400"
                  }`}
                >
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
                  <h3 className={`font-semibold text-sm mb-1 ${button.fileUrl ? "text-gray-800" : "text-gray-500"}`}>
                    {button.title}
                  </h3>
                  <p className={`text-xs ${button.fileUrl ? "text-gray-600" : "text-gray-400"}`}>
                    {button.fileUrl ? "Disponible" : "No disponible"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

      
      </div>

      <Footer />
    </div>
  );
};

export default IndicadoresPage;
// This code defines a React component for the "Indicadores" page, which includes tabs for different types of indicators and a section for additional PDF documents. It uses hooks to manage state and fetch data from an API, displaying loading and error states as needed. The layout is responsive and styled with Tailwind CSS classes.
// The component also includes a header and footer, and handles PDF document clicks to open them in a new tab. The tabs allow users to switch between monthly indicators, holiday seasons, and long weekends, with each section displaying relevant content. The PDF section provides a grid of buttons for downloading documents, with visual feedback based on availability. The overall design is clean and user-friendly, suitable for displaying tourism indicators in Colima.
// The component is structured to be easily maintainable and extendable, allowing for future enhancements or    additional features as needed. The use of TypeScript interfaces ensures type safety for the PDF items, enhancing code reliability.
// The component is designed to be part of a larger application, likely focused on tourism or local information, and integrates seamlessly with other parts of the application such as the header and footer components. The use of responsive design principles ensures that the page looks good on both desktop and mobile devices, providing a consistent user experience across different screen sizes.
// The component is also optimized for performance, with efficient data fetching and state management, ensuring a smooth user experience even when loading multiple documents or switching between tabs. The use of Tailwind CSS classes allows for rapid styling and layout adjustments, making it easy to adapt the design as needed without extensive CSS modifications.
// The overall architecture of the component follows best practices for React development, including the use of functional