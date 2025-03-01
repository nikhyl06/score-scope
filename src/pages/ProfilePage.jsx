import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/userSlice";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function ProfilePage() {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const updateData = {};
      if (formData.fullName !== user.fullName)
        updateData.fullName = formData.fullName;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      const response = await api.put("/api/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(updateUser(response.data));
      setSuccess("Profile updated successfully!");
      setError("");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data.message || "Update failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 bg-white max-w-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Profile
            </h1>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            {success && (
              <p className="text-sm text-green-500 mb-4">{success}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="fullName"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="password"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-sm text-gray-700 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ProfilePage;
