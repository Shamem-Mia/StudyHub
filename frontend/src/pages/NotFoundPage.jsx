import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center transform transition-all hover:scale-[1.02] duration-300">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full animate-pulse">
            <AlertTriangle size={80} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all hover:shadow-xl"
          >
            <Home size={18} />
            Return to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
