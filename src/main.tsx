import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, App as AntApp } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import "./styles/style.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import themeAntd from "./styles/theme-Antd.tsx";
import { AlertNotificationProvider } from "./hooks/AlertNotification.tsx";
import { ENV } from "./config/env.tsx";
import { CookiesProvider } from "react-cookie";
import ErrorFallback from "./components/ErrorFallback.tsx";
import { logError } from "./utils/errorLogging.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        logError({
          error,
          errorInfo,
          context: "App Root",
        });
      }}
      onReset={() => {
        // Reset app state when user clicks "Try Again"
        window.location.href = "/";
      }}
    >
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <QueryClientProvider client={queryClient}>
          <AlertNotificationProvider>
            <AuthProvider>
              <GoogleOAuthProvider clientId={ENV.VITE_GOOGLE_CLIENT_ID}>
                <ConfigProvider theme={themeAntd}>
                  <AntApp>
                    <App />
                  </AntApp>
                </ConfigProvider>
              </GoogleOAuthProvider>
            </AuthProvider>
          </AlertNotificationProvider>
        </QueryClientProvider>
      </CookiesProvider>
    </ErrorBoundary>
  </StrictMode>
);
