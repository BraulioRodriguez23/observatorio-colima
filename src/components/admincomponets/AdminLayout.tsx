import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
      </header>
      <main className="bg-white rounded-lg shadow p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;