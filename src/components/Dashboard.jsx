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
import { Link } from "react-router-dom";
import UserEditModal from "./UserEditModal";
import UserFormModal from "./UserFormModal";

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
  const [addUserForm, setAddUserForm] = useState(false);
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
      console.log(response);
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
      setAddUserForm(false);
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
            <a
              href="#"
              className="block p-2 text-[17px] rounded hover:bg-gray-100">
              Dashboard
            </a>
            <a
              href="#"
              className="block p-2 text-[17px] rounded hover:bg-gray-100">
              Users
            </a>
            <a
              href="#"
              className="block p-2 text-[17px] rounded hover:bg-gray-100">
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
              <div className="p-4 pl-6 font-bold border-b text-[18px] flex justify-between items-center">
                Logo
                <FaTimes onClick={() => setSidebarOpen(false)} />
              </div>
              <nav className="p-4 space-y-2">
                <a
                  href="#"
                  className="block p-2 text-[18px] rounded hover:bg-gray-100">
                  Dashboard
                </a>
                <a
                  href="#"
                  className="block p-2 text-[18px] rounded hover:bg-gray-100">
                  Users
                </a>
                <a
                  href="#"
                  className="block p-2 text-[18px] rounded hover:bg-gray-100">
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
          <main
            className={`flex-1 bg-gray-100 p-4 md:mx-6 overflow-y-auto pt-23 md:pl-64 min-h-screen ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}>
            <div className="flex flex-col gap-5 md:flex-row justify-between">
              <h2 className="text-2xl font-bold">Users</h2>
              <button
                className="rounded-xl px-4 py-2 bg-blue-500 text-white"
                onClick={() => setAddUserForm(true)}>
                Add New Users
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full my-3">
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 border bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDark ? "text-white bg-gray-700 border-gray-700" : "bg-white"
                }`}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Add New User Form with Yup validation */}

            {addUserForm && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setAddUserForm(false)}>
                <div
                  className={`rounded-lg shadow-xl w-full max-w-md p-6 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New User</h2>
                    <button
                      onClick={() => setAddUserForm(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(addUser)} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        {...register("name")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        {...register("title")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>{" "}
                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Content
                      </label>
                      <input
                        {...register("content")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          errors.content ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.content && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.content.message}
                        </p>
                      )}
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        {...register("email")}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Users Display (same as before) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`bg-gray-700 p-4 shadow rounded hover:transform hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? "text-white bg-gray-700 border-gray-700"
                      : "bg-white"
                  }`}>
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
                      <h3
                        className={`font-bold text-lg  ${
                          isDark ? "text-gray-300 " : "bg-white"
                        }`}>
                        {user.name}
                      </h3>
                      <p className="font-bold text-lg text-gray-400 ">
                        {user.title}
                      </p>
                      <p className="font-bold text-lg text-gray-400 ">
                        {user.content}
                      </p>
                      <p className="text-gray-400 font-bold">{user.email}</p>
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
