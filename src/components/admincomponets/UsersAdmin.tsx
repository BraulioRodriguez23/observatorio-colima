import React, { useState } from "react";

const UserRegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch("https://observatorio-api-dhp4.vercel.app/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Error al registrar usuario");
      }
      
      setName("");
      setEmail("");
      setPassword("");
      setSuccess("¡Usuario registrado correctamente!");
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
      
      // NOTA: Para que la tabla se actualice sola después de crear un usuario, 
      // lo ideal sería que recargues la página o eleves el estado, pero por ahora 
      // puedes darle F5 al navegador para verlo aparecer en la lista de abajo.
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Registrar nuevo usuario</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold px-6 py-2 rounded shadow-sm w-full mt-4"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar usuario"}
        </button>

        {error && <div className="p-3 bg-red-100 text-red-700 rounded font-medium text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded font-medium text-sm">{success}</div>}
      </form>
    </div>
  );
};

export default UserRegisterForm;