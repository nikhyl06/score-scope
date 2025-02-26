import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AnalysisHistoryPage() {
  const { tests } = useSelector((state) => state.user);
  const [filter, setFilter] = useState({ date: "", subject: "", search: "" });

  // Mock subjects for filtering
  const subjects = ["All", "Physics", "Chemistry", "Maths"];

  // Enhanced mock test data (assuming tests have more fields; extend Redux state if needed)
  const enrichedTests = tests.map((test) => ({
    ...test,
    date: test.date || new Date().toISOString().split("T")[0], // Default date if missing
    difficulty: test.difficulty || "Medium", // Add if not present
  }));

  const filteredTests = enrichedTests.filter((test) => {
    const dateMatch = filter.date ? test.date === filter.date : true;
    const subjectMatch =
      filter.subject && filter.subject !== "All"
        ? test.name.includes(filter.subject)
        : true;
    const searchMatch = filter.search
      ? test.name.toLowerCase().includes(filter.search.toLowerCase())
      : true;
    return dateMatch && subjectMatch && searchMatch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 pt-12 pb-20 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Analysis History
          </h1>
          <p className="text-sm text-gray-600">
            Review your past test performances
          </p>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white rounded-md p-4 mb-8">
          <h2 className="text-md font-medium text-gray-800 mb-3">
            Filter Tests
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                className="block text-sm text-gray-700 mb-1"
                htmlFor="search"
              >
                Search by Name
              </label>
              <input
                type="text"
                id="search"
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                placeholder="Search tests..."
                className="w-full p-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm text-gray-700 mb-1"
                htmlFor="date"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                className="p-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm text-gray-700 mb-1"
                htmlFor="subject"
              >
                Subject
              </label>
              <select
                id="subject"
                value={filter.subject}
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
                className="p-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Past Tests Section */}
        <div className="bg-white rounded-md p-4 mb-8">
          <h2 className="text-md font-medium text-gray-800 mb-3">Past Tests</h2>
          {filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-md p-3 hover:bg-gray-100 transition"
                >
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    {test.name}
                  </h3>
                  <p className="text-xs text-gray-600">Score: {test.score}%</p>
                  <p className="text-xs text-gray-500">Date: {test.date}</p>
                  <p className="text-xs text-gray-500">
                    Difficulty: {test.difficulty}
                  </p>
                  <Link
                    to={`/analysis/${test.id}`}
                    className="mt-2 inline-block text-sm text-blue-500 hover:underline"
                  >
                    View Analysis
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No tests found matching your filters
            </p>
          )}
        </div>

        {/* Statistics Summary */}
        <div className="bg-white rounded-md p-4 mb-8">
          <h2 className="text-md font-medium text-gray-800 mb-3">
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-2">
              <p className="text-sm font-medium text-gray-800">
                Total Tests: {tests.length}
              </p>
              <p className="text-xs text-gray-600">Completed so far</p>
            </div>
            <div className="p-2">
              <p className="text-sm font-medium text-gray-800">
                Avg Score:{" "}
                {tests.length
                  ? (
                      tests.reduce((acc, t) => acc + t.score, 0) / tests.length
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-600">Across all tests</p>
            </div>
            <div className="p-2">
              <p className="text-sm font-medium text-gray-800">
                Best Score:{" "}
                {tests.length ? Math.max(...tests.map((t) => t.score)) : 0}%
              </p>
              <p className="text-xs text-gray-600">Highest achieved</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-md p-4">
          <h2 className="text-md font-medium text-gray-800 mb-3">
            Quick Actions
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <Link
              to="/test-selection"
              className="bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition text-center"
            >
              Take a New Test
            </Link>
            <Link
              to="/study-plan"
              className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 transition text-center"
            >
              Review Study Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisHistoryPage;
