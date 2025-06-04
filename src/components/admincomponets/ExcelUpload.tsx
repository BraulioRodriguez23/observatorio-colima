import React, { useState } from 'react';

const excelTypes = [
  { value: "mensual",   route: "monthly-stats",   label: "Corte mensual" },
  { value: "temporada", route: "season-stats",    label: "Temporadas vacacionales" },
  { value: "fines de semana largos", route: "puentes-stats",  label: "Fines de semana largos" },
];

type ExcelType = typeof excelTypes[number]["value"];

interface ExcelUploadProps {
  excelType: ExcelType;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onUploadComplete: () => void;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({
  excelType,
  onSuccess,
  onError,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && !/\.(xlsx|xls)$/.test(selected.name)) {
      onError('Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Por favor selecciona un archivo');
      return;
    }
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuario no autenticado');

      const config = excelTypes.find(e => e.value === excelType);
      if (!config) throw new Error('Tipo de Excel no válido');

      const url = `${import.meta.env.VITE_API_BASE_URL}/${config.route}/upload-excel`;
      const formData = new FormData();
      formData.append('file', file);
    

      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error subiendo archivo');
      }

      onSuccess('Archivo subido exitosamente');
      onUploadComplete();
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar archivo Excel
      </label>
      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>
    </div>
  );
};
