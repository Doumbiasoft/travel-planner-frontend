import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";
import "./styles/style.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import themeAntd from "./styles/theme-Antd.tsx";
import { AlertNotificationProvider } from "./hooks/AlertNotification.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AlertNotificationProvider>
        <AuthProvider>
          <GoogleOAuthProvider clientId="<your_client_id>">
            <ConfigProvider theme={themeAntd}>
              <App />
            </ConfigProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </AlertNotificationProvider>
    </QueryClientProvider>
  </StrictMode>
);
