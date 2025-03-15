import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Registrar los elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function DoughnutChart() {
  // Datos de la gráfica
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], // Etiquetas para los segmentos
    datasets: [
      {
        label: "Cantidad",
        data: [12, 19, 3, 5, 2, 3], // Valores de los segmentos
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1, // Ancho de las líneas de los segmentos
      },
    ],
  };

  // Configuración de las opciones
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Posición de la leyenda
      },
      title: {
        display: true,
        text: "Chart.js Doughnut Chart", // Título de la gráfica
      },
    },
  };

  return (
    <div className="max-w-md mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
}
