import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

/**
 * Representa un registro de indicadores recuperado de la API.
 */
export interface DataRecord {
  id: number;
  year: number;
  bridgeName: string;
  municipality: string;
  occupancyRate: number;
  roomOffer: number;
  occupiedRooms: number;
  availableBeds: number;
  stay: number;
  density: number;
  nights: number;
  touristsPerNight: number;
  gpd: number;
  economicImpact: number;
  touristFlow: number;
  createdAt: string;
  updatedAt: string;
  /**
   * Cadena "YYYY-MM" derivada de createdAt
   */
  month: string;
}

interface UseExcelFilesParams {
  fromYear?: string;
  toYear?: string;
  municipality?: string;
}

/**
 * Hook para obtener registros de indicadores desde la API de info-injection.
 */
export const useExcelFiles = (
  params: UseExcelFilesParams,
  token: string
) => {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  const reload = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const queryParams: Record<string, string> = {};
        if (params.fromYear) queryParams.fromYear = params.fromYear;
        if (params.toYear) queryParams.toYear = params.toYear;
        if (params.municipality) queryParams.municipality = params.municipality;

        const response = await axios.get<Omit<DataRecord, 'month'>[]>(
          `${import.meta.env.VITE_API_BASE_URL}/info-injection`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: queryParams,
          }
        );
        // Enriquecemos cada registro con la propiedad 'month'
        const enriched: DataRecord[] = response.data.map(r => {
          const d = new Date(r.createdAt);
          const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          return { ...r, month };
        });
        setRecords(enriched);
      } catch (err: unknown) {
        let msg = 'Error cargando datos';
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ message?: string }>;
          msg = axiosErr.response?.data?.message || axiosErr.message;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.fromYear, params.toYear, params.municipality, token, trigger]);

  return { records, loading, error, reload };
};