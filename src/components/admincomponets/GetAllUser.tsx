import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://observatorio-api-dhp4.vercel.app/user/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && data.data) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const res = await fetch(`https://observatorio-api-dhp4.vercel.app/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      
      if (!res.ok) throw new Error("Error al borrar");
      setUsers(users.filter(user => user.id !== id));
    } catch {
      alert("Error al eliminar usuario");
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`https://observatorio-api-dhp4.vercel.app/user/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(editingUser),
      });
      
      if (!res.ok) throw new Error("Error al actualizar");
      setEditingUser(null);
      fetchUsers();
    } catch {
      alert("Error al actualizar usuario");
    }
  };

  if (loading) return <div className="text-blue-600 font-bold p-4">Cargando usuarios...</div>;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Lista de usuarios</h2>
      {users.length === 0 && !error && <p className="text-gray-500">No hay usuarios registrados.</p>}
      
      {users.map(user => (
        <div key={user.id} className="border p-4 mb-2 rounded flex justify-between items-center hover:bg-gray-50">
          {editingUser?.id === user.id ? (
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={editingUser.name}
                onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                className="border p-2 rounded focus:outline-blue-500"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                className="border p-2 rounded focus:outline-blue-500"
              />
              <button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium">
                Guardar
              </button>
              <button onClick={() => setEditingUser(null)} className="text-gray-600 hover:text-gray-800 font-medium px-2">
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <p className="text-lg"><strong className="text-gray-800">{user.name}</strong></p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          )}
          
          {editingUser?.id !== user.id && (
            <div className="space-x-3">
              <button onClick={() => setEditingUser(user)} className="text-blue-600 hover:text-blue-800 font-medium">Editar</button>
              <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800 font-medium">Eliminar</button>
            </div>
          )}
        </div>
      ))}
      {error && <p className="text-red-600 font-bold mt-4">{error}</p>}
    </div>
  );
};

export default UserList;