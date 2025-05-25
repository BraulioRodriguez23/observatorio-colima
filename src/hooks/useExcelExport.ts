/* hooks/useExcelExport.ts */
import * as XLSX from 'xlsx';

/**
 * Hook para exportar datos a un archivo Excel.
 *
 * @returns Función exportToExcel que recibe un arreglo de objetos y nombre de archivo.
 */
export const useExcelExport = () => {
  const exportToExcel = (data: object[], filename = 'datos.xlsx') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, filename);
  };

  return { exportToExcel };
};

