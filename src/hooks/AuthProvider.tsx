import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useCookies } from "react-cookie";
import unitOfWork from "../api/unit-of-work";
import { internalAxiosInstance } from "../api/api-base-config";
import { HttpStatus } from "../helpers/http-status-codes";
import type { User } from "../types";
import { ENV } from "../config/env";
import { useGoogleOauth } from "../hooks/useGoogleOauth";

interface AuthContextType {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_COOKIE_NAME = "accessToken";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_COOKIE_NAME]);
  const [token, setToken] = useState<string | null>(
    cookies.accessToken || null
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const { googleLogout } = useGoogleOauth();
  const login = useCallback(
    async (newToken: string) => {
      try {
        setError(null);
        // Save token to cookie with 7 days expiration
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        setCookie(TOKEN_COOKIE_NAME, newToken, {
          expires,
          secure: ENV.VITE_MODE === "production",
          sameSite: "lax",
        });
        setToken(newToken);
      } catch (err) {
        setError("Login failed");
        setToken(null);
        setUser(null);
        throw err;
      }
    },
    [setCookie]
  );

  const logout = useCallback(async () => {
    try {
      await unitOfWork.auth.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Remove token from cookie
      removeCookie(TOKEN_COOKIE_NAME);
      setToken(null);
      setUser(null);
      setError(null);
      //googleLogout();
    }
  }, [removeCookie]);

  // Set up auth interceptor to add token to requests
  useLayoutEffect(() => {
    const authInterceptor = internalAxiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    return () => {
      internalAxiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // Set up refresh interceptor to handle token refresh
  useLayoutEffect(() => {
    const refreshInterceptor = internalAxiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't already retried
        if (
          error.response?.status === HttpStatus.UNAUTHORIZED &&
          error.response?.data?.message === "Invalid token" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await unitOfWork.auth.refreshToken();
            const newToken = response.data.accessToken;

            // Save new token to cookie
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            setCookie(TOKEN_COOKIE_NAME, newToken, {
              expires,
              secure: ENV.VITE_MODE === "production",
              sameSite: "lax",
            });

            setToken(newToken);

            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry the original request with new token
            return internalAxiosInstance(originalRequest);
          } catch (refreshError) {
            setToken(null);
            setUser(null);
            logout();
            setError("Session expired. Please login again.");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      internalAxiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, [logout, setCookie]);

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await unitOfWork.auth.getMe();
        setUser(response.data.user);
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user data");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const value = useMemo(
    () => ({
      login,
      logout,
      user,
      isLoading,
      isAuthenticated: !!token,
      error,
    }),
    [login, logout, user, isLoading, token, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook must be used within an AuthProvider");
  }
  return context;
};
