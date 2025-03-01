import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      // Placeholder for subscription API (not implemented in backend yet)
      await axios.post("http://localhost:5000/api/subscribe", { email });
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-8 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Explore</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/test-selection" className="hover:text-blue-500">
                  Tests
                </Link>
              </li>
              <li>
                <Link to="/study-plan" className="hover:text-blue-500">
                  Study Plan
                </Link>
              </li>
              <li>
                <Link to="/analysis-history" className="hover:text-blue-500">
                  Analysis
                </Link>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Contact</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Email: support@iitjeeprep.com</li>
              <li>Phone: +91 987-654-3210</li>
              <li>Address: 123 Prep Lane, Edu City</li>
              <li>
                <a
                  href="https://twitter.com"
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </a>{" "}
                |{" "}
                <a
                  href="https://linkedin.com"
                  className="text-blue-500 hover:underline"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Subscribe for prep tips and updates
            </p>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition"
              >
                Subscribe
              </button>
            </form>
            {submitted && (
              <p className="text-sm text-green-600 mt-2">
                Thanks for subscribing!
              </p>
            )}
          </div>
        </div>
        <div className="border border-gray-200 rounded-md p-4 mt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 IIT JEE Prep. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
