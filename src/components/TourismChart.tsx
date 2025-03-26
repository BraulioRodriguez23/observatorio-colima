// components/TourismChart.tsx
import { useEffect, useRef, FC } from 'react';
import Chart from 'chart.js/auto';

interface TourismChartProps {
  categoria: string;
  municipio: string;
  fechaInicio: string;
  fechaFin: string;
}

const TourismChart: FC<TourismChartProps> = ({ categoria, municipio, fechaInicio, fechaFin }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // Destruir gráfica anterior si existe
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Datos de ejemplo (deberías reemplazar esto con datos reales basados en los props)
        const data = {
          labels: ['Campus ocupado', 'Departamento urbano', 'Área organizada', 'Participación'],
          datasets: [{
            label: `Indicadores Turísticos (${categoria}) - ${municipio}`,
            data: [18.00, 17.00, 10.00, 9.00],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        };

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Kilómetros cuadrados (km²)'
                }
              }
            }
          }
        });
      }
    }

    // Cleanup al desmontar el componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categoria, municipio, fechaInicio, fechaFin]); // Ahora se actualiza cuando cambian los props

  return <canvas ref={chartRef} />;
};

export default TourismChart;