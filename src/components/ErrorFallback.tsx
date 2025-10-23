import React from "react";
import { Button } from "antd";
import { Home, RefreshCw, AlertCircle } from "lucide-react";
import error_broken from "../assets/images/error-broken.png";
import { ENV } from "../config/env";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <img
            src={error_broken}
            alt="Something went wrong"
            className="w-80 h-80 md:w-96 md:h-96 object-contain animate-pulse"
          />
        </div>

        <div className="mb-4 flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Oops! Something Went Wrong
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
          We encountered an unexpected error
        </h2>

        <p className="text-gray-600 text-lg mb-4 max-w-md mx-auto">
          Don't worry, our team has been notified and we're working on fixing
          this issue. Please try again.
        </p>

        {/* Show error details in development mode only */}
        {ENV.VITE_MODE === "development" && (
          <details className="mb-8 text-left max-w-2xl mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs text-red-800 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="default"
            size="large"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={resetErrorBoundary}
            className="w-full sm:w-auto"
            style={{
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Try Again
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<Home className="w-4 h-4" />}
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto"
            style={{
              backgroundColor: "#FFE566",
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
