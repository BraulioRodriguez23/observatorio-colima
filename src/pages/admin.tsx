import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admincomponets/AdminSidebar";
import AdminLayout from "../components/admincomponets/AdminLayout";
import AdminHeader from "../components/admincomponets/AdminHeader";
import NewsForm from "../components/admincomponets/NewForm";
import NewsList from "../components/admincomponets/NewsList";
import PdfList from "../components/admincomponets/PdfList";
import PdfUpload from "../components/admincomponets/PdfUpload";
import { ExcelUpload } from "../components/admincomponets/ExcelUpload";
import { createClient } from "@supabase/supabase-js";

// -------- Types --------
type Section = "news" | "pdfs" | "excel";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  metadata?: { author: string; date: string };
}

interface DocumentItem {
  id: number;
  title: string;
  url: string;
  category: string;
}

interface ExcelItem {
  id: number;
  name: string; // O el campo relevante, ajusta según tu modelo
  // ...otros campos si tienes
}

const excelTypes = [
  { value: "mensual",   route: "monthly-stats",   label: "Mensual"      },
  { value: "temporada", route: "season-stats",    label: "Temporada"    },
  { value: "puentes",   route: "info-injection",  label: "Puentes"      },
];

// -------- Supabase --------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPage: React.FC = () => {
  const [excelType, setExcelType] = useState<string>(excelTypes[0].value);
  const [currentSection, setCurrentSection] = useState<Section>("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pdfs, setPdfs] = useState<DocumentItem[]>([]);
  const [excels, setExcels] = useState<ExcelItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfCategory, setPdfCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  // -------- Fetch data --------
  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/news`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al cargar las noticias");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar las noticias");
    }
  };

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al cargar los PDFs");
      const data = await response.json();
      setPdfs(
        data.map((d: DocumentItem & { fileUrl?: string }) => ({
          ...d,
          id: Number(d.id),
          url: d.url ?? d.fileUrl,
          category: d.category ?? "Sin Categoría",
        }))
      );
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar los PDFs");
    }
  };

// 1) Dentro de AdminPage (o donde definas tu fetch de listado)
const fetchExcels = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = excelTypes.find(e => e.value === excelType)!;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/${config.route}`,   // ← GET a /<route>
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    if (!response.ok) throw new Error("Error al cargar los Excels");
    const data = await response.json();
    setExcels(data);
  } catch {
    setError("Error al cargar los Excels");
  }
};


