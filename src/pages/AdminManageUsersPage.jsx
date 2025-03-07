import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Button from "../components/Button";

const AdminManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/profile/users");
        setUsers(response.data);
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/profile/users/${userId}/role`, {
        role: newRole,
      });
      setUsers(users.map((u) => (u._id === userId ? response.data : u)));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.response?.data.message || "Error updating role");
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
      <Card>
        <h2 className="text-lg font-semibold mb-4">User List</h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="p-4 border border-gray-200 rounded-md"
              >
                <p className="text-sm text-gray-800 font-medium">
                  {user.fullName}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-sm text-gray-600">Role:</span>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="p-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center">No users found</p>
        )}
      </Card>
    </div>
  );
};

export default AdminManageUsersPage;
