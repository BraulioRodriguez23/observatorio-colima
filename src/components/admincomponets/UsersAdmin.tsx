import React, { useState } from "react";

const   UserRegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://observatorio-api-dhp4.vercel.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al registrar usuario");
      }
      setName("");
      setEmail("");
      setPassword("");
      alert("Usuario registrado correctamente");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-lg font-bold">Registrar nuevo usuario</h2>
      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="email"
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrar"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default UserRegisterForm;