import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admincomponets/AdminSidebar";
import AdminLayout from "../components/admincomponets/AdminLayout";
import AdminHeader from "../components/admincomponets/AdminHeader";
import NewsForm from "../components/admincomponets/NewForm";
import { createClient } from "@supabase/supabase-js";

type Section = "news" | "pdfs" | "excel";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  metadata?: { author: string; date: string };
}

interface DocumentItem {
  id: string;
  title: string;
  url: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pdfs, setPdfs] = useState<DocumentItem[]>([]);
  const [excels, setExcels] = useState<DocumentItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/news`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al cargar las noticias");
      }
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar las noticias");
    }
  };

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al cargar los PDFs");
      }
      const data = await response.json();
      // Se asume que la data es un arreglo de DocumentItem.
      setPdfs(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar los PDFs");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchNews(), fetchPdfs()]);
      setLoading(false);
    };
    setExcels([])
    fetchData();
  }, []);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `news-images/${Date.now()}-${file.name}`;
    console.log(fileName);
    const { error } = await supabase.storage
      .from("news-articles")
      .upload(fileName, file, {
        contentType: "image/jpeg",
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("news-articles").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleNewsSubmit = async (data: {
    title: string;
    content: string;
    image?: File;
    imageUrl?: string;
  }) => {
    try {
      let imageUrl = data.imageUrl;

      // Upload new image if provided
      if (data.image) {
        imageUrl = await uploadImageToSupabase(data.image);
      }
      // Save news data to your API
      const token = localStorage.getItem("token");
      const method = editingNews ? "PUT" : "POST";
      const url = editingNews
        ? `${import.meta.env.VITE_API_BASE_URL}/news/${editingNews.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/news`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          imageUrl,
          metadata: { author: "Autor", date: new Date().toISOString() },
          userId: "1",
        }),
      });

      if (!response.ok) {
        throw new Error(
          editingNews
            ? "Error al actualizar la noticia"
            : "Error al crear la noticia"
        );
      }

      const newsItem = await response.json();

      if (editingNews) {
        setNews(
          news.map((item) => (item.id === editingNews.id ? newsItem : item))
        );
      } else {
        setNews([...news, newsItem]);
      }

      setEditingNews(null);
    } catch (error) {
      console.error("Error:", error);
      alert(
        editingNews
          ? "Error al actualizar la noticia"
          : "Error al crear la noticia"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // First get the news item to check for image
      const newsItem = news.find((item) => item.id === id);

      if (newsItem?.imageUrl) {
        // Extract the image path from the URL
        const imagePath = newsItem.imageUrl.split("/").pop();
        if (imagePath) {
          await supabase.storage.from("news-images").remove([imagePath]);
        }
      }

      // Then delete from the API
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/news/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la noticia");
      }

      setNews(news.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la noticia");
    }
  };

  const handlePdfUpload = async (file: File, title: string) => {
    try {
      const token = localStorage.getItem("token");
      const fileName = `pdfs/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("pdfs").getPublicUrl(fileName);

      console.log(title)

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/inventory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            fileUrl: publicUrl,
          }),
        }
      );
      console.log(response)
      if (!response.ok) {
        throw new Error("Error al subir el archivo PDF");
      }
      const newPdf = await response.json();
      setPdfs((prevPdfs) => [...prevPdfs, newPdf]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir el archivo PDF");
    }
  };

  const handleDeletePdf = async (id: string, name: string) => {
    try {
      await supabase.storage.from("pdfs").remove([name]);

      setPdfs(pdfs.filter((pdf) => pdf.id !== id));
    } catch (error) {
      console.error("Error deleting PDF:", error);
      alert("Error al eliminar el PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="ml-64 flex-1 p-8">
        <AdminHeader />

        <AdminLayout>
          <div className="space-y-6">
            {currentSection === "news" && (
              <NewsForm
                initialData={editingNews || undefined}
                onSubmit={handleNewsSubmit}
                onCancel={() => setEditingNews(null)}
              />
            )}

            {currentSection === "pdfs" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título del PDF"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setPdfFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    if (pdfFile && pdfTitle) {
                      handlePdfUpload(pdfFile, pdfTitle);
                    } else {
                      alert("Por favor, completa todos los campos");
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Subir PDF
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentSection === "news"
                ? news
                : currentSection === "pdfs"
                ? pdfs
                : excels
              ).map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {currentSection === "news" && (
                    <>
                      {(item as NewsItem).imageUrl && (
                        <img
                          src={(item as NewsItem).imageUrl}
                          alt={(item as NewsItem).title}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2">
                        {(item as NewsItem).title}
                      </h3>
                      <p className="text-gray-800 line-clamp-3 mb-4">
                        {(item as NewsItem).content}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setEditingNews(item as NewsItem)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}

                  {currentSection === "pdfs" && (
                    <>
                      <h3 className="font-semibold text-lg mb-2 text-blue-600">
                        {(item as DocumentItem).title}
                      </h3>
                      <div className="flex justify-between">
                        <a
                          href={(item as DocumentItem).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Ver PDF
                        </a>
                        <button
                          onClick={() => handleDeletePdf(item.id, item.title)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AdminLayout>
      </div>
    </div>
  );
};

export default AdminPage;
