import { useContext } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook must be used within an AuthProvider");
  }
  return context;
};
