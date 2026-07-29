import React, { useCallback } from "react";
import { Box, Button, alpha, type Theme } from "@mui/material";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

// 👈 ייבוא הטיפוס הישיר מההוק שלנו
import type { FilterOptions } from "../../../Task/hooks/useTaskFilters";

interface BoardFilterButtonsProps {
  // 🌟 אפשרות א' (מומלצת): העברת אובייקט הפילטרים ופונקציית עדכון ה-State מהרכיב האב
  filters?: FilterOptions;
  setFilters?: React.Dispatch<React.SetStateAction<FilterOptions>>;

  // 🔄 אפשרות ב' (תמיכה לאחור): Props פרטניים
  showOnlySaved?: boolean;
  onToggleSaved?: (val: boolean) => void;
  showOnlyMine?: boolean;
  onToggleMine?: (val: boolean) => void;
}

// ⚡ אופטימיזציה: פונקציית העיצוב מחוץ לרכיב למניעת חישוב מחדש בכל רנדור
const getFilterButtonSx = (isActive: boolean) => (theme: Theme) => ({
  borderRadius: "10px",
  fontSize: "0.82rem",
  fontWeight: isActive ? 600 : 500,
  textTransform: "none",
  whiteSpace: "nowrap",
  px: 1.5,
  py: 0.6,
  color: isActive ? "primary.main" : "text.secondary",
  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : "transparent",
  border: "1px solid",
  borderColor: isActive
    ? alpha(theme.palette.primary.main, 0.35)
    : "transparent",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    bgcolor: isActive
      ? alpha(theme.palette.primary.main, 0.2)
      : theme.palette.action.hover,
  },
});

export const BoardFilterButtons: React.FC<BoardFilterButtonsProps> = React.memo(
  ({
    filters,
    setFilters,
    showOnlySaved: propShowSaved,
    onToggleSaved,
    showOnlyMine: propShowMine,
    onToggleMine,
  }) => {
    // 🎯 חילוץ הערכים הפעילים (בין אם הועברו בתוך filters או כ-Props בודדים)
    const isSavedActive = filters?.showOnlySaved ?? propShowSaved ?? false;
    const isMineActive = filters?.showOnlyMine ?? propShowMine ?? false;

    // ⚡ הינדלר בלחיצה על "השמורות שלי"
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

    // ⚡ הינדלר בלחיצה על "המשימות שלי"
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

    return (
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Button
          size="small"
          onClick={handleToggleSaved}
          startIcon={<BookmarkOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={getFilterButtonSx(isSavedActive)}
        >
          השמורות שלי
        </Button>

        <Button
          size="small"
          onClick={handleToggleMine}
          startIcon={<PersonOutlineIcon sx={{ fontSize: 16 }} />}
          sx={getFilterButtonSx(isMineActive)}
        >
          המשימות שלי
        </Button>
      </Box>
    );
  },
);

BoardFilterButtons.displayName = "BoardFilterButtons";
