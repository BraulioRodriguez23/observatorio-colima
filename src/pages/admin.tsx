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
import PdfUploadFront from "../components/admincomponets/pdfUploadFront";
import UserRegisterForm from "../components/admincomponets/UsersAdmin";

// -------- Types --------
type Section = "news" | "pdfs" | "excel" | "pdfFront" | "users";

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
  name: string;
  fileUrl: string;
  tipo: "mensual" | "temporada" | "puentes";
  createdAt: string;
  uploadedBy?: string;
}

const excelTypes = [
  { value: "mensual",   route: "monthly-stats",   label: "Mensual"   },
  { value: "temporada", route: "season-stats",    label: "Temporada" },
  { value: "puentes",   route: "long-weekend-stats",  label: "Puentes"   },
];

// -------- Supabase --------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
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
  const [pdfsFront, setPdfsFront] = useState<DocumentItem[]>([]);


  const API_BASE = import.meta.env.VITE_API_BASE_URL!;

  // -------- Fetch data --------
  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const url = `${API_BASE}/news`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar las noticias");
      const data = await response.json();
      setNews(data);
    } catch {
      setError("Error al cargar las noticias");
    }
  };

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const url = `${API_BASE}/inventory`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle, category: newCategory }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar el PDF");
      setPdfs((prev) =>
        prev.map((pdf) =>
          pdf.id === id ? { ...pdf, title: newTitle, category: newCategory } : pdf
        )
      );
    } catch {
      alert("Error al actualizar el PDF");
    }
  };

  // ------ pdfsFront (CORREGIDO)
 const fetchPdfsFront = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    const url = `${API_BASE}/pdfs-front`; // <- aquí cambia
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
    const response = await fetch(`${API_BASE}/pdfs-front/${id}`, { // <- aquí cambia
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle, category: newCategory }),
    });
    if (!response.ok) throw new Error("No se pudo actualizar el PDF Front");
    setPdfsFront((prev) =>
      prev.map((pdf) =>
        pdf.id === id ? { ...pdf, title: newTitle, category: newCategory } : pdf
      )
    );
  } catch {
    alert("Error al actualizar el PDF Front");
  }
};

