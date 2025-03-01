import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LogoutConfirmationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-6 flex-1 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-md p-6 max-w-sm text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Are you sure you want to logout?
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Yes
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
            >
              No
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LogoutConfirmationPage;
