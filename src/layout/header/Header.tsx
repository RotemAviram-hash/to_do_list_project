import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import NavItem from "../../router/NavItem";
import ROUTES from "../../router/routes";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../providers/ProjectThemeProvider";
import { useUser } from "../../features/User/hooks/useUser";
import { HeaderAvatar } from "../../features/User/components/HeaderAvatar";

function Header() {
  const navigate = useNavigate();
  const { isDark, toggleMode } = useContext(
    ProjectThemeContext,
  ) as ThemeContextType;

  const { user, logout } = useUser();

  return (
    <AppBar
      position="static" /* <<< זה השינוי המרכזי: הופך אותו לאלמנט רגיל בשרשרת הדף */
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          minHeight: "64px",
        }}
      >
        {/* אזור 1: כפתור תצוגה + משתמש / התחברות */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* כפתור החלפת מצב יום/לילה */}
          <Tooltip title={isDark ? "מצב יום" : "מצב לילה"}>
            <IconButton
              onClick={toggleMode}
              aria-label="החלף מצב תצוגה"
              sx={{
                color: "text.secondary",
                transition: "color 0.2s ease-in-out",
                "&:hover": { color: "primary.main" },
              }}
            >
              {isDark ? (
                <Brightness7Icon fontSize="small" />
              ) : (
                <Brightness4Icon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* מחובר: אווטר + התנתקות | אורח: התחברות + הרשמה */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <HeaderAvatar />

              <Button
                onClick={() => logout()}
                variant="text"
                sx={{
                  fontWeight: "600",
                  color: "text.secondary",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": {
                    color: "error.main",
                    bgcolor: isDark
                      ? "rgba(244, 67, 54, 0.12)"
                      : "rgba(211, 47, 47, 0.08)",
                  },
                }}
              >
                התנתקות
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                variant="text"
                sx={{
                  fontWeight: "600",
                  color: "text.primary",
                  borderRadius: 2,
                  px: 2,
                }}
              >
                התחברות
              </Button>

              <Button
                onClick={() => navigate(ROUTES.REGISTER)}
                variant="contained"
                disableElevation
                sx={{
                  fontWeight: "600",
                  borderRadius: 2,
                  px: 2,
                  textTransform: "none",
                }}
              >
                הרשמה
              </Button>
            </Box>
          )}
        </Box>

        {/* אזור 2 (מרכז): קישורי ניווט - מופיעים רק כשאורח */}
        {!user && (
          <Box
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <NavItem to={ROUTES.HOME} label="דף הבית" />
            <NavItem to={ROUTES.ABOUT} label="אודות" />
            <NavItem to={ROUTES.CONTACT} label="צור קשר" />
          </Box>
        )}

        {/* אזור 3: לוגו */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate(ROUTES.HOME)}
            sx={{
              fontWeight: "800",
              letterSpacing: "0.5px",
              fontSize: "1.25rem",
              background: isDark
                ? "linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)"
                : "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            TaskFlow
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
