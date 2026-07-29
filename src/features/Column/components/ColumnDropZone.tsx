import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import DraggableTaskCard from "../../Task/components/DraggableTaskCard";
import type { Task } from "../../Task/models/Task";
import type { Column as ColumnType } from "../models/Column";

interface ColumnDropZoneProps {
  dropRef: (node: HTMLElement | null) => void;
  tasks: Task[];
  columns: ColumnType[];
}

// ⚡ אופטימיזציה: עטיפה ב-React.memo
export const ColumnDropZone: React.FC<ColumnDropZoneProps> = memo(
  ({ dropRef, tasks, columns }) => {
    return (
      <Box
        ref={dropRef}
        sx={{
          p: 2,
          pt: 1.5,
          flex: 1,
          minHeight: 0, // 🟢 קריטי! מאפשר ל-Flex להתכווץ ולייצר scrollbar במקום לחרוג
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          overflowY: "auto", // 🟢 מפעיל גלילה אנכית למשימות מרובות
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "action.disabledBackground",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            bgcolor: "action.active",
          },
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task} columns={columns} />
          ))
        ) : (
          <Box
            sx={{
              minHeight: 120, // 🟢 גובה קבוע ונקי לאזור ריק
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: "12px",
              py: 3,
              px: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.disabled",
                fontWeight: "500",
              }}
            >
              אין משימות בעמודה
            </Typography>
          </Box>
        )}
      </Box>
    );
  },
);

ColumnDropZone.displayName = "ColumnDropZone";
