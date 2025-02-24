import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTest } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";

function TestInterfacePage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 hours in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());

  // Mock test data (replace with API fetch in real app)
  const questions = [
    {
      id: 1,
      text: "What is the value of g?",
      options: ["9.8", "10", "8.9", "9"],
      correct: "9.8",
      type: "MCQ",
    },
    {
      id: 2,
      text: "Solve: 2x + 3 = 7",
      options: ["1", "2", "3", "4"],
      correct: "2",
      type: "MCQ",
    },
    {
      id: 3,
      text: "Value of ∫(0 to 1) x dx?",
      type: "Numerical",
      correct: "0.5",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  const handleSubmit = () => {
    const score =
      (Object.keys(answers).reduce((acc, qId) => {
        const q = questions.find((q) => q.id === parseInt(qId));
        return acc + (answers[qId] === q.correct ? 4 : -1);
      }, 0) /
        (questions.length * 4)) *
      100;
    dispatch(addTest({ id: testId, name: `Test ${testId}`, score }));
    navigate(`/test-summary/${testId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Test {testId}</h1>
          <p className="text-lg font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>
        <div className="flex space-x-6">
          {/* Question Area */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-medium mb-4">
              Q{currentQuestion + 1}: {questions[currentQuestion].text}
            </p>
            {questions[currentQuestion].type === "MCQ" ? (
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleAnswer(questions[currentQuestion].id, option)
                    }
                    className={`p-3 rounded-lg border text-center ${
                      answers[questions[currentQuestion].id] === option
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="number"
                step="0.1"
                value={answers[questions[currentQuestion].id] || ""}
                onChange={(e) =>
                  handleAnswer(questions[currentQuestion].id, e.target.value)
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your answer"
              />
            )}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  toggleMarkForReview(questions[currentQuestion].id)
                }
                className={`px-4 py-2 rounded-lg ${
                  markedForReview.has(questions[currentQuestion].id)
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {markedForReview.has(questions[currentQuestion].id)
                  ? "Unmark"
                  : "Mark for Review"}
              </button>
              <button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                className="bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
            </div>
            <button
              onClick={() => window.confirm("Are you sure?") && handleSubmit()}
              className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Submit Test
            </button>
          </div>
          {/* Question Palette */}
          <div className="w-40 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentQuestion === idx
                      ? "bg-blue-600 text-white"
                      : answers[q.id]
                      ? "bg-green-500 text-white"
                      : markedForReview.has(q.id)
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestInterfacePage;
