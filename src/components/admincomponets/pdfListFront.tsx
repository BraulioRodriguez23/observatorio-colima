// components/admincomponets/PdfList.tsx
import React, { useState } from "react";

interface DocumentItem {
  id: number;
  title: string;
  url: string;
  category: string;
}

interface PdfListProps {
  pdfs: DocumentItem[];
  onDelete: (id: number, fileName: string) => void;
  onEditSave: (id: number, newTitle: string, newCategory: string) => Promise<void>;
}

const PdfListFront: React.FC<PdfListProps> = ({ pdfs, onDelete, onEditSave }) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const startEdit = (pdf: DocumentItem) => {
    setEditId(pdf.id);
    setEditTitle(pdf.title);
    setEditCategory(pdf.category || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditCategory("");
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      alert("El título no puede estar vacío.");
      return;
    }
    setEditLoading(true);
    await onEditSave(editId!, editTitle, editCategory);
    setEditLoading(false);
    cancelEdit();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className="bg-white rounded-xl shadow-md p-5 flex flex-col transition hover:shadow-lg"
        >
          {editId === pdf.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="border border-pink-400 rounded px-2 py-1 mb-2 text-lg w-full focus:outline-pink-500"
                disabled={editLoading}
                autoFocus
                maxLength={120}
              />
              <input
                type="text"
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 mb-3 text-sm w-full focus:outline-pink-400"
                placeholder="Categoría"
                disabled={editLoading}
                maxLength={80}
              />
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg mb-1 text-blue-600 break-words">{pdf.title}</h3>
              <span className="text-xs bg-pink-100 text-pink-600 rounded px-2 py-1 mb-2 w-fit">
                {pdf.category || "Sin Categoría"}
              </span>
            </>
          )}

          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm mt-2"
          >
            Ver PDF
          </a>

          <div className="flex gap-2 mt-4">
            {editId === pdf.id ? (
              <>
                <button
                  className="flex-1 bg-green-500 text-white rounded px-3 py-2 font-bold hover:bg-green-600 transition"
                  onClick={saveEdit}
                  disabled={editLoading}
                >
                  {editLoading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  className="flex-1 bg-gray-200 text-gray-700 rounded px-3 py-2 font-semibold hover:bg-gray-300 transition"
                  onClick={cancelEdit}
                  disabled={editLoading}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex-1 bg-blue-600 text-white rounded px-3 py-2 font-bold hover:bg-blue-700 transition"
                  onClick={() => startEdit(pdf)}
                >
                  Editar
                </button>
                <button
                  className="flex-1 bg-black text-red-500 rounded px-3 py-2 font-bold hover:bg-gray-800 transition"
                  onClick={() => onDelete(pdf.id, pdf.url.split("/").pop() || "")}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PdfListFront;
