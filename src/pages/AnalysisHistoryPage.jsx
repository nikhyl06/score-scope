import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function AnalysisHistoryPage() {
  const { token, tests } = useSelector((state) => state.user);
  const [filter, setFilter] = useState({ date: "", subject: "" });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/api/results/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming tests are updated in Redux elsewhere; otherwise, set local state
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };
    fetchResults();
  }, [token]);

  const filteredTests = tests.filter((test) => {
    const dateMatch = filter.date
      ? new Date(test.endTime).toISOString().split("T")[0] === filter.date
      : true;
    const subjectMatch =
      filter.subject && filter.subject !== "All"
        ? test.testId.category === filter.subject
        : true;
    return dateMatch && subjectMatch;
  });

  const subjects = ["All", "Physics", "Chemistry", "Maths"];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Analysis History
            </h1>
            <p className="text-sm text-gray-600">
              Review your past test performances
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Tests
            </h2>
            <div className="flex space-x-6">
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
                  onChange={(e) =>
                    setFilter({ ...filter, date: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Past Tests
            </h2>
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <div
                    key={test._id}
                    className="p-4 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-md font-medium text-gray-800 mb-1">
                      {test.testId.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Score: {test.score}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(test.endTime).toLocaleDateString()}
                    </p>
                    <Link
                      to={`/analysis/${test._id}`}
                      className="mt-2 inline-block text-sm text-blue-500 hover:underline"
                    >
                      View Analysis
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No tests found matching your filters.
              </p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AnalysisHistoryPage;
