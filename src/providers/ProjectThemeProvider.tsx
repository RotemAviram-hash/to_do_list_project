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
            // 🌙 ערכי רקע וטקסט למצב כהה (SaaS Dark)
            background: {
              default: "#0B0F19", // כחול-לילה עמוק ומקצועי לרקע הדף
              paper: "#151B26", // טון אחד בהיר יותר לכרטיסים וטפסים
            },
            text: {
              primary: "#F3F4F6", // לבן מעודן שלא שורף את העין
              secondary: "#9CA3AF", // אפור ברור למטא-דאטה
            },
            divider: "#242F41", // קווים מפרידים עדינים בגוון כהה
          }
        : {
            // ☀️ ערכי רקע וטקסט למצב בהיר (Soft SaaS Light)
            background: {
              default: "#F8F9FA", // אפור-לבן רך ונוח לעבודה ממושכת
              paper: "#FFFFFF", // לבן נקי לחלוטין לכרטיסים וטפסים
            },
            text: {
              primary: "#1A1F26", // שחור מעודן, לא שחור פחם אגרסיבי
              secondary: "#656E7B", // אפור קריא לתיאורים ופרטים
            },
            divider: "#E9ECEF", // קווים מפרידים סופר עדינים
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
