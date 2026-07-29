import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../features/User/hooks/useUser"; // 👈 הנתיב להוק החיצוני שלך
import ROUTES from "./routes";

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = ROUTES.LOGIN }: ProtectedRouteProps) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // 1. ממתינים לסיום בדיקת ההתחברות הראשונית
  if (loading) {
    return null; // אם ה-UserProvider כבר מציג מסך טעינה גלובלי
  }

  // 2. אם המשתמש לא מחובר – נווט לעמוד ההתחברות ושמור את המיקום הנוכחי ב-state
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3. המשתמש מחובר – מעבר חופשי לעמוד
  return <Outlet />;
};

export default ProtectedRoute;
