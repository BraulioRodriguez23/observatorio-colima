import { useState } from 'react';
import axios from 'axios';

interface ExcelData {
  id: number;
  year: number;
  municipality: string;
  occupancyRate?: number;
  touristFlow?: number;
  economicImpact?: number;
  roomOffer?: number;
  occupiedRooms?: number;
  availableRooms?: number;
  stay?: number;
  density?: number;
  touristsPerNight?: number;
  avgSpending?: number;
  bridgeName?: string;
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  year?: string;
  municipality?: string;
}

export const useExcelData = (
  route: 'monthly-stats' | 'season-stats' | 'long-weekend-stats'
) => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (currentPage = page, perPage = rowsPerPage) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuario no autenticado');

      // Construcción dinámica de params
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: perPage,
      };
      if (filters.year) params.fromYear = filters.year;
      if (filters.year) params.toYear = filters.year;
      if (filters.municipality) params.municipality = filters.municipality;

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/${route}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      // Paginación
      setData(response.data.rows || response.data);
      setTotal(response.data.total ?? response.data.length);
    } catch (err) {
      console.error('Error fetching Excel data:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    total,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    filters: {
      year: filters.year || '',
      municipality: filters.municipality || '',
      setYear: (year: string) => setFilters(prev => ({ ...prev, year })),
      setMunicipality: (municipality: string) =>
        setFilters(prev => ({ ...prev, municipality })),
    },
    loading,
    error,
    loadData,
  };
};