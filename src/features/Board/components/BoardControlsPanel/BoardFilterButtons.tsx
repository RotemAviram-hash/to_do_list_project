import React from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

interface BoardFilterButtonsProps {
  showOnlySaved: boolean;
  onToggleSaved: (val: boolean) => void;
  showOnlyMine: boolean;
  onToggleMine: (val: boolean) => void;
}

export const BoardFilterButtons: React.FC<BoardFilterButtonsProps> = ({
  showOnlySaved,
  onToggleSaved,
  showOnlyMine,
  onToggleMine,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <Button
        size="small"
        onClick={() => onToggleSaved(!showOnlySaved)}
        startIcon={<BookmarkOutlinedIcon sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: "10px",
          fontSize: "0.82rem",
          textTransform: "none",
          whiteSpace: "nowrap",
          px: 1.5,
          py: 0.6,
          color: showOnlySaved ? "primary.main" : "text.secondary",
          bgcolor: showOnlySaved
            ? alpha(theme.palette.primary.main, 0.1)
            : "transparent",
          border: "1px solid",
          borderColor: showOnlySaved
            ? alpha(theme.palette.primary.main, 0.3)
            : "transparent",
          "&:hover": {
            bgcolor: showOnlySaved
              ? alpha(theme.palette.primary.main, 0.15)
              : isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.03)",
          },
        }}
      >
        השמורות שלי
      </Button>

      <Button
        size="small"
        onClick={() => onToggleMine(!showOnlyMine)}
        startIcon={<PersonOutlineIcon sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: "10px",
          fontSize: "0.82rem",
          textTransform: "none",
          whiteSpace: "nowrap",
          px: 1.5,
          py: 0.6,
          color: showOnlyMine ? "primary.main" : "text.secondary",
          bgcolor: showOnlyMine
            ? alpha(theme.palette.primary.main, 0.1)
            : "transparent",
          border: "1px solid",
          borderColor: showOnlyMine
            ? alpha(theme.palette.primary.main, 0.3)
            : "transparent",
          "&:hover": {
            bgcolor: showOnlyMine
              ? alpha(theme.palette.primary.main, 0.15)
              : isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.03)",
          },
        }}
      >
        המשימות שלי
      </Button>
    </Box>
  );
};
