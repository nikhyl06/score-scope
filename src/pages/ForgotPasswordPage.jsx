import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      setError("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data.message || "Error sending reset link");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-6 flex-1 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-md p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Forgot Password
          </h2>
          {message && (
            <p className="text-sm text-green-600 mb-4 text-center">{message}</p>
          )}
          {error && (
            <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Send Reset Link
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            <Link to="/login" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;
