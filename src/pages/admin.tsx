import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admincomponets/AdminSidebar";
import AdminLayout from "../components/admincomponets/AdminLayout";
import AdminHeader from "../components/admincomponets/AdminHeader";
import NewsForm from "../components/admincomponets/NewForm";
import { createClient } from "@supabase/supabase-js";
import { ExcelUpload } from '../components/admincomponets/ExcelUpload';
import { Notification } from '../components/admincomponets/Notification';
import { ExcelList } from '../components/admincomponets/ExcelList';

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

interface ExcelItem extends DocumentItem {
  section: string;
  fileName: string;
  uploadedAt: string;  
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pdfs, setPdfs] = useState<DocumentItem[]>([]);
  const [excels, setExcels] = useState<ExcelItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [excelView, setExcelView] = useState<'upload' | 'list'>('upload');
  const [refreshExcel, setRefreshExcel] = useState(false);

  // Funciones de fetching de datos
  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/news`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error:", error);
      setNotification({ type: 'error', message: 'Error al cargar noticias' });
    }
  };

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPdfs(data);
    } catch (error) {
      console.error("Error:", error);
      setNotification({ type: 'error', message: 'Error al cargar PDFs' });
    }
  };

  const fetchExcels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/info-injection`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setExcels(data);
    } catch (error) {
      console.error('Error:', error);
      setNotification({ type: 'error', message: 'Error al cargar excels' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchNews(), fetchPdfs(), fetchExcels()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (refreshExcel) {
      fetchExcels().then(() => setRefreshExcel(false));
    }
  }, [refreshExcel]);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `news-images/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("news-articles")
      .upload(fileName, file, { contentType: "image/jpeg" });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from("news-articles").getPublicUrl(fileName);
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
      if (data.image) imageUrl = await uploadImageToSupabase(data.image);

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
        }),
      });

      const newsItem = await response.json();
      setNews(prev => editingNews 
        ? prev.map(item => item.id === editingNews.id ? newsItem : item) 
        : [...prev, newsItem]
      );
      setEditingNews(null);
      setNotification({ type: 'success', message: 'Noticia guardada exitosamente' });
    } catch (error) {
      console.error("Error:", error);
      setNotification({ type: 'error', message: 'Error al guardar noticia' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const newsItem = news.find(item => item.id === id);
      if (newsItem?.imageUrl) {
        const imagePath = newsItem.imageUrl.split("/").pop();
        if (imagePath) await supabase.storage.from("news-images").remove([imagePath]);
      }

      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNews(prev => prev.filter(item => item.id !== id));
      setNotification({ type: 'success', message: 'Noticia eliminada exitosamente' });
    } catch (error) {
      console.error("Error:", error);
      setNotification({ type: 'error', message: 'Error al eliminar noticia' });
    }
  };

  const handlePdfUpload = async (file: File, title: string) => {
    try {
      const fileName = `pdfs/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("pdfs").upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("pdfs").getPublicUrl(fileName);

      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, fileUrl: publicUrl }),
      });

      const newPdf = await response.json();
      setPdfs(prev => [...prev, newPdf]);
      setNotification({ type: 'success', message: 'PDF subido exitosamente' });
    } catch (error) {
      console.error("Error:", error);
      setNotification({ type: 'error', message: 'Error al subir PDF' });
    }
  };

  const handleDeletePdf = async (id: string, fileName: string) => {
    try {
      await supabase.storage.from("pdfs").remove([fileName]);
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfs(prev => prev.filter(p => p.id !== id));
      setNotification({ type: 'success', message: 'PDF eliminado exitosamente' });
    } catch (error) {
      console.error("Error:", error);
      setNotification({ type: 'error', message: 'Error al eliminar PDF' });
    }
  };

  const handleDeleteExcel = async (id: string, fileName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/info-injection/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el archivo');
      }

      await supabase.storage.from("excels").remove([fileName]);
      setRefreshExcel(true);
      setNotification({ type: 'success', message: 'Archivo eliminado exitosamente' });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
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
      <AdminSidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <div className="ml-64 flex-1 p-8">
        <AdminHeader />
        
        <Notification 
          open={!!notification}
          message={notification?.message || ''}
          type={notification?.type}
          onClose={() => setNotification(null)}
        />

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
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => {
                    if (pdfFile && pdfTitle) {
                      handlePdfUpload(pdfFile, pdfTitle);
                    } else {
                      setNotification({ type: 'error', message: 'Complete todos los campos' });
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Subir PDF
                </button>
              </div>
            )}

            {currentSection === "excel" && (
              <div className="space-y-6">
                <div className="flex gap-2 border-b pb-2">
                  <button 
                    onClick={() => setExcelView('upload')} 
                    className={`px-4 py-2 ${excelView === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Subir Excel
                  </button>
                  <button 
                    onClick={() => setExcelView('list')} 
                    className={`px-4 py-2 ${excelView === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Ver Archivos
                  </button>
                </div>

                {excelView === 'upload' ? (
                  <ExcelUpload
                    onSuccess={(msg) => {
                      setNotification({ type: 'success', message: msg });
                      setRefreshExcel(true);
                      setExcelView('list');
                    }}
                    onError={(msg) => setNotification({ type: 'error', message: msg })}
                    onUploadComplete={() => setRefreshExcel(true)}
                  />
                ) : (
                  <ExcelList
                    data={excels}
                    onDelete={handleDeleteExcel}
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentSection === "news" ? news : 
               currentSection === "pdfs" ? pdfs : 
               []).map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {currentSection === "news" && (
                    <>
                      {(item as NewsItem).imageUrl && (
                        <img
                          src={(item as NewsItem).imageUrl}
                          alt={(item as NewsItem).title}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2">{(item as NewsItem).title}</h3>
                      <p className="text-gray-800 line-clamp-3 mb-4">{(item as NewsItem).content}</p>
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
                      <h3 className="font-semibold text-lg mb-2 text-blue-600">{(item as DocumentItem).title}</h3>
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