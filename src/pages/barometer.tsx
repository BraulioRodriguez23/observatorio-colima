import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import Top from '../components/top';

const PDFSection = () => {
  // Datos de ejemplo para los PDFs
  const pdfs = [
    { id: 1, name: 'Informe Turístico Enero 2023', url: '/pdfs/informe-enero-2023.pdf' },
    { id: 2, name: 'Informe Turístico Febrero 2023', url: '/pdfs/informe-febrero-2023.pdf' },
    { id: 3, name: 'Informe Turístico Marzo 2023', url: '/pdfs/informe-marzo-2023.pdf' },
    { id: 4, name: 'Informe Turístico Abril 2023', url: '/pdfs/informe-abril-2023.pdf' },
    { id: 5, name: 'Informe Turístico Mayo 2023', url: '/pdfs/informe-mayo-2023.pdf' },
    { id: 6, name: 'Informe Turístico Junio 2023', url: '/pdfs/informe-junio-2023.pdf' },
  ];

  return (
    <div className="relative">
      <Header />
      <Top />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">Documentos Turísticos</h1>

        {/* Sección de PDFs */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Informes Mensuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pdf.name}</h3>
                <a
                  href={pdf.url}
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