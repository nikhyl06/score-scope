import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressCircle from "../components/ProgressCircle";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const IndividualTestAnalysisPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/results/${resultId}`);
        setResult(response.data);
      } catch (error) {
        toast.error("Error fetching test result");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading)
    return <div className="text-center py-12">Loading analysis...</div>;
  if (!result) return <div className="text-center py-12">Result not found</div>;

  const { testId: test, score, totalMarks, responses, analysis } = result;
  const percentage = ((score / totalMarks) * 100).toFixed(1);
  const stats = {
    correct: responses.filter((r) => r.isCorrect).length,
    incorrect: responses.filter((r) => r.userAnswer && !r.isCorrect).length,
    unattempted: test.questions ? test.questions.length - responses.length : 0,
  };

  const pieData = {
    labels: ["Correct", "Incorrect", "Unattempted"],
    datasets: [
      {
        data: [stats.correct, stats.incorrect, stats.unattempted],
        backgroundColor: ["#34d399", "#f87171", "#d1d5db"],
      },
    ],
  };

  const topicBarData = {
    labels: analysis.topicPerformance.map((t) => t.topic),
    datasets: [
      {
        label: "Accuracy (%)",
        data: analysis.topicPerformance.map((t) => t.accuracy),
        backgroundColor: "#3c68ca",
      },
    ],
  };

  const typeBarData = {
    labels: analysis.questionTypePerformance.map((t) => t.type),
    datasets: [
      {
        label: "Accuracy (%)",
        data: analysis.questionTypePerformance.map((t) => t.accuracy),
        backgroundColor: "#34d399",
      },
    ],
  };

  // Fixed: Show individual time spent per question, not cumulative
  const timeBarData = {
    labels: responses.map((r, idx) => `Q${idx + 1}`),
    datasets: [
      {
        label: "Time Spent (sec)",
        data: responses.map((r) => r.timeSpent),
        backgroundColor: "#f87171",
      },
    ],
  };

  const mistakePieData = {
    labels: ["Conceptual", "Silly", "Not Studied"],
    datasets: [
      {
        data: [
          analysis.mistakeDistribution.conceptual,
          analysis.mistakeDistribution.silly,
          analysis.mistakeDistribution.notStudied,
        ],
        backgroundColor: ["#f87171", "#fbbf24", "#9ca3af"],
      },
    ],
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Analysis: {test.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Performance" className="flex flex-col items-center">
          <ProgressCircle percentage={percentage} />
          <p className="mt-4 text-lg">
            {score} / {totalMarks}
          </p>
        </Card>
        <Card title="Question Breakdown">
          <div className="h-48">
            <Pie
              data={pieData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </Card>
        <Card title="Insights">
          <ul className="space-y-2">
            {analysis.tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Topic Performance">
          <div className="h-64">
            <Bar
              data={topicBarData}
              options={{
                responsive: true,
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </div>
        </Card>
        <Card title="Question Type Performance">
          <div className="h-64">
            <Bar
              data={typeBarData}
              options={{
                responsive: true,
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Time Spent per Question">
          <div className="h-64">
            <Bar
              data={timeBarData}
              options={{
                responsive: true,
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </Card>
        <Card title="Mistake Distribution">
          <div className="h-48">
            <Pie
              data={mistakePieData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </Card>
      </div>
      <Card title="Test Details">
        <p className="text-sm text-gray-600">
          Difficulty:{" "}
          {analysis.difficulty === "easy"
            ? "Easy (JEE Mains)"
            : "Hard (JEE Advanced)"}
        </p>
        <p className="text-sm text-gray-600">
          Total Time: {analysis.timeManagement.totalTime} sec
        </p>
        <p className="text-sm text-gray-600">
          Average Time per Question:{" "}
          {analysis.timeManagement.averageTimePerQuestion.toFixed(1)} sec
        </p>
        {analysis.timeManagement.questionsExceededTime.length > 0 && (
          <p className="text-sm text-red-500 mt-2">
            Questions Exceeded Time:{" "}
            {analysis.timeManagement.questionsExceededTime.length}
          </p>
        )}
      </Card>
      <div className="flex justify-center space-x-4 mt-6">
        <Button onClick={() => navigate("/analysis")}>
          Back to Overall Analysis
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/test-summary/${result._id}`)}
        >
          View Summary
        </Button>
      </div>
    </div>
  );
};

export default IndividualTestAnalysisPage;
