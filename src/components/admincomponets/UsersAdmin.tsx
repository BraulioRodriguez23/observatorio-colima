import React, { useState } from "react";

const UserRegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="relative">
            <input
              className="w-full border p-2 pr-10 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
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