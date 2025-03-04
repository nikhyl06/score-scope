import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { addTestResult } from "../redux/userSlice";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function Dashboard() {
  const { user, token, tests } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/results/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Dispatch all results at once instead of one by one
        response.data.forEach((result) => dispatch(addTestResult(result)));
        setError(null);
      } catch (err) {
        setError(err.response?.data.message || "Error fetching test results");
        toast.error(error);
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="text-center pt-20 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <div className="pt-12 pb-20 px-6 flex-1 text-center text-red-500">
            {error}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const totalTests = tests.length;
  const avgScore = totalTests
    ? (tests.reduce((acc, t) => acc + t.score, 0) / totalTests).toFixed(1)
    : 0;
  const lastTestScore = totalTests ? `${tests[totalTests - 1].score}%` : "N/A";
  const recentTests = tests.slice(-3);
  const todos = [
    { id: 1, task: "Revise Mechanics", completed: false },
    { id: 2, task: "Take Chemistry Mock", completed: true },
  ];
  const progress = {
    completedTests: totalTests,
    totalTests: 10,
    percentage: totalTests * 10,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Hello {user?.fullName || "User"}
            </h1>
            <p className="text-sm text-gray-600">
              Your dashboard for IIT JEE preparation
            </p>
          </div>
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
          <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Recent Tests
            </h2>
            {recentTests.length ? (
              <ul className="space-y-2">
                {recentTests.map((test) => (
                  <li
                    key={test._id}
                    className="border border-gray-200 rounded-md p-3 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">
                      {test.testId?.name || "Unnamed Test"} - {test.score}%
                    </span>
                    <Link
                      to={`/analysis/${test._id}`}
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
          <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Today’s Tasks
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
          <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Preparation Progress
            </h2>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {progress.completedTests} of {progress.totalTests} tests
                completed
              </p>
              <p className="text-sm text-gray-600">{progress.percentage}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
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
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
