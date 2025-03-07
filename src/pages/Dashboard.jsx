import React from "react";
import { useSelector } from "react-redux";
import Card from "../components/Card";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.user);
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user.fullName}
      </h1>
      {user.role === "student" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card title="Next Steps">
            <p className="text-sm text-gray-600">
              Take a new test or review your analysis.
            </p>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Admin Overview">
            <p className="text-sm text-gray-600">
              Manage tests, questions, and users.
            </p>
          </Card>
          <Card title="Pending Tasks">
            <p className="text-sm text-gray-600">
              Review new question submissions.
            </p>
          </Card>
          <Card title="System Stats">
            <p className="text-sm text-gray-600">
              Users: N/A (fetch from backend)
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
