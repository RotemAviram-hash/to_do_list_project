import { Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../router/routes";
import { useUser } from "../features/User/hooks/useUser";
import { LoginDialog } from "../features/User/dialogs/LoginDialog"; // ודאי שנתיב הייבוא מדויק לפי מיקום הקובץ אצלך

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Guard: אם המשתמש כבר מחובר, מעבירים אותו ישירות לדף הבית
  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <LoginDialog
      open={true}
      onClose={() => navigate(ROUTES.HOME)}
      onSwitchToRegister={() => navigate(ROUTES.REGISTER || "/register")}
    />
  );
}

export default LoginPage;
