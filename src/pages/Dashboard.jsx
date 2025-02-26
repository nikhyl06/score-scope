import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Dashboard() {
  const { name, tests, progress} = useSelector((state) => state.user);

  // Calculate stats
  const totalTests = tests.length;
  const avgScore = totalTests
    ? (tests.reduce((acc, t) => acc + t.score, 0) / totalTests).toFixed(1)
    : 0;
  const lastTestScore = totalTests ? `${tests[totalTests - 1].score}%` : "N/A";

  // Mock additional data (replace with real data from Redux/API)
  const recentTests = tests.slice(-3); // Last 3 tests
  const todos = [
    { id: 1, task: "Revise Mechanics", completed: false },
    { id: 2, task: "Take Chemistry Mock", completed: true },
  ];
  const UserProgress = {...progress,
    percentage: (progress.completedTests / progress.totalTests) * 100
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 pt-12 pb-20 px-6">
        {/* Welcome Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Hello {name}
          </h1>
          <p className="text-sm text-gray-600">
            Your dashboard for IIT JEE preparation
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-1">
              Tests Taken
            </h3>
            <p className="text-md text-gray-600">{totalTests}</p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-1">
              Average Score
            </h3>
            <p className="text-md text-gray-600">{avgScore}%</p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h3 className="text-md font-medium text-gray-800 mb-1">
              Last Test
            </h3>
            <p className="text-md text-gray-600">{lastTestScore}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Get Started
          </h2>
          <div className="flex space-x-3">
            <Link
              to="/test-selection"
              className="border border-blue-500 text-blue-500 text-sm px-4 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Take a Test
            </Link>
            <Link
              to="/study-plan"
              className="border border-gray-500 text-gray-500 text-sm px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              View Study Plan
            </Link>
          </div>
        </div>

        {/* Recent Tests Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Recent Tests
          </h2>
          {recentTests.length ? (
            <ul className="space-y-2">
              {recentTests.map((test) => (
                <li
                  key={test.id}
                  className="border border-gray-200 rounded-md p-3 flex justify-between items-center"
                >
                  <span className="text-sm text-gray-600">
                    {test.name} - {test.score}%
                  </span>
                  <Link
                    to={`/analysis/${test.id}`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Analysis
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No tests taken yet</p>
          )}
          {totalTests > 3 && (
            <Link
              to="/analysis-history"
              className="inline-block mt-3 text-sm text-blue-500 hover:underline"
            >
              See All Tests
            </Link>
          )}
        </div>

        {/* To-Do List Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Today's Tasks
          </h2>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                  className="mr-2"
                />
                <span
                  className={`text-sm ${
                    todo.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-600"
                  }`}
                >
                  {todo.task}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/study-plan"
            className="inline-block mt-3 text-sm text-blue-500 hover:underline"
          >
            Manage Tasks
          </Link>
        </div>

        {/* Progress Overview */}
        <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Preparation Progress
          </h2>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              {UserProgress.completedTests} of {UserProgress.totalTests} tests
              completed
            </p>
            <p className="text-sm text-gray-600">{UserProgress.percentage}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${UserProgress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="border border-gray-200 rounded-md p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Tips
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="border-l-2 border-blue-500 pl-3">
              Focus on high-weightage topics like Mechanics and Calculus
            </li>
            <li className="border-l-2 border-blue-500 pl-3">
              Review mistakes immediately after each test
            </li>
            <li className="border-l-2 border-blue-500 pl-3">
              Practice time management with shorter mock tests
            </li>
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
