// src/helpers/excelMap.ts

import { ExcelIndicator } from "../src/types/ExcelIndicator"; // ajusta la ruta si tu interface está en otro archivo

interface RawExcelRecord {
  id: number | string;
  year: number;
  municipality: string;
  month?: string;
  season?: string;
  bridgeName?: string;
  occupancyRate: number;
}

export function mapExcelRecord(raw: RawExcelRecord, type: string): ExcelIndicator {
  switch (type) {
    case "mensual":
      return {
        id: Number(raw.id),
        year: raw.year,
        municipio: raw.municipality,
        mes: raw.month,
        ocupacion: raw.occupancyRate,
      };
    case "temporada":
      return {
        id: Number(raw.id),
        year: raw.year,
        municipio: raw.municipality,
        temporada: raw.season,
        ocupacion: raw.occupancyRate,
      };
    case "puentes":
      return {
        id: Number(raw.id),
        year: raw.year,
        municipio: raw.municipality,
        puente: raw.bridgeName,
        ocupacion: raw.occupancyRate,
      };
    default:
      return {
        id: Number(raw.id),
        year: raw.year,
        municipio: raw.municipality,
        ocupacion: raw.occupancyRate,
      };
  }
}
