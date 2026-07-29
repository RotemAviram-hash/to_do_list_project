import React, { useCallback } from "react";
import { Box, InputBase, IconButton, alpha, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface BoardSearchBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const BoardSearchBar: React.FC<BoardSearchBarProps> = React.memo(
  ({ searchQuery, onSearchChange }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange],
    );

    const handleClear = useCallback(() => {
      onSearchChange("");
    }, [onSearchChange]);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1.5,
          py: 0.4,
          borderRadius: "10px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.common.black, 0.03),
          border: "1px solid transparent",
          transition: "all 0.2s ease-in-out",
          width: { xs: "100%", sm: 260 },
          "&:focus-within": {
            borderColor: "primary.main",
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: "text.secondary", mr: 1 }} />
        <InputBase
          placeholder="סינון/חיפוש משימות..."
          value={searchQuery}
          onChange={handleChange}
          sx={{ fontSize: "0.85rem", width: "100%" }}
        />
        {searchQuery && (
          <Tooltip title="ניקוי">
            <IconButton size="small" onClick={handleClear} sx={{ p: 0.2 }}>
              <ClearIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  },
);

BoardSearchBar.displayName = "BoardSearchBar";
