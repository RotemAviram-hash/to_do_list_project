import React, { useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import type { Column as ColumnType } from "../../../Column/models/Column";
import type { Task } from "../../../Task/models/Task";
import Column from "../../../Column/components/Column";

interface BoardColumnsListProps {
  columns: ColumnType[];
  tasks: Task[];
}

// ⚡ אופטימיזציה: עטיפה ב-React.memo
export const BoardColumnsList: React.FC<BoardColumnsListProps> = React.memo(
  ({ columns, tasks }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // ⚡ אופטימיזציה קריטית: מילון משימות לפי columnId בסיבוכיות O(N)
    // מונע ביצוע tasks.filter בלולאה עבור כל עמודה ועמודה בכל רנדור!
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

    return (
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 2,
          pt: 0.5,
          px: 0.5,
          alignItems: "flex-start",
          flexGrow: 1,
          "&::-webkit-scrollbar": { height: "8px" },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.15)",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(0, 0, 0, 0.25)",
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
            />
          </Box>
        ))}
      </Box>
    );
  },
);

BoardColumnsList.displayName = "BoardColumnsList";
