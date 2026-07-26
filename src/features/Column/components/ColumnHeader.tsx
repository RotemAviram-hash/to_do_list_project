import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Popover,
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";

// Types
import type { Column as ColumnType, ColumnTheme } from "../models/Column";

// מיפוי הערכים של ColumnTheme לצבעים ויזואליים ב-UI
export const THEME_COLOR_MAP: Record<
  ColumnTheme,
  { main: string; label: string }
> = {
  red: { main: "#ef5350", label: "אדום" },
  blue: { main: "#42a5f5", label: "כחול" },
  green: { main: "#66bb6a", label: "ירוק" },
  yellow: { main: "#ffee58", label: "צהוב" },
  purple: { main: "#ab47bc", label: "סגול" },
  gray: { main: "#bdbdbd", label: "אפור" },
};

interface ColumnHeaderProps {
  column: ColumnType;
  taskCount: number;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  onAddTask?: (columnId: string) => void;
  onThemeChange?: (columnId: string, theme: ColumnTheme) => void;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  taskCount,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onThemeChange,
}) => {
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);

  const handleOpenColorPicker = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setColorAnchor(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setColorAnchor(null);
  };

  const handleSelectTheme = (themeKey: ColumnTheme) => {
    if (onThemeChange) {
      onThemeChange(column.id, themeKey);
    }
    handleCloseColorPicker();
  };

  // מציאת הצבע הנוכחי לפי הערך במודל
  const currentThemeColor =
    THEME_COLOR_MAP[column.theme]?.main || THEME_COLOR_MAP.gray.main;

  return (
    <Box
      sx={{
        p: 2,
        pb: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* 1. כותרת, אינדיקטור צבע וספירת משימות */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
        >
          {/* עיגול אינדיקטור קטן של הנושא הנוכחי */}
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: currentThemeColor,
              flexShrink: 0,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "text.primary" }}
            noWrap
          >
            {column.title}
          </Typography>
        </Box>

        <Chip
          label={taskCount}
          size="small"
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            fontWeight: 700,
          }}
        />
      </Box>

      {/* 2. סרגל כפתורי פעולה */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 0.5, width: "100%" }}
      >
        <Tooltip title="הוספת משימה">
          <IconButton
            size="small"
            onClick={() => onAddTask?.(column.id)}
            sx={{ p: 0.5 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="שינוי צבע עמודה">
          <IconButton
            size="small"
            onClick={handleOpenColorPicker}
            sx={{ p: 0.5 }}
          >
            <ColorLensOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="עריכת עמודה">
          <IconButton
            size="small"
            onClick={() => onEditColumn(column)}
            sx={{ p: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="מחיקת עמודה">
          <IconButton
            size="small"
            onClick={() => onDeleteColumn(column.id)}
            sx={{ p: 0.5 }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 3. תפריט בחירת Theme */}
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={handleCloseColorPicker}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            p: 1.5,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
          }}
        >
          {(Object.keys(THEME_COLOR_MAP) as ColumnTheme[]).map((themeKey) => {
            const themeObj = THEME_COLOR_MAP[themeKey];
            const isSelected = column.theme === themeKey;

            return (
              <Tooltip key={themeKey} title={themeObj.label}>
                <Box
                  onClick={() => handleSelectTheme(themeKey)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: themeObj.main,
                    cursor: "pointer",
                    border: isSelected ? "3px solid #000" : "2px solid #fff",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                    transition: "transform 0.15s ease",
                    "&:hover": {
                      transform: "scale(1.15)",
                    },
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
};
