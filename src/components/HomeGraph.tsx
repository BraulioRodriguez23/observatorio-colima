import { Chart } from "react-google-charts";

const data = [
  ["Lat", "Long", "Municipio"],
  [19.2433, -103.7247, "Colima"], // Coordenadas de Colima
  [19.2291, -103.7422, "Villa de Álvarez"], // Coordenadas de Villa de Álvarez
  [18.9160, -103.8784, "Tecomán"], // Coordenadas de Tecomán
  [19.0741, -103.8607, "Ixtlahuacán"], // Coordenadas de Ixtlahuacán
  [19.3342, -103.7723, "Armería"], // Coordenadas de Armería
  [19.3272, -103.7880, "Comala"], // Coordenadas de Comala
  [19.3206, -103.6716, "Cuauhtémoc"], // Coordenadas de Cuauhtémoc
];

const options = {
  region: "MX", // Mapa centrado en México
  displayMode: "markers", // Usa marcadores
  colorAxis: { colors: ["#f44336", "#4caf50"] }, // Gradiente de colores
  backgroundColor: "#81d4fa", // Fondo azul claro
  datalessRegionColor: "#f8bbd0", // Color para regiones sin datos
};

export default function HomeGraph() {
  return (
    <Chart
      chartType="GeoChart"
      width="100%"
      height="500px"
      data={[["Lat", "Long", "Municipio"], ...data]}
      options={options}
    />
  );
}
