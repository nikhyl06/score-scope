import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const TestQuestion = ({
  question,
  index,
  answer,
  onAnswer,
  onMarkForReview,
  isMarked,
}) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="text-sm text-gray-600 mb-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({ node, ...props }) => (
            <img {...props} style={{ maxWidth: "100%" }} />
          ),
          table: ({ node, ...props }) => (
            <table
              className="border-collapse w-full border border-gray-200"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-200 p-2 bg-gray-50" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-200 p-2" {...props} />
          ),
        }}
      >
        {`Q${index + 1}: ${question.content}`}
      </ReactMarkdown>
    </div>
    {question.type === "MCQ" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(question._id, option.id)}
            className={`p-2 rounded-md text-sm border ${
              answer === option.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {`${option.id}. ${option.content}`}
            </ReactMarkdown>
          </button>
        ))}
      </div>
    ) : (
      <input
        type="text"
        value={answer || ""}
        onChange={(e) => onAnswer(question._id, e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md text-sm"
      />
    )}
    <button
      onClick={() => onMarkForReview(question._id)}
      className={`mt-2 text-sm p-2 rounded-md ${
        isMarked
          ? "bg-yellow-500 text-white"
          : "border border-gray-300 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {isMarked ? "Unmark" : "Mark for Review"}
    </button>
  </div>
);

export default TestQuestion;
