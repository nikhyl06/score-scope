import React from "react";

const ProgressCircle = ({ percentage, size = 100, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        stroke="#3c68ca"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-gray-800 font-semibold"
        transform="rotate(90, 50, 50)"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default ProgressCircle;
