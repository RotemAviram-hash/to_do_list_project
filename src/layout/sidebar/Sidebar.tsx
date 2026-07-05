import { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sidebarList } from "./sidebarLinks";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* הידית המלבנית שלך */}
      <Box
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          left: 0,
          top: "40%",
          width: "24px",
          height: "80px",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          cursor: "pointer",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
          transition: "background-color 0.2s, width 0.2s",
          "&:hover": { bgcolor: "primary.dark", width: "28px" },
        }}
      >
        <Box sx={{ fontSize: "12px", fontWeight: "bold" }}>❯</Box>
      </Box>

      {/* המגירה האלגנטית */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              borderTopRightRadius: "16px",
              borderBottomRightRadius: "16px",
              boxShadow: "4px 0px 24px rgba(0, 0, 0, 0.08)",
              bgcolor: "background.paper",
              backgroundImage: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2.5,
          }}
          role="presentation"
        >
          <Typography
            variant="subtitle2"
            sx={{
              px: 1.5,
              pb: 2,
              fontWeight: "700",
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "0.75rem",
            }}
          >
            TaskFlow
          </Typography>

          <List
            disablePadding
            sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            {/* הלולאה החכמה שמציגה את כל הפריטים בצורה דינמית */}
            {sidebarList.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.to);
                    setIsOpen(false);
                  }}
                  sx={{
                    borderRadius: "12px",
                    py: 1.2,
                    px: 2,
                    color: "text.secondary",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "text.primary",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ fontSize: "0.95rem", fontWeight: "600" }}
                      >
                        {item.name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
