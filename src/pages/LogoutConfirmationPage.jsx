import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

function LogoutConfirmationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
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
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmationPage;
