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

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [token] = useState(localStorage.getItem("token") || "");

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setToast({ type: "error", message: "Error al obtener usuarios." });
    }
    setLoading(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ type: "success", message: "Usuario eliminado." });
      fetchUsers();
    } catch {
      setToast({ type: "error", message: "Error al eliminar." });
    }
    setLoading(false);
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
      if (editingUser) {
        await axios.put(
          `${API_BASE}/user/${editingUser.id}`,
          { ...form, password: undefined },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setToast({ type: "success", message: "Usuario actualizado." });
      } else {
        await axios.post(
          `${API_BASE}/user`,
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
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-2 sm:px-6 py-8">
      {/* Toast/alerta */}
      {toast && (
        <div className={`fixed top-7 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-semibold shadow-2xl text-lg
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
            <tbody>
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
                <tr key={u.id} className="border-t hover:bg-blue-50 transition">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4 capitalize">{u.role}</td>
                  <td className="py-2 px-4 text-center flex gap-3 justify-center">
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
        <div className="fixed z-40 inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg mx-2 p-8 rounded-3xl shadow-2xl border border-blue-200 animate-fadein"
          >
            <h2 className="text-2xl mb-6 font-bold text-blue-700 text-center">
              {editingUser ? "Editar usuario" : "Nuevo usuario"}
            </h2>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-1 text-gray-700">Nombre</label>
              <input
                name="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border px-4 py-2 rounded-lg w-full focus:outline-blue-400 text-lg"
                required
                autoFocus
                placeholder="Nombre completo"
              />
            </div>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-1 text-gray-700">Correo</label>
              <input
                name="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="border px-4 py-2 rounded-lg w-full focus:outline-blue-400 text-lg"
                type="email"
                required
                placeholder="ejemplo@correo.com"
              />
            </div>
            {!editingUser && (
              <div className="mb-4">
                <label className="block text-base font-semibold mb-1 text-gray-700">Contraseña</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="border px-4 py-2 rounded-lg w-full focus:outline-blue-400 text-lg"
                  type="password"
                  minLength={6}
                  required
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            )}
            <div className="mb-6">
              <label className="block text-base font-semibold mb-1 text-gray-700">Rol</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="border px-4 py-2 rounded-lg w-full focus:outline-blue-400 text-lg"
              >
                {roles.map(r => (
                  <option value={r.value} key={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between gap-3 mt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-semibold text-lg transition"
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
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
