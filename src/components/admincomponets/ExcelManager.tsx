import React, { useState, useEffect } from 'react';
import { ExcelUpload } from './ExcelUpload';
import { ExcelList, ExcelColumn, ExcelRecord } from './ExcelList';
import { SingleRecordForm } from './SingleRecordForm';
import { EditRecordModal } from './EditRecordModal';
import { ConfirmModal } from './ConfirmModal';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ADMIN_TABS = [
  { value: 'mensual', route: 'monthly-stats', label: 'Corte mensual' },
  { value: 'temporada', route: 'season-stats', label: 'Temporadas vacacionales' },
  { value: 'puentes', route: 'long-weekend-stats', label: 'Fines de semana largos' },
] as const;

type ExcelType = typeof ADMIN_TABS[number]['value'];
type ViewMode = 'table' | 'batch';

// Definición dinámica de columnas dependiendo de la pestaña
const getColumns = (type: ExcelType): ExcelColumn[] => {
  if (type === 'mensual') {
    return [
      { key: 'id', label: 'ID' }, { key: 'year', label: 'Año' }, { key: 'month', label: 'Mes' },
      { key: 'municipality', label: 'Municipio' }, { key: 'occupancyRate', label: 'Ocupación (%)', format: 'percentage' },
      { key: 'touristFlow', label: 'Turistas', format: 'number' }, { key: 'economicImpact', label: 'Impacto Económico', format: 'currency' },
    ];
  }
  if (type === 'temporada') {
    return [
      { key: 'id', label: 'ID' }, { key: 'year', label: 'Año' }, { key: 'season', label: 'Temporada' },
      { key: 'municipality', label: 'Municipio' }, { key: 'occupancyRate', label: 'Ocupación (%)', format: 'percentage' },
      { key: 'economicImpact', label: 'Derrama Económica', format: 'currency' }, { key: 'touristFlow', label: 'Afluencia Turística', format: 'number' },
    ];
  }
  return [
    { key: 'id', label: 'ID' }, { key: 'year', label: 'Año' }, { key: 'bridge_name', label: 'Puente' },
    { key: 'municipality', label: 'Municipio' }, { key: 'occupancy_rate', label: 'Ocupación (%)', format: 'percentage' },
    { key: 'economic_impact', label: 'Derrama', format: 'currency' }, { key: 'tourist_flow', label: 'Afluencia', format: 'number' },
  ];
};

const ExcelManager: React.FC = () => {
  const [records, setRecords] = useState<ExcelRecord[]>([]);
  const [excelType, setExcelType] = useState<ExcelType>('mensual');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRecord, setEditingRecord] = useState<ExcelRecord | null>(null);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isLoading: boolean;
    onConfirm: (() => Promise<void>) | null;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isLoading: false,
    onConfirm: null
  });

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const route = ADMIN_TABS.find(t => t.value === excelType)?.route;
      const res = await fetch(`${API_URL}/${route}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Error cargando los datos del servidor.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Registro',
      message: '¿Estás seguro de que deseas eliminar este registro individual? Esta acción no se puede deshacer.',
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const route = ADMIN_TABS.find(t => t.value === excelType)?.route;
          const res = await fetch(`${API_URL}/${route}/${id}`, { 
            method: 'DELETE', 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
          });
          if (!res.ok) throw new Error('Error al borrar');
          setSuccess('Registro eliminado con éxito.');
          fetchRecords();
        } catch (err) {
          console.error(err);
          setError('Ocurrió un error al intentar eliminar el registro.');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        }
      }
    });
  };

  const handleDeleteBatch = (ids: number[]) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Lote Completo',
      message: `ATENCIÓN: ¿Estás seguro de que deseas eliminar todo el lote (${ids.length} registros)? Esta acción no se puede deshacer y borrará permanentemente la información.`,
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const route = ADMIN_TABS.find(t => t.value === excelType)?.route;
          const token = localStorage.getItem('token');
          await Promise.all(
            ids.map(id =>
              fetch(`${API_URL}/${route}/${id}`, {
                method: 'DELETE', 
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );
          setSuccess('Lote eliminado correctamente.');
          fetchRecords();
        } catch (err) {
          console.error(err);
          setError('Error eliminando algunos registros del lote.');
          fetchRecords(); 
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        }
      }
    });
  };

  useEffect(() => {
    fetchRecords();
    // Limpiamos mensajes al cambiar de pestaña
    setError('');
    setSuccess('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelType]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6 relative">
      <div className="flex flex-wrap gap-2">
        {ADMIN_TABS.map(tab => (
          <button 
            key={tab.value} 
            onClick={() => setExcelType(tab.value)}
            className={`px-4 py-2 rounded font-medium transition-colors ${excelType === tab.value ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('table')} 
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Vista de Tabla
          </button>
          <button 
            onClick={() => setViewMode('batch')} 
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${viewMode === 'batch' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Vista por Lote
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium border border-red-200">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium border border-green-200">{success}</div>}

     <SingleRecordForm
        excelType={excelType}
        onSuccess={(msg) => { setSuccess(msg); fetchRecords(); }}
        onError={(msg) => setError(msg)}
      />

      <ExcelUpload 
        excelType={excelType} 
        onSuccess={(msg) => {
          setSuccess(msg);
          fetchRecords();
        }}
        onError={(msg) => setError(msg)}
        onUploadComplete={fetchRecords} 
      />

      <ExcelList 
        data={records} 
        columns={getColumns(excelType)} 
        onDelete={handleDelete} 
        onDeleteBatch={handleDeleteBatch} 
        onEdit={setEditingRecord}
        loading={loading} 
        viewMode={viewMode} 
        type={excelType} 
      />

      {editingRecord && (
        <EditRecordModal
          excelType={excelType}
          record={editingRecord}
          onSuccess={(msg) => {
            setSuccess(msg);
            fetchRecords();
          }}
          onError={(msg) => setError(msg)}
          onClose={() => setEditingRecord(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isLoading={confirmModal.isLoading}
        onConfirm={() => {
          if (confirmModal.onConfirm) confirmModal.onConfirm();
        }}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ExcelManager;