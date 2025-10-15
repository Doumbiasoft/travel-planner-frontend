import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={`/dashboard`} />;
  }
  return <>{children}</>;
};

export default PublicRoute;
