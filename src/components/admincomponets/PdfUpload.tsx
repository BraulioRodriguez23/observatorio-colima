import React from "react";

interface Props {
  pdfFile: File | null;
  setPdfFile: (f: File | null) => void;
  pdfTitle: string;
  setPdfTitle: (t: string) => void;
  pdfCategory: string;
  setPdfCategory: (t: string) => void;
  handlePdfUpload: (file: File, title: string, category: string) => void;
}

const PdfUpload: React.FC<Props> = ({
  pdfFile,
  setPdfFile,
  pdfTitle,
  setPdfTitle,
  pdfCategory,
  setPdfCategory,
  handlePdfUpload,
}) => (
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Título del PDF"
      value={pdfTitle}
      onChange={(e) => setPdfTitle(e.target.value)}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
    />

    <select
      value={pdfCategory}
      onChange={(e) => setPdfCategory(e.target.value)}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
    >
      <option value="">Selecciona la sección</option>
      <option value="Investigación">Investigación</option>
      <option value="Perfil y grado de satisfacción de los turistas que visitan el estado en temporadas vacacionales">
        Perfil y grado de satisfacción de los turistas que visitan el estado en temporadas vacacionales
      </option>
      <option value="Por temporada vacacional">Por temporada vacacional</option>
      <option value="Por destino">Por destino</option>
      <option value="Informe anual 2024">Informe anual 2024</option>
    </select>

    <input
      type="file"
      accept=".pdf"
      onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={() => {
        if (pdfFile && pdfTitle && pdfCategory)
          handlePdfUpload(pdfFile, pdfTitle, pdfCategory);
        else alert("Por favor, completa todos los campos");
      }}
      className="px-4 py-2 bg-blue-500 text-gray-800 rounded hover:bg-blue-600 "
    >
      Subir PDF
    </button>
  </div>
);

export default PdfUpload;
