import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ROUTES from "../router/routes";
import { useUser } from "../features/User/hooks/useUser";
import { RegisterDialog } from "../features/User/dialogs/RegisterDialog";

function RegisterPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  // אם המשתמש כבר מחובר - מעבירים אותו לעמוד הבית
  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const handleClose = () => {
    setOpen(false);
    // ברגע שהדיאלוג נסגר בעמוד הייעודי, נחזיר את המשתמש לדף הבית
    navigate(ROUTES.HOME);
  };

  const handleSwitchToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <RegisterDialog
      open={open}
      onClose={handleClose}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
}

export default RegisterPage;