useEffect(() => {
  const fetchData = async () => {
    await Promise.all([fetchNews(), fetchPdfs()]);
    if (currentSection === "excel") {
      await fetchExcels();
    }
    setLoading(false);
  };
  fetchData();
}, [currentSection, excelType]);

  // -------- Supabase uploads --------
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `news-images/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("news-articles")
      .upload(fileName, file, { contentType: "image/jpeg" });
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from("news-articles").getPublicUrl(fileName);
    return publicUrl;
  };

  // -------- Handlers --------
  const handleNewsSubmit = async (data: {
    title: string;
    content: string;
    image?: File;
    imageUrl?: string;
  }) => {
    try {
      let imageUrl = data.imageUrl;

      if (data.image) {
        imageUrl = await uploadImageToSupabase(data.image);
      }
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

      if (!response.ok)
        throw new Error(
          editingNews
            ? "Error al actualizar la noticia"
            : "Error al crear la noticia"
        );

      const newsItem = await response.json();

      if (editingNews) {
        setNews(news.map((item) => (item.id === editingNews.id ? newsItem : item)));
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
      const newsItem = news.find((item) => item.id === id);
      if (newsItem?.imageUrl) {
        const parts = newsItem.imageUrl.split("/");
        const imagePath = parts.slice(parts.findIndex(p => p === "news-images")).join("/");
        if (imagePath) {
          await supabase.storage.from("news-articles").remove([imagePath]);
        }
      }
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/news/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Error al eliminar la noticia");
      setNews(news.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la noticia");
    }
  };

  const handlePdfUpload = async (file: File, title: string, category: string) => {
    try {
      const token = localStorage.getItem("token");
      const fileName = `pdfs/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("pdfs").upload(fileName, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("pdfs").getPublicUrl(fileName);

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
            category: category,
          }),
        }
      );
      if (!response.ok) throw new Error("Error al subir el archivo PDF");
      const newPdf = await response.json();
      setPdfs((prevPdfs) => [
        ...prevPdfs,
        {
          ...newPdf,
          id: Number(newPdf.id),
          url: newPdf.url ?? newPdf.fileUrl,
          category: newPdf.category ?? "Sin Categoría",
        },
      ]);
      setPdfFile(null);
      setPdfTitle("");
      setPdfCategory("");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir el archivo PDF");
    }
  };

  const handleDeletePdf = async (id: number, fileName: string) => {
    try {
      await supabase.storage.from("pdfs").remove([fileName]);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/inventory/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`Error borrando en API: ${response.status}`);
      setPdfs((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting PDF:", err);
      alert(err instanceof Error ? err.message : "Error al eliminar el PDF");
    }
  };

  // --------- Eliminar Excel ---------
  const handleDeleteExcel = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/info-injection/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error("Error al eliminar el Excel");
      setExcels((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Error al eliminar el archivo Excel");
    }
  };

  // AGRUPACIÓN por categoría
  const groupedByCategory = pdfs.reduce<{ [cat: string]: DocumentItem[] }>((acc, pdf) => {
    const category = pdf.category || "Sin Categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(pdf);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <AdminSidebar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
        <div className="ml-64 flex-1 p-8">
          <AdminHeader />
          <AdminLayout>
            <div className="space-y-6">
              <div>Cargando...</div>
            </div>
          </AdminLayout>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      <div className="ml-64 flex-1 p-8">
        <AdminHeader />
        <AdminLayout>
          <div className="space-y-6">

            {currentSection === "news" && (
              <>
                <NewsForm
                  initialData={editingNews || undefined}
                  onSubmit={handleNewsSubmit}
                  onCancel={() => setEditingNews(null)}
                />
                <NewsList
                  news={news}
                  onEdit={setEditingNews}
                  onDelete={handleDelete}
                />
              </>
            )}

            {currentSection === "pdfs" && (
              <>
                <PdfUpload
                  pdfFile={pdfFile}
                  setPdfFile={setPdfFile}
                  pdfTitle={pdfTitle}
                  setPdfTitle={setPdfTitle}
                  pdfCategory={pdfCategory}
                  setPdfCategory={setPdfCategory}
                  handlePdfUpload={handlePdfUpload}
                />
                <div className="space-y-6">
                  {Object.entries(groupedByCategory).map(([category, docs]) => (
                    <div key={category} className="mb-8">
                      <h3 className="font-bold text-lg mb-2">{category}</h3>
                      <PdfList pdfs={docs} onDelete={handleDeletePdf} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentSection === "excel" && (
              <>
                {/* Selector de tipo de Excel */}
                <div className="w-1/3 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Excel
                  </label>
                  <select
                    value={excelType}
                    onChange={e => {
                      setExcelType(e.target.value);
                      setLoading(true);
                    }}
                    className="w-full p-2 border rounded"
                  >
                    {excelTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Componente de subida */}
                <ExcelUpload
                  excelType={excelType}
                  excelTypes={excelTypes}
                  onSuccess={() => fetchExcels()}
                  onError={msg => alert(msg)}
                  onUploadComplete={() => fetchExcels()}
                />

                {/* Listado de Excels */}
                <div className="space-y-4 mt-4">
                  {excels.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white p-3 rounded shadow"
                    >
                      <span>{item.name}</span>
                      <button
                        onClick={() => handleDeleteExcel(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && <div className="text-red-600 mt-4">{error}</div>}
          </div>
        </AdminLayout>
      </div>
    </div>
  );
};

export default AdminPage;