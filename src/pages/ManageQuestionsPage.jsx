import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { questionHierarchy } from "../data/questionHierarchy";

function ManageQuestionsPage() {
  const { token, user } = useSelector((state) => state.user);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({
    exams: {},
    topics: {},
    chapters: {},
  });
  const [filters, setFilters] = useState({
    exam: "",
    class: "",
    subject: "",
    topic: "",
    chapter: "",
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/api/questions/filter",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        }
      );
      setQuestions(response.data);
    } catch (error) {
      toast.error("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  if (user?.role !== "admin")
    return (
      <div className="text-center pt-20 text-red-500">
        Access Denied: Admin Only
      </div>
    );

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

  const toggleExpand = (level, key) => {
    setExpanded((prev) => ({
      ...prev,
      [level]: { ...prev[level], [key]: !prev[level][key] },
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <div className="pt-12 pb-20 px-6 flex-1">
          <div className="border border-gray-200 rounded-md p-6 mb-6 bg-white">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Manage Questions
            </h1>
            <p className="text-sm text-gray-600">View and edit all questions</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded-md p-6 mb-6 bg-white flex flex-col gap-4"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by question ID or content..."
              className="p-2 border border-gray-300 rounded-md text-sm"
            />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={filters.exam}
                onChange={(e) =>
                  setFilters({ ...filters, exam: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Exams</option>
                <option value="jee-mains">JEE Mains</option>
                <option value="jee-advanced">JEE Advanced</option>
              </select>
              <select
                value={filters.class}
                onChange={(e) =>
                  setFilters({ ...filters, class: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Classes</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
              <select
                value={filters.subject}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    subject: e.target.value,
                    topic: "",
                    chapter: "",
                  })
                }
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Subjects</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="mathematics">Mathematics</option>
              </select>
              <select
                value={filters.topic}
                onChange={(e) =>
                  setFilters({ ...filters, topic: e.target.value, chapter: "" })
                }
                className="p-2 border border-gray-300 rounded-md text-sm"
                disabled={!filters.subject}
              >
                <option value="">All Topics</option>
                {filters.subject &&
                  Object.keys(questionHierarchy[filters.subject]).map(
                    (topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    )
                  )}
              </select>
              <select
                value={filters.chapter}
                onChange={(e) =>
                  setFilters({ ...filters, chapter: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md text-sm"
                disabled={!filters.topic}
              >
                <option value="">All Chapters</option>
                {filters.topic &&
                  questionHierarchy[filters.subject][filters.topic].map(
                    (chapter) => (
                      <option key={chapter} value={chapter}>
                        {chapter}
                      </option>
                    )
                  )}
              </select>
            </div>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Fetch Questions
            </button>
          </form>
          {loading ? (
            <div className="text-center text-gray-600">
              Loading questions...
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md p-6 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Question Hierarchy ({filteredQuestions.length})
              </h2>
              {Object.entries(hierarchy).map(([exam, topics]) => (
                <div key={exam} className="mb-4">
                  <button
                    onClick={() => toggleExpand("exams", exam)}
                    className="w-full text-left text-md font-medium text-gray-800 p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    {exam} ({Object.keys(topics).length} topics)
                  </button>
                  {expanded.exams[exam] && (
                    <div className="ml-4 mt-2">
                      {Object.entries(topics).map(([topic, chapters]) => (
                        <div key={topic} className="mb-2">
                          <button
                            onClick={() =>
                              toggleExpand("topics", `${exam}-${topic}`)
                            }
                            className="w-full text-left text-sm font-medium text-gray-700 p-2 bg-gray-50 rounded-md hover:bg-gray-100"
                          >
                            {topic} ({Object.keys(chapters).length} chapters)
                          </button>
                          {expanded.topics[`${exam}-${topic}`] && (
                            <div className="ml-4 mt-2">
                              {Object.entries(chapters).map(([chapter, qs]) => (
                                <div key={chapter} className="mb-2">
                                  <button
                                    onClick={() =>
                                      toggleExpand(
                                        "chapters",
                                        `${exam}-${topic}-${chapter}`
                                      )
                                    }
                                    className="w-full text-left text-sm text-gray-600 p-2 hover:bg-gray-50"
                                  >
                                    {chapter} ({qs.length} questions)
                                  </button>
                                  {expanded.chapters[
                                    `${exam}-${topic}-${chapter}`
                                  ] && (
                                    <ul className="ml-4 mt-2 space-y-1">
                                      {qs.map((q) => (
                                        <li
                                          key={q.questionId}
                                          className="flex justify-between items-center p-2 border border-gray-200 rounded-md"
                                        >
                                          <span className="text-sm text-gray-600">
                                            <ReactMarkdown
                                              remarkPlugins={[
                                                remarkGfm,
                                                remarkMath,
                                              ]}
                                              rehypePlugins={[rehypeKatex]}
                                            >
                                              {q.content.substring(0, 50) +
                                                "..."}
                                            </ReactMarkdown>
                                            <span className="ml-2">
                                              ({q.type}, Class {q.class},{" "}
                                              {q.subject})
                                            </span>
                                          </span>
                                          <Link
                                            to={`/edit-question/${q.questionId}`}
                                            className="text-sm text-blue-500 hover:underline"
                                          >
                                            Edit
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ManageQuestionsPage;
