import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 fixed">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/test-selection" className="hover:underline">
            Take Test
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/analysis-history" className="hover:underline">
            Analysis History
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/study-plan" className="hover:underline">
            Study Plan
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
        </li>
        <li className="mb-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="hover:underline"
          >
            Logout
          </button>
        </li>
      </ul>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
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
