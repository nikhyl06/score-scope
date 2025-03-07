import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Button from "../components/Button";
import topics from "../utils/topics";

const AdminManageQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    class: "",
    subject: "",
    topic: "",
    chapter: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "subject" ? { topic: "", chapter: "" } : {}), // Reset topic and chapter when subject changes
      ...(name === "topic" ? { chapter: "" } : {}), // Reset chapter when topic changes
    }));
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/questions/filter", {
        params: {
          class: filters.class,
          subject: filters.subject,
          topic: filters.topic,
          chapter: filters.chapter || undefined, // Only include chapter if selected
        },
      });
      setQuestions(response.data);
    } catch (error) {
      toast.error("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Questions
      </h1>
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Class</label>
            <select
              name="class"
              value={filters.class}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Subject</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              {Object.keys(topics).map((subject) => (
                <option key={subject} value={subject}>
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {filters.subject && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Topic</label>
              <select
                name="topic"
                value={filters.topic}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All</option>
                {Object.keys(topics[filters.subject]).map((topic) => (
                  <option key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() +
                      topic.slice(1).replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          )}
          {filters.topic && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Chapter
              </label>
              <select
                name="chapter"
                value={filters.chapter}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All</option>
                {topics[filters.subject][filters.topic].map((chapter) => (
                  <option key={chapter} value={chapter}>
                    {chapter.charAt(0).toUpperCase() +
                      chapter.slice(1).replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <Button
          onClick={fetchQuestions}
          disabled={loading}
          className="w-full mt-4"
          variant="secondary"
        >
          {loading ? "Fetching..." : "Fetch Questions"}
        </Button>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Questions ({questions.length})
        </h2>
        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.questionId}
                className="flex justify-between items-center p-2 border-b"
              >
                <span className="text-sm text-gray-600">
                  {q.content.substring(0, 50)}...
                </span>
                <Link
                  to={`/edit-question/${q.questionId}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminManageQuestionsPage;
