import { useState } from 'react';
import axios from 'axios';

interface ExcelData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touristFlow: any;       // ajusta el tipo si sabes más
  año: number;
  municipio: string;
  porcentaje_ocupacion: number;
  oferta_cuartos: number;
  cuartos_ocupados: number;
  derrama_economica: number;
}

interface Filters {
  year: string;
  municipio: string;
}

export const useExcelData = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<Filters>({ year: '', municipio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (currentPage = page, rowsPerPage = 10) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      // 1. Construcción dinámica de params
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: rowsPerPage
      };
      if (filters.year) {
        params.year = filters.year;              // aquí 'year' coincide con tu backend
      }
      if (filters.municipio) {
        params.municipality = filters.municipio; // backend espera 'municipality'
      }

      // 2. Llamada con Axios
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/upload-excel`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );

      setData(response.data.rows);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Error fetching Excel files:', err);
      setError('No se pudieron cargar los archivos. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    total,
    loadData,
    page,
    setPage,
    filters: {
      year: filters.year,
      municipio: filters.municipio,
      setYear: (value: string) =>
        setFilters(prev => ({ ...prev, year: value })),
      setMunicipio: (value: string) =>
        setFilters(prev => ({ ...prev, municipio: value }))
    },
    loading,
    error
  };
};
