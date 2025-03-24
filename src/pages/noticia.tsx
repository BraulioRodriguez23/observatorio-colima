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
    <div className=" w-screen h-screen bg-white relative">
              <Header />

      <div className="bg-white  m-auto h-full rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
        {article.imageUrl && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${article.imageUrl}`}
            alt={article.title}
            className="w-1/2 h-80 object-cover rounded-lg mb-6"
          />
        )}
        <p className="text-gray-700 leading-relaxed">{article.content}</p>
      </div>
    </div>
  );
};

export default NoticiaDetalle;