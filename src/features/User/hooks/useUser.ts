import { useContext, useCallback } from "react";
import { UserContext, type UserContextType } from "../providers/UserProvider";
import { useSnack } from "../../../providers/SnackProvider";

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  const { showError, showSuccess } = useSnack();

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  // ⚡ עטיפת התנתקות המשתמש עם חיווי Snack אוטומטי
  const logoutWithSnack = useCallback(async () => {
    try {
      await context.logout();
      showSuccess("התנתקת בהצלחה!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "שגיאה בהתנתקות מהמערכת";
      showError(message);
    }
  }, [context, showSuccess, showError]);

  return {
    ...context,
    logout: logoutWithSnack,
  };
};
