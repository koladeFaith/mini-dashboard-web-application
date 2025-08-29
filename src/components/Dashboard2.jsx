import React, { useEffect, useState } from "react";
import {
  FaList,
  FaSearch,
  FaTimes,
  FaUser,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FiToggleLeft } from "react-icons/fi";
import axios from "axios";

const Dashboard2 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);

  // 🔹 Fetch users when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // READ
  const fetchUsers = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/users";
      const response = await axios.get(url);
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching the data", error);
    }
  };

  // CREATE
  const addUser = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/users";
      const response = await axios.post(url, newUser);
      setUsers([response.data, ...users]); // add new user to list
      setNewUser({ name: "", email: "" }); // reset input
    } catch (error) {
      console.log("Error adding user", error);
    }
  };

  // UPDATE
  const updateUser = async (id) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/users/${id}`;
      const response = await axios.put(url, editingUser);
      setUsers(users.map((u) => (u.id === id ? response.data : u)));
      setEditingUser(null);
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  // DELETE
  const deleteUser = async (id) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/users/${id}`;
      await axios.delete(url);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.log("Error deleting user", error);
    }
  };

  return (
    <>
      <div className="flex relative h-screen bg-gray-100">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 fixed inset-y-0 left-0 z-10 bg-white shadow-lg">
          <div className="py-[18px] px-6 font-bold border-b">Logo</div>
          <nav className="flex-1 p-4 space-y-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Dashboard
            </a>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Users
            </a>
            <a href="#" className="block p-2 rounded hover:bg-gray-100">
              Settings
            </a>
          </nav>
        </aside>

        {/* Sidebar (mobile overlay) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}></div>
            <aside className="relative z-50 w-64 bg-white shadow-lg">
              <div className="p-4 font-bold border-b flex justify-between items-center">
                Logo
                <FaTimes onClick={() => setSidebarOpen(false)} />
              </div>
              <nav className="p-4 space-y-2">
                <a href="#" className="block p-2 rounded hover:bg-gray-100">
                  Dashboard
                </a>
                <a href="#" className="block p-2 rounded hover:bg-gray-100">
                  Users
                </a>
                <a href="#" className="block p-2 rounded hover:bg-gray-100">
                  Settings
                </a>
              </nav>
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Topbar */}
          <header className="flex fixed top-0 left-0 right-0 z-20 items-center justify-between bg-white px-5 py-3 shadow">
            <FaList
              onClick={() => setSidebarOpen(true)}
              className="text-xl md:hidden"
            />
            <h1 className="font-bold text-[20px]">Logo</h1>
            <div className="flex gap-3 items-center text-xl">
              <div className="bg-gray-100 p-2 rounded-full">
                <FaUser />
              </div>
              <FiToggleLeft />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:mx-6 pt-16 md:pl-64">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            {/* Add New User */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="border p-2 rounded w-1/3"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="border p-2 rounded w-1/3"
              />
              <button
                onClick={addUser}
                className="px-4 py-2 bg-blue-500 text-white rounded">
                Add
              </button>
            </div>

            {/* Display Users in Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white p-4 shadow rounded">
                  {editingUser?.id === user.id ? (
                    <>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full mb-2"
                      />
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full mb-2"
                      />
                      <button
                        onClick={() => updateUser(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex gap-3 mt-3">
                        <FaEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => setEditingUser(user)}
                        />
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteUser(user.id)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard2;
