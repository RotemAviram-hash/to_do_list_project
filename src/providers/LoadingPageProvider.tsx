import { createContext, useState, useCallback, type ReactNode } from "react";
import { CircularProgress, Box, Alert, Typography } from "@mui/material";

// 1. הגדרת הממשק של ה-Context (מה הפרובאיידר חושף החוצה)
interface AsyncStatusContextType {
  showLoading: () => void;
  hideLoading: () => void;
  showError: (message: string) => void;
  clearError: () => void;
}

export const LoadingPageContext = createContext<AsyncStatusContextType | null>(
  null,
);

// 2. קומפוננטת הפרובאיידר עצמה
export function LoadingPageProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // פונקציות לשליטה על הסטייט מבחוץ
  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);
  const showError = useCallback(
    (message: string) => setErrorMessage(message),
    [],
  );
  const clearError = useCallback(() => setErrorMessage(null), []);

  return (
    <LoadingPageContext.Provider
      value={{ showLoading, hideLoading, showError, clearError }}
    >
      {/* תנאי 1: אם יש מסך טעינה - מציגים את עיגול ההמתנה של MUI ומקפיאים את המסך */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh", // ממקם את העיגול במרכז הגובה של המסך
            gap: 2,
          }}
        >
          <CircularProgress size={50} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            טוען נתונים, אנא המתן..
          </Typography>
        </Box>
      ) : errorMessage ? (
        /* תנאי 2: אם יש שגיאה - מציגים את ה-Alert של MUI עם ההודעה שצורפה מראש */
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 5 }}>
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Box>
      ) : (
        /* תנאי 3: אם הכל תקין ואין טעינה או שגיאה - מציגים את הילדים (האפליקציה/הלוח) כרגיל */
        children
      )}
    </LoadingPageContext.Provider>
  );
}
