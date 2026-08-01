// src/features/Board/components/BoardColumnsList.tsx
import React, { useMemo } from "react";
import { Box, Button, Typography, alpha, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";

import Column from "../../../Column/components/Column";
import type { Column as ColumnType } from "../../../Column/models/Column";
import type { Task } from "../../../Task/models/Task";

export interface BoardColumnsListProps {
  columns: ColumnType[];
  tasks: Task[];
  onAddColumn?: () => void;
  canEdit?: boolean; // 👈 הרשאת עריכה (הוספה/מחיקה/גרירה)
}

export const BoardColumnsList: React.FC<BoardColumnsListProps> = React.memo(
  ({ columns, tasks, onAddColumn, canEdit = false }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const tasksByColumnMap = useMemo(() => {
      const map: Record<string, Task[]> = {};
      for (const task of tasks) {
        if (!map[task.columnId]) {
          map[task.columnId] = [];
        }
        map[task.columnId].push(task);
      }
      return map;
    }, [tasks]);

    // 🧱 מקרה שבו הלוח ריק מעמודות
    if (columns.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            my: 4,
            borderRadius: "16px",
            border: "2px dashed",
            borderColor: theme.palette.divider,
            bgcolor: theme.palette.action.hover,
            textAlign: "center",
            gap: 1.5,
          }}
        >
          <ViewColumnOutlinedIcon
            sx={{
              fontSize: 48,
              color: theme.palette.text.secondary,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            אין עמודות בלוח זה עדיין
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", maxWidth: 360 }}
          >
            {canEdit
              ? 'לחץ על "עמודה חדשה" כדי להתחיל לארגן את המשימות בלוח.'
              : "אין עמודות זמינות לצפייה בלוח זה כרגע."}
          </Typography>

          {/* ✏️ כפתור הוספת עמודה - מוצג רק למי שמורשה לערוך */}
          {canEdit && onAddColumn && (
            <Button
              variant="outlined"
              size="small"
              onClick={onAddColumn}
              startIcon={<AddRoundedIcon />}
              sx={{ mt: 1, borderRadius: "10px", fontWeight: 600 }}
            >
              הוספת עמודה ראשונה
            </Button>
          )}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 2,
          pt: 0.5,
          px: 0.5,
          alignItems: "flex-start",
          flexGrow: 1,
          width: "100%",
          "&::-webkit-scrollbar": { height: "8px" },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark
              ? alpha(theme.palette.common.white, 0.15)
              : alpha(theme.palette.common.black, 0.15),
            borderRadius: "10px",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: isDark
                ? alpha(theme.palette.common.white, 0.28)
                : alpha(theme.palette.common.black, 0.28),
            },
          },
        }}
      >
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              minWidth: { xs: 280, sm: 320 },
              maxWidth: { xs: 280, sm: 340 },
              flexShrink: 0,
            }}
          >
            <Column
              column={column}
              tasks={tasksByColumnMap[column.id] || []}
              columns={columns}
              canEdit={canEdit} // 👈 שרשור לרכיב Column
            />
          </Box>
        ))}
      </Box>
    );
  },
);

BoardColumnsList.displayName = "BoardColumnsList";
