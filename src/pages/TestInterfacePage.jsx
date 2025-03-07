import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTestResult } from "../redux/userSlice";
import api from "../api";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Button from "../components/Button";
import TestQuestion from "../components/TestQuestion";

const TestInterfacePage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
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
        const response = await api.get(`/tests/${testId}`);
        setTest(response.data);
        setTimeLeft(response.data.metadata.timeAllotted / 1000);
      } catch (error) {
        toast.error("Error fetching test");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);
  console.log(test);

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
      [questionId]: {
        userAnswer: answer,
        timeSpent: (Date.now() - startTime) / 1000,
      },
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
    const formattedResponses = Object.entries(answers).map(
      ([questionId, data]) => ({
        questionId,
        userAnswer: data.userAnswer,
        timeSpent: Math.floor(data.timeSpent),
      })
    );

    setLoading(true);
    try {
      const response = await api.post(`/tests/submit/${testId}`, {
        responses: formattedResponses,
        startTime,
        endTime,
      });
      console.log({
        responses: formattedResponses,
        startTime,
        endTime,
      });
      dispatch(addTestResult(response.data));
      console.log(response.data);
      toast.success("Test submitted successfully!");
      navigate(`/test-summary/${response.data._id}`);
    } catch (error) {
      toast.error("Error submitting test");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading test...</div>;
  if (!test) return <div className="text-center py-12">Test not found</div>;
  

  return (
    <div className="container py-12">
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Test: {test.name}
          </h1>
          <p className="text-lg font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </Card>
      <div className="flex flex-col md:flex-row gap-6">
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
          <div className="flex justify-between mt-4">
            <Button
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0 || loading}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(test.questions.length - 1, prev + 1)
                )
              }
              disabled={
                currentQuestion === test.questions.length - 1 || loading
              }
              variant="secondary"
            >
              Next
            </Button>
          </div>
          <Button
            onClick={() => window.confirm("Are you sure?") && handleSubmit()}
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Test"}
          </Button>
        </div>
        <Card className="w-full md:w-40">
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
        </Card>
      </div>
    </div>
  );
};

export default TestInterfacePage;
