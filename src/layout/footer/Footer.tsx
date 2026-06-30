import { Box, Paper, Typography, Link } from "@mui/material";
import { useContext } from "react";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../providers/ProjectThemeProvider";

function Footer() {
  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;

  return (
    <Paper
      component="footer"
      elevation={0}
      sx={{
        mt: "auto",
        py: 2.5,
        px: 3,
        bgcolor: "background.paper", // צבע רקע מעט שונה ב-Light Mode כדי לתת מסגרת יפה לעמוד
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        justifyContent: "center", // ממרכז את כל הפוטר למרכז המסך
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap", // מוודא שבמסכים קטנים זה ירד שורה בצורה יפה
        }}
      >
        {/* מותג */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: "700",
            fontSize: "0.85rem",
            background: isDark
              ? "linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)"
              : "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            userSelect: "none",
          }}
        >
          TaskFlow
        </Typography>

        {/* נקודת הפרדה עדינה */}
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          •
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: "500",
            fontSize: "0.8rem",
          }}
        >
          &copy; {new Date().getFullYear()} All rights reserved
        </Typography>

        {/* נקודת הפרדה עדינה */}
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          •
        </Typography>

        {/* קישורים טקסטואליים צמודים */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link
            href="#"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "color 0.2s",
              "&:hover": { color: "primary.main" },
            }}
          >
            Terms
          </Link>
          <Link
            href="#"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "color 0.2s",
              "&:hover": { color: "primary.main" },
            }}
          >
            Privacy
          </Link>
          <Link
            href="#"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontWeight: "500",
              textDecoration: "none",
              transition: "color 0.2s",
              "&:hover": { color: "primary.main" },
            }}
          >
            Support
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}

export default Footer;
