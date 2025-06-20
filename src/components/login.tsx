import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom"; // For navigation after login
import { useAuth } from "../context/user"; // Import the useAuth hook

const Login = () => {
  const [email, setEmail] = useState(""); // Use email instead of username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation
  const { login, loading, user } = useAuth(); // Usar el hook useAuth para acceder al contexto

  useEffect(() => {
    if (user) {
      navigate('/admin'); // Use navigate to redirect
    }
  }, [user, navigate]); 

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent default form submission

    // Clear previous errors
    setError("");

    console.log(email, password);

    try {
      // Call the login function from AuthContext
      await login(email, password);

      // Redirect the user to the home page or dashboard
      navigate("/admin");
    } catch (err: unknown) {
      // Handle errors (e.g., display an error message)
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password");
      }
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo de email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black  focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        {/* Enlace para recuperar contraseña */}
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Olvidaste tu contraseña?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Recupérala aquí
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
