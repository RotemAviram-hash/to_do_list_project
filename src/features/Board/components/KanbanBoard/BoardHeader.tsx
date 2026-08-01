// src/features/Board/components/BoardHeader.tsx
import React from "react";
import {
  Box,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  alpha,
  useTheme,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ViewKanbanRoundedIcon from "@mui/icons-material/ViewKanbanRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

export interface BoardHeaderProps {
  onAddColumn: () => void;
  onAddMember: () => void;
  viewMode: "kanban" | "calendar";
  onViewModeChange: (mode: "kanban" | "calendar") => void;
  isOwner?: boolean; // 👈 הרשאה לשיתוף לוח (רק בעלים)
  canEdit?: boolean; // 👈 הרשאה לעריכה/הוספת עמודות (בעלים או עורך)
}

export const BoardHeader: React.FC<BoardHeaderProps> = React.memo(
  ({
    onAddColumn,
    onAddMember,
    viewMode,
    onViewModeChange,
    isOwner = false,
    canEdit = false,
  }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.8,
          mb: 2,
          borderBottom: "1px solid",
          borderColor: isDark
            ? alpha(theme.palette.divider, 0.6)
            : alpha(theme.palette.divider, 0.8),
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* מחליף תצוגות (Kanban / Calendar) - זמין לכולם */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => {
            if (value) {
              onViewModeChange(value);
            }
          }}
          size="small"
          sx={{
            bgcolor: theme.palette.action.hover,
            p: 0.4,
            borderRadius: "12px",
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: "8px",
              px: 1.8,
              py: 0.5,
              fontWeight: 600,
              fontSize: "0.82rem",
              textTransform: "none",
              "&.Mui-selected": {
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                boxShadow: theme.shadows[1],
              },
            },
          }}
        >
          <ToggleButton value="kanban">
            <ViewKanbanRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} /> קנבן
          </ToggleButton>
          <ToggleButton value="calendar">
            <CalendarMonthRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} /> לוח שנה
          </ToggleButton>
        </ToggleButtonGroup>

        {/* כפתורי פעולות - מוגבלים לפי הרשאות */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* 👑 כפתור שיתוף לוח - מוצג רק לבעלי הלוח */}
          {isOwner && (
            <Button
              size="small"
              onClick={onAddMember}
              startIcon={<PersonAddRoundedIcon sx={{ fontSize: 19 }} />}
              sx={{
                borderRadius: "12px",
                px: 2.2,
                py: 0.8,
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: alpha(theme.palette.info.main, isDark ? 0.18 : 0.08),
                color: theme.palette.info.main,
                border: "1px solid",
                borderColor: alpha(theme.palette.info.main, isDark ? 0.3 : 0.2),
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: theme.palette.info.main,
                  color: theme.palette.info.contrastText,
                  borderColor: theme.palette.info.main,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.info.main,
                    0.35,
                  )}`,
                },
              }}
            >
              שתף לוח
            </Button>
          )}

          {/* ✏️ כפתור הוספת עמודה - מוצג רק בתצוגת קנבן ורק למי שמורשה לערוך */}
          {viewMode === "kanban" && canEdit && (
            <Button
              size="small"
              onClick={onAddColumn}
              startIcon={<AddRoundedIcon sx={{ fontSize: 19 }} />}
              sx={{
                borderRadius: "12px",
                px: 2.2,
                py: 0.8,
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.18 : 0.08,
                ),
                color: theme.palette.primary.main,
                border: "1px solid",
                borderColor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.3 : 0.2,
                ),
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.primary.main,
                    0.35,
                  )}`,
                },
              }}
            >
              עמודה חדשה
            </Button>
          )}
        </Box>
      </Box>
    );
  },
);

BoardHeader.displayName = "BoardHeader";
