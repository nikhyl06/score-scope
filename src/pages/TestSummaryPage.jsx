import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";

function TestSummaryPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { tests } = useSelector((state) => state.user);
  const test = tests.find((t) => t.id === testId) || {
    name: `Test ${testId}`,
    score: 75,
  };

  // Mock data
  const summary = {
    totalMarks: test.score,
    subjects: { Physics: 25, Chemistry: 30, Maths: 20 },
    stats: { correct: 18, incorrect: 5, unattempted: 7 },
    time: "2 hrs 45 min",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Test Summary: {test.name}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
          <p className="text-2xl mb-4">Score: {summary.totalMarks}%</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Object.entries(summary.subjects).map(([subject, marks]) => (
              <div key={subject} className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold">{subject}</h3>
                <p>{marks}/30</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <p>Correct: {summary.stats.correct}</p>
            <p>Incorrect: {summary.stats.incorrect}</p>
            <p>Unattempted: {summary.stats.unattempted}</p>
          </div>
          <p>Time Taken: {summary.time}</p>
          <button
            onClick={() => navigate(`/analysis/${testId}`)}
            className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            View Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestSummaryPage;
