import React, { useCallback } from "react";
import { Box, Button, alpha } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

import type { FilterOptions } from "../../../Task/hooks/useTaskFilters";

interface BoardFilterButtonsProps {
  filters?: FilterOptions;
  setFilters?: React.Dispatch<React.SetStateAction<FilterOptions>>;
  showOnlySaved?: boolean;
  onToggleSaved?: (val: boolean) => void;
  showOnlyMine?: boolean;
  onToggleMine?: (val: boolean) => void;
}

export const BoardFilterButtons: React.FC<BoardFilterButtonsProps> = React.memo(
  ({
    filters,
    setFilters,
    showOnlySaved: propShowSaved,
    onToggleSaved,
    showOnlyMine: propShowMine,
    onToggleMine,
  }) => {
    const isSavedActive = filters?.showOnlySaved ?? propShowSaved ?? false;
    const isMineActive = filters?.showOnlyMine ?? propShowMine ?? false;

    const handleToggleSaved = useCallback(() => {
      if (setFilters) {
        setFilters((prev) => ({
          ...prev,
          showOnlySaved: !prev.showOnlySaved,
        }));
      } else if (onToggleSaved) {
        onToggleSaved(!isSavedActive);
      }
    }, [setFilters, onToggleSaved, isSavedActive]);

    const handleToggleMine = useCallback(() => {
      if (setFilters) {
        setFilters((prev) => ({
          ...prev,
          showOnlyMine: !prev.showOnlyMine,
        }));
      } else if (onToggleMine) {
        onToggleMine(!isMineActive);
      }
    }, [setFilters, onToggleMine, isMineActive]);

    const getButtonSx = (isActive: boolean) => (theme: Theme) => ({
      borderRadius: "10px",
      fontSize: "0.82rem",
      fontWeight: isActive ? 600 : 500,
      textTransform: "none" as const,
      whiteSpace: "nowrap" as const,
      px: 1.8,
      py: 0.6,
      color: isActive ? "primary.main" : "text.secondary",
      bgcolor: isActive
        ? alpha(theme.palette.primary.main, 0.1)
        : "transparent",
      border: "1px solid",
      borderColor: isActive
        ? alpha(theme.palette.primary.main, 0.3)
        : "divider",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        bgcolor: isActive
          ? alpha(theme.palette.primary.main, 0.18)
          : alpha(theme.palette.action.hover, 0.08),
        borderColor: isActive
          ? "primary.main"
          : alpha(theme.palette.text.secondary, 0.3),
      },
    });

    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button
          size="small"
          onClick={handleToggleSaved}
          startIcon={
            isSavedActive ? (
              <BookmarkIcon sx={{ fontSize: 16 }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: 16 }} />
            )
          }
          sx={getButtonSx(isSavedActive)}
        >
          השמורות שלי
        </Button>

        <Button
          size="small"
          onClick={handleToggleMine}
          startIcon={
            isMineActive ? (
              <PersonIcon sx={{ fontSize: 16 }} />
            ) : (
              <PersonOutlineIcon sx={{ fontSize: 16 }} />
            )
          }
          sx={getButtonSx(isMineActive)}
        >
          המשימות שלי
        </Button>
      </Box>
    );
  },
);

BoardFilterButtons.displayName = "BoardFilterButtons";
