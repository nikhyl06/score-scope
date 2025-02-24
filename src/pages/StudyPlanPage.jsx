import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function StudyPlanPage() {
  const navigate = useNavigate();
  const [targetScore, setTargetScore] = useState("");

  // Mock study plan
  const plan = [
    { day: "Day 1", task: "Solve 20 Mechanics questions", progress: 50 },
    { day: "Day 2", task: "Revise Organic Chemistry", progress: 20 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Your Study Plan
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Set Your Goal</h2>
          <input
            type="number"
            value={targetScore}
            onChange={(e) => setTargetScore(e.target.value)}
            placeholder="Target Score (e.g., 90%)"
            className="w-full max-w-xs p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Update Plan
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <ul className="space-y-4">
            {plan.map((item) => (
              <li key={item.day} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {item.day}: {item.task}
                  </p>
                  <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/test-selection")}
                  className="text-blue-600 hover:underline"
                >
                  Practice Now
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudyPlanPage;
