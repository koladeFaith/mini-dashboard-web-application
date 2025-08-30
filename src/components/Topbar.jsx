import React from "react";
import { FaList, FaUser } from "react-icons/fa";
import { FiToggleLeft } from "react-icons/fi";

const Topbar = ({ isDark, toggleTheme, setSidebarOpen }) => {
  return (
    <header
      className={`flex fixed top-0 left-0 right-0 z-20 items-center justify-between px-5 py-3 shadow ${
        isDark ? "bg-gray-700 text-white" : "bg-white"
      }`}>
      <FaList
        onClick={() => setSidebarOpen(true)}
        className="text-xl md:hidden cursor-pointer"
      />
      <h1 className="font-bold text-lg md:pl-1">Logo</h1>
      <div className="flex items-center gap-3 text-xl">
        <div className="bg-gray-100 p-2 rounded-full">
          <FaUser className={isDark ? "text-black" : "bg-white"} />
        </div>
        <FiToggleLeft
          className="text-2xl cursor-pointer"
          onClick={toggleTheme}
        />
      </div>
    </header>
  );
};

export default Topbar;
