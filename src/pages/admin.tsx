import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admincomponets/AdminSidebar";
import AdminLayout from "../components/admincomponets/AdminLayout";
import AdminHeader from "../components/admincomponets/AdminHeader";
import NewsForm from "../components/admincomponets/NewForm";
import NewsList from "../components/admincomponets/NewsList";
import PdfList from "../components/admincomponets/PdfList";
import PdfUpload from "../components/admincomponets/PdfUpload";
import { createClient } from "@supabase/supabase-js";
import PdfUploadFront from "../components/admincomponets/pdfUploadFront";
import UserRegisterForm from "../components/admincomponets/UsersAdmin";
import UserList from "../components/admincomponets/GetAllUser";
import ActivityLog from "../components/admincomponets/ActivityLog";

// AQUÍ IMPORTAMOS EL MANAGER QUE ARREGLAMOS
import ExcelManager from "../components/admincomponets/ExcelManager";

// -------- Types --------
type Section = "news" | "pdfs" | "excel" | "pdfFront" | "users" | "activityLog";

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

// -------- Supabase --------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pdfs, setPdfs] = useState<DocumentItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfCategory, setPdfCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pdfsFront, setPdfsFront] = useState<DocumentItem[]>([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL!;

  // -------- Fetch data --------
  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/news`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Error al cargar las noticias");
      setNews(await response.json());
    } catch {
      setError("Error al cargar las noticias");
    }
  };

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/inventory`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Error al cargar los PDFs");
      const data = await response.json();
      setPdfs(
        data.map((d: DocumentItem & { fileUrl?: string }) => ({
          ...d,
          id: Number(d.id),
          url: d.url ?? d.fileUrl!,
          category: d.category ?? "Sin Categoría",
        }))
      );
    } catch {
      setError("Error al cargar los PDFs");
    }
  };

  const handleEditPdfSave = async (id: number, newTitle: string, newCategory: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, category: newCategory }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar el PDF");
      setPdfs((prev) => prev.map((pdf) => pdf.id === id ? { ...pdf, title: newTitle, category: newCategory } : pdf));
    } catch {
      alert("Error al actualizar el PDF");
    }
  };

  const fetchPdfsFront = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/pdfs-front`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Error al cargar los PDFs Front");
      const data = await response.json();
      setPdfsFront(
        data.map((d: DocumentItem & { fileUrl?: string }) => ({
          ...d,
          id: Number(d.id),
          url: d.url ?? d.fileUrl!,
          category: d.category ?? "Sin Categoría",
        }))
      );
    } catch {
      setError("Error al cargar los PDFs Front");
    }
  };

  const handleEditPdfsFrontSave = async (id: number, newTitle: string, newCategory: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/pdfs-front/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, category: newCategory }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar el PDF Front");
      setPdfsFront((prev) => prev.map((pdf) => pdf.id === id ? { ...pdf, title: newTitle, category: newCategory } : pdf));
    } catch {
      alert("Error al actualizar el PDF Front");
    }
  };

  const handlePdfUploadGeneral = async (file: File, title: string, category: string, section: "pdfs" | "pdfs-front") => {
    try {
      const token = localStorage.getItem("token") || "";
      const cleanedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileName = `${Date.now()}-${cleanedFileName}`;
      const bucket = section;
      const apiEndpoint = section === "pdfs" ? `${API_BASE}/inventory` : `${API_BASE}/pdfs-front`;

      const { error: storageError } = await supabase.storage.from(bucket).upload(fileName, file);
      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, fileUrl: publicUrl, category }),
      });

      if (!response.ok) throw new Error("Error en la API al guardar el PDF");

      if (section === "pdfs") fetchPdfs();
      else fetchPdfsFront();

      setPdfFile(null); setPdfTitle(""); setPdfCategory("");
      alert("PDF subido y guardado exitosamente.");
    } catch (err) {
      alert("Ocurrió un error inesperado: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeletePdfFront = async (id: number, fileName: string) => {
    try {
      await supabase.storage.from("pdfs-front").remove([fileName]);
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/pdfs-front/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Error borrando en API: ${response.status}`);
      setPdfsFront((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message || "Error al eliminar el PDF");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      await fetchNews();
      await fetchPdfs();
      if (currentSection === "pdfFront") await fetchPdfsFront();
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `news-images/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("news-articles").upload(fileName, file, { contentType: file.type });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("news-articles").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleNewsSubmit = async (data: { title: string; content: string; image?: File; imageUrl?: string; }) => {
    try {
      let imageUrl = data.imageUrl || "";
      if (data.image) imageUrl = await uploadImageToSupabase(data.image);

      const token = localStorage.getItem("token") || "";
      const method = editingNews ? "PUT" : "POST";
      const endpoint = editingNews ? `${API_BASE}/news/${editingNews.id}` : `${API_BASE}/news`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: data.title, content: data.content, imageUrl,
          metadata: { author: "Autor", date: new Date().toISOString() }, userId: "1",
        }),
      });

      if (!response.ok) throw new Error("Error al procesar la noticia");
      const newsItem = await response.json();

      if (editingNews) setNews(news.map((item) => (item.id === editingNews.id ? newsItem : item)));
      else setNews((prev) => [...prev, newsItem]);

      setEditingNews(null);
    } catch {
      alert("Error al procesar la noticia");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const newsItem = news.find((item) => item.id === id);
      if (newsItem?.imageUrl) {
        const parts = newsItem.imageUrl.split("/");
        const idx = parts.findIndex((p) => p === "news-images");
        if (idx >= 0) await supabase.storage.from("news-articles").remove([parts.slice(idx).join("/")]);
      }
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/news/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar");
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Error al eliminar la noticia");
    }
  };

  const handleDeletePdf = async (id: number, fileName: string) => {
    try {
      await supabase.storage.from("pdfs").remove([fileName]);
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${API_BASE}/inventory/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error borrando en API");
      setPdfs((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message || "Error al eliminar el PDF");
    }
  };

  const groupedByCategory = pdfs.reduce<{ [cat: string]: DocumentItem[] }>((acc, pdf) => {
    const category = pdf.category || "Sin Categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(pdf);
    return acc;
  }, {});

  const groupedByCategoryFront = pdfsFront.reduce<{ [cat: string]: DocumentItem[] }>((acc, pdf) => {
    const category = pdf.category || "Sin Categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(pdf);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <AdminSidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
        <div className="ml-64 flex-1 p-8">
          <AdminHeader />
          <AdminLayout><div className="space-y-6"><span>Cargando...</span></div></AdminLayout>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      <div className="ml-64 flex-1 p-8">
        <AdminHeader />
        <AdminLayout>
          <div className="space-y-6">

            {currentSection === "news" && (
              <>
                <NewsForm initialData={editingNews || undefined} onSubmit={handleNewsSubmit} onCancel={() => setEditingNews(null)} />
                <NewsList news={news} onEdit={setEditingNews} onDelete={handleDelete} />
              </>
            )}

            {currentSection === "pdfs" && (
              <>
                <PdfUpload pdfFile={pdfFile} setPdfFile={setPdfFile} pdfTitle={pdfTitle} setPdfTitle={setPdfTitle} pdfCategory={pdfCategory} setPdfCategory={setPdfCategory} handlePdfUpload={(file, title, category) => handlePdfUploadGeneral(file, title, category, "pdfs")} />
                <div className="space-y-6 pt-4">
                  {Object.entries(groupedByCategory).map(([category, docs]) => (
                    <div key={category} className="mb-8">
                      <h3 className="font-bold text-lg mb-2">{category}</h3>
                      <PdfList pdfs={docs} onDelete={handleDeletePdf} onEditSave={handleEditPdfSave} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentSection === "pdfFront" && (
              <>
                <PdfUploadFront pdfFile={pdfFile} setPdfFile={setPdfFile} pdfTitle={pdfTitle} setPdfTitle={setPdfTitle} pdfCategory={pdfCategory} setPdfCategory={setPdfCategory} handlePdfUpload={(file, title, category) => handlePdfUploadGeneral(file, title, category, "pdfs-front")} />
                <div className="space-y-6 pt-4">
                  {Object.entries(groupedByCategoryFront).map(([category, docs]) => (
                    <div key={category} className="mb-8">
                      <h3 className="font-bold text-lg mb-2">{category}</h3>
                      <PdfList pdfs={docs} onDelete={handleDeletePdfFront} onEditSave={handleEditPdfsFrontSave} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentSection === "users" && (
              <>
                <UserRegisterForm />
                <UserList />
              </>
            )}

            {/* AQUÍ ESTÁ EL CAMBIO MÁGICO. TODO SE DELEGA A TU EXCEL MANAGER */}
            {currentSection === "excel" && (
              <ExcelManager />
            )}

            {currentSection === "activityLog" && (
              <ActivityLog />
            )}

            {error && <div className="text-red-600 mt-4">{error}</div>}
          </div>
        </AdminLayout>
      </div>
    </div>
  );
};

export default AdminPage;