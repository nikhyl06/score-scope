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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const TestSummaryPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [mistakeTypes, setMistakeTypes] = useState({});

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/results/${testId}`);
        setResult(response.data);
        console.log(
          "Fetched responses timeSpent:",
          response.data.responses.map((r) => r.timeSpent)
        ); // Debug log
        const initialMistakes = {};
        response.data.responses.forEach((r) => {
          if (!r.isCorrect && r.userAnswer)
            initialMistakes[r.questionId] = r.mistakeType || "";
        });
        setMistakeTypes(initialMistakes);
      } catch (error) {
        console.error("Fetch result error:", error);
        toast.error("Error fetching result");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [testId]);

  const handleMistakeChange = (questionId, value) => {
    setMistakeTypes((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitMistakeTypes = async () => {
    try {
      const updates = Object.entries(mistakeTypes).map(
        ([questionId, mistakeType]) => ({
          questionId,
          mistakeType: mistakeType || null,
        })
      );
      const response = await api.put(`/results/${testId}/mistakes`, {
        responses: updates,
      });
      console.log(
        "Updated responses timeSpent:",
        response.data.responses.map((r) => r.timeSpent)
      ); // Debug log
      setResult(response.data);
      toast.success("Mistake types updated!");
    } catch (error) {
      console.error("Submit mistake types error:", error);
      toast.error("Error updating mistake types");
    }
  };

  if (loading)
    return <div className="text-center py-12">Loading summary...</div>;
  if (!result) return <div className="text-center py-12">Result not found</div>;

  const { testId: test, score, totalMarks, responses, analysis } = result;
  const percentage = ((score / totalMarks) * 100).toFixed(1);
  const stats = {
    correct: responses.filter((r) => r.isCorrect).length,
    incorrect: responses.filter((r) => r.userAnswer && !r.isCorrect).length,
    unattempted: test.questions ? test.questions.length - responses.length : 0,
  };

  // Chart Data
  const pieData = {
    labels: ["Correct", "Incorrect", "Unattempted"],
    datasets: [
      {
        data: [stats.correct, stats.incorrect, stats.unattempted],
        backgroundColor: ["#34d399", "#f87171", "#d1d5db"],
      },
    ],
  };
  console.log(analysis.mistakeDistribution);

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

  const timeBarData = {
    labels: responses.map((r, idx) => `Q${idx + 1}`),
    datasets: [
      {
        label: "Time Spent (sec)",
        data: responses.map((r) => r.timeSpent), // Should be individual times
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
      <Card>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Test Summary & Analysis: {test.name}
        </h1>
        <div className="flex justify-center mb-6">
          <ProgressCircle percentage={percentage} size={120} />
        </div>
        <p className="text-xl text-center mb-4">
          {score} / {totalMarks} ({percentage}%)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <p className="text-sm text-gray-600 text-center">
            Correct: {stats.correct}
          </p>
          <p className="text-sm text-gray-600 text-center">
            Incorrect: {stats.incorrect}
          </p>
          <p className="text-sm text-gray-600 text-center">
            Unattempted: {stats.unattempted}
          </p>
        </div>
        <p className="text-sm text-gray-600 text-center mb-6">
          Time Taken:{" "}
          {Math.floor(
            (new Date(result.endTime) - new Date(result.startTime)) / 60000
          )}{" "}
          min
        </p>

        {/* Analysis Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Detailed Analysis</h2>
          {result && ( // Conditional rendering to ensure data is available
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  {analysis.timeManagement.averageTimePerQuestion.toFixed(1)}{" "}
                  sec
                </p>
                {analysis.timeManagement.questionsExceededTime.length > 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Questions Exceeded Time:{" "}
                    {analysis.timeManagement.questionsExceededTime.length}
                  </p>
                )}
              </Card>
            </div>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <div className="flex justify-center space-x-4 mb-6 mt-6">
          <Button onClick={() => setShowSolutions(!showSolutions)}>
            {showSolutions ? "Hide Solutions" : "Show Solutions"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/test-selection")}
          >
            Take Another Test
          </Button>
        </div>

        {/* Solutions Section */}
        {showSolutions && (
          <div className="space-y-6 mb-6 mt-6">
            <h2 className="text-lg font-semibold">Solutions & Feedback</h2>
            {test.questions && test.questions.length > 0 ? (
              test.questions.map((question, index) => {
                const questionId = question._id
                  ? question._id.toString()
                  : null;
                const response =
                  responses.find((r) => r.questionId === questionId) || {};
                return (
                  <Card key={questionId || index} className="p-4">
                    <div className="text-sm text-gray-600 mb-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {`Q${index + 1}: ${
                          question.content || "Question content missing"
                        }`}
                      </ReactMarkdown>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Your Answer:</span>{" "}
                      {response.userAnswer || "Not attempted"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {question.correctAnswer || "N/A"}
                    </p>
                    {question.explanation && (
                      <div className="text-sm text-gray-600 mt-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {`**Explanation:** ${question.explanation}`}
                        </ReactMarkdown>
                      </div>
                    )}
                    {!response.isCorrect &&
                      response.userAnswer &&
                      questionId && (
                        <div className="mt-2">
                          <label className="text-sm text-gray-600">
                            What went wrong?
                          </label>
                          <select
                            value={mistakeTypes[questionId] || ""}
                            onChange={(e) =>
                              handleMistakeChange(questionId, e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md mt-1"
                          >
                            <option value="">Select</option>
                            <option value="conceptual">
                              Conceptual Mistake
                            </option>
                            <option value="silly">Silly Mistake</option>
                            <option value="notStudied">Haven't Studied</option>
                          </select>
                        </div>
                      )}
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-gray-600">
                No questions available to display.
              </p>
            )}
            <Button onClick={submitMistakeTypes} className="w-full mt-4">
              Submit Feedback
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TestSummaryPage;
