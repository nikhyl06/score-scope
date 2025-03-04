import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function TestQuestion({
  question,
  index,
  answer,
  onAnswer,
  onMarkForReview,
  isMarked,
}) {
  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white">
      <div className="text-sm text-gray-600 mb-2">
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
          {`Q${index + 1}: ${question.content}`}
        </ReactMarkdown>
      </div>
      {question.type === "MCQ" ? (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(question._id, option.id)}
              className={`p-2 border rounded-md text-sm ${
                answer === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              disabled={answer !== undefined}
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
          disabled={answer !== undefined}
        />
      )}
      <button
        onClick={() => onMarkForReview(question._id)}
        className={`mt-2 text-sm ${
          isMarked
            ? "bg-yellow-500 text-white"
            : "border border-gray-300 text-gray-600"
        } p-2 rounded-md`}
        disabled={answer !== undefined}
      >
        {isMarked ? "Unmark" : "Mark for Review"}
      </button>
    </div>
  );
}

export default TestQuestion;
