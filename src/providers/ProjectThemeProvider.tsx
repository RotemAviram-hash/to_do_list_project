import { createContext, useCallback, useState, type ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface ThemeContextType {
  isDark: boolean;
  toggleMode: () => void;
}

const ProjectThemeContext = createContext<null | ThemeContextType>(null);

function ProjectThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // הגדרת ערכי ה-Theme המשודרגים על פי מצב הסטייט
  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      ...(isDark
        ? {
            // 🌙 פלטת כחול-לילה עמוק ומקצועי (Rich Deep Navy)
            background: {
              default: "#0A1128", // השכבה הכי תחתונה (MAIN) - כחול לילה עמוק מאוד
              paper: "#1C2541", // כרטיסי המשימות (השכבה הצפה) - כחול פלדה מעט בהיר יותר
            },
            // רקע העמודות (שכבת הביניים) - בדיוק באמצע בין ה-Default ל-Paper
            action: {
              hover: "#111A33",
            },
            text: {
              primary: "#E2E8F0", // טקסט לבן-כחלחל עדין (לא שורף את העין)
              secondary: "#94A3B8",
            },
            divider: "#3A506B", // קווים מפרידים בגוון כחול-אפרפר עמום שישתלב בטבעיות
          }
        : {
            // ☀️ המצב הבהיר נשאר נקי ורך כמו מקודם
            background: {
              default: "#F8F9FA",
              paper: "#FFFFFF",
            },
            action: {
              hover: "#F1F3F5",
            },
            text: {
              primary: "#1A1F26",
              secondary: "#656E7B",
            },
            divider: "#E9ECEF",
          }),
    },
    // בונוס מקצועי: עיצוב גלובלי לרכיבי ה-Paper במערכת (מבטל את הצלליות הצועקות)
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 0, // ביטול הצל המובנה של MUI כברירת מחדל
        },
        styleOverrides: {
          root: ({ theme }) => ({
            border: "1px solid",
            borderColor: theme.palette.divider, // מסגרת דקה בצבע הדיביידר המוגדר למעלה
            transition: "all 0.2s ease-in-out", // אנימציה חלקה במעבר בין מצבים
          }),
        },
      },
    },
  });

  const toggleMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <ProjectThemeContext.Provider value={{ isDark, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ProjectThemeContext.Provider>
  );
}

export { ProjectThemeProvider, ProjectThemeContext, type ThemeContextType };
