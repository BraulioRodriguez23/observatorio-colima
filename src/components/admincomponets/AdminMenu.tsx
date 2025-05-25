// src/components/HorizontalMenu.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, User, LogOut } from "lucide-react";

const HorizontalMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    { name: "Inicio",   path: "/admin",           icon: <Home size={20} /> },
    { name: "Perfil",   path: "/admin/Profile",    icon: <User size={20} /> },
  
    { name: "Salir",    action: handleLogout,      icon: <LogOut size={20} /> }
  ];

  return (
    <nav className="flex space-x-2 md:space-x-4">
      {tabs.map(tab =>
        tab.action ? (
          <button
            key={tab.name}
            onClick={tab.action}
            className="py-2 px-4 rounded-full text-sm flex items-center gap-1 text-gray-700 hover:bg-gray-200"
          >
            {tab.icon}
            {tab.name}
          </button>
        ) : (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `py-2 px-4 rounded-full text-sm flex items-center gap-1 transition-all ${
                isActive
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {tab.icon}
            {tab.name}
          </NavLink>
        )
      )}
    </nav>
  );
};

export default HorizontalMenu;
