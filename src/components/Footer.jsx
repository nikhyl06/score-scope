import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-800 text-white py-6 mt-auto">
    <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Score Scope</h3>
        <p className="text-sm">Your ultimate IIT JEE prep companion.</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link to="/" className="hover:text-blue-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/test-selection" className="hover:text-blue-300">
              Tests
            </Link>
          </li>
          <li>
            <Link to="/study-plan" className="hover:text-blue-300">
              Study Plan
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Contact</h3>
        <p className="text-sm">Email: support@scorescope.com</p>
        <p className="text-sm">Phone: +91 987-654-3210</p>
      </div>
    </div>
    <div className="text-center mt-4 text-sm">
      © {new Date().getFullYear()} Score Scope. All rights reserved.
    </div>
  </footer>
);

export default Footer;
