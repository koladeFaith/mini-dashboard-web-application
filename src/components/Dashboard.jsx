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

// Yup Validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  // Toggle between light and dark themes.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  //  Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // READ
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  // CREATE
  const addUser = async (data) => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        data
      );
      setUsers([response.data, ...users]);
      // Reset form after submit
      reset();
    } catch (error) {
      console.log("Error adding user", error);
    }
  };

  // UPDATE
  const updateUser = async (id) => {
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        editingUser
      );
      setUsers(users.map((u) => (u.id === id ? response.data : u)));
      setEditingUser(null);
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  // DELETE
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.log("Error deleting user", error);
    }
  };
  return (
    <>
      <div
        className={`flex relative h-screen bg-gray-100 ${
          isDark ? "bg-gray-800 text-white" : "bg-white"
        } `}>
        {/* Sidebar (desktop) */}
        <aside
          className={`hidden md:flex w-64 fixed inset-y-0 left-0 z-10 md:w-64 md:flex-col md:bg-white md:shadow-lg ${
            isDark ? "bg-gray-700" : "bg-white"
          }`}>
          <div
            className={`py-[18px] px-7  font-bold border-b ${
              isDark ? "border-b-black" : "border-b-white"
            }`}>
            Logo
          </div>
          <nav
            className={`flex-1 p-4 space-y-2 ${
              isDark ? "bg-gray-700 text-white" : "bg-white"
            }`}>
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
            {/* Overlay background */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}></div>

            {/* Sidebar panel */}
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
          <header
            className={`flex fixed top-0 left-0 right-0 z-20 items-center justify-between bg-gray-500 px-5 md:px-5 py-3 shadow ${
              isDark ? "bg-gray-700 text-white" : "bg-white"
            } `}>
            <FaList
              onClick={() => setSidebarOpen(true)}
              className="text-xl md:hidden"
            />
            <h1 className="font-bold text-[20px] md:pl-1">Logo</h1>
            <div className="flex justify-center md:mr-4 gap-2 md:gap-3 items-center text-xl">
              <div className="bg-gray-100 p-2  rounded-full">
                <FaUser
                  className={`text-xl ${isDark ? "text-black" : "bg-white"}`}
                />
              </div>{" "}
              <FiToggleLeft className="text-2xl" onClick={toggleTheme} />
            </div>
          </header>
          {/* Main content */}
          <main className="flex-1 p-4 md:mx-6 overflow-y-auto pt-23 md:pl-64 min-h-screen">
            <div className="flex flex-col gap-5 md:flex-row justify-between">
              <h2 className="text-2xl font-bold">Users</h2>
              <button
                className="rounded-xl px-4 py-2 bg-blue-500 text-white"
                onClick={fetchUsers}>
                Refresh Users
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full my-3">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? "text-black" : "bg-white"
                }`}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Add New User Form with Yup validation */}
            <form
              onSubmit={handleSubmit(addUser)}
              className="flex gap-2 mb-6 flex-wrap">
              <div className="flex flex-col w-1/3 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className={`border border-bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white p-2 rounded ${
                    isDark ? "text-black" : "bg-white"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>{" "}
              <div className="flex flex-col w-1/3 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Title"
                  {...register("title")}
                  className={`border border-bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white p-2 rounded ${
                    isDark ? "text-black" : "bg-white"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>{" "}
              <div className="flex flex-col w-1/3 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Content"
                  {...register("content")}
                  className={`border border-bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white p-2 rounded ${
                    isDark ? "text-black" : "bg-white"
                  }`}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-1/3 min-w-[200px]">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`border border-bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white p-2 rounded ${
                    isDark ? "text-black" : "bg-white"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded self-end">
                Add
              </button>
            </form>

            {/* Users Display (same as before) */}
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
                        type="text"
                        value={editingUser.title}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            title: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full mb-2"
                      />{" "}
                      <input
                        type="text"
                        value={editingUser.content}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            content: e.target.value,
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
                      <p className="font-bold text-lg">{user.title}</p>
                      <p className="font-bold text-lg">{user.content}</p>
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

export default Dashboard;
