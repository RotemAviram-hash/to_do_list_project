import { createContext, useCallback, useState, type ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface ThemeContextType {
  isDark: boolean;
  toggleMode: () => void;
}

const ProjectThemeContext = createContext<null | ThemeContextType>(null);

function ProjectThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
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
