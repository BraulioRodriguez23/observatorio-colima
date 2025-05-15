/* File: src/hooks/useDateRangeValidator.ts */
import { useCallback, useState } from 'react';

export function useDateRangeValidator(
  municipio: string,
  fechaInicio: string,
  fechaFin: string
) {
  const [error, setError] = useState('');

  const validate = useCallback(() => {
    const errs: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    if (!municipio) errs.push('Debe seleccionar un municipio');
    if (!fechaInicio || !fechaFin) errs.push('Ambas fechas son requeridas');
    if (fechaInicio > today) errs.push('Fecha inicio no puede ser futura');
    if (fechaFin > today) errs.push('Fecha fin no puede ser futura');
    if (new Date(fechaInicio) > new Date(fechaFin)) errs.push('Fecha inicio debe ser ≤ fecha fin');

    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    if (new Date(fechaFin).getTime() - new Date(fechaInicio).getTime() > oneYearMs) {
      errs.push('El rango máximo es 1 año');
    }

    setError(errs.join('. '));
    return errs.length === 0;
  }, [municipio, fechaInicio, fechaFin]);

  return { validate, error };
};