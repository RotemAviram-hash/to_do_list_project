import { useEffect, useState, memo, useContext, useMemo } from "react";
import { Box, Fab, Typography, Button } from "@mui/material";
import Workspace from "../features/Workspace/workspace/components/Workspace";

function WorkspacePage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 4,
        direction: "rtl",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* כותרת ראשית */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.5px",
            mb: 1,
          }}
        >
          סביבת העבודה שלי ✨
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          ניהול משימות חכם, מעקב דינמי וארגון לוחות העבודה שלך.
        </Typography>
      </Box>
      <Workspace />
    </Box>
  );
}

export default memo(WorkspacePage);
