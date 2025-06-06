// src/App.tsx
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Publications from "./pages/publications";
import Home from "./pages/home";
import Inventory from "./pages/inventory";

import Login from "./components/login";
import Admin from "./pages/admin";
import ExcelManager from "./components/admincomponets/ExcelManager"; // <-- Nueva importación
import ProtectedRoute from "./hooks/protectedRoute";
import { AuthProvider } from "./context/user";
import NoticiaDetalle from "./pages/noticia";
import News from "./pages/News";
import Sobre_nosotros from "./pages/Sobre_nosotros"
import AdminUsers from "./pages/AdminUsers"; // Asegúrate de que esta ruta sea correcta
function App() {
  return (
    <div className="bg-transparent">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/excel" element={<ExcelManager />} /> {/* Nueva ruta para ExcelManager */}
            <Route path="/admin/users" element={<AdminUsers />} /> {/* Ruta para AdminUsers */}
          </Route>

          <Route path="/Publications" element={<Publications />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/News" element={<News />} />
          <Route path="/noticia/:id" element={<NoticiaDetalle />} />
          <Route path="/Sobre_Nosotros" element={<Sobre_nosotros />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;