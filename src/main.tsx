import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider, App as AntApp } from "antd";
import { LoadScript } from "@react-google-maps/api";
import "./styles/style.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import themeAntd from "./styles/theme-Antd.tsx";
import { AlertNotificationProvider } from "./hooks/AlertNotification.tsx";
import { ENV } from "./config/env.tsx";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <QueryClientProvider client={queryClient}>
        <AlertNotificationProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={ENV.VITE_GOOGLE_CLIENT_ID}>
              <LoadScript
                googleMapsApiKey={ENV.VITE_GOOGLE_MAP_API_KEY}
                loadingElement={<></>}
              >
                <ConfigProvider theme={themeAntd}>
                  <AntApp>
                    <App />
                  </AntApp>
                </ConfigProvider>
              </LoadScript>
            </GoogleOAuthProvider>
          </AuthProvider>
        </AlertNotificationProvider>
      </QueryClientProvider>
    </CookiesProvider>
  </StrictMode>
);
