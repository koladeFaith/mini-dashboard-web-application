import React from "react";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isDark, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex w-64 fixed inset-y-0 left-0 z-10 md:w-64 md:flex-col md:shadow-lg ${
          isDark ? "bg-gray-700 text-white" : "bg-white"
        }`}>
        <div className={`py-4 px-7 font-bold border-b`}>Logo</div>
        <nav className="flex-1 p-4 space-y-2">
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

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 w-64 bg-white shadow-lg">
            <div className="p-4 flex justify-between items-center border-b font-bold">
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
    </>
  );
};

export default Sidebar;
