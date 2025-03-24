import  { useEffect, useState } from 'react';
import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';

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

export default function Publications() {
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
    <div className="relative">
      <Header />
      <section className="bg-blue-50 py-4">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center">
            Últimas Publicaciones
          </h2>
          <h3 className="text-3xl font-bold text-pink-600 mb-8 text-left">
            Ve las últimas noticias turísticas
          </h3>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${article.imageUrl}`} // Use the full image URL
                alt="Noticia turística"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {article.title}
                </h4>
                <p className="text-gray-600 mt-2">{article.content}</p>
                <a
                  href={`/noticia/${article.id}`}
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  Leer más...
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}