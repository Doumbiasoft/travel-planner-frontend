import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a minimal loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to={`/dashboard`} />;
  }

  return <>{children}</>;
};

export default PublicRoute;
