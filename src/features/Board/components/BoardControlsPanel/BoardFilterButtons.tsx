import React from "react";
import { Box, Button, alpha, type Theme } from "@mui/material";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

interface BoardFilterButtonsProps {
  showOnlySaved: boolean;
  onToggleSaved: (val: boolean) => void;
  showOnlyMine: boolean;
  onToggleMine: (val: boolean) => void;
}

// 1. פונקציית סטייל שמקבלת את ה-theme אוטומטית מתוך ה-sx!
const getFilterButtonSx = (isActive: boolean) => (theme: Theme) => ({
  borderRadius: "10px",
  fontSize: "0.82rem",
  textTransform: "none",
  whiteSpace: "nowrap",
  px: 1.5,
  py: 0.6,
  color: isActive ? "primary.main" : "text.secondary",
  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : "transparent",
  border: "1px solid",
  borderColor: isActive
    ? alpha(theme.palette.primary.main, 0.3)
    : "transparent",
  "&:hover": {
    bgcolor: isActive
      ? alpha(theme.palette.primary.main, 0.15)
      : theme.palette.action.hover, // 👈 MUI מטפל במצב כהה/בהיר אוטומטית!
  },
});

export const BoardFilterButtons: React.FC<BoardFilterButtonsProps> = ({
  showOnlySaved,
  onToggleSaved,
  showOnlyMine,
  onToggleMine,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <Button
        size="small"
        onClick={() => onToggleSaved(!showOnlySaved)}
        startIcon={<BookmarkOutlinedIcon sx={{ fontSize: 16 }} />}
        sx={getFilterButtonSx(showOnlySaved)}
      >
        השמורות שלי
      </Button>

      <Button
        size="small"
        onClick={() => onToggleMine(!showOnlyMine)}
        startIcon={<PersonOutlineIcon sx={{ fontSize: 16 }} />}
        sx={getFilterButtonSx(showOnlyMine)}
      >
        המשימות שלי
      </Button>
    </Box>
  );
};
