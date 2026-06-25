import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routes";

function Footer() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  return (
    <Box sx={{ pb: 7 }}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<RestoreIcon />}
            onClick={() => {
              console.log("Home clicked");
              navigate(ROUTES.HOME);
            }}
          />
          <BottomNavigationAction
            label="Contact"
            icon={<FavoriteIcon />}
            onClick={() => {
              console.log("contact clicked");
              navigate(ROUTES.CONTACT);
            }}
          />
          <BottomNavigationAction
            label="About"
            icon={<LocationOnIcon />}
            onClick={() => {
              console.log("about clicked");
              navigate(ROUTES.ABOUT);
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
export default Footer;
