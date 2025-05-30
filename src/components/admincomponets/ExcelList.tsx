// components/admincomponets/ExcelList.tsx
import React from 'react';

export interface ExcelItem {
  id: number;
  name: string;
  uploadedAt: string;
}

interface ExcelListProps {
  data: ExcelItem[];
  onDelete: (id: number) => void;
  onDeleteByDate?: (date: string) => void;
}

function groupByDate(data: ExcelItem[]) {
  return data.reduce((acc, item) => {
    const date = item.uploadedAt.slice(0, 10);
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ExcelItem[]>);
}

export const ExcelList: React.FC<ExcelListProps> = ({ data, onDelete, onDeleteByDate }) => {
  const grouped = groupByDate(data);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Archivos Subidos</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No hay archivos subidos.</p>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{date} ({items.length})</h3>
              {onDeleteByDate && (
                <button
                  onClick={() => onDeleteByDate(date)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Eliminar todos los de este día
                </button>
              )}
            </div>
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Subido el {new Date(item.uploadedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};
