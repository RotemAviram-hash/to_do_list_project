import React, { memo } from "react";
import { Paper } from "@mui/material";
import { useDroppable } from "@dnd-kit/react";

// Sub-components
import { ColumnHeader } from "./ColumnHeader";
import { ColumnDropZone } from "./ColumnDropZone";

// Types
import type { Column, ColumnTheme } from "../models/Column";
import type { Task } from "../../Task/models/Task";

// Hooks
import { useColumns } from "../hooks/useColumns";
import { useTasks } from "../../Task/hooks/useTasks";

interface ColumnProps {
  column: Column;
  tasks: Task[];
  columns: Column[];
  onOpenAddTaskModal?: (columnId: string) => void;
}

function Column({ tasks, columns, column, onOpenAddTaskModal }: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id: column.id });
  const { updateColumn, deleteColumn } = useColumns(column.boardId);
  const { addTask } = useTasks();

  // טיפול בהוספת משימה לעמודה הזו
  const handleAddTask = async (columnId: string) => {
    if (onOpenAddTaskModal) {
      onOpenAddTaskModal(columnId);
    } else {
      // הוספת משימה דיפולטיבית מהירה במידה ואין מודאל
      await addTask({
        title: "משימה חדשה",
        columnId: columnId,
        boardId: column.boardId,
        createdAt: new Date().toISOString(),
      } as any);
    }
  };

  // טיפול בשינוי Theme בעמודה
  const handleThemeChange = async (columnId: string, theme: ColumnTheme) => {
    await updateColumn(columnId, { theme });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 290,
        maxWidth: 320,
        maxHeight: "85vh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "action.hover",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isDropTarget ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        boxShadow: isDropTarget ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        onEditColumn={updateColumn}
        onDeleteColumn={deleteColumn}
        onAddTask={handleAddTask}
        onThemeChange={handleThemeChange}
      />

      <ColumnDropZone dropRef={ref} tasks={tasks} columns={columns} />
    </Paper>
  );
}

export default memo(Column);
