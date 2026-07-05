import { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ידית המגירה המלבנית - צמודה לדופן שמאל ומעוצבת כלשונית */}
      <Box
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          left: 0,
          top: "40%", // ממקם את הידית בערך באמצע גובה המסך
          width: "24px", // הרוחב של הידית שבולט מהקיר
          height: "80px", // האורך של המלבן
          bgcolor: "primary.main",
          color: "primary.contrastText",
          cursor: "pointer",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // עיגול פינות רק בצד ימין (הצד הפנימי של המסך)
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
          transition: "background-color 0.2s, width 0.2s",
          "&:hover": {
            bgcolor: "primary.dark",
            width: "28px", // אפקט קטן שהידית קצת נשלפת החוצה ב-Hover
          },
        }}
      >
        <Box sx={{ fontSize: "12px", fontWeight: "bold" }}>❯</Box>
      </Box>

      {/* המגירה עצמה - מעודכנת לגרסה 6 */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        // פתרון השגיאה מתוך image_389204.png - שימוש ב-slotProps
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
          {/* כותרת קטנה ואלגנטית בראש המגירה */}
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
            Navigation
          </Typography>

          <List
            disablePadding
            sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            {/* פריט: דף הבית */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setIsOpen(false)}
                sx={{
                  borderRadius: "12px",
                  py: 1.2,
                  px: 2,
                  color: "text.secondary",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                    transform: "translateX(4px)", // אפקט תזוזה קטן ויפה ימינה
                  },
                }}
              >
                {/* פתרון השגיאה מתוך image_383f4a.png - העברת Typography ישירות לתוך ה-primary */}
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: "600" }}>
                      דף הבית
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>

            {/* פריט: אודות */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setIsOpen(false)}
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
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: "600" }}>
                      אודות
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>

            {/* פריט: צור קשר */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setIsOpen(false)}
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
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: "600" }}>
                      צור קשר
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
