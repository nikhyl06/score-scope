import React from "react";
import { Link } from "react-router-dom";
// Assuming logo is in src/assets/logo.png (adjust path as needed)
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="IIT JEE Prep Logo" className="h-8 w-8 mr-2" />
          </Link>
          <Link to="/" className="text-md font-semibold text-gray-800">
            Score Scope
          </Link>
        </div>
        <div className="space-x-4">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
