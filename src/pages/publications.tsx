import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import { useEffect, useState } from 'react';

interface PDFDocument {
  id: string;
  title: string;
  fileUrl: string;
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
        setPdfs(data);
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
      <div className="text-center py-8">
        <span className="animate-pulse">Cargando documentos...</span>
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
            Documentos Turísticos
          </h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Informes Mensuales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf) => (
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PDFSection;