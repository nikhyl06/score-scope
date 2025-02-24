import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock API call
    setMessage("Check your email for the reset link.");
    setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            Forgot Password
          </h2>
          {message ? (
            <p className="text-green-600 text-center mb-4">{message}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Send Reset Link
              </button>
            </form>
          )}
          <p className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
