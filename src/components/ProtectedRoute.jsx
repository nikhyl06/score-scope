import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
};

export default ProtectedRoute;
