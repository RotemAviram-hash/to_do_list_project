import React, { memo, useState, useCallback } from "react";
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

// Types & Dialog
import type { ColumnTheme, Column } from "../models/Column";
import { EditColumnDialog } from "../dialogs/EditColumnDialog";

export const THEME_COLOR_MAP: Record<
  ColumnTheme,
  { main: string; label: string }
> = {
  blue: { main: "#3b82f6", label: "כחול" },
  red: { main: "#ef4444", label: "אדום" },
  green: { main: "#22c55e", label: "ירוק" },
  yellow: { main: "#eab308", label: "צהוב" },
  purple: { main: "#a855f7", label: "סגול" },
  gray: { main: "#64748b", label: "אפור" },
  cyan: { main: "#06b6d4", label: "ציאן" },
  pink: { main: "#ec4899", label: "ורוד" },
  orange: { main: "#f97316", label: "כתום" },
  indigo: { main: "#6366f1", label: "אינדיגו" },
  teal: { main: "#14b8a6", label: "טיאל" },
};

const THEME_KEYS = Object.keys(THEME_COLOR_MAP) as ColumnTheme[];

interface ColumnHeaderProps {
  column: Column;
  taskCount: number;
  boardId: string;
  onEditColumn: (id: string, updatedFields: Partial<Column>) => Promise<void>;
  onDeleteColumn: (id: string, hasTasks?: boolean) => Promise<void>;
  onAddTask: (columnId: string) => void;
  onThemeChange?: (columnId: string, theme: ColumnTheme) => void;
  canEdit?: boolean; // 👈 הרשאת עריכה
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = memo(
  ({
    column,
    taskCount,
    boardId,
    onEditColumn,
    onDeleteColumn,
    onAddTask,
    onThemeChange,
    canEdit = false,
  }) => {
    const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleOpenEditDialog = useCallback(() => {
      if (!canEdit) return;
      setIsEditDialogOpen(true);
    }, [canEdit]);

    const handleCloseEditDialog = useCallback(() => {
      setIsEditDialogOpen(false);
    }, []);

    const handleOpenColorPicker = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!canEdit) return;
        setColorAnchor(event.currentTarget);
      },
      [canEdit],
    );

    const handleCloseColorPicker = useCallback(() => {
      setColorAnchor(null);
    }, []);

    const handleSelectTheme = useCallback(
      (themeKey: ColumnTheme) => {
        if (!canEdit) return;
        if (onThemeChange) {
          onThemeChange(column.id, themeKey);
        } else {
          onEditColumn(column.id, { theme: themeKey });
        }
        handleCloseColorPicker();
      },
      [canEdit, column.id, onThemeChange, onEditColumn, handleCloseColorPicker],
    );

    const handleAddTaskClick = useCallback(() => {
      if (!canEdit) return;
      onAddTask(column.id);
    }, [canEdit, column.id, onAddTask]);

    const handleDeleteClick = useCallback(() => {
      if (!canEdit) return;
      const hasTasks = taskCount > 0;

      if (hasTasks) {
        onDeleteColumn(column.id, true);
        return;
      }

      if (window.confirm(`האם למחוק את העמודה "${column.title || ""}"?`)) {
        onDeleteColumn(column.id, false);
      }
    }, [canEdit, column.id, column.title, onDeleteColumn, taskCount]);

    const currentThemeColor =
      THEME_COLOR_MAP[column.theme]?.main || THEME_COLOR_MAP.gray.main;

    return (
      <Box
        sx={{
          p: 2,
          pb: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "transparent",
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
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 24,
                borderRadius: "4px",
                bgcolor: currentThemeColor,
                flexShrink: 0,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "0.95rem",
                letterSpacing: "-0.01em",
              }}
              noWrap
            >
              {column.title}
            </Typography>
          </Box>

          <Chip
            label={taskCount}
            size="small"
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              fontWeight: 700,
              height: 22,
              "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
            }}
          />
        </Box>

        {/* 2. סרגל כפתורי פעולה - מוצג רק למורשי עריכה */}
        {canEdit && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              width: "100%",
              mt: 0.5,
            }}
          >
            <Tooltip title="הוספת משימה">
              <IconButton
                size="small"
                onClick={handleAddTaskClick}
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  color: "text.secondary",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "primary.main",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="שינוי צבע עמודה">
              <IconButton
                size="small"
                onClick={handleOpenColorPicker}
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  color: "text.secondary",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: currentThemeColor,
                  },
                }}
              >
                <ColorLensOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="עריכת עמודה">
              <IconButton
                size="small"
                onClick={handleOpenEditDialog}
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  color: "text.secondary",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="מחיקת עמודה">
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  color: "text.disabled",
                  "&:hover": {
                    bgcolor: "error.lighter",
                    color: "error.main",
                  },
                }}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* 3. תפריט צבעים (Popover) */}
        {canEdit && (
          <Popover
            open={Boolean(colorAnchor)}
            anchorEl={colorAnchor}
            onClose={handleCloseColorPicker}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  p: 1.5,
                  borderRadius: "16px",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  border: "1px solid",
                  borderColor: "divider",
                  width: 240,
                },
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 1,
                px: 1,
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              בחר ערכת צבעים לעמודה
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 0.75,
              }}
            >
              {THEME_KEYS.map((themeKey) => {
                const themeObj = THEME_COLOR_MAP[themeKey];
                const isSelected = column.theme === themeKey;

                return (
                  <Box
                    key={themeKey}
                    onClick={() => handleSelectTheme(themeKey)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      p: 1,
                      borderRadius: "10px",
                      cursor: "pointer",
                      bgcolor: isSelected
                        ? (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.04)"
                        : "transparent",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.03)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: themeObj.main,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: isSelected ? "2px solid #fff" : "none",
                      }}
                    >
                      {isSelected && (
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            bgcolor: "#fff",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "text.primary" : "text.secondary",
                        fontSize: "0.825rem",
                      }}
                    >
                      {themeObj.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Popover>
        )}

        {/* 4. דיאלוג עריכת עמודה */}
        {canEdit && (
          <EditColumnDialog
            open={isEditDialogOpen}
            onClose={handleCloseEditDialog}
            column={column}
            boardId={boardId}
          />
        )}
      </Box>
    );
  },
);

ColumnHeader.displayName = "ColumnHeader";
