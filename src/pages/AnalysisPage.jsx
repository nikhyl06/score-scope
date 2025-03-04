import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function AnalysisPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/tests/results/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const latestResult = response.data.find((r) => r._id === testId);
        setResult(latestResult);
      } catch (error) {
        toast.error("Error fetching analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [testId, token]);

  if (loading)
    return (
      <div className="text-center pt-20 text-gray-600">Loading analysis...</div>
    );
  if (!result)
    return (
      <div className="text-center pt-20 text-gray-600">Result not found</div>
    );

  const { testId: test, score, totalMarks, analysis } = result;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Analysis: {test.name}
            </h1>

            {/* Overall Score */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Your Score
            </h2>
            <p className="text-2xl mb-6">
              {score} / {totalMarks} ({((score / totalMarks) * 100).toFixed(1)}
              %)
            </p>

            {/* Topic Performance */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Topic Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {analysis.topicPerformance.map((perf, idx) => (
                <div key={idx} className="p-4 border rounded-md bg-gray-50">
                  <p>
                    <strong>{perf.topic}</strong>
                  </p>
                  <p>
                    Correct: {perf.correct}/{perf.total} (
                    {((perf.correct / perf.total) * 100).toFixed(1)}%)
                  </p>
                </div>
              ))}
            </div>

            {/* Difficulty */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Difficulty
            </h2>
            <p className="mb-6">
              This test was{" "}
              {analysis.difficulty === "easy"
                ? "JEE Mains (Easy)"
                : "JEE Advanced (Hard)"}{" "}
              level.
            </p>

            {/* Personalized Tips */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tips for Improvement
            </h2>
            <div className="p-4 border rounded-md bg-blue-50 mb-6">
              <ul className="list-disc ml-6">
                {analysis.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate("/test-selection")}
              className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition"
            >
              Back to Tests
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AnalysisPage;
