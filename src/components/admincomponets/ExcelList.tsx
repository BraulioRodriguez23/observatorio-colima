import React, { useState, useMemo } from 'react';

export interface ExcelColumn {
  key: string;
  label: string;
  format?: 'currency' | 'percentage' | 'number';
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
  onEdit?: (record: ExcelRecord) => void;
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

const formatValue = (value: any, format?: string) => {
  if (value === null || value === undefined) return '-';
  if (format === 'currency') {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(value));
  }
  if (format === 'percentage') {
    return `${Number(value).toFixed(2)}%`;
  }
  if (format === 'number') {
    return new Intl.NumberFormat('es-MX').format(Number(value));
  }
  return String(value);
};

const renderTable = (items: ExcelRecord[], columns: ExcelColumn[], onDelete: (id: number) => void, onEdit?: (record: ExcelRecord) => void) => (
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
              {formatValue(item[col.key], col.format)}
            </td>
          ))}
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
            {onEdit && (
              <button 
                onClick={() => onEdit(item)} 
                className="text-blue-600 hover:text-blue-900 font-medium transition-colors mr-3"
              >
                Editar
              </button>
            )}
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

export const ExcelList: React.FC<ExcelListProps> = ({ data, columns, onDelete, onDeleteBatch, onEdit, loading = false, viewMode, type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter(item => 
      columns.some(col => {
        const val = item[col.key];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(lowerTerm);
      })
    );
  }, [data, columns, searchTerm]);

  const paginatedData = useMemo(() => {
    if (viewMode === 'batch') return filteredData; // Batch mode handles its own grouping, we won't paginate it to keep it simple, or we paginate the flat list? Actually, batch mode is usually for deleting a whole upload. Let's just return filteredData for batch.
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, viewMode]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return <div className="mt-6 p-8 bg-white rounded-lg shadow text-center text-gray-500 animate-pulse">Cargando registros...</div>;
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="mt-6 p-12 bg-white rounded-lg shadow flex flex-col items-center justify-center text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <p className="text-lg font-medium">No hay registros disponibles</p>
        <p className="text-sm mt-1">Sube un Excel o agrega el primero manualmente.</p>
      </div>
    );
  }

  const grouped = viewMode === 'batch' ? groupByBatch(filteredData, type) : null;

  return (
    <div className="mt-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="Buscar registros..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

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
              {renderTable(items, columns, onDelete, onEdit)}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            {renderTable(paginatedData, columns, onDelete, onEdit)}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando del <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> al{' '}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> de{' '}
                    <span className="font-medium">{filteredData.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};