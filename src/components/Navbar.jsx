import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import logo from "../assets/logo.png";

function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="IIT JEE Prep Logo" className="h-8 w-8 mr-2" />
          </Link>
          <Link to="/" className="text-md font-semibold text-gray-800">
            IIT JEE Prep
          </Link>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-gray-600 hover:text-blue-500"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-md hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
