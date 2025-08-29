import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Create a Theme Context
const ThemeContext = createContext();

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div
        className={`min-h-screen ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        } transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Sidebar Component
const Sidebar = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-64 fixed inset-y-0 left-0 z-10 ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-md transform -translate-x-full md:translate-x-0 transition-transform duration-300`}>
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      <nav className="p-4">
        <ul>
          {["Dashboard", "Users", "Settings"].map((item, index) => (
            <li key={index} className="mb-4">
              <a
                href="#"
                className={`flex items-center p-2 rounded-lg ${
                  isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors`}>
                <span className="ml-3">{item}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Top Navigation Component
const TopNav = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-20 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-md`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <span className="text-xl font-bold">Dashboard</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-800 text-yellow-400"
              } focus:outline-none`}>
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
            <div className="ml-4 relative">
              <button className="flex items-center focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  U
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsSidebarOpen(false)}>
          <div
            className={`fixed inset-y-0 left-0 w-64 ${
              isDark ? "bg-gray-800" : "bg-white"
            } transform transition-transform duration-300`}
            onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Dashboard</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <nav className="p-4">
              <ul>
                {["Dashboard", "Users", "Settings"].map((item, index) => (
                  <li key={index} className="mb-4">
                    <a
                      href="#"
                      className={`flex items-center p-2 rounded-lg ${
                        isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      } transition-colors`}>
                      <span className="ml-3">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

// User Card Component
const UserCard = ({ user, onClick }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-lg shadow-md p-6 cursor-pointer transition-all ${
        isDark ? "bg-gray-800" : "bg-white"
      } hover:transform hover:-translate-y-1 hover:shadow-lg`}
      onClick={onClick}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">
          {user.name.charAt(0)}
        </div>
        <div className="ml-4">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {user.company?.catchPhrase || "No catchphrase available"}
        </p>
      </div>
      <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{user.phone}</span>
        <span>{user.website}</span>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ user, isOpen, onClose, onEdit, onDelete }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className={`rounded-lg shadow-xl w-full max-w-md p-6 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Username
              </p>
              <p>{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p>{user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Website
              </p>
              <p>{user.website}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Company
              </p>
              <p>{user.company?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p>
                {user.address?.street}, {user.address?.city}
                <br />
                {user.address?.zipcode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onDelete(user.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Delete
          </button>
          <button
            onClick={() => onEdit(user)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// User Form Schema with Yup
const userSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  phone: yup.string().required("Phone is required"),
  website: yup.string().required("Website is required"),
});

// User Form Component
const UserForm = ({ user, isOpen, onClose, onSubmit }) => {
  const { isDark } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: user || {
      name: "",
      email: "",
      username: "",
      phone: "",
      website: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset(user);
    } else {
      reset({
        name: "",
        email: "",
        username: "",
        phone: "",
        website: "",
      });
    }
  }, [user, reset, isOpen]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className={`rounded-lg shadow-xl w-full max-w-md p-6 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              {...register("name")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              {...register("phone")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website
            </label>
            <input
              {...register("website")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.website
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              {user ? "Update" : "Create"} User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Content Component
const MainContent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      // In a real app, we would call the API to delete
      await axios.delete(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );

      // Update the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    }
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users/${editingUser.id}`,
          userData
        );

        // Update the local state with the updated user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? { ...user, ...response.data } : user
          )
        );
      } else {
        // Create new user
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/users",
          userData
        );

        // Add the new user to the local state
        setUsers((prevUsers) => [
          ...prevUsers,
          { ...response.data, id: Math.max(...prevUsers.map((u) => u.id)) + 1 },
        ]);
      }

      setIsFormOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError(
        `Failed to ${editingUser ? "update" : "create"} user. Please try again.`
      );
      console.error("Error saving user:", err);
    }
  };

  return (
    <div className="pt-16 md:pl-64 min-h-screen">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Users</h1>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Add New User
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 pl-10 rounded-md border ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div
            className={`p-4 mb-6 rounded-md ${
              isDark ? "bg-red-900 text-red-100" : "bg-red-100 text-red-700"
            }`}>
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right focus:outline-none">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            className={`p-6 rounded-md text-center ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-md`}>
            <p className="text-lg">
              No users found{searchTerm ? ` matching "${searchTerm}"` : ""}.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={() => handleUserClick(user)}
              />
            ))}
          </div>
        )}

        <Modal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        <UserForm
          user={editingUser}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleSubmitUser}
        />
      </div>
    </div>
  );
};

// App Component
const App = () => {
  return (
    <ThemeProvider>
      <TopNav />
      <Sidebar />
      <MainContent />
    </ThemeProvider>
  );
};

export default App;
