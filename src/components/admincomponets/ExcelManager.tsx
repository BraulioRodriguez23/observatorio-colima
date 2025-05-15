// src/pages/admin/ExcelManager.tsx
import React, { useState, useEffect } from 'react';
import { ExcelUpload } from '../../components/admincomponets/ExcelUpload';
import { ExcelList, ExcelItem } from '../../components/admincomponets/ExcelList';

const ExcelManager: React.FC = () => {
  const [excels, setExcels] = useState<ExcelItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchExcels = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/info-injection`);
      const data = await res.json();
      setExcels(data);
    } catch (err) {
      console.error(err);
      setError('Error cargando la lista de archivos');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/:id${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al eliminar');

      setExcels(prev => prev.filter(item => item.id !== id));
      setSuccess(`Archivo "${name}" eliminado.`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Error eliminando archivo');
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

      <ExcelList data={excels} onDelete={handleDelete} />
    </div>
  );
};

export default ExcelManager;