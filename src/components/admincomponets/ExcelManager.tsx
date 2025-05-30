// pages/admin/ExcelManager.tsx
import React, { useState, useEffect } from 'react';
import { ExcelUpload } from '../../components/admincomponets/ExcelUpload';
import { ExcelList, ExcelItem } from '../../components/admincomponets/ExcelList';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ExcelManager: React.FC = () => {
  const [excels, setExcels] = useState<ExcelItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchExcels = async () => {
    try {
      const res = await fetch(`${API_URL}/info-injection`);
      const data = await res.json();
      setExcels(data);
    } catch {
      setError('Error cargando la lista de archivos');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/info-injection/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      setExcels(prev => prev.filter(item => item.id !== id));
      setSuccess(`Archivo eliminado.`);
    } catch {
      setError('Error eliminando archivo');
    }
  };

  // Eliminar todos los excels de una fecha
  const handleDeleteByDate = async (date: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/info-injection/by-date?date=${date}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar por fecha');
      fetchExcels();
      setSuccess(`Se eliminaron los archivos del ${date}.`);
    } catch {
      setError('Error al eliminar archivos por fecha');
    }
  };

  useEffect(() => {
    fetchExcels();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Archivos Excel</h1>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <ExcelUpload
        excelType="default" // Cambia "default" por el tipo de excel adecuado
        onSuccess={(msg) => {
          setSuccess(msg);
          setError('');
          fetchExcels();
        }}
        onError={(msg) => {
          setError(msg);
          setSuccess('');
        }}
        onUploadComplete={fetchExcels}
      />

      <ExcelList data={excels} onDelete={handleDelete} onDeleteByDate={handleDeleteByDate} />
    </div>
  );
};

export default ExcelManager;
