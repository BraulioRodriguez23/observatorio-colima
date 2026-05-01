import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

type Toast = { type: "success" | "error"; message: string };

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "editor", label: "Editor" },
];

const initialForm = { name: "", email: "", password: "", role: "admin" };

import { useAuth } from "../context/user";
import { Navigate } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (user && user.email !== "sergio@ucol.mx" && user.role !== "admin") {
    return <Navigate to="/admin" />;
  }

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      // CORRECCIÓN 404: Agregada la barra al final de la ruta "/user/"
      const res = await axios.get(`${API_BASE}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // VALIDACIÓN INTELIGENTE: Buscamos el arreglo sin importar cómo lo envuelva la API
      const data = res.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.warn("Formato desconocido de la API:", data);
        setUsers([]); 
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error al obtener usuarios." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      await axios.delete(`${API_BASE}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ type: "success", message: "Usuario eliminado." });
      fetchUsers();
    } catch {
      setToast({ type: "error", message: "Error al eliminar." });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
    setForm({ ...initialForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      
      if (editingUser) {
        // Al editar usamos el ID
        await axios.put(
          `${API_BASE}/user/${editingUser.id}`,
          { ...form, password: form.password || undefined }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setToast({ type: "success", message: "Usuario actualizado." });
      } else {
        // CORRECCIÓN 404: Agregada la barra al final "/user/"
        await axios.post(
          `${API_BASE}/user/`, 
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setToast({ type: "success", message: "Usuario creado." });
      }
      handleModalClose();
      fetchUsers();
    } catch (e: unknown) {
      let message = "Error al guardar usuario.";
      if (typeof e === "object" && e !== null && "response" in e) {
        const err = e as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      }
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-6 py-8">
      {/* Toast/alerta */}
      {toast && (
        <div className={`fixed top-7 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-semibold shadow-2xl text-lg transition-all duration-300
          ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-12 mt-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center sm:text-left">
            Gestión de Usuarios
          </h2>
          <button
            onClick={() => { setModalOpen(true); setEditingUser(null); setForm({ ...initialForm }); }}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 text-lg rounded-lg text-white font-bold shadow-md transition-all"
          >
            + Nuevo usuario
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow border bg-white">
          <table className="min-w-full text-base sm:text-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 font-semibold text-left">ID</th>
                <th className="py-3 px-4 font-semibold text-left">Nombre</th>
                <th className="py-3 px-4 font-semibold text-left">Correo</th>
                <th className="py-3 px-4 font-semibold text-left">Rol</th>
                <th className="py-3 px-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-blue-600 font-medium">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50 transition">
                  <td className="py-3 px-4">{u.id}</td>
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 capitalize">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    <button
                      className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-blue-700 font-semibold transition"
                      onClick={() => handleEdit(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-700 font-semibold transition"
                      onClick={() => handleDelete(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed z-40 inset-0 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl border border-blue-200 animate-fadein"
          >
            <h2 className="text-2xl mb-6 font-bold text-blue-700 text-center">
              {editingUser ? "Editar usuario" : "Nuevo usuario"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-base font-semibold mb-1 text-gray-700">Nombre</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                  required
                  autoFocus
                  placeholder="Nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-base font-semibold mb-1 text-gray-700">Correo</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>
              
              <div>
                <label className="block text-base font-semibold mb-1 text-gray-700">Contraseña {editingUser && "(Dejar en blanco para no cambiar)"}</label>
                <div className="relative">
                  <input
                    name="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="border px-4 py-2 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    required={!editingUser} // Solo obligatoria si es un nuevo usuario
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-base font-semibold mb-1 text-gray-700">Rol</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                >
                  {roles.map(r => (
                    <option value={r.value} key={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-8">
              <button
                type="button"
                onClick={handleModalClose}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-semibold text-gray-700 text-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-lg text-white font-bold text-lg transition"
                disabled={loading}
              >
                {editingUser ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* animación modal */}
      <style>{`
        .animate-fadein {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;