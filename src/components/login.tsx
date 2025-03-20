// src/components/Login.jsx
const Login = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        {/* Formulario */}
        <form className="space-y-4">
          {/* Campo de usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ingresa tu usuario"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ingresar
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