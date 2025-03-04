import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function CreateTestPage() {
  const { token, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
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
  const [search, setSearch] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/api/questions/filter",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            exam: formData.exam,
            class: formData.class,
            subject: formData.subject,
            topic: formData.topic,
            chapter: formData.chapter,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      toast.error("Error fetching questions");
      console.error("Fetch questions error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="text-center pt-20 text-red-500">
        Access Denied: Admin Only
      </div>
    );
  }

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionId.toLowerCase().includes(search.toLowerCase()) ||
      q.content.toLowerCase().includes(search.toLowerCase())
  );

  const hierarchy = filteredQuestions.reduce((acc, q) => {
    const exam = q.exam;
    acc[exam] = acc[exam] || {};
    acc[exam][q.topic] = acc[exam][q.topic] || {};
    acc[exam][q.topic][q.chapter] = acc[exam][q.topic][q.chapter] || [];
    acc[exam][q.topic][q.chapter].push(q);
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject") {
      setFormData((prev) => ({
        ...prev,
        subject: value,
        topic: "",
        chapter: "",
      }));
    } else if (name === "topic") {
      setFormData((prev) => ({ ...prev, topic: value, chapter: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleQuestion = (id) => {
    // Use _id instead of questionId
    setFormData((prev) => ({
      ...prev,
      questionIds: prev.questionIds.includes(id)
        ? prev.questionIds.filter((existingId) => existingId !== id)
        : [...prev.questionIds, id],
    }));
  };

  const handleFetchQuestions = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.questionIds.length === 0) {
      toast.error("Test name and at least one question are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/tests/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Test created successfully!");
      navigate("/manage-tests");
    } catch (error) {
      toast.error(error.response?.data.message || "Error creating test");
      console.error("Create test error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Create a Test Paper
            </h1>
            <p className="text-sm text-gray-600">
              Select questions to create a custom test
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded-md p-6 bg-white mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Test Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${
                    !formData.name && "border-red-300"
                  } rounded-md text-sm`}
                  required
                  disabled={loading}
                />
                {!formData.name && (
                  <p className="text-sm text-red-500 mt-1">
                    Test name is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Exam</label>
                <select
                  name="exam"
                  value={formData.exam}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                  disabled={loading}
                >
                  <option value="jee-mains">JEE Mains</option>
                  <option value="jee-advanced">JEE Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                >
                  <option value="">Any</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                >
                  <option value="">Any</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Chapter
                </label>
                <input
                  type="text"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleFetchQuestions}
              className="w-full bg-gray-500 text-white text-sm p-2 rounded-md hover:bg-gray-600 transition disabled:opacity-50 mb-4"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Fetch Questions"}
            </button>
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions by ID or content..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-4"
                disabled={loading}
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Select Questions ({formData.questionIds.length} selected)
              </h2>
              {loading ? (
                <div className="text-center text-gray-600">
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    />
                  </svg>
                  Loading questions...
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center text-gray-600">
                  No questions fetched yet. Apply filters and click "Fetch
                  Questions".
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                  {Object.entries(hierarchy).map(([exam, topics]) => (
                    <div key={exam} className="mb-4">
                      <h3 className="text-md font-medium text-gray-800 bg-gray-100 p-2 rounded-md">
                        {exam}
                      </h3>
                      {Object.entries(topics).map(([topic, chapters]) => (
                        <div key={topic} className="ml-4 mt-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            {topic}
                          </h4>
                          {Object.entries(chapters).map(([chapter, qs]) => (
                            <div key={chapter} className="ml-4 mt-2">
                              <h5 className="text-sm text-gray-600 font-semibold">
                                {chapter}
                              </h5>
                              {qs.map((q) => (
                                <div
                                  key={q._id} // Use _id instead of questionId
                                  className={`flex items-start p-2 border-b border-gray-200 ${
                                    formData.questionIds.includes(q._id)
                                      ? "bg-blue-100"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.questionIds.includes(
                                      q._id
                                    )}
                                    onChange={() => toggleQuestion(q._id)}
                                    className="mr-2 mt-1"
                                    disabled={loading}
                                  />
                                  <div className="text-sm text-gray-600 flex-1">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm, remarkMath]}
                                      rehypePlugins={[rehypeKatex]}
                                    >
                                      {q.content.substring(0, 100) + "..."}
                                    </ReactMarkdown>
                                    <span className="text-xs text-gray-500">
                                      ({q.type}, Class {q.class}, {q.subject})
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
              disabled={loading || formData.questionIds.length === 0}
            >
              {loading ? "Creating..." : "Create Test"}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CreateTestPage;
