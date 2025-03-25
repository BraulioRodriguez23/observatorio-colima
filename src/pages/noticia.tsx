import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";

// Define la interfaz para el artículo
interface Article {
  id: number;
  tipo: string;
  content: string;
  imageUrl: string;
  title: string;
  // Agrega más propiedades según sea necesario
}

const NoticiaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/news/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setArticle(data); // Set the news data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchNews();
  }, [id]); // Dependencia en `id` para que se vuelva a ejecutar si cambia

  // Mostrar estado de carga
  if (loading) {
    return <div className="text-center py-8">Cargando noticia...</div>;
  }

  // Mostrar estado de error
  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  // Mostrar si no se encontró el artículo
  if (!article) {
    return <div className="text-center py-8">Noticia no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {article.imageUrl && (
            <div className="relative h-96 bg-gray-100">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${article.imageUrl}`}
                alt={article.title}
                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-95"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-32" />
            </div>
          )}
          
          <div className="px-6 py-8 md:px-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="px-6 md:px-12 pb-8">
            <div className="border-t border-gray-200 pt-6">
              <a
                href="/News"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Volver a noticias
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default NoticiaDetalle;