import { createContext, useCallback, useState, type ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface ThemeContextType {
  isDark: boolean;
  toggleMode: () => void;
}

const ProjectThemeContext = createContext<null | ThemeContextType>(null);

function ProjectThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // הגדרת ערכי ה-Theme המלאים עם פלטת צבעים מותאמת
  const theme = createTheme({
    direction: "rtl", // מבטיח כיווניות מימין לשמאל
    palette: {
      mode: isDark ? "dark" : "light",
      ...(isDark
        ? {
            // 🌙 מצב כהה - Rich Deep Navy
            primary: {
              main: "#3B82F6", // כחול רויאל מודרני ובולט
              dark: "#1D4ED8", // כחול עמוק לגרדיאנטים ומצבי פוקוס
              light: "#60A5FA",
              contrastText: "#FFFFFF",
            },
            secondary: {
              main: "#e78bfa", // ורוד נעים למשימות שלי
              dark: "#ea3aed",
              light: "#fdb5fd",
              contrastText: "#FFFFFF",
            },
            warning: {
              main: "#FBBF24", // זהב-חם נעים לעין לפריטים שמורים
              dark: "#D97706",
              light: "#FDE68A",
              contrastText: "#1A1F26",
            },
            error: {
              main: "#F87171", // אדום רך שאינו מעייף את העין ברקע כהה
              dark: "#DC2626",
              light: "#FCA5A5",
              contrastText: "#FFFFFF",
            },
            success: {
              main: "#34D399", // ירוק אמרלד רענן
              dark: "#059669",
              light: "#6EE7B7",
              contrastText: "#1A1F26",
            },
            background: {
              default: "#0A1128", // השכבה הכי תחתונה (MAIN) - כחול לילה עמוק
              paper: "#1C2541", // כרטיסים ופאנלים צפים
            },
            action: {
              hover: "#111A33", // שכבת ביניים (לרקע טאבים ושדות קלט)
              selected: "rgba(59, 130, 246, 0.16)",
            },
            text: {
              primary: "#E2E8F0", // טקסט לבן-כחלחל קריא
              secondary: "#94A3B8",
            },
            divider: "#3A506B", // קווים מפרידים בגוון כחול-אפרפר
          }
        : {
            // ☀️ מצב בהיר - נקי, רך וחד
            primary: {
              main: "#2563EB", // כחול אינטנסיבי וחד
              dark: "#1E40AF",
              light: "#3B82F6",
              contrastText: "#FFFFFF",
            },
            secondary: {
              main: "#7C3AED", // סגול עמוק
              dark: "#5B21B6",
              light: "#A78BFA",
              contrastText: "#FFFFFF",
            },
            warning: {
              main: "#D97706", // כתום-זהב קריא על רקע בהיר
              dark: "#B45309",
              light: "#FBBF24",
              contrastText: "#FFFFFF",
            },
            error: {
              main: "#EF4444",
              dark: "#B91C1C",
              light: "#F87171",
              contrastText: "#FFFFFF",
            },
            success: {
              main: "#10B981",
              dark: "#047857",
              light: "#34D399",
              contrastText: "#FFFFFF",
            },
            background: {
              default: "#F8F9FA",
              paper: "#FFFFFF",
            },
            action: {
              hover: "#F1F3F5",
              selected: "rgba(37, 99, 235, 0.08)",
            },
            text: {
              primary: "#1A1F26",
              secondary: "#656E7B",
            },
            divider: "#E9ECEF",
          }),
    },
    components: {
      // 🟢 הגדרה רוחבית לכל הכפתורים באפליקציה למניעת הידבקות האייקון לטקסט בעברית
      MuiButton: {
        styleOverrides: {
          startIcon: {
            marginLeft: "8px",
            marginRight: "-4px",
          },
          endIcon: {
            marginRight: "8px",
            marginLeft: "-4px",
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            border: "1px solid",
            borderColor: theme.palette.divider,
            transition: "all 0.2s ease-in-out",
          }),
        },
      },
      // הדריסה שמבטלת את הכפייה של צבע הכחול על טאב נבחר
      MuiTab: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              color: "#F1F3F5",
            },
          },
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
