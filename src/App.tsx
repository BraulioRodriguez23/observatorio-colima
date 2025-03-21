import "./App.css";
import Header from "./components/Horizontalmenu"; // Importa el componente correctamente
import { Route, Routes } from "react-router-dom";
import Barometer from "./pages/barometer";
import Home from "./pages/home";
import Publications from "./pages/publications";
import Inventory from "./pages/inventory";
import Indicadores from "./pages/indicadores";
import Login from "./components/login";

function App() {
  return (
    <div className="bg-transparent">
      {/* Mostrar el Header solo si no estamos en la página de Login */}
      {!window.location.pathname.includes("/login") && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Ruta para el Login */}
        <Route path="/indicador" element={<Indicadores />} />
        <Route path="/barometro" element={<Barometer />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/publicaciones" element={<Publications />} />
      </Routes>
    </div>
  );
}

export default App;