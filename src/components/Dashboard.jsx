import React, { useEffect, useState } from "react";
import { FaList, FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { FiToggleLeft, FiUser } from "react-icons/fi";
import axios from "axios";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  //   useEffect(() => {
  //       fetchUsers();
  //     }, []);
  const fetchUsers = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/users";
      axios.get(url).then((response) => {
        setUsers(response.data);
        console.log(response.data);
        console.log(users);
      });
    } catch (error) {
      console.log("Error fetching the data", error);
    }
  };

  return (
    <>
      <div className="flex relative h-screen bg-gray-100">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 fixed inset-y-0 left-0 z-10 md:w-64 md:flex-col md:bg-white md:shadow-lg">
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
          <header className="flex fixed top-0 left-0 right-0 z-20 items-center justify-between bg-white px-5 md:px-4 py-3 shadow ">
            <FaList
              onClick={() => setSidebarOpen(true)}
              className="text-xl md:hidden"
            />
            <h1 className="font-bold text-[20px]">Logo</h1>
            <div className="flex justify-center gap-1 md:gap-3 items-center text-xl">
              <div className="bg-gray-100 p-2 rounded-full">
                <FaUser className="text-xl" />
              </div>{" "}
              <FiToggleLeft className="text-xl" />
            </div>
          </header>
          {/* Main content */}
          <main className="flex-1 p-4 md:mx-6  overflow-y-auto pt-16 md:pl-64 min-h-screen">
            <div className="flex flex-col gap-5 md:flex-row justify-between mt-1 md:mt-3 md:mb-5">
              <h2 className="text-2xl font-bold">User</h2>
              <button
                className="rounded-xl px-4 py-2 bg-blue-500"
                onClick={fetchUsers}>
                Add New Users
              </button>
            </div>
            <div className="relative w-full my-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-grey-400 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
