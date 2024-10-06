import React, { useState, useEffect,useContext } from "react";
import { IsDarkModecontext } from "./context/Context";
import { useNavigate } from "react-router-dom";
import SidebarNavbar from "./Sidebar";

const SettingsPage = () => {
    const [ darkMode, setDarkMode ] = useContext(IsDarkModecontext);

  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDarkMode = () => {
    if(localStorage.getItem("darkMode") === "true") {
        localStorage.setItem("darkMode", "false");
        setDarkMode('false');
    }else{
        localStorage.setItem("darkMode", "true");
        setDarkMode('true');
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("User");
    localStorage.removeItem("darkMode");
    navigate("/login");
  };

  return (
    <div className="dark:text-white dark:bg-gray-900 w-full flex flex-col md:flex-row">
      <SidebarNavbar />
      <div className="min-h-screen w-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Settings
          </h1>

          {/* Dark/Light Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-900 dark:text-gray-100">Dark Mode</span>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={darkMode === 'true'}
                onChange={toggleDarkMode}
              />
              <span
                className={`slider round ${darkMode === 'true' ? "bg-gray-600" : "bg-gray-300"
                  }`}
              ></span>
            </label>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
