import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a minimal loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={`/signin`} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
