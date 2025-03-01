import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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
import Footer from "../components/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AnalysisPage() {
  const { testId } = useParams(); // Result ID
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("performance");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/api/results/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };
    fetchResult();
  }, [testId, token]);

  if (!result) return <div>Loading...</div>;

  const { testId: test, answers } = result;
  const performanceData = {
    labels: ["Physics", "Chemistry", "Maths"],
    datasets: [
      {
        label: "Score (%)",
        data: Object.entries(
          answers.reduce((acc, ans) => {
            const subject =
              test.questions.find((q) => q._id.toString() === ans.questionId)
                ?.category || "Unknown";
            acc[subject] = acc[subject] || { correct: 0, total: 0 };
            acc[subject].total += 1;
            if (ans.isCorrect) acc[subject].correct += 1;
            return acc;
          }, {})
        ).map(([subject, data]) => (data.correct / data.total) * 100),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  };
  const timeData = {
    labels: ["Physics", "Chemistry", "Maths"],
    datasets: [
      {
        label: "Time (min)",
        data: Object.entries(
          answers.reduce((acc, ans) => {
            const subject =
              test.questions.find((q) => q._id.toString() === ans.questionId)
                ?.category || "Unknown";
            acc[subject] = acc[subject] || 0;
            acc[subject] += ans.timeSpent / 60;
            return acc;
          }, {})
        ).map(([, time]) => time),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };
  const options = { scales: { y: { beginAtZero: true, max: 100 } } };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Analysis for {test.name}
            </h1>
            <div className="flex space-x-4 mb-6 border-b">
              {["performance", "time", "review", "recommendations"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-4 ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>
            {activeTab === "performance" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Performance Breakdown
                </h2>
                <Bar data={performanceData} options={options} />
                <p className="mt-4 text-sm text-gray-600">
                  Score: {result.score}%
                </p>
              </div>
            )}
            {activeTab === "time" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Time Management
                </h2>
                <Bar
                  data={timeData}
                  options={{
                    scales: {
                      y: { max: Math.max(...timeData.datasets[0].data) + 10 },
                    },
                  }}
                />
                <p className="mt-4 text-sm text-gray-600">
                  Tip: Reduce time on questions by practicing shortcuts.
                </p>
              </div>
            )}
            {activeTab === "review" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Question Review
                </h2>
                <ul className="space-y-4">
                  {answers.map((ans, idx) => {
                    const question = test.questions.find(
                      (q) => q._id.toString() === ans.questionId
                    );
                    return (
                      <li key={ans.questionId}>
                        Q{idx + 1}:{" "}
                        {question.content
                          .map((block) =>
                            block.type === "text" ? block.value : ""
                          )
                          .join(" ")}{" "}
                        <br />
                        Your Answer: {ans.userAnswer} (
                        {ans.isCorrect ? "Correct" : "Incorrect"}, Correct:{" "}
                        {question.correctAnswer}) <br />
                        <span className="text-sm text-gray-600">
                          {question.explanation.content[0]?.value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {activeTab === "recommendations" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Study Recommendations
                </h2>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="border-l-2 border-blue-500 pl-2">
                    Revise weak subjects based on performance
                  </li>
                  <li className="border-l-2 border-blue-500 pl-2">
                    Practice time management with shorter tests
                  </li>
                  <li className="border-l-2 border-blue-500 pl-2">
                    Focus on high-weightage topics
                  </li>
                </ul>
              </div>
            )}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => navigate(`/test-summary/${testId}`)}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
              >
                Back to Summary
              </button>
              <button
                onClick={() => navigate("/test-selection")}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Take Another Test
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AnalysisPage;
