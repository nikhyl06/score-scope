import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/userSlice"; // For updating name
import Sidebar from "../components/Sidebar";

function ProfilePage() {
  const { name } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: name,
    email: "student@example.com", // Mock, replace with real data
    password: "",
    confirmPassword: "",
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Mock API call simulation
    dispatch(login({ name: formData.name }));
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Your Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled // Typically email isn't editable
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 mb-2"
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="notifications" className="text-gray-700">
                Receive email notifications
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
