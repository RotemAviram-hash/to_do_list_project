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
  alpha,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

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
      position="static"
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
          minHeight: "72px",
        }}
      >
        {/* אזור שמאל: כפתור תצוגה + משתמש / התחברות */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* כפתור החלפת מצב יום/לילה מעוגל ועדין */}
          <Tooltip title={isDark ? "מצב יום" : "מצב לילה"}>
            <IconButton
              onClick={toggleMode}
              aria-label="החלף מצב תצוגה"
              sx={{
                color: "text.secondary",
                bgcolor: isDark ? alpha("#fff", 0.05) : alpha("#000", 0.03),
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "14px",
                p: "9px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: isDark
                    ? alpha("#3b82f6", 0.12)
                    : alpha("#3b82f6", 0.08),
                  borderColor: alpha("#3b82f6", 0.3),
                  transform: "scale(1.05)",
                },
              }}
            >
              {isDark ? (
                <Brightness7Icon sx={{ fontSize: 18 }} />
              ) : (
                <Brightness4Icon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <HeaderAvatar />

              <Button
                onClick={() => logout()}
                variant="text"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  borderRadius: "12px",
                  px: 2,
                  py: 0.75,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: isDark
                      ? alpha("#ef4444", 0.12)
                      : alpha("#ef4444", 0.08),
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
                  fontWeight: 600,
                  color: "text.primary",
                  borderRadius: "12px",
                  px: 2,
                  py: 0.75,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: isDark ? alpha("#fff", 0.06) : alpha("#000", 0.04),
                  },
                }}
              >
                התחברות
              </Button>

              <Button
                onClick={() => navigate(ROUTES.REGISTER)}
                variant="contained"
                disableElevation
                sx={{
                  fontWeight: 600,
                  borderRadius: "14px",
                  px: 2.5,
                  py: 0.75,
                  fontSize: "0.85rem",
                  textTransform: "none",
                  boxShadow: isDark
                    ? "0 4px 12px rgba(59, 130, 246, 0.25)"
                    : "0 4px 12px rgba(25, 118, 210, 0.2)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: isDark
                      ? "0 6px 16px rgba(59, 130, 246, 0.35)"
                      : "0 6px 16px rgba(25, 118, 210, 0.3)",
                  },
                }}
              >
                הרשמה
              </Button>
            </Box>
          )}
        </Box>

        {/* אזור מרכז: קישורי ניווט */}
        {!user && (
          <Box
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <NavItem to={ROUTES.HOME} label="דף הבית" />
            <NavItem to={ROUTES.ABOUT} label="אודות" />
            <NavItem to={ROUTES.CONTACT} label="צור קשר" />
          </Box>
        )}

        {/* אזור ימין: לוגו עדין וחמוד בהשראת הלוח */}
        <Box
          onClick={() => navigate(ROUTES.HOME)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            cursor: "pointer",
            userSelect: "none",
            p: "6px 14px",
            borderRadius: "16px",
            bgcolor: isDark ? alpha("#3b82f6", 0.08) : alpha("#3b82f6", 0.05),
            border: "1px solid",
            borderColor: isDark
              ? alpha("#3b82f6", 0.2)
              : alpha("#3b82f6", 0.15),
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: isDark ? alpha("#3b82f6", 0.15) : alpha("#3b82f6", 0.1),
              transform: "translateY(-1px)",
              "& .logo-icon-box": {
                transform: "rotate(6deg) scale(1.05)",
              },
            },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.2px",
              fontSize: "1.15rem",
              color: "text.primary",
            }}
          >
            Task
            <Box component="span" sx={{ color: "primary.main" }}>
              Flow
            </Box>
          </Typography>

          <Box
            className="logo-icon-box"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: "10px",
              bgcolor: "primary.main",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
              transition: "transform 0.2s ease",
            }}
          >
            <DashboardRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
