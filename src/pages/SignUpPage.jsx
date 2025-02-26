import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice"; // Reusing login action for simplicity
import Navbar from "../components/Navbar";
import signupIllustration from "../assets/signup-illustration.png";
import Footer from "../components/Footer";

function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate API call for signup
    dispatch(login({ name: fullName || "Student" })); // Replace with signup-specific action if needed
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Illustration Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <img
              src={signupIllustration}
              alt="Sign Up Illustration"
              className="max-w-full h-auto max-h-64"
            />
            <p className="text-xs text-gray-600 mt-2 text-center">
              Start your IIT JEE preparation journey
            </p>
          </div>
        </div>

        {/* SignUp Form Section */}
        <div className="w-full md:w-1/2">
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
              Sign Up
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Create an account to unlock your prep tools
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-3 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Additional Info Section */}
          <div className="border border-gray-200 rounded-md p-4 mt-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-2">
              What You’ll Get
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="border-l-2 border-blue-500 pl-2">
                Free diagnostic test on signup
              </li>
              <li className="border-l-2 border-blue-500 pl-2">
                Personalized study recommendations
              </li>
              <li className="border-l-2 border-blue-500 pl-2">
                Access to 100+ practice tests
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUpPage;
