import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
