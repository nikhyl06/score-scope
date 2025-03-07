import React from "react";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import ProgressCircle from "../components/ProgressCircle";

const Dashboard = () => {
  const { user, tests } = useSelector((state) => state.user);
  const avgScore =
    tests.length > 0
      ? (
          (tests.reduce((sum, t) => sum + t.score, 0) /
            tests.length /
            tests[0].totalMarks) *
          100
        )
      : 0;

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user.fullName}
      </h1>
      {user.role === "student" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Recent Performance"
            className="flex flex-col items-center"
          >
            <ProgressCircle percentage={avgScore} />
            <p className="mt-2 text-gray-600">Average Score: {avgScore}%</p>
          </Card>
          <Card title="Quick Stats">
            <p className="text-sm text-gray-600">Tests Taken: {tests.length}</p>
            <p className="text-sm text-gray-600">
              Last Test:{" "}
              {tests.length > 0
                ? new Date(tests[0].endTime).toLocaleDateString()
                : "N/A"}
            </p>
          </Card>
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
