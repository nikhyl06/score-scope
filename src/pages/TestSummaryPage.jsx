import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function TestSummaryPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/api/tests/results/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const latestResult = response.data.find((r) => r._id === testId);
        setResult(latestResult);
      } catch (error) {
        toast.error("Error fetching result");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [testId, token]);

  if (loading)
    return (
      <div className="text-center pt-20 text-gray-600">Loading summary...</div>
    );
  if (!result)
    return (
      <div className="text-center pt-20 text-gray-600">Result not found</div>
    );

  const { testId: test, score, totalMarks, responses } = result;
  const stats = {
    correct: responses.filter((r) => r.isCorrect).length,
    incorrect: responses.filter((r) => r.userAnswer && !r.isCorrect).length,
    unattempted: test.questions.length - responses.length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Test Summary: {test.name}
            </h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Performance
            </h2>
            <p className="text-2xl mb-4">
              Score: {score} / {totalMarks} (
              {((score / totalMarks) * 100).toFixed(1)}%)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <p className="text-sm text-gray-600">Correct: {stats.correct}</p>
              <p className="text-sm text-gray-600">
                Incorrect: {stats.incorrect}
              </p>
              <p className="text-sm text-gray-600">
                Unattempted: {stats.unattempted}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Time Taken:{" "}
              {Math.floor(
                (new Date(result.endTime) - new Date(result.startTime)) / 60000
              )}{" "}
              min
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/analysis/${testId}`)}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              >
                View Detailed Analysis
              </button>
              <button
                onClick={() => navigate("/test-selection")}
                className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition"
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

export default TestSummaryPage;