const handlePdfUploadGeneral = async (
  file: File,
  title: string,
  category: string,
  section: "pdfs" | "pdfs-front"
) => {
  try {
    const token = localStorage.getItem("token") || "";
    const cleanedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}-${cleanedFileName}`;
    const bucket = section;
    const apiEndpoint =
      section === "pdfs" ? `${API_BASE}/inventory` : `${API_BASE}/pdfs-front`;

    // Subir a bucket correcto
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    console.log(storageError)

    if (storageError) throw storageError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    // Subir metadatos al endpoint correcto
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, fileUrl: publicUrl, category }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Error desconocido del servidor.",
      }));
      alert(
        `Error al guardar los datos del PDF: ${
          errorData.message || response.statusText
        }`
      );
      throw new Error("Error en la API al guardar el PDF");
    }

    // Refresca la lista según sección
    if (section === "pdfs") fetchPdfs();
    else fetchPdfsFront();

    setPdfFile(null);
    setPdfTitle("");
    setPdfCategory("");
    alert("PDF subido y guardado exitosamente.");
  } catch (err) {
    alert(
      "Ocurrió un error inesperado: " +
        (err instanceof Error ? err.message : String(err))
    );
  }
};


const handleDeletePdfFront = async (id: number, fileName: string) => {
  try {
    await supabase.storage.from("pdfs-front").remove([fileName]); // <- aquí cambia
    const token = localStorage.getItem("token") || "";
    const endpoint = `${API_BASE}/pdfs-front/${id}`; // <- aquí cambia
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Error borrando en API: ${response.status}`);
    setPdfsFront((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    alert((err as Error).message || "Error al eliminar el PDF convertido");
  }
};

  const fetchExcels = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const config = excelTypes.find((e) => e.value === excelType)!;
      const url = `${API_BASE}/${config.route}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al cargar los Excels");
      const data = await response.json();
      setExcels(data);
    } catch {
      setError("Error al cargar los Excels");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await fetchNews();
      await fetchPdfs();
      if (currentSection === "excel") {
        await fetchExcels();
      }
      if (currentSection === "pdfFront") {
        await fetchPdfsFront();
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, excelType]);

  // -------- Supabase uploads --------
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `news-images/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("news-articles")
      .upload(fileName, file, { contentType: file.type });

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
      let imageUrl = data.imageUrl || "";

      if (data.image) {
        imageUrl = await uploadImageToSupabase(data.image);
      }

      const token = localStorage.getItem("token") || "";
      const method = editingNews ? "PUT" : "POST";
      const endpoint = editingNews
        ? `${API_BASE}/news/${editingNews.id}`
        : `${API_BASE}/news`;

      const response = await fetch(endpoint, {
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
        throw new Error(editingNews ? "Error al actualizar la noticia" : "Error al crear la noticia");

      const newsItem = await response.json();
      if (editingNews) {
        setNews(news.map((item) => (item.id === editingNews.id ? newsItem : item)));
      } else {
        setNews((prev) => [...prev, newsItem]);
      }
      setEditingNews(null);
    } catch {
      alert(editingNews ? "Error al actualizar la noticia" : "Error al crear la noticia");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const newsItem = news.find((item) => item.id === id);
      if (newsItem?.imageUrl) {
        const parts = newsItem.imageUrl.split("/");
        const idx = parts.findIndex((p) => p === "news-images");
        if (idx >= 0) {
          const imagePath = parts.slice(idx).join("/");
          await supabase.storage.from("news-articles").remove([imagePath]);
        }
      }

      const token = localStorage.getItem("token") || "";
      const endpoint = `${API_BASE}/news/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar la noticia");

      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Error al eliminar la noticia");
    }
  };

  const handleDeletePdf = async (id: number, fileName: string) => {
    try {
      await supabase.storage.from("pdfs").remove([fileName]);
      const token = localStorage.getItem("token") || "";
      const endpoint = `${API_BASE}/inventory/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Error borrando en API: ${response.status}`);
      setPdfs((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert((err as Error).message || "Error al eliminar el PDF");
    }
  };

const handleDeleteAllExcels = async () => {
  if (!window.confirm("¿Seguro que quieres borrar TODOS los registros?")) return;

  try {
    const token = localStorage.getItem("token") || "";
    const config = excelTypes.find(e => e.value === excelType)!;
    const url = `${API_BASE}/${config.route}/all`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al eliminar todos los Excel");

    const data = await response.json();
    alert(data.message);
    setExcels([]);   // limpia el estado, lista vacía en frontend
  } catch (err) {
    alert((err as Error).message || "Error al eliminar todos los Excel");
  }
};


  // CORRECCIÓN: Crear groupedByCategory para pdfs normales
  const groupedByCategory = pdfs.reduce<{ [cat: string]: DocumentItem[] }>((acc, pdf) => {
    const category = pdf.category || "Sin Categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(pdf);
    return acc;
  }, {});

  // CORRECCIÓN: Crear groupedByCategoryFront para pdfsFront
  const groupedByCategoryFront = pdfsFront.reduce<{ [cat: string]: DocumentItem[] }>((acc, pdf) => {
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
              <span>Cargando...</span>
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
      handlePdfUpload={(file, title, category) =>
        handlePdfUploadGeneral(file, title, category, "pdfs")
      }
    />

                <div className="space-y-6 pt-4">
                  {Object.entries(groupedByCategory).map(([category, docs]) => (
                    <div key={category} className="mb-8">
                      <h3 className="font-bold text-lg mb-2">{category}</h3>
                      <PdfList
                        pdfs={docs}
                        onDelete={handleDeletePdf}
                        onEditSave={handleEditPdfSave}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentSection === "pdfFront" && (
              <>
                <PdfUploadFront
      pdfFile={pdfFile}
      setPdfFile={setPdfFile}
      pdfTitle={pdfTitle}
      setPdfTitle={setPdfTitle}
      pdfCategory={pdfCategory}
      setPdfCategory={setPdfCategory}
      handlePdfUpload={(file, title, category) =>
        handlePdfUploadGeneral(file, title, category, "pdfs-front")
      }
    />
                <div className="space-y-6 pt-4">
                  {Object.entries(groupedByCategoryFront).map(([category, docs]) => (
                    <div key={category} className="mb-8">
                      <h3 className="font-bold text-lg mb-2">{category}</h3>
                      <PdfList
                        pdfs={docs}
                        onDelete={handleDeletePdfFront}
                        onEditSave={handleEditPdfsFrontSave}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            {currentSection === "users" && (
              <>
                <UserRegisterForm />
              </>
            )}

           {currentSection === "excel" && (
  <>
    {/* Selector de tipo de Excel */}
    <div className="w-1/3 mb-4">
      <label htmlFor="tipo-excel" className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Excel
      </label>
      <select
        id="tipo-excel"
        value={excelType}
        onChange={(e) => setExcelType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {excelTypes.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>

    {/* Subida de Excel */}
    <ExcelUpload
      excelType={excelType as "mensual" | "temporada" | "puentes"}
      onSuccess={() => fetchExcels()}
      onError={(msg) => alert(msg)}
      onUploadComplete={() => fetchExcels()}
    />

    {/* ✅ Botón de Eliminar Todos - AQUÍ está bien */}
    <button
      onClick={handleDeleteAllExcels}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4"
    >
      Eliminar Todos
    </button>

    {/* Listado de archivos */}
    <div className="space-y-4 mt-4">
      {excels.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white p-3 rounded shadow"
        >
          <span>{item.name}</span>
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