import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <Button
      component={NavLink}
      to={to}
      disableRipple // מוריד את אפקט הבלון הלחיץ בשביל מראה SaaS נקי יותר
      sx={{
        textTransform: "none", // מונע מ-MUI להפוך את האותיות ל-CAPITALS באנגלית
        fontSize: "0.95rem",
        fontWeight: "600",
        px: 2,
        py: 0.75,
        borderRadius: "8px",
        color: "text.secondary",
        transition: "all 0.2s ease-in-out",

        // עיצוב במצב ריחופ עכבר (Hover) רגיל
        "&:hover": {
          color: "text.primary",
          bgcolor: "action.hover",
        },

        // הקסם של MUI + react-router-dom:
        // כשהקישור אקטיבי, ה-NavLink מוסיף אוטומטית את הקלאס '.active'
        "&.active": {
          color: "primary.main",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(144, 202, 249, 0.12)" // רקע כחלחל עדין מאוד ב-Dark Mode
              : "rgba(25, 118, 210, 0.08)", // רקע כחלחל עדין ב-Light Mode
          fontWeight: "700",

          "&:hover": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(144, 202, 249, 0.2)"
                : "rgba(25, 118, 210, 0.15)",
          },
        },
      }}
    >
      {label}
    </Button>
  );
}

export default NavItem;
