import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TestQuestion from "../components/TestQuestion";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function AddQuestionPage() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    category: "physics",
    subcategory: "",
    difficulty: "Medium",
    type: "MCQ",
    contentBlocks: [{ type: "text", value: "" }],
    options: [{ id: "A", text: "", isCorrect: false }],
    correctAnswer: "",
    explanationBlocks: [{ type: "text", value: "" }],
  });
  const [imageFiles, setImageFiles] = useState([]);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (index, field, value) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[index][field] = value;
    setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }));
  };

  const addContentBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { type, value: type === "image" ? "" : "" },
      ],
    }));
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
      options: [...prev.options, { id: newId, text: "", isCorrect: false }],
    }));
  };

  const handleExplanationChange = (index, value) => {
    const newBlocks = [...formData.explanationBlocks];
    newBlocks[index].value = value;
    setFormData((prev) => ({ ...prev, explanationBlocks: newBlocks }));
  };

  const addExplanationBlock = (type) => {
    setFormData((prev) => ({
      ...prev,
      explanationBlocks: [...prev.explanationBlocks, { type, value: "" }],
    }));
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImageFiles(files);
    const newContentBlocks = [...formData.contentBlocks];
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = () => {
        const existingImageIndex = newContentBlocks.findIndex(
          (b, i) => b.type === "image" && i >= index + idx
        );
        if (existingImageIndex !== -1) {
          newContentBlocks[existingImageIndex] = {
            type: "image",
            url: reader.result,
            description: "",
          };
        }
        setFormData((prev) => ({ ...prev, contentBlocks: newContentBlocks }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("category", formData.category);
    data.append("subcategory", formData.subcategory);
    data.append("difficulty", formData.difficulty);
    data.append("type", formData.type);
    data.append("content", JSON.stringify(formData.contentBlocks));
    data.append("options", JSON.stringify(formData.options));
    data.append("correctAnswer", formData.correctAnswer);
    data.append("explanation", JSON.stringify(formData.explanationBlocks));
    imageFiles.forEach((file) => data.append("images", file));

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
    content: formData.contentBlocks.map((block) => ({
      type: block.type,
      value: block.value,
      url: block.url || (block.type === "image" ? "" : undefined),
      data: block.data,
    })),
    type: formData.type,
    options: formData.options,
    correctAnswer: formData.correctAnswer,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Add a New Question
            </h1>
            <p className="text-sm text-gray-600">
              Create a question with text, images, equations, or tables
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded-md p-6 bg-white mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="maths">Maths</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                Question Content
              </h2>
              {formData.contentBlocks.map((block, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 mb-2"
                >
                  <select
                    value={block.type}
                    onChange={(e) =>
                      handleContentChange(index, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
                    disabled={loading}
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="equation">Equation (LaTeX)</option>
                    <option value="table">Table</option>
                  </select>
                  {block.type === "text" || block.type === "equation" ? (
                    <textarea
                      value={block.value}
                      onChange={(e) =>
                        handleContentChange(index, "value", e.target.value)
                      }
                      placeholder={
                        block.type === "text"
                          ? "Enter text..."
                          : "Enter LaTeX..."
                      }
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows="3"
                      disabled={loading}
                    />
                  ) : block.type === "image" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-600"
                      disabled={loading}
                    />
                  ) : (
                    <textarea
                      value={block.data ? JSON.stringify(block.data) : ""}
                      onChange={(e) =>
                        handleContentChange(
                          index,
                          "data",
                          JSON.parse(e.target.value)
                        )
                      }
                      placeholder='Enter table as JSON, e.g., [["A", "B"], ["1", "2"]]'
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows="3"
                      disabled={loading}
                    />
                  )}
                </div>
              ))}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => addContentBlock("text")}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Text
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("image")}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("equation")}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Equation
                </button>
                <button
                  type="button"
                  onClick={() => addContentBlock("table")}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Table
                </button>
              </div>
            </div>
            {formData.type === "MCQ" && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Options
                </h2>
                {formData.options.map((option, index) => (
                  <div
                    key={option.id}
                    className="border border-gray-200 rounded-md p-4 mb-2 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      placeholder={`Option ${option.id}`}
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
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
                Correct Answer
              </label>
              <input
                type="text"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                placeholder={
                  formData.type === "MCQ" ? "e.g., B" : "e.g., 17.32"
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Explanation
              </h2>
              {formData.explanationBlocks.map((block, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 mb-2"
                >
                  <select
                    value={block.type}
                    onChange={(e) =>
                      handleContentChange(index, "type", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
                    disabled={loading}
                  >
                    <option value="text">Text</option>
                    <option value="equation">Equation (LaTeX)</option>
                  </select>
                  <textarea
                    value={block.value}
                    onChange={(e) =>
                      handleExplanationChange(index, e.target.value)
                    }
                    placeholder={
                      block.type === "text"
                        ? "Enter explanation..."
                        : "Enter LaTeX..."
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows="3"
                    disabled={loading}
                  />
                </div>
              ))}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => addExplanationBlock("text")}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Text
                </button>
                <button
                  type="button"
                  onClick={() => addExplanationBlock("equation")}
                  className="border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                  disabled={loading}
                >
                  Add Equation
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="w-full border border-gray-300 text-gray-600 text-sm p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
              >
                {preview ? "Hide Preview" : "Preview Question"}
              </button>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white text-sm p-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Question"}
              </button>
            </div>
          </form>
          {preview && (
            <div className="border border-gray-200 rounded-md p-6 bg-white">
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
        <Footer />
      </div>
    </div>
  );
}

export default AddQuestionPage;
