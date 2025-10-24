import React from "react";
import { Button } from "antd";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ENV } from "../config/env";
import error_broken from "../assets/images/error-broken.png";

interface RouteErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const navigate = useNavigate();

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

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Something went wrong with this page
        </h2>

        <p className="text-gray-600 mb-6">
          We're sorry for the inconvenience. This error has been logged and
          we'll fix it soon.
        </p>

        {/* Show error details in development mode only */}
        {ENV.VITE_MODE === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800 overflow-auto max-h-40">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            type="default"
            size="large"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
            style={{
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Go Back
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={resetErrorBoundary}
            className="w-full sm:w-auto"
            style={{
              backgroundColor: "#FFE566",
              borderColor: "#FFE566",
              color: "#2B2B2B",
              fontWeight: 600,
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorFallback;
