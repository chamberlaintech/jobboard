import React from "react";

const LoadingSpinner = ({
  size = "lg",
  fullScreen = false,
  message = "",
  className = "",
}) => {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <span
        className={`loading loading-spinner text-primary ${sizeClasses[size]}`}
      ></span>
      {message && (
        <p className="text-base-content/70 text-sm sm:text-base">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
