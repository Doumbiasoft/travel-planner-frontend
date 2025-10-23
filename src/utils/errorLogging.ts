import { ENV } from "../config/env";

interface ErrorLogData {
  error: Error;
  errorInfo?: React.ErrorInfo;
  context?: string;
  userId?: string;
}

/**
 * I can use monitoring service (e.g., Sentry, LogRocket, Datadog) to lod errors
 */
export const logError = ({
  error,
  errorInfo,
  context = "Unknown",
  userId,
}: ErrorLogData): void => {
  if (ENV.VITE_MODE === "development") {
    console.group(`🚨 Error in ${context}`);
    console.error("Error:", error);
    if (errorInfo) {
      console.error("Error Info:", errorInfo);
    }
    if (userId) {
      console.error("User ID:", userId);
    }
    console.error("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }

  if (ENV.VITE_MODE === "production") {
    // I can sent it to logger service
    console.error("Production Error:", {
      message: error.message,
      stack: error.stack,
      context,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  // I can send it to my own logger implementation
  try {
  } catch (loggingError) {
    console.error("Failed to log error:", loggingError);
  }
};

export const handleAsyncError = (
  error: Error,
  context: string = "Async Operation"
): void => {
  logError({ error, context });
};
