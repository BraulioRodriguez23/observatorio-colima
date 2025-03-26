import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admincomponets/AdminSidebar";
import AdminLayout from "../components/admincomponets/AdminLayout";
import AdminHeader from "../components/admincomponets/AdminHeader";
import NewsForm from "../components/admincomponets/NewForm";
import DocumentUpload from "../components/admincomponets/DocumentUpload";

type Section = "news" | "pdfs" | "excel";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  metadata?: { author: string; date: string };
}

// Se utiliza la misma interfaz para PDFs y Excels, ya que en este ejemplo
// solo se requiere almacenar un id y el nombre del documento.
interface DocumentItem {
  id: string;
  name: string;
}

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

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/pdfs`,
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
      await Promise.all([fetchNews(), fetchFiles()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleNewsSubmit = async (data: {
    title: string;
    content: string;
    image?: File;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append(
        "metadata",
        JSON.stringify({ author: "Autor", date: new Date().toISOString() })
      );
      formData.append("userId", "1");
      if (data.image) {
        formData.append("image", data.image);
      }
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/news`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error al crear la noticia");
      }
      const newNews = await response.json();
      setNews((prevNews) => [...prevNews, newNews]);
      setEditingNews(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la noticia");
    }
  };

  const handleDelete = async (id: string) => {
    try {
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
      setNews((prevNews) => prevNews.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la noticia");
    }
  };

  // Aquí se define newDoc con la interfaz DocumentItem y se usa
  // para actualizar el estado de pdfs o excels sin recurrir a "any".
  const handleDocumentUpload = (file: File, type: "pdfs" | "excel"): void => {
    const newDoc: DocumentItem = {
      id: Date.now().toString(),
      name: file.name,
    };

    if (type === "pdfs") {
      setPdfs((prev) => [...prev, newDoc]);
    } else {
      setExcels((prev) => [...prev, newDoc]);
    }
  };

  const handlePdfUpload = async (file: File, title: string) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory/pdfs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
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

  if (loading) {
    return <div>Cargando noticias...</div>;
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
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setPdfFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
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

            {currentSection === "excel" && (
              <DocumentUpload
                accept=".xlsx,.xls"
                onUpload={(file) => handleDocumentUpload(file, "excel")}
                label="Subir nuevo Excel"
              />
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
                          src={`${import.meta.env.VITE_API_BASE_URL}${
                            (item as NewsItem).imageUrl
                          }`}
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
                      <div className="flex justify-between items-center text-gray-800">
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
                        {(item as DocumentItem).name}
                      </h3>
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL}/pdfs/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Ver PDF
                      </a>
                    </>
                  )}

                  {currentSection === "excel" && (
                    <span className="truncate">
                      {(item as DocumentItem).name}
                    </span>
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
