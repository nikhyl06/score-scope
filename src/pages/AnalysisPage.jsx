import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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

const AnalysisPage = () => {
  const navigate = useNavigate();
  const { tests } = useSelector((state) => state.user);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get("/results/user");
        setResults(response.data);
      } catch (error) {
        toast.error("Error fetching analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading)
    return <div className="text-center py-12">Loading analysis...</div>;
  if (results.length === 0)
    return <div className="text-center py-12">No results found</div>;

  // Aggregate overall performance
  const totalTests = results.length;
  const avgScore = (
    (results.reduce((sum, r) => sum + r.score, 0) /
      results.reduce((sum, r) => sum + r.totalMarks, 0)) *
    100
  ).toFixed(1);
  const totalResponses = results.flatMap((r) => r.responses);
  const stats = {
    correct: totalResponses.filter((r) => r.isCorrect).length,
    incorrect: totalResponses.filter((r) => r.userAnswer && !r.isCorrect)
      .length,
    unattempted: results.reduce(
      (sum, r) => sum + (r.testId.questions.length - r.responses.length),
      0
    ),
  };

  // Aggregate topic performance
  const topicPerfMap = {};
  results.forEach((r) => {
    r.analysis.topicPerformance.forEach((tp) => {
      topicPerfMap[tp.topic] = topicPerfMap[tp.topic] || {
        correct: 0,
        total: 0,
      };
      topicPerfMap[tp.topic].correct += tp.correct;
      topicPerfMap[tp.topic].total += tp.total;
    });
  });
  const topicBarData = {
    labels: Object.keys(topicPerfMap),
    datasets: [
      {
        label: "Accuracy (%)",
        data: Object.values(topicPerfMap).map((tp) =>
          ((tp.correct / tp.total) * 100).toFixed(1)
        ),
        backgroundColor: "#3c68ca",
      },
    ],
  };

  // Aggregate question type performance
  const typePerfMap = {};
  results.forEach((r) => {
    r.analysis.questionTypePerformance.forEach((tp) => {
      typePerfMap[tp.type] = typePerfMap[tp.type] || { correct: 0, total: 0 };
      typePerfMap[tp.type].correct += tp.correct;
      typePerfMap[tp.type].total += tp.total;
    });
  });
  const typeBarData = {
    labels: Object.keys(typePerfMap),
    datasets: [
      {
        label: "Accuracy (%)",
        data: Object.values(typePerfMap).map((tp) =>
          ((tp.correct / tp.total) * 100).toFixed(1)
        ),
        backgroundColor: "#34d399",
      },
    ],
  };

  // Aggregate mistake distribution
  const mistakeDist = { conceptual: 0, silly: 0, notStudied: 0 };
  results.forEach((r) => {
    mistakeDist.conceptual += r.analysis.mistakeDistribution.conceptual;
    mistakeDist.silly += r.analysis.mistakeDistribution.silly;
    mistakeDist.notStudied += r.analysis.mistakeDistribution.notStudied;
  });
  const mistakePieData = {
    labels: ["Conceptual", "Silly", "Not Studied"],
    datasets: [
      {
        data: [
          mistakeDist.conceptual,
          mistakeDist.silly,
          mistakeDist.notStudied,
        ],
        backgroundColor: ["#f87171", "#fbbf24", "#9ca3af"],
      },
    ],
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

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Overall Performance Analysis
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Overall Score" className="flex flex-col items-center">
          <ProgressCircle percentage={avgScore} />
          <p className="mt-4 text-lg">Average: {avgScore}%</p>
        </Card>
        <Card title="Question Breakdown">
          <div className="h-48">
            <Pie
              data={pieData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </Card>
        <Card title="Test Summary">
          <p className="text-sm text-gray-600">Total Tests: {totalTests}</p>
          <p className="text-sm text-gray-600">
            Total Questions:{" "}
            {stats.correct + stats.incorrect + stats.unattempted}
          </p>
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
      <Card title="Mistake Distribution" className="max-w-md mx-auto">
        <div className="h-48">
          <Pie
            data={mistakePieData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </Card>
      <Card title="Individual Test Analysis" className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Your Tests</h2>
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result._id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span className="text-sm text-gray-600">
                {result.testId.name} (
                {new Date(result.endTime).toLocaleDateString()})
              </span>
              <Button
                variant="secondary"
                onClick={() => navigate(`/test-summary/${result._id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex justify-center mt-6">
        <Button onClick={() => navigate("/test-selection")}>
          Back to Tests
        </Button>
      </div>
    </div>
  );
};

export default AnalysisPage;
