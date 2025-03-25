import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import { useEffect, useState } from 'react';

const PDFSection = () => {
  const [pdfs, setPdfs] = useState<any[]>([]);
  // State to handle loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory/pdfs`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        console.log(data)
        setPdfs(data); // Set the news data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred'); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchNews();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display loading state
  if (loading) {
    return <div className="text-center py-8">Loading news...</div>;
  }

  // Display error state
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative">
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">Documentos Turísticos</h1>

        {/* Sección de PDFs */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Informes Mensuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pdf.title}</h3>
                <a
                  href= {`${import.meta.env.VITE_API_BASE_URL}${pdf.fileUrl}`}
                  download
                  className="inline-block mt-4 px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Descargar PDF 
                </a>
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