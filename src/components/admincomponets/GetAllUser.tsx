import React, { useEffect, useState } from "react";

interface User {
  _id: string;
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
      const res = await fetch("https://observatorio-api-dhp4.vercel.app/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // Asegúrate de tener token
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await fetch(`https://observatorio-api-dhp4.vercel.app/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setUsers(users.filter(user => user._id !== id));
    } catch {
      alert("Error al eliminar usuario");
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await fetch(`https://observatorio-api-dhp4.vercel.app/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchUsers(); // Recargar
    } catch {
      alert("Error al actualizar usuario");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lista de usuarios</h2>
      {users.map(user => (
        <div key={user._id} className="border p-4 mb-2 rounded flex justify-between items-center">
          {editingUser?._id === user._id ? (
            <div className="space-x-2">
              <input
                type="text"
                value={editingUser.name}
                onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                className="border p-1 rounded"
              />
              <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded">
                Guardar
              </button>
              <button onClick={() => setEditingUser(null)} className="ml-2 text-gray-600">
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <p><strong>{user.name}</strong> ({user.email})</p>
            </div>
          )}
          <div className="space-x-2">
            <button onClick={() => setEditingUser(user)} className="text-blue-600">Editar</button>
            <button onClick={() => deleteUser(user._id)} className="text-red-600">Eliminar</button>
          </div>
        </div>
      ))}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default UserList;
