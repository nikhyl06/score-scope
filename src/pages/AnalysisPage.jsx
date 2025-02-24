import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AnalysisPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { tests } = useSelector((state) => state.user);
  const test = tests.find((t) => t.id === testId) || {
    name: `Test ${testId}`,
    score: 75,
  };
  const [activeTab, setActiveTab] = useState("performance");

  // Mock data for analysis (replace with API fetch)
  const performanceData = {
    labels: ["Physics", "Chemistry", "Maths"],
    datasets: [
      {
        label: "Score (%)",
        data: [75, 80, 65],
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  };
  const timeData = {
    labels: ["Physics", "Chemistry", "Maths"],
    datasets: [
      {
        label: "Time (min)",
        data: [50, 45, 55],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = { scales: { y: { beginAtZero: true, max: 100 } } };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Analysis for {test.name}
        </h1>
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {["performance", "time", "review", "recommendations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === "performance" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Performance Breakdown
              </h2>
              <Bar data={performanceData} options={options} />
              <p className="mt-4">Score: {test.score}%</p>
            </>
          )}
          {activeTab === "time" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Time Management</h2>
              <Bar data={timeData} options={{ scales: { y: { max: 180 } } }} />
              <p className="mt-4">
                Tip: Reduce time on Chemistry by practicing shortcuts.
              </p>
            </>
          )}
          {activeTab === "review" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Question Review</h2>
              <ul className="space-y-4">
                <li>
                  Q1: What is the value of g? <br />
                  Your Answer: 9.8 (Correct) <br />
                  <a href="#" className="text-blue-600 hover:underline">
                    Watch Explanation
                  </a>
                </li>
                <li>
                  Q2: Solve: 2x + 3 = 7 <br />
                  Your Answer: 3 (Incorrect, Correct: 2) <br />
                  <a href="#" className="text-blue-600 hover:underline">
                    Watch Explanation
                  </a>
                </li>
              </ul>
            </>
          )}
          {activeTab === "recommendations" && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Study Recommendations
              </h2>
              <ul className="list-disc pl-5">
                <li>Revise Thermodynamics - Score: 40%</li>
                <li>Practice Algebra - Common mistakes detected</li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Watch Calculus Basics
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => navigate(`/test-summary/${testId}`)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Summary
          </button>
          <button
            onClick={() => navigate("/test-selection")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Take Another Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
