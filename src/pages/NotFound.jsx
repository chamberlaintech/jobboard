import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 sm:px-6">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-base-content mb-4">
            Page Not Found
          </h2>
          <p className="text-base-content/70 text-lg mb-8">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
          <Link to="/dashboard" className="btn btn-outline btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
