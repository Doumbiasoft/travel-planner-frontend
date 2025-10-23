
import React, { useState } from "react";
import { Button, Space, Card } from "antd";
import { AlertTriangle } from "lucide-react";

const TestErrorBoundary: React.FC = () => {
  const [shouldThrowRenderError, setShouldThrowRenderError] = useState(false);

  // Simulate render error
  if (shouldThrowRenderError) {
    throw new Error("Test Render Error: This is a simulated error for testing error boundaries!");
  }

  // Simulate async error 
  const handleAsyncError = () => {
    setTimeout(() => {
      throw new Error("Test Async Error: This won't be caught by error boundary!");
    }, 100);
  };

  // Simulate event handler error
  const handleEventError = () => {
    throw new Error("Test Event Handler Error: This won't be caught by error boundary!");
  };

  return (
    <Card
      className="border-2 border-red-500 bg-red-50"
      title={
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">Error Boundary Test Panel</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Click the buttons below to test different error scenarios:
        </p>

        <Space direction="vertical" className="w-full">
          <Button
            danger
            block
            onClick={() => setShouldThrowRenderError(true)}
          >
            ✅ Trigger Render Error (Caught by Error Boundary)
          </Button>

          <Button
            danger
            block
            onClick={handleEventError}
            type="dashed"
          >
            ❌ Trigger Event Handler Error (NOT caught - will crash)
          </Button>

          <Button
            danger
            block
            onClick={handleAsyncError}
            type="dashed"
          >
            ❌ Trigger Async Error (NOT caught - check console)
          </Button>
        </Space>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Note:</strong> Remove this component before deploying to production!
        </div>
      </div>
    </Card>
  );
};

export default TestErrorBoundary;
