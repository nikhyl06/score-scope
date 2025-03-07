import React from "react";

const Button = ({
  children,
  variant = "primary",
  onClick,
  disabled,
  className,
}) => {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "border border-gray-300 text-gray-600 hover:bg-gray-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
