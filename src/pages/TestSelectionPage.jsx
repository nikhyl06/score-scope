import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function TestSelectionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Mock test data
  const tests = [
    { id: "1", name: "Full Mock Test 1", duration: "3 hrs", questions: 90 },
    { id: "2", name: "Physics: Mechanics", duration: "1 hr", questions: 30 },
    { id: "3", name: "Chemistry: Organic", duration: "1 hr", questions: 30 },
  ];

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Choose a Test</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tests..."
          className="w-full max-w-md p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{test.name}</h3>
              <p className="text-gray-600">Duration: {test.duration}</p>
              <p className="text-gray-600">Questions: {test.questions}</p>
              <button
                onClick={() => navigate(`/test/${test.id}`)}
                className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestSelectionPage;
