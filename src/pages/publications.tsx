import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import { useEffect, useState } from 'react';
import imagenCarga from '../../public/images/Manzanillo -logo.png';
import imagenfondo from '../../public/images/ballena-nueva.jpg';

interface PDFDocument {
  id: number;
  title: string;
  fileUrl: string;
  category: string;
}

function groupByCategory(pdfs: PDFDocument[]) {
  return pdfs.reduce<{ [key: string]: PDFDocument[] }>((acc, pdf) => {
    const cat = pdf.category || "Sin Categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pdf);
    return acc;
  }, {});
}

const PDFSection = () => {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/inventory/`,
          { signal: abortController.signal }
        );
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data: PDFDocument[] = await response.json();
        setPdfs(data.map(d => ({ ...d, id: Number(d.id) })));
        setError(null);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
    return () => abortController.abort();
  }, []);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const blob = await response.blob();
      const tempUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = tempUrl;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(tempUrl);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error en descarga:', err);
      alert('No se pudo descargar el archivo. Intente nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <img
          src={imagenCarga}
          alt="Cargando"
          className="w-40 h-40 mb-6 object-contain animate-pulse-scale"
        />
        <p className="text-2xl font-semibold">Cargando noticias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error} - Intente recargar la página
      </div>
    );
  }

  const groupedPdfs = groupByCategory(pdfs);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white">
      <Header />

      {/* Hero Section Noticias */}
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
           Investigación
          </h1>
          {/* <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto">
            Perfil y grado de satisfacción de turistas que visitan el Estado
          </p> */}
        </div>
      </section>

      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          <h1 className="text-xxl text-center text-gray-800 mb-8 ">
            Perfil y grado de satisfacción de turistas que visitan el Estado
          </h1>

          {Object.entries(groupedPdfs).map(([cat, docs]) => (
            <section key={cat} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map((pdf) => (
                  <article 
                    key={pdf.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {pdf.title}
                    </h3>
                    <button
                      onClick={() => handleDownload(pdf.fileUrl, `${pdf.title}.pdf`)}
                      className="w-full px-4 py-2 bg-pink-600 text-white rounded-md
                               hover:bg-pink-700 transition-colors focus:outline-none
                               focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      Descargar PDF
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PDFSection;
