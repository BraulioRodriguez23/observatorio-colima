import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface HolidayStat {
  id: string;
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
  month: string;
}

export interface UseHolidayParams {
  fromYear?: string;
  toYear?: string;
  municipality?: string;
}

export const useHolidayStats = (
  params: UseHolidayParams,
  token: string
) => {
  const [data, setData] = useState<HolidayStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const reload = useCallback(() => {
    setTrigger(t => t + 1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const query: Record<string,string> = {};
        if (params.fromYear) query.fromYear = params.fromYear;
        if (params.toYear)   query.toYear   = params.toYear;
        if (params.municipality) query.municipality = params.municipality;

        const res = await axios.get<HolidayStat[]>(
          `${import.meta.env.VITE_API_BASE_URL}/upload-excel`,
          { headers: { Authorization: `Bearer ${token}` }, params: query }
        );
        setData(res.data);
      } catch (err: unknown) {
        let msg = 'Error cargando estadísticas';
        if (axios.isAxiosError(err)) msg = err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params, token, trigger]);

  return { data, loading, error, reload };
};
