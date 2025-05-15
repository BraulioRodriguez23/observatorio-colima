// src/contexts/ExcelContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

//
// 1. Define el tipo de cada fila del Excel.
//    Usamos un Record cuyos valores pueden ser string, número o booleano.
//    Si tus filas tienen un esquema fijo (por ejemplo { nombre: string; edad: number; }),
//    reemplaza esto por tu interfaz concreta.
//
export type ExcelRow = Record<string, string | number | boolean>;

//
// 2. Define la forma del contexto.
//
interface ExcelContextValue {
  rows: ExcelRow[];
  fileId: number | null;
  loading: boolean;
  error: string | null;
  uploadExcel: (file: File, sectionId: number) => Promise<void>;
  fetchData: (id: number) => Promise<void>;
}

//
// 3. Crea el contexto con valores por defecto que cumplen la interfaz.
//
export const ExcelContext = createContext<ExcelContextValue>({
  rows: [],
  fileId: null,
  loading: false,
  error: null,
  uploadExcel: async () => { /* stub */ },
  fetchData: async () => { /* stub */ },
});

//
// 4. Provider que envuelve la aplicación.
//
export const ExcelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rows, setRows] = useState<ExcelRow[]>([]);
  const [fileId, setFileId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para subir el Excel y luego obtener sus datos
  const uploadExcel = async (file: File, sectionId: number): Promise<void> => {
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append('file', file);
    form.append('sectionId', sectionId.toString());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/excel/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: form,
        }
      );
      if (!res.ok) throw new Error('Upload failed');
      const json: { fileId: number } = await res.json();
      setFileId(json.fileId);
      await fetchData(json.fileId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los datos ya procesados del Excel
  const fetchData = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/excel/${id}/data`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (!res.ok) throw new Error('Fetch data failed');
      const data: ExcelRow[] = await res.json();
      setRows(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExcelContext.Provider
      value={{ rows, fileId, loading, error, uploadExcel, fetchData }}
    >
      {children}
    </ExcelContext.Provider>
  );
};
