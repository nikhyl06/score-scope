import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addTestResult } from "../redux/userSlice";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TestQuestion from "../components/TestQuestion";

function TestInterfacePage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [test, setTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [startTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tests/${testId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTest(response.data);
        const durationInMinutes = parseInt(response.data.duration) * 60; // Convert hours to seconds
        setTimeLeft(durationInMinutes);
      } catch (error) {
        toast.error("Error fetching test");
        console.error("Error fetching test:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId, token]);

  useEffect(() => {
    if (timeLeft <= 0 && test) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, test]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { userAnswer: answer, timeSpent: Date.now() - startTime },
    }));
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) newSet.delete(questionId);
      else newSet.add(questionId);
      return newSet;
    });
  };

  const handleSubmit = async () => {
    const endTime = new Date();
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      userAnswer: answers[questionId].userAnswer,
      timeSpent: Math.floor(answers[questionId].timeSpent / 1000),
    }));

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/results/submit",
        { testId, answers: formattedAnswers, startTime, endTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addTestResult(response.data));
      toast.success("Test submitted successfully!");
      navigate(`/test-summary/${response.data._id}`);
    } catch (error) {
      toast.error("Error submitting test");
      console.error("Error submitting test:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center pt-20 text-gray-600">Loading test...</div>
    );
  if (!test)
    return (
      <div className="text-center pt-20 text-gray-600">Test not found</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Test: {test.name}
            </h1>
            <p className="text-lg font-semibold">
              Time Left: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div className="flex space-x-6">
            <div className="flex-1">
              <TestQuestion
                question={test.questions[currentQuestion]}
                index={currentQuestion}
                answer={
                  answers[test.questions[currentQuestion]._id]?.userAnswer
                }
                onAnswer={handleAnswer}
                onMarkForReview={toggleMarkForReview}
                isMarked={markedForReview.has(
                  test.questions[currentQuestion]._id
                )}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) => Math.max(0, prev - 1))
                  }
                  className="bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  disabled={currentQuestion === 0 || loading}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(test.questions.length - 1, prev + 1)
                    )
                  }
                  className="bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  disabled={
                    currentQuestion === test.questions.length - 1 || loading
                  }
                >
                  Next
                </button>
              </div>
              <button
                onClick={() =>
                  window.confirm("Are you sure?") && handleSubmit()
                }
                className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Test"}
              </button>
            </div>
            <div className="w-40 bg-white border border-gray-200 rounded-md p-4">
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              <div className="grid grid-cols-4 gap-2">
                {test.questions.map((q, idx) => (
                  <button
                    key={q._id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      currentQuestion === idx
                        ? "bg-blue-500 text-white"
                        : answers[q._id]
                        ? "bg-green-500 text-white"
                        : markedForReview.has(q._id)
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200"
                    }`}
                    disabled={loading}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default TestInterfacePage;
