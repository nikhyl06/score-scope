import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Take Test", path: "/test-selection" },
    { name: "Analysis History", path: "/analysis-history" },
    { name: "Study Plan", path: "/study-plan" },
    { name: "Profile", path: "/profile" },
    ...(user?.role === "admin"
      ? [{ name: "Add Question", path: "/add-question" }]
      : []),
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4 fixed font-sans">
      <h2 className="text-md font-semibold text-gray-800 mb-4">Menu</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block border border-gray-200 rounded-md p-2 text-sm ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-500 border-blue-300"
                  : "text-gray-600 hover:bg-gray-100 hover:border-gray-300"
              } transition`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/logout"
            className="block w-full text-left border border-gray-200 rounded-md p-2 text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition"
          >
            Logout
          </Link>
        </li>
      </ul>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-md p-6 w-full max-w-sm">
            <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => navigate("/logout")}
                className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
