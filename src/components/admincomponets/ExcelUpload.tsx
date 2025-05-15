
import React, { useState } from 'react';

type ExcelRecord = Record<string, string | number | null | undefined>;

interface ExcelUploadProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onUploadComplete: () => void;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onSuccess, onError, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [records, setRecords] = useState<ExcelRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && !/\.(xlsx|xls)$/.test(selected.name)) {
      onError('Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }
    setFile(selected);
  };

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      const response = await fetch(`${API_URL}/upload-excel`);
      if (!response.ok) throw new Error('Error obteniendo registros');
      const data = await response.json();
      setRecords(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      onError('No se pudieron obtener los registros');
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Por favor selecciona un archivo');
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload-excel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Error subiendo archivo');
      }

      onSuccess('Archivo subido exitosamente');
      onUploadComplete();
      await fetchRecords(); // <-- Aquí consultamos los registros después de subir
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      onError(msg);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar archivo Excel</label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>

      <button
        onClick={fetchRecords}
        disabled={loadingRecords}
        className="ml-2 mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingRecords ? 'Cargando...' : 'Actualizar Registros'}
      </button>

      {records.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Registros del Excel:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  {Object.keys(records[0]).map((key) => (
                    <th key={key} className="border px-2 py-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="border px-2 py-1">{val != null ? String(val) : ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
