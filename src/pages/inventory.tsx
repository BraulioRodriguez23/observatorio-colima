/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import { useExcelFiles, DataRecord } from '../hooks/ExcelFiles';
import { useExcelExport } from '../hooks/useExcelExport';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

const municipiosColima = [
  'Colima', 'Tecomán', 'Manzanillo',
   'Comala', 'Armería',
   
];

const metricOptions = [
  { key: 'occupancyRate',    label: '% Ocupación'        },
  { key: 'roomOffer',        label: 'Oferta cuartos'     },
  { key: 'occupiedRooms',    label: 'Cuartos ocupados'   },
  { key: 'availableBeds',    label: 'Ctos. disp.'        },
  { key: 'stay',             label: 'Estadía'            },
  { key: 'density',          label: 'Densidad'           },
  { key: 'touristsPerNight', label: 'Turistas noche'     },
  { key: 'gpd',              label: 'Gasto promedio diario'},
  { key: 'economicImpact',   label: 'Derrama económica'  },
  { key: 'touristFlow',      label: 'Afluencia turística'},
];

const monthMap: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4,
  mayo: 5, junio: 6, julio: 7, agosto: 8,
  septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

const parseMonthNumber = (bridgeName: string): number | null => {
  const monthPart = bridgeName.split(' ')[0].toLowerCase();
  return monthMap[monthPart] || null;
};

const formatMonth = (d: Date) => 
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const getDefaultDates = (): { start: string; end: string } => {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return { start: formatMonth(lastMonth), end: formatMonth(today) };
};

const generateMonthRange = (start: string, end: string): string[] => {
  const startDate = new Date(`${start}-01`);
  const endDate = new Date(`${end}-01`);
  const months: string[] = [];

  while (startDate <= endDate) {
    months.push(formatMonth(startDate));
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return months;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-gray-800">
        <p className="font-semibold text-pink-600 mb-1">{payload[0].payload.name}</p>
        <p className="text-gray-600">
          Valor: <strong>{payload[0].value.toLocaleString('es-MX')}</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function IndicadoresPaginated(): JSX.Element {
  const token = localStorage.getItem('token') ?? '';
  const [municipio, setMunicipio] = useState('');
  const [fechaInicio, setFechaInicio] = useState(getDefaultDates().start);
  const [fechaFin, setFechaFin] = useState(getDefaultDates().end);
  const [errorFecha, setErrorFecha] = useState('');
  const [metric, setMetric] = useState(metricOptions[0].key);

  const valid = useCallback(() => {
    const errs: string[] = [];
    if (!municipio) errs.push('Debe seleccionar un municipio');
    if (!fechaInicio || !fechaFin) errs.push('Ambos meses son requeridos');

    const start = new Date(`${fechaInicio}-01`);
    const end = new Date(`${fechaFin}-01`);
    const today = new Date();

    if (start > today) errs.push('Mes de inicio no puede ser futuro');
    if (end > today) errs.push('Mes de fin no puede ser futuro');
    if (start > end) errs.push('Mes de inicio debe ser ≤ mes de fin');

    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > oneYear) errs.push('El rango máximo es 1 año');

    setErrorFecha(errs.join('. '));
    return errs.length === 0;
  }, [municipio, fechaInicio, fechaFin]);

  const fromYear = fechaInicio.split('-')[0];
  const toYear = fechaFin.split('-')[0];

  const { records, loading, error, reload } = useExcelFiles(
    { fromYear, toYear, municipality: municipio },
    token
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid()) return;
    reload();
  };

  // Exportación mejorada con nombre de indicador
  const { exportToExcel } = useExcelExport();
  const handleExport = () => {
    const filtered = records.map(r => ({
      Año:r.year,
      Mes: r.bridgeName,
      Municipio: r.municipality,
      Indicador: metricOptions.find(m => m.key === metric)?.label,
      Valor: (r[metric as keyof DataRecord] as number),
    }));
    exportToExcel(filtered, 'indicadores.xlsx');
  };

  // Generación de datos para el gráfico
  const selectedMonths = generateMonthRange(fechaInicio, fechaFin);
  const chartData = selectedMonths.map(monthKey => {
    const [yy, mm] = monthKey.split('-').map(Number);
    const rec = records.find(r => 
      r.year === yy &&
      parseMonthNumber(r.bridgeName) === mm &&
      r.municipality === municipio
    );
    
    const label = new Date(yy, mm - 1)
      .toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });

    return {
      name: label,
      value: rec ? (rec[metric as keyof DataRecord] as number) : 0,
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow p-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado con métricas y botón de exportación */}
          <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {metricOptions.map(o => (
                <button
                  key={o.key}
                  onClick={() => setMetric(o.key)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    metric === o.key
                      ? 'bg-pink-600 text-white'
                      : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Exportar a Excel
            </button>
          </div>

          {/* Contenedor principal */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sección de filtros */}
            <form 
              onSubmit={handleSubmit} 
              className="text-gray-800 lg:col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Municipio</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    value={municipio}
                    onChange={e => setMunicipio(e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {municipiosColima.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mes inicial</label>
                  <input
                    type="month"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mes final</label>
                  <input
                    type="month"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                  />
                </div>

                {errorFecha && <p className="text-red-500 text-sm">{errorFecha}</p>}

                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
                >
                  {loading ? 'Cargando...' : 'Actualizar'}
                </button>
              </div>
            </form>

            {/* Gráfico */}
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {metricOptions.find(o => o.key === metric)?.label}
              </h3>
              
              {loading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  Cargando datos...
                </div>
              ) : error ? (
                <div className="h-80 flex items-center justify-center text-red-600">
                  Error: {error}
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#4b5563"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#4b5563"
                        tickFormatter={(value) => value.toLocaleString('es-MX')}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        fill="#db2777"
                        barSize={35}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}