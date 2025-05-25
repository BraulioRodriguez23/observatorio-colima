// src/layouts/AdminLayout.tsx
import React from "react";
import HorizontalMenu from "../components/admincomponets/AdminMenu";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 shadow-sm">
        <HorizontalMenu />
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
