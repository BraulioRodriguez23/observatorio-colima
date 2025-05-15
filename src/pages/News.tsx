import  { useEffect, useState } from 'react';
import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import imagenfondo  from '../images/comala-pueblo-mgico-foto-hernando-rivera.jpg'

// Define the type for a news article
interface NewsArticle {
  id: number;
  title: string;
  content: string;
  metadata: string;
  imageUrl: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function News() {
  // State to store the news data
  const [news, setNews] = useState<NewsArticle[]>([]);
  // State to handle loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/news`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data); // Set the news data
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
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
      Explorando Colima
    </h1>
    <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto">
      Descubre las últimas novedades, eventos y experiencias turísticas de nuestro Estado
    </p>
  </div>
</section>
  
      {/* Grid de Noticias */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((article) => (
              <article
                key={article.id}
                className="group relative bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out"
              >
                
  
                {/* Imagen con Efecto */}
                <div className="relative h-72 overflow-hidden rounded-t-2xl">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                </div>
  
                {/* Contenido */}
                <div className="p-6">
                  {/* Fecha */}
                  <div className="text-sm text-pink-500 font-medium mb-2">
                    {new Date(article.createdAt).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
  
                  {/* Título */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
                    {article.title}
                  </h3>
  
                  {/* Extracto */}
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {article.content}
                  </p>
  
                  {/* Botón Leer Más */}
                  <a
                    href={`/noticia/${article.id}`}
                    className="inline-flex items-center font-semibold text-pink-600 hover:text-pink-800 transition-colors group/button"
                  >
                    <span className="border-b-2 border-transparent group-hover/button:border-pink-600 transition-all">
                      Ver artículo completo
                    </span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover/button:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
  
      {/* CTA Section */}
      {/* <section className="bg-pink-900 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Quieres recibir las últimas noticias?
          </h2>
          <p className="text-lg text-pink-100 mb-8">
            Suscríbete a nuestro boletín y mantente actualizado sobre el turismo en Colima
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button className="px-8 py-3 bg-white text-pink-900 font-semibold rounded-lg hover:bg-pink-50 transition-colors">
              Suscribirme
            </button>
          </div>
        </div>
      </section> */}
  
      <Footer />
    </div>
  );
}