import { Navigate } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import ROUTES from "./routes";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
