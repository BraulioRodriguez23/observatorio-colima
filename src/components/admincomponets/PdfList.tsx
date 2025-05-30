import React from "react";

interface DocumentItem {
  id: number;
  title: string;
  url: string;
  category: string;
}

interface PdfListProps {
  pdfs: DocumentItem[];
  onDelete: (id: number, fileName: string) => void;
}

function groupPdfsByCategory(pdfs: DocumentItem[]) {
  return pdfs.reduce<{ [key: string]: DocumentItem[] }>((acc, pdf) => {
    const cat = pdf.category || "ok";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pdf);
    return acc;
  }, {});
}

const PdfList: React.FC<PdfListProps> = ({ pdfs, onDelete }) => {
  const grouped = groupPdfsByCategory(pdfs);

  return (
    <div>
      {Object.entries(grouped).map(([category, pdfs]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfs.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2 text-blue-600">{item.title}</h3>
                <div className="flex justify-between">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Ver PDF
                  </a>
                  <button
                    onClick={() => onDelete(item.id, item.title)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PdfList;
