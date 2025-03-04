import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { questionHierarchy } from "../data/questionHierarchy";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function EditQuestionPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    exam: "jee-mains",
    class: "11",
    subject: "physics",
    topic: "",
    chapter: "",
    type: "MCQ",
    content: "",
    options: [{ id: "A", content: "", isCorrect: false }],
    correctAnswer: "",
    explanation: "",
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        setLoading(true);
        try {
          const response = await api.get(
            `/api/questions/${questionId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = response.data;
          // Ensure options are in the correct format
          const formattedOptions =
            data.options.length > 0
              ? data.options.map((opt, idx) => ({
                  id: String.fromCharCode(65 + idx),
                  content: opt.content || "",
                  isCorrect: opt.isCorrect || false,
                }))
              : [{ id: "A", content: "", isCorrect: false }];
          setFormData({ ...data, options: formattedOptions });
        } catch (error) {
          toast.error("Error fetching question");
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [questionId, token]);

  if (user?.role !== "admin") {
    return (
      <div className="text-center pt-20 text-red-500">
        Access Denied: Admin Only
      </div>
    );
  }

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

  const handleContentChange = (e) => {
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === "content") newOptions[index].content = value;
    if (field === "isCorrect") newOptions[index].isCorrect = value === "true";
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    const newId = String.fromCharCode(65 + formData.options.length);
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { id: newId, content: "", isCorrect: false }],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length > 1) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, options: newOptions }));
    }
  };

  const handleExplanationChange = (e) => {
    setFormData((prev) => ({ ...prev, explanation: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content || !formData.correctAnswer) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const url = questionId
        ? `/api/questions/${questionId}`
        : "/api/questions/add";
      const method = questionId ? "put" : "post";
      await api[method](
        url,
        { ...formData, options: JSON.stringify(formData.options) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        questionId
          ? "Question updated successfully!"
          : "Question added successfully!"
      );
      navigate("/manage-questions");
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to save question");
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
              {questionId ? "Edit Question" : "Add a New Question"}
            </h1>
            <p className="text-sm text-gray-600">
              Manage question details with Markdown support
            </p>
          </div>
          {loading && (
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
              Loading...
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded-md p-6 bg-white mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                  required
                  disabled={loading}
                >
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
                  required
                  disabled={loading}
                >
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Topic
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                  disabled={!formData.subject || loading}
                >
                  <option value="">Select Topic</option>
                  {formData.subject &&
                    Object.keys(questionHierarchy[formData.subject]).map(
                      (topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      )
                    )}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Chapter
                </label>
                <select
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                  disabled={!formData.topic || loading}
                >
                  <option value="">Select Chapter</option>
                  {formData.topic &&
                    questionHierarchy[formData.subject][formData.topic].map(
                      (chapter) => (
                        <option key={chapter} value={chapter}>
                          {chapter}
                        </option>
                      )
                    )}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  required
                  disabled={loading}
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="Numerical">Numerical</option>
                  <option value="True/False">True/False</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Question Content (Markdown)
                <span className="text-red-500">*</span>
              </h2>
              <textarea
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Enter question in Markdown (e.g., # Question\nInline: $$E=mc^2$$\n| A | B |\n|---|---|\n| 1 | 2 |)"
                className={`w-full p-2 border ${
                  !formData.content && "border-red-300"
                } rounded-md text-sm font-mono resize-y`}
                rows="6"
                disabled={loading}
              />
              {!formData.content && (
                <p className="text-sm text-red-500 mt-1">
                  Question content is required
                </p>
              )}
            </div>
            {formData.type === "MCQ" && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Options (Markdown)
                </h2>
                {formData.options.map((option, index) => (
                  <div
                    key={option.id}
                    className="border border-gray-200 rounded-md p-4 mb-2 flex items-start gap-2"
                  >
                    <textarea
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(index, "content", e.target.value)
                      }
                      placeholder={`Option ${option.id} (e.g., $$\\frac{n^2 + 4}{n^2}$$\n| A | B |\n|---|---|)`}
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm font-mono resize-y"
                      rows="3"
                      disabled={loading}
                    />
                    <select
                      value={option.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(index, "isCorrect", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded-md text-sm"
                      disabled={loading}
                    >
                      <option value="false">Incorrect</option>
                      <option value="true">Correct</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={loading || formData.options.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Option
                </button>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                Correct Answer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                placeholder={
                  formData.type === "MCQ" ? "e.g., A" : "e.g., 17.32"
                }
                className={`w-full p-2 border ${
                  !formData.correctAnswer && "border-red-300"
                } rounded-md text-sm`}
                required
                disabled={loading}
              />
              {!formData.correctAnswer && (
                <p className="text-sm text-red-500 mt-1">
                  Correct answer is required
                </p>
              )}
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Explanation (Markdown)
              </h2>
              <textarea
                value={formData.explanation || ""}
                onChange={handleExplanationChange}
                placeholder="Enter explanation in Markdown (e.g., $$\\int_{0}^{\\infty} e^{-x^2} dx$$)"
                className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono resize-y"
                rows="6"
                disabled={loading}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="w-full border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
              >
                {preview ? "Hide Preview" : "Show Preview"}
              </button>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : questionId
                  ? "Update Question"
                  : "Add Question"}
              </button>
            </div>
          </form>
          {preview && (
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Preview
              </h2>
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img {...props} style={{ maxWidth: "100%" }} />
                    ),
                    table: ({ node, ...props }) => (
                      <table
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          border: "1px solid #ccc",
                        }}
                        {...props}
                      />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          backgroundColor: "#f5f5f5",
                        }}
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        style={{ border: "1px solid #ccc", padding: "8px" }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {formData.content}
                </ReactMarkdown>
              </div>
              {formData.type === "MCQ" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {formData.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 border rounded-md text-sm ${
                        opt.isCorrect ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {`${opt.id}. ${opt.content}`}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-4">
                <strong className="text-gray-700">Correct Answer:</strong>{" "}
                <span className="text-blue-600">{formData.correctAnswer}</span>
              </div>
              {formData.explanation && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <strong className="text-gray-700 block mb-2">
                    Explanation:
                  </strong>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {formData.explanation}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default EditQuestionPage;
