import React from "react";

import {
  Paper,
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { useDroppable } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { TaskCard } from "../Task/TaskCard";

import type { Column, Task } from "../WorkspaceTypes";

import { DraggableTaskCard } from "../Task/DraggableTaskCard";

interface BoardColumnProps {
  column: Column;

  tasks: Task[];

  isDarkMode: boolean;

  onToggleSave: (id: string) => void;
}

export const ColumnBoard: React.FC<BoardColumnProps> = ({
  column,

  tasks,

  isDarkMode,

  onToggleSave,
}) => {
  // הגדרת העמודה כאיזור שחרור (Droppable)

  const { setNodeRef } = useDroppable({ id: column.id });

  // מיפוי מזהי המשימות עבור קונטקסט המיון של dnd-kit

  const taskIds = tasks.map((t) => t.id);

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: isDarkMode ? "action.hover" : column.color,

        borderColor: column.borderColor,

        borderRadius: 4,

        p: 2.5,

        boxShadow: "0px 4px 20px rgba(0,0,0,0.015)",

        width: "100%",

        display: "flex",

        flexDirection: "column",

        minHeight: "550px", // גובה מינימלי משופר לנראות ונוחות גרירה

        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* כותרת העמודה ופעולות מהירות */}

      <Box
        sx={{
          display: "flex",

          flexDirection: "column",

          gap: 1.5,

          mb: 2.5,

          pb: 1.5,

          borderBottom: "1px solid",

          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            width: "100%",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {column.title}
          </Typography>

          <Chip
            label={tasks.length}
            size="small"
            sx={{
              bgcolor: "background.paper",

              border: "1px solid",

              borderColor: isDarkMode ? "divider" : column.borderColor,

              fontWeight: 700,
            }}
          />
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
        >
          <Tooltip title="הוספת משימה">
            <IconButton
              size="small"
              onClick={() => console.log("הוספה")}
              sx={{ p: 0.5 }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="מחיקת עמודה">
            <IconButton
              size="small"
              onClick={() => console.log("מחיקה")}
              sx={{ p: 0.5 }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* רשימת המשימות הממוינת */}

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Box
          ref={setNodeRef} // חיבור ה-Ref של ה-droppable למכל המשימות הפנימי
          sx={{
            flexGrow: 1,

            display: "flex",

            flexDirection: "column",

            gap: 2,

            minHeight: "100%", // תופס את כל שטח העמודה הנותר לגרירה קלה
          }}
        >
          {tasks.map((task) => (
            <DraggableTaskCard key={task.id} id={task.id}>
              <TaskCard
                task={task}
                borderColor={column.borderColor}
                isDarkMode={isDarkMode}
                onToggleSave={onToggleSave}
              />
            </DraggableTaskCard>
          ))}
        </Box>
      </SortableContext>
    </Paper>
  );
};
