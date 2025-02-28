import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function TestSummaryPage() {
  const { testId } = useParams(); // This is the result ID, not the test ID
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/results/${testId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };
    fetchResult();
  }, [testId, token]);

  if (!result) return <div>Loading...</div>;

  const { testId: test, score, totalMarks, answers } = result;
  const subjectBreakdown = answers.reduce((acc, ans) => {
    const subject =
      test.questions.find((q) => q._id.toString() === ans.questionId)
        ?.category || "Unknown";
    acc[subject] = acc[subject] || { correct: 0, total: 0 };
    acc[subject].total += 4; // Assuming 4 marks per question
    if (ans.isCorrect) acc[subject].correct += 4;
    return acc;
  }, {});

  const stats = {
    correct: answers.filter((a) => a.isCorrect).length,
    incorrect: answers.filter((a) => a.userAnswer && !a.isCorrect).length,
    unattempted: test.questions.length - answers.length,
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
              Overall Performance
            </h2>
            <p className="text-2xl mb-4">Score: {score}%</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(subjectBreakdown).map(([subject, data]) => (
                <div
                  key={subject}
                  className="border border-gray-200 rounded-md p-4 bg-white"
                >
                  <h3 className="font-semibold text-gray-800">{subject}</h3>
                  <p className="text-sm text-gray-600">
                    {data.correct}/{data.total}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <p className="text-sm text-gray-600">Correct: {stats.correct}</p>
              <p className="text-sm text-gray-600">
                Incorrect: {stats.incorrect}
              </p>
              <p className="text-sm text-gray-600">
                Unattempted: {stats.unattempted}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Time Taken:{" "}
              {Math.floor(
                (new Date(result.endTime) - new Date(result.startTime)) / 60000
              )}{" "}
              min
            </p>
            <button
              onClick={() => navigate(`/analysis/${testId}`)}
              className="mt-6 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              View Detailed Analysis
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TestSummaryPage;
