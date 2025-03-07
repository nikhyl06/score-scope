import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Button from "../components/Button";
import topics from "../utils/topics";

const AdminCreateTestPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    exam: "jee-mains",
    class: "11",
    subject: "",
    topic: "",
    chapter: "",
    questionIds: [],
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
          class: formData.class,
          subject: formData.subject,
          topic: formData.topic,
          chapter: formData.chapter || undefined, // Only include chapter if selected
        },
      });
      setQuestions(response.data);
    } catch (error) {
      toast.error("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId) => {
    setFormData((prev) => {
      const questionIds = prev.questionIds.includes(questionId)
        ? prev.questionIds.filter((id) => id !== questionId)
        : [...prev.questionIds, questionId];
      return { ...prev, questionIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/tests/create", formData);
      toast.success("Test created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data.message || "Error creating test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Test</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Test Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Exam</label>
              <select
                name="exam"
                value={formData.exam}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                <option value="jee-mains">JEE Mains</option>
                <option value="jee-advanced">JEE Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={loading}
              >
                <option value="">Select Subject</option>
                {Object.keys(topics).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {formData.subject && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Topic
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="">Select Topic</option>
                  {Object.keys(topics[formData.subject]).map((topic) => (
                    <option key={topic} value={topic}>
                      {topic.charAt(0).toUpperCase() +
                        topic.slice(1).replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {formData.topic && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Chapter
                </label>
                <select
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="">Select Chapter</option>
                  {topics[formData.subject][formData.topic].map((chapter) => (
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
            disabled={loading || !formData.subject}
            className="w-full mt-4"
            variant="secondary"
          >
            {loading ? "Fetching..." : "Fetch Questions"}
          </Button>
          {questions.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mt-4">Select Questions</h2>
              <div className="max-h-64 overflow-y-auto">
                {questions.map((q) => (
                  <div
                    key={q._id}
                    className="flex items-center space-x-2 p-2 border-b"
                  >
                    <input
                      type="checkbox"
                      checked={formData.questionIds.includes(q._id)}
                      onChange={() => toggleQuestion(q._id)}
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-600">
                      {q.content.substring(0, 50)}...
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          <Button
            type="submit"
            disabled={loading || formData.questionIds.length === 0}
            className="w-full mt-4"
          >
            {loading ? "Creating..." : "Create Test"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminCreateTestPage;
