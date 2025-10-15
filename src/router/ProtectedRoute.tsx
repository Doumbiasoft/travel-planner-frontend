import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={`/signin`} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
