import React from 'react';

export interface ExcelColumn {
  key: string;
  label: string;
}

export type ExcelViewMode = 'table' | 'batch';
export type ExcelType = 'mensual' | 'temporada' | 'puentes';

export interface ExcelRecord {
  id?: string | number;
  createdAt?: string | Date;
  year?: string | number;
  month?: string | number;
  season?: string;
  bridge_name?: string;
  [key: string]: string | number | boolean | Date | null | undefined;
}

interface ExcelListProps {
  data: ExcelRecord[];
  columns: ExcelColumn[];
  onDelete: (id: number) => void;
  onDeleteBatch?: (ids: number[]) => void;
  loading?: boolean;
  viewMode: ExcelViewMode;
  type: ExcelType;
}

const getBatchKey = (item: ExcelRecord, type: ExcelType): string => {
  if (item.createdAt) {
    const date = new Date(item.createdAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
  if (type === 'mensual') return `${item.year ?? 'N/A'} / ${item.month ?? 'N/A'}`;
  if (type === 'temporada') return `${item.year ?? 'N/A'} / ${item.season ?? 'N/A'}`;
  if (type === 'puentes') return `${item.year ?? 'N/A'} / ${item.bridge_name ?? 'N/A'}`;
  return 'Sin lote';
};

const groupByBatch = (data: ExcelRecord[], type: ExcelType) => {
  return data.reduce((acc: Record<string, ExcelRecord[]>, item) => {
    const batch = getBatchKey(item, type);
    if (!acc[batch]) acc[batch] = [];
    acc[batch].push(item);
    return acc;
  }, {});
};

const renderTable = (items: ExcelRecord[], columns: ExcelColumn[], onDelete: (id: number) => void) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {column.label}
          </th>
        ))}
        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {items.map((item, idx) => (
        <tr key={item.id ? String(item.id) : `row-${idx}`} className="hover:bg-gray-50 transition-colors">
          {columns.map((col) => (
            <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
              {item[col.key] !== null && item[col.key] !== undefined ? String(item[col.key]) : '-'}
            </td>
          ))}
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
            <button 
              onClick={() => onDelete(Number(item.id))} 
              className="text-red-600 hover:text-red-900 font-medium transition-colors"
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const ExcelList: React.FC<ExcelListProps> = ({ data, columns, onDelete, onDeleteBatch, loading = false, viewMode, type }) => {
  if (loading) {
    return <div className="mt-6 p-8 bg-white rounded-lg shadow text-center text-gray-500 animate-pulse">Cargando registros...</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="mt-6 p-8 bg-white rounded-lg shadow text-center text-gray-500">No hay datos disponibles para esta categoría.</div>;
  }

  const grouped = viewMode === 'batch' ? groupByBatch(data, type) : null;

  return (
    <div className="mt-6 space-y-6">
      {viewMode === 'batch' ? (
        Object.entries(grouped || {}).map(([group, items]) => (
          <div key={group} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Lote: {group} <span className="text-gray-500 text-sm font-normal">({items.length} registros)</span></span>
              {onDeleteBatch && (
                <button 
                  onClick={() => onDeleteBatch(items.map(i => Number(i.id)))} 
                  className="text-sm bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded transition-colors font-medium"
                >
                  Eliminar lote completo
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              {renderTable(items, columns, onDelete)}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {renderTable(data, columns, onDelete)}
        </div>
      )}
    </div>
  );
};