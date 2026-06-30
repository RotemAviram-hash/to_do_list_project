import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavItem from "../../router/NavItem";
import ROUTES from "../../router/routes";
import { useNavigate } from "react-router-dom";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../providers/ProjectThemeProvider";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useContext } from "react";
import { useUser } from "../../providers/UserProvider";

function Header() {
  const navigate = useNavigate();
  const { isDark, toggleMode } = useContext(
    ProjectThemeContext,
  ) as ThemeContextType;

  const { user, logout } = useUser();

  return (
    <AppBar
      position="sticky" // עדיף מ-static כדי שילווה את הגלילה באלגנטיות
      elevation={0}
      sx={{
        bgcolor: isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(8px)", // אפקט זכוכית מודרני וחצי שקוף
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, md: 4 }, // ריווח פנימי מעט רחב יותר בצדדים
          minHeight: "64px",
        }}
      >
        {/* כפתור תפריט למובייל */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* לוגו האפליקציה */}
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

        {/* אזור הניווט והמשתמש */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* לינקים של הניווט - עטופים ב-Box שמנהל את הטיפוגרפיה והמרווחים בצורה נקייה */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <NavItem to={ROUTES.HOME} label="Home" />
            <NavItem to={ROUTES.ABOUT} label="About" />
            <NavItem to={ROUTES.CONTACT} label="Contact" />
          </Box>

          {/* כפתורי פעולה מותאמי סטטוס משתמש */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <Button
                onClick={() => logout()}
                variant="text"
                sx={{
                  fontWeight: "600",
                  color: "text.secondary",
                  borderRadius: "8px",
                  px: 2,
                  "&:hover": { color: "error.main", bgcolor: "error.lighter" },
                }}
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  variant="text"
                  sx={{
                    fontWeight: "600",
                    color: "text.primary",
                    borderRadius: "8px",
                    px: 2,
                  }}
                >
                  Log In
                </Button>

                <Button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  variant="contained"
                  disableElevation
                  sx={{
                    fontWeight: "600",
                    borderRadius: "8px",
                    px: 2,
                    textTransform: "none",
                  }}
                >
                  Register
                </Button>
              </>
            )}

            {/* כפתור החלפת ערכת נושא */}
            <IconButton
              onClick={toggleMode}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {isDark ? (
                <Brightness7 fontSize="small" />
              ) : (
                <Brightness4 fontSize="small" />
              )}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
