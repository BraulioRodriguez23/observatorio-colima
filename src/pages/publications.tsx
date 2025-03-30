import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import { useEffect, useState } from 'react';

const PDFSection = () => {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener la lista de PDFs desde la API
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory/`);
        if (!response.ok) {
          throw new Error('Error al obtener los documentos');
        }
        const data = await response.json();
        setPdfs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Cargando documentos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative">
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">Documentos Turísticos</h1>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Informes Mensuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pdf.title}</h3>
                <button
                  onClick={() => {
                    // Crear un enlace dinámicamente para forzar la descarga
                    const link = document.createElement('a');
                    link.href = pdf.fileUrl;
                    link.setAttribute('download', `${pdf.title}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-block mt-4 px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PDFSection;
