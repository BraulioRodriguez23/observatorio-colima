// src/components/ExcelDataTable.tsx
import React, { useEffect } from 'react';
import { useExcelData } from '../../hooks/useExcelData';
import TourismChart from '../TourismChart';

const ExcelDataTable: React.FC = () => {
  const {
    data,
    total,
    loadData,
    page,
    setPage,
    filters: { year, municipio, setYear, setMunicipio },
    loading,
    error
  } = useExcelData();

  // Cada vez que cambian filtros o página, recargamos
  useEffect(() => {
    loadData();
  }, [year, municipio, page]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Datos Turísticos</h2>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Año</label>
          <input
            type="text"
            value={year}
            onChange={e => { setYear(e.target.value); setPage(0); }}
            className="mt-1 p-2 border rounded w-24"
            placeholder="2021"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Municipio</label>
          <input
            type="text"
            value={municipio}
            onChange={e => { setMunicipio(e.target.value); setPage(0); }}
            className="mt-1 p-2 border rounded w-48"
            placeholder="Manzanillo"
          />
        </div>
      </div>

      {/* Tabla */}
      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <table className="w-full table-auto border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Año</th>
                <th className="p-2 border">Municipio</th>
                <th className="p-2 border">% Ocupación</th>
                <th className="p-2 border">Oferta Cuartos</th>
                <th className="p-2 border">Cuartos Ocupados</th>
                <th className="p-2 border">Derrama Económica</th>
                <th className="p-2 border">Afluencia Turística</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={`${row.año}-${row.municipio}`} className="hover:bg-gray-100">
                  <td className="p-2 border">{row.año}</td>
                  <td className="p-2 border">{row.municipio}</td>
                  <td className="p-2 border">{row.porcentaje_ocupacion}%</td>
                  <td className="p-2 border">{row.oferta_cuartos.toLocaleString()}</td>
                  <td className="p-2 border">{row.cuartos_ocupados.toLocaleString()}</td>
                  <td className="p-2 border">${row.derrama_economica.toLocaleString()}</td>
                  <td className="p-2 border">{row.touristFlow.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setPage(Math.max(page - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {page + 1} de {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Gráfico de Afluencia Turística */}
      {/* Usamos el primer valor de la tabla para pasarle al componente */}
      {data.length > 0 && data[0].municipio && year && (
  <TourismChart
    categoria="Afluencia Turística"
    municipio={data[0].municipio}
    // Usamos día 01 y último día del año
    fechaInicio={`${year}-01-01`}
    fechaFin={`${year}-12-31`}
  />
)}
    </div>
  );
};

export default ExcelDataTable;
