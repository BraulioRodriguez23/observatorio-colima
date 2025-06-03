import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

/**
 * Representa un registro de indicadores recuperado de la API.
 * Se incluyen campos que pueden venir de monthly-stats, season-stats o info-injection.
 */
export interface DataRecord {
  id: number;
  year: number;
  // Campos comunes
  municipality: string;
  // Para monthly-stats
  month?: string;           // ejemplo "2021-03"
  occupancyRate?: number;
  touristFlow?: number;
  economicImpact?: number;
  // Para season-stats
  season?: string;
  roomOffer?: number;
  occupiedRooms?: number;
  availableRooms?: number;
  stay?: number;
  density?: number;
  touristsPerNight?: number;
  avgSpending?: number;
  // Para info-injection (puentes)
  bridgeName?: string;
  // timestamps
  createdAt: string;
  updatedAt: string;
}

interface UseExcelFilesParams {
  fromYear?: string;
  toYear?: string;
  municipality?: string;
}

/**
 * Hook personalizado para obtener registros de indicadores desde distintas APIs:
 * - monthly-stats
 * - season-stats
 * - info-injection
 * 
 * @param params Filtros de consulta.
 * @param token  Token de autenticación.
 * @param route  Ruta base (monthly-stats|season-stats|info-injection).
 */
export const useExcelFiles = (
  params: UseExcelFilesParams,
  token: string,
  route: 'monthly-stats' | 'season-stats' | 'puentes-stats'
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
        if (params.fromYear)    queryParams.fromYear    = params.fromYear;
        if (params.toYear)      queryParams.toYear      = params.toYear;
        if (params.municipality) queryParams.municipality = params.municipality;

        const response = await axios.get<Omit<DataRecord, 'month'>[]>(
          `${import.meta.env.VITE_API_BASE_URL}/${route}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: queryParams,
          }
        );

        // Para monthly-stats y season-stats, la API ya devuelve "month" o "bridgeName".
        // No necesitamos enrich en el front a menos que falte.
        setRecords(response.data as DataRecord[]);
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
  }, [params.fromYear, params.toYear, params.municipality, token, route, trigger]);

  return { records, loading, error, reload };
};
