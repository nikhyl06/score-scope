import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function TestSelectionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // Filter by category

  // Mock test data with additional details
  const tests = [
    {
      id: "1",
      name: "Full Mock Test 1",
      category: "Full-Length",
      duration: "3 hrs",
      questions: 90,
      difficulty: "Hard",
      description: "Simulates the complete IIT JEE exam experience",
    },
    {
      id: "2",
      name: "Physics: Mechanics",
      category: "Subject",
      duration: "1 hr",
      questions: 30,
      difficulty: "Medium",
      description: "Focuses on core mechanics concepts",
    },
    {
      id: "3",
      name: "Chemistry: Organic",
      category: "Subject",
      duration: "1 hr",
      questions: 30,
      difficulty: "Medium",
      description: "Covers organic chemistry fundamentals",
    },
  ];

  // Filter tests based on search and category
  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || test.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 pt-12 pb-20 px-6">
        {/* Header Section */}
        <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Choose a Test
          </h1>
          <p className="text-sm text-gray-600">
            Select from full-length mocks or subject-specific practice
          </p>
        </div>

        {/* Search and Filter Section */}
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

        {/* Test List Section */}
        <div className="border border-gray-200 rounded-md p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Available Tests ({filteredTests.length})
          </h2>
          {filteredTests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="border border-gray-200 rounded-md p-4 bg-white hover:border-gray-300 transition"
                >
                  <h3 className="text-md font-medium text-gray-800 mb-1">
                    {test.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {test.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Duration: {test.duration} | Questions: {test.questions}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Difficulty: {test.difficulty}
                  </p>
                  <button
                    onClick={() => navigate(`/test/${test.id}`)}
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

        {/* Tips Section */}
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

        {/* Recommended Test Section */}
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
              onClick={() => navigate("/test/2")}
              className="border border-blue-500 text-blue-500 text-sm px-2 py-1 rounded-md hover:bg-blue-50 transition"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestSelectionPage;
