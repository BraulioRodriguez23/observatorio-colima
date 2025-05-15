// src/components/admincomponets/DownloadExcel.tsx
import React, { useContext } from 'react';
import { ExcelContext } from '../../context/ExcelContext';

export const DownloadExcel: React.FC = () => {
  const { fileId } = useContext(ExcelContext);
  if (!fileId) return null;
  return (
    <a
      href={`${import.meta.env.VITE_API_BASE_URL}/excels/${fileId}/download`}
      className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      download
    >
      Descargar original
    </a>
  );
};
