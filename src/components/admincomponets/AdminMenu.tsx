// HorizontalMenu.tsx (Versión mejorada con enrutamiento)
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut } from "lucide-react";

const HorizontalMenu: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { name: "", path: "/admin", icon: <Home size={20} /> },
    { name: "", path: "/admin", icon: <User size={20} /> },
    { name: "", path: "/admin", icon: <Settings size={20} /> },
    { name: "", path: "/admin", icon: <LogOut size={20} /> },
  ];

  return (
    <nav className="flex space-x-2 md:space-x-4">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => 
            `py-2 px-4 md:px-6 rounded-full text-sm transition-all ${
              isActive || location.pathname === tab.path
                ? 'bg-gray-800 text-white font-semibold shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`
          }
        >
          {tab.name}
          {tab.icon}
          {tab.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default HorizontalMenu;