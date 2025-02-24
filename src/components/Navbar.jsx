import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          IIT JEE Prep
        </Link>
        <div>
          <Link to="/login" className="mr-4 hover:underline">
            Login
          </Link>
          <Link to="/" className="hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
