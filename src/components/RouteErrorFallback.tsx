import React from "react";
import { Button, Card } from "antd";
import { RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ENV } from "../config/env";

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
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full shadow-lg">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 rounded-full p-6">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              type="default"
              size="large"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
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
      </Card>
    </div>
  );
};

export default RouteErrorFallback;
