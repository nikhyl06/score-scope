import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AnalysisHistoryPage() {
  const { tests } = useSelector((state) => state.user);
  const [filter, setFilter] = useState({ date: "", subject: "" });

  // Mock subjects for filtering (replace with dynamic data if needed)
  const subjects = ["All", "Physics", "Chemistry", "Maths"];

  const filteredTests = tests.filter((test) => {
    const dateMatch = filter.date ? test.date === filter.date : true; // Assuming test has a date field
    const subjectMatch =
      filter.subject && filter.subject !== "All"
        ? test.name.includes(filter.subject)
        : true;
    return dateMatch && subjectMatch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Analysis History
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Tests</h2>
          <div className="flex space-x-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="subject">
                Subject
              </label>
              <select
                id="subject"
                value={filter.subject}
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Past Tests</h2>
          {filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-medium">{test.name}</h3>
                  <p className="text-gray-600">Score: {test.score}%</p>
                  <p className="text-gray-500 text-sm">
                    Date: {test.date || "N/A"}
                  </p>
                  <Link
                    to={`/analysis/${test.id}`}
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    View Analysis
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No tests found matching your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisHistoryPage;
