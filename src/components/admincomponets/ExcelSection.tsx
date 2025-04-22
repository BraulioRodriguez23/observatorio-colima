// src/components/admincomponets/ExcelSection.tsx
import React, { useState } from 'react';

export interface DocumentItem {
  id: string;
  title: string;
  url: string;
}

interface ExcelSectionProps {
  data: DocumentItem[];
  onUpload: (file: File, title: string) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
}

const ExcelSection: React.FC<ExcelSectionProps> = ({ data, onUpload, onDelete }) => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelTitle, setExcelTitle] = useState('');

  const handleUpload = async () => {
    if (!excelFile || !excelTitle) {
      alert('Por favor completa todos los campos');
      return;
    }
    try {
      await onUpload(excelFile, excelTitle);
      setExcelFile(null);
      setExcelTitle('');
    } catch (err) {
      console.error(err);
      alert('Error al subir el Excel');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Subir Excel</h2>
      <input
        type="text"
        placeholder="Título del Excel"
        value={excelTitle}
        onChange={e => setExcelTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={e => setExcelFile(e.target.files?.[0] || null)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Subir Excel
      </button>
      <ul className="mt-4 space-y-2">
        {data.map(item => (
          <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {item.title}
            </a>
            <button
              onClick={() => onDelete(item.id, item.title)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExcelSection;