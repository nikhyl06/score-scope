import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function TestSelectionPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(response.data);
      } catch (error) {
        toast.error("Error fetching tests");
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [token]);

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || test.category === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading)
    return (
      <div className="text-center pt-20 text-gray-600">Loading tests...</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Choose a Test
            </h1>
            <p className="text-sm text-gray-600">
              Select from full-length mocks or subject-specific practice
            </p>
          </div>
          <div className="border border-gray-200 rounded-md p-4 mb-6 bg-white flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests by name..."
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Tests</option>
              <option value="Full-Length">Full-Length</option>
              <option value="Subject">Subject-Specific</option>
            </select>
          </div>
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Available Tests ({filteredTests.length})
            </h2>
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTests.map((test) => (
                  <div
                    key={test._id}
                    className="border border-gray-200 rounded-md p-4 bg-white hover:border-gray-300 transition"
                  >
                    <h3 className="text-md font-medium text-gray-800 mb-1">
                      {test.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {test.category} Test
                    </p>
                    <p className="text-xs text-gray-500">
                      Duration: {test.duration} | Questions:{" "}
                      {test.questions.length}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Difficulty: {test.difficulty || "N/A"}
                    </p>
                    <button
                      onClick={() => navigate(`/test/${test._id}`)}
                      className="w-full border border-blue-500 text-blue-500 text-sm p-2 rounded-md hover:bg-blue-50 transition"
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No tests match your search or filter
              </p>
            )}
          </div>
          <div className="border border-gray-200 rounded-md p-6 mt-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Test Selection Tips
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="border-l-2 border-blue-500 pl-2">
                Start with a full-length mock to assess your baseline
              </li>
              <li className="border-l-2 border-blue-500 pl-2">
                Use subject-specific tests to target weak areas
              </li>
              <li className="border-l-2 border-blue-500 pl-2">
                Mix difficulty levels to build confidence and skills
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-md p-6 mt-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Recommended for You
            </h2>
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-md font-medium text-gray-800 mb-1">
                Physics: Mechanics
              </h3>
              <p className="text-xs text-gray-600 mb-1">
                Strengthen your foundation in a key IIT JEE topic
              </p>
              <button
                onClick={() => navigate("/test/2")} // Replace with dynamic ID
                className="w-full border border-blue-500 text-blue-500 text-sm p-2 rounded-md hover:bg-blue-50 transition"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TestSelectionPage;
