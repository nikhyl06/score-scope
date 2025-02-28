import React from "react";

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
      <p className="text-sm text-gray-600 mb-2">
        Q{index + 1}:{" "}
        {question.content.map((block, idx) => {
          switch (block.type) {
            case "text":
              return <span key={idx}>{block.value}</span>;
            case "image":
              return (
                <img
                  key={idx}
                  src={block.url}
                  alt={block.description}
                  className="max-w-full h-auto my-2"
                />
              );
            case "equation":
              return <span key={idx}>{`$$${block.value}$$`}</span>; // Requires MathJax/KaTeX
            case "table":
              return (
                <table
                  key={idx}
                  className="border-collapse border border-gray-200 my-2"
                >
                  <tbody>
                    {block.data.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="border border-gray-200 p-2 text-sm"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            default:
              return null;
          }
        })}
      </p>
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
            >
              {option.id}. {option.text}
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
        className={`mt-2 text-sm ${
          isMarked
            ? "bg-yellow-500 text-white"
            : "border border-gray-300 text-gray-600"
        } p-2 rounded-md`}
      >
        {isMarked ? "Unmark" : "Mark for Review"}
      </button>
    </div>
  );
}

export default TestQuestion;
