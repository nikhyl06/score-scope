import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const studentLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tests", path: "/test-selection" },
    { name: "Analysis", path: "/analysis" },
    { name: "Study Plan", path: "/study-plan" },
    { name: "Profile", path: "/profile" },
  ];

  const adminLinks = [
    { name: "Profile", path: "/profile" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Test", path: "/create-test" },
    { name: "Manage Questions", path: "/manage-questions" },
    { name: "Manage Users", path: "/manage-users" },
    { name: "Add Question", path: "/add-question" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Score Scope" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-800">Score Scope</span>
        </Link>
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              {(user?.role === "admin" ? adminLinks : studentLinks).map(
                (link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-600 hover:text-blue-500 transition text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                )
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-500 font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition font-medium text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
