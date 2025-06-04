// pages/admin/ExcelManager.tsx
import React, { useState, useEffect } from 'react';
import { ExcelUpload } from '../../components/admincomponets/ExcelUpload';
import { ExcelList, ExcelItem } from '../../components/admincomponets/ExcelList';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ADMIN_TABS = [
  { label: "Corte mensual", value: "mensual" },
  { label: "Temporadas vacacionales", value: "temporada" },
  { label: "Fines de semana largos", value: "fines de semana largos" },
];

const excelTypes = [
  { value: "mensual",   route: "monthly-stats",   label: "Corte mensual"      },
  { value: "temporada", route: "season-stats",    label: "Temporadas vacacionales"    },
  { value: "puentes",   route: "puentes-stats",  label: "Fines de semana largos"      },
];

type ExcelType = typeof excelTypes[number]["value"];

const getEndpoint = (type: ExcelType) => {
  const config = excelTypes.find(e => e.value === type);
  return config ? config.route : "puentes-stats ";
};

const ExcelManager: React.FC = () => {
  const [excels, setExcels] = useState<ExcelItem[]>([]);
  const [excelType, setExcelType] = useState<ExcelType>("mensual");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchExcels = async (type = excelType) => {
    try {
      const res = await fetch(`${API_URL}/${getEndpoint(type)}`);
      const data = await res.json();
      setExcels(data);
    } catch {
      setError('Error cargando la lista de archivos');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${getEndpoint(excelType)}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchExcels();
      setSuccess(`Archivo eliminado.`);
    } catch {
      setError('Error eliminando archivo');
    }
  };

  // Eliminar todos los excels de una fecha
  const handleDeleteByDate = async (date: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${getEndpoint(excelType)}/by-date?date=${date}`, {
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
    fetchExcels(excelType);
    // eslint-disable-next-line
  }, [excelType]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Archivos Excel</h1>
      <div className="flex gap-2 mb-4">
        {ADMIN_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setExcelType(tab.value as ExcelType)}
            className={`px-4 py-2 rounded ${excelType === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <ExcelUpload
        excelType={excelType}
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
