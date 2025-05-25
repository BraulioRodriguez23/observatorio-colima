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
   * Cadena en formato "YYYY-MM" derivada de createdAt.
   */
  month: string;
}

/**
 * Parámetros opcionales para filtrar los registros de indicadores.
 */
interface UseExcelFilesParams {
  fromYear?: string;
  toYear?: string;
  municipality?: string;
}

/**
 * Hook personalizado para obtener registros de indicadores desde la API de info-injection.
 *
 * @param params - Parámetros opcionales para filtrar la consulta (año desde/hasta, municipio).
 * @param token - Token de autenticación para realizar la petición.
 * @returns Un objeto con:
 *  - `records`: Lista de registros recibidos desde la API (con campo adicional 'month').
 *  - `loading`: Estado booleano que indica si los datos están cargando.
 *  - `error`: Mensaje de error si ocurre alguno durante la carga.
 *  - `reload`: Función que puede llamarse para recargar los datos manualmente.
 */
export const useExcelFiles = (
  params: UseExcelFilesParams,
  token: string
) => {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  /**
   * Fuerza la recarga de los datos reiniciando el efecto.
   */
  const reload = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  /**
   * Efecto que se dispara cuando cambian los filtros, el token o se llama a reload().
   */
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        // Construcción dinámica de los parámetros de consulta
        const queryParams: Record<string, string> = {};
        if (params.fromYear) queryParams.fromYear = params.fromYear;
        if (params.toYear) queryParams.toYear = params.toYear;
        if (params.municipality) queryParams.municipality = params.municipality;

        // Petición a la API
        const response = await axios.get<Omit<DataRecord, 'month'>[]>(
          `${import.meta.env.VITE_API_BASE_URL}/info-injection`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: queryParams,
          }
        );

        // Enriquecimiento de los datos con el campo 'month'
        const enriched: DataRecord[] = response.data.map(record => {
          const date = new Date(record.createdAt);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return { ...record, month };
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
