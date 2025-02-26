import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Define menu items with their paths
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Take Test", path: "/test-selection" },
    { name: "Analysis History", path: "/analysis-history" },
    { name: "Study Plan", path: "/study-plan" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 fixed font-sans">
      <h2 className="text-md font-semibold mb-4">Menu</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-2 text-sm rounded-md ${
                location.pathname === item.path
                  ? "bg-gray-700 text-white"
                  : "text-gray-200 hover:bg-gray-700 hover:text-white"
              } transition`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="block w-full text-left p-2 text-sm text-gray-200 rounded-md hover:bg-gray-700 hover:text-white transition"
          >
            Logout
          </button>
        </li>
      </ul>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-full max-w-sm">
            <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-600 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition"
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
