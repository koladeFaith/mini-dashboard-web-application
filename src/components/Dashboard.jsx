import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "./Topbar";
import UserCard from "./UserCard";
import UserEditModal from "./UserEditModal";
import UserFormModal from "./UserFormModal";
import { FaSearch } from "react-icons/fa";
import Sidebar from "./SideBar";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setIsDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Fetch Users
  useEffect(() => {
    fetchUsers();
  }, []);
  // Read
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Create
  const addUser = async (data) => {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/users",
      data
    );
    setUsers([response.data, ...users]);
  };
  // Update
  const updateUser = async (updatedUser) => {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
      updatedUser
    );
    setUsers(users.map((u) => (u.id === updatedUser.id ? response.data : u)));
  };
  // Delete
  const deleteUser = async (id) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  // Filtered
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`flex relative h-screen ${
        isDark ? "bg-gray-800 text-white" : "bg-white"
      }`}>
      {/* Sidebar */}
      <Sidebar
        isDark={isDark} //
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <Topbar
          isDark={isDark}
          toggleTheme={toggleTheme}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className={`flex-1 p-4 md:mx-6 overflow-y-auto pt-23 md:pl-64 min-h-screen ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}>
          <div className="flex flex-col md:flex-row justify-between gap-5">
            <h2 className="text-2xl font-bold">Users</h2>
            <button
              className="rounded-xl px-4 py-2 bg-blue-500 text-white"
              onClick={() => setAddUserForm(true)}>
              Add New Users
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full my-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none ${
                isDark ? "text-white bg-gray-700 border-gray-700" : "bg-white"
              }`}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Users */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isDark={isDark}
                  onEdit={setEditingUser}
                  onDelete={deleteUser}
                />
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={addUserForm}
        onClose={() => setAddUserForm(false)}
        onAddUser={addUser}
        isDark={isDark}
      />
      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onUpdateUser={updateUser}
      />
    </div>
  );
};

export default Dashboard;
