// HorizontalMenu.tsx
import React from 'react';
import { NavLink,  useNavigate } from 'react-router-dom';
import { Home, User, Settings, LogOut } from "lucide-react";

const HorizontalMenu: React.FC = () => {
;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    { name: "Inicio", path: "/admin", icon: <Home size={20} /> },
    { name: "Perfil", path: "/admin/profile", icon: <User size={20} /> },
    { name: "Configuración", path: "/admin/settings", icon: <Settings size={20} /> },
    { name: "Salir", icon: <LogOut size={20} />, action: handleLogout }
  ];

  return (
    <nav className="flex space-x-2 md:space-x-4">
      {tabs.map((tab) => (
        tab.action ? (
          <button
            key={tab.name}
            onClick={tab.action}
            className="py-2 px-4 md:px-6 rounded-full text-sm transition-all text-gray-700 hover:bg-gray-200"
          >
            <div className="flex items-center gap-1">
              {tab.icon}
              {tab.name}
            </div>
          </button>
        ) : (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => 
              `py-2 px-4 md:px-6 rounded-full text-sm transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-gray-800 text-white font-semibold shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              }`
            }
          >
            {tab.icon}
            {tab.name}
          </NavLink>
        )
      ))}
    </nav>
  );
};

export default HorizontalMenu;