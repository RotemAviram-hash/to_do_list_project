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
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          My Logo
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <NavItem to={ROUTES.HOME} label="Home" />
            <NavItem to={ROUTES.ABOUT} label="About" />
            <NavItem to={ROUTES.CONTACT} label="Contact" />
          </Box>
          {user ? (
            <>
              <Button
                onClick={() => logout()}
                variant="outlined"
                color="inherit"
                sx={{ ml: 2 }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                variant="outlined"
                color="inherit"
                sx={{ ml: 2 }}
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate(ROUTES.REGISTER)}
                variant="outlined"
                color="inherit"
                sx={{ ml: 2 }}
              >
                Register
              </Button>
            </>
          )}
          <IconButton onClick={toggleMode} color="inherit">
            {isDark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Header;
