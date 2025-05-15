import React from 'react';

export interface ExcelItem {
  id: string;
  fileName: string;
  uploadedAt: string;
}

interface ExcelListProps {
  data: ExcelItem[];
  onDelete: (id: string, fileName: string) => Promise<void>;
}

export const ExcelList: React.FC<ExcelListProps> = ({ data, onDelete }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Archivos Subidos</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No hay archivos subidos.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {data.map((item) => (
            <li key={item.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.fileName}</p>
                <p className="text-xs text-gray-500">Subido el {new Date(item.uploadedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => onDelete(item.id, item.fileName)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
