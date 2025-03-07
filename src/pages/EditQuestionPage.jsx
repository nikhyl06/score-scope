import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Footer from "../components/Footer";
import topics from "../utils/topics";
import ImageUploader from "../components/ImageUploader";

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
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/questions/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;
          console.log(data)
          const formattedOptions =
            data.options.length > 0
              ? data.options.map((opt, idx) => ({
                  id: opt.id || String.fromCharCode(65 + idx),
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
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
        ? `/questions/${questionId}`
        : "/questions/add"; // Updated path
      const method = questionId ? "put" : "post";
      const formDataToSend = new FormData();
      formDataToSend.append("exam", formData.exam);
      formDataToSend.append("class", formData.class);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("topic", formData.topic);
      formDataToSend.append("chapter", formData.chapter);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("options", JSON.stringify(formData.options));
      formDataToSend.append("correctAnswer", formData.correctAnswer);
      formDataToSend.append("explanation", formData.explanation || "");
      if (imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formDataToSend.append(`image${index}`, file);
        });
      }

      console.log("Sending FormData:", Array.from(formDataToSend.entries()));

      await api[method](url, formDataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(
        questionId
          ? "Question updated successfully!"
          : "Question added successfully!"
      );
      navigate("/manage-questions");
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to save question");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col min-h-screen bg-gray-50">
      <div className="pt-12 pb-20 flex-1">
        <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {questionId ? "Edit Question" : "Add a New Question"}
          </h1>
          <p className="text-sm text-gray-600">
            Manage question details with Markdown and image support
          </p>
        </div>
        <ImageUploader />
        {loading && <div className="text-center text-gray-600">Loading...</div>}
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
              <label className="block text-sm text-gray-700 mb-1">Class</label>
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
                {Object.keys(topics).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Topic</label>
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
                  Object.keys(topics[formData.subject]).map((topic) => (
                    <option key={topic} value={topic}>
                      {topic.charAt(0).toUpperCase() +
                        topic.slice(1).replace(/-/g, " ")}
                    </option>
                  ))}
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
                  topics[formData.subject][formData.topic].map((chapter) => (
                    <option key={chapter} value={chapter}>
                      {chapter.charAt(0).toUpperCase() +
                        chapter.slice(1).replace(/-/g, " ")}
                    </option>
                  ))}
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
              Question Content (Markdown){" "}
              <span className="text-red-500">*</span>
            </h2>
            <textarea
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Enter question in Markdown (e.g., A particle moves... ![Image](url))"
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
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-2 text-sm text-gray-600"
              disabled={loading}
            />
            {imageFiles.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {imageFiles.map((file) => file.name).join(", ")}
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
                    placeholder={`Option ${option.id} (e.g., $$\\frac{n^2 + 4}{n^2}$)`}
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
              placeholder={formData.type === "MCQ" ? "e.g., A" : "e.g., 17.32"}
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
    </div>
  );
}

export default EditQuestionPage;
