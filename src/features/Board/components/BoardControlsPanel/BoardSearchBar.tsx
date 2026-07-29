import React, { useCallback } from "react";
import { Box, InputBase, alpha, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface BoardSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

// ⚡ אופטימיזציה: עטיפה ב-React.memo מונעת רירונדר של החיפוש בעת שינוי בלוחות/סינונים
export const BoardSearchBar: React.FC<BoardSearchBarProps> = React.memo(
  ({ searchQuery, onSearchChange }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    // ⚡ אופטימיזציה: ייצוב ה-Handler למניעת יצירה מחדש בכל הקלדה
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange],
    );

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          px: 1.5,
          py: 0.5,
          borderRadius: "10px",
          bgcolor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          border: "1px solid transparent",
          transition: "all 0.2s",
          width: 220,
          "&:focus-within": {
            borderColor: "primary.main",
            bgcolor: "background.paper",
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: "text.disabled", mr: 1 }} />
        <InputBase
          placeholder="סינון/חיפוש..."
          value={searchQuery}
          onChange={handleChange}
          sx={{ fontSize: "0.85rem", width: "100%" }}
        />
      </Box>
    );
  },
);

BoardSearchBar.displayName = "BoardSearchBar";
