// src/pages/AddQuestionPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import TestQuestion from "../components/TestQuestion";
import ImageUploader from "../components/ImageUploader";
import { questionHierarchy } from "../data/questionHierarchy";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function AddQuestionPage() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    exam: "jee-main",
    class: "11",
    subject: "",
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
    newOptions[index][field] = field === "isCorrect" ? value === "true" : value;
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
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleExplanationChange = (e) => {
    setFormData((prev) => ({ ...prev, explanation: e.target.value }));
  };

  const handleImageUploaded = (url, target) => {
    if (target === "content") {
      setFormData((prev) => ({
        ...prev,
        content: `${prev.content}\n![Image](${url})`.trim(),
      }));
    } else if (target.startsWith("option-")) {
      const index = parseInt(target.split("-")[1], 10);
      const newOptions = [...formData.options];
      newOptions[index].content =
        `${newOptions[index].content}\n![Image](${url})`.trim();
      setFormData((prev) => ({ ...prev, options: newOptions }));
    } else if (target === "explanation") {
      setFormData((prev) => ({
        ...prev,
        explanation: `${prev.explanation}\n![Image](${url})`.trim(),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("exam", formData.exam);
    data.append("class", formData.class);
    data.append("subject", formData.subject);
    data.append("topic", formData.topic);
    data.append("chapter", formData.chapter);
    data.append("type", formData.type);
    data.append("content", formData.content);
    data.append(
      "options",
      formData.type === "MCQ" ? JSON.stringify(formData.options) : "[]"
    );
    data.append("correctAnswer", formData.correctAnswer);
    data.append("explanation", formData.explanation || "");

    try {
      await api.post("/api/questions/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Question added successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const previewQuestion = {
    _id: "preview",
    content: [{ type: "text", value: formData.content }],
    type: formData.type,
    options: formData.options.map((opt) => ({ id: opt.id, text: opt.content })),
    correctAnswer: formData.correctAnswer,
    explanation: formData.explanation,
  };

  return (
    <div className="container flex min-h-screen  font-sans">
  
      <div className="flex-1 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Add a New Question
            </h1>
            <p className="text-sm text-gray-600">
              Create a JEE question with text, images, or equations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam and Class */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam
                </label>
                <select
                  name="exam"
                  value={formData.exam}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                >
                  <option value="jee-main">JEE Main</option>
                  <option value="jee-advanced">JEE Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                >
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            </div>

            {/* Subject, Topic, Chapter */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={loading}
                >
                  <option value="">Select Subject</option>
                  {Object.keys(questionHierarchy).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {formData.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    disabled={loading}
                  >
                    <option value="">Select Topic</option>
                    {Object.keys(questionHierarchy[formData.subject]).map(
                      (top) => (
                        <option key={top} value={top}>
                          {top
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
              {formData.topic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter
                  </label>
                  <select
                    name="chapter"
                    value={formData.chapter}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    disabled={loading}
                  >
                    <option value="">Select Chapter</option>
                    {questionHierarchy[formData.subject][formData.topic].map(
                      (chap) => (
                        <option key={chap} value={chap}>
                          {chap
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                disabled={loading}
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="Numerical">Numerical</option>
                <option value="True/False">True/False</option>
              </select>
            </div>

            {/* Question Content */}
            <div className="border border-gray-200 rounded-md p-4 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Content (Markdown supported)
              </label>
              <textarea
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Enter question text, images (e.g., ![Image](url)), or LaTeX (e.g., $$x^2$$)"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows="5"
                disabled={loading}
              />
              <ImageUploader />
            </div>

            {/* Options (for MCQ only) */}
            {formData.type === "MCQ" && (
              <div className="border border-gray-200 rounded-md p-4 bg-white">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Options
                </h2>
                {formData.options.map((opt, index) => (
                  <div
                    key={opt.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <input
                      type="text"
                      value={opt.content}
                      onChange={(e) =>
                        handleOptionChange(index, "content", e.target.value)
                      }
                      placeholder={`Option ${opt.id}`}
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                      disabled={loading}
                    />
                    <select
                      value={opt.isCorrect}
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
                      className="text-red-500 hover:text-red-700"
                      disabled={loading || formData.options.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Option
                </button>
              </div>
            )}

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer
              </label>
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                placeholder={
                  formData.type === "MCQ"
                    ? "Enter option ID (e.g., A)"
                    : "Enter numerical value or True/False"
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                disabled={loading}
              />
            </div>

            {/* Explanation */}
            <div className="border border-gray-200 rounded-md p-4 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explanation (Optional, Markdown supported)
              </label>
              <textarea
                value={formData.explanation}
                onChange={handleExplanationChange}
                placeholder="Enter explanation, images (e.g., ![Image](url)), or LaTeX (e.g., $$x^2$$)"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows="5"
                disabled={loading}
              />
            </div>

            {/* Submit and Preview Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Add Question"}
              </button>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
              >
                {preview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
          </form>

          {preview && (
            <div className="border border-gray-200 rounded-md p-6 bg-white mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Question Preview
              </h2>
              <TestQuestion
                question={previewQuestion}
                index={0}
                answer=""
                onAnswer={() => {}}
                onMarkForReview={() => {}}
                isMarked={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddQuestionPage;
