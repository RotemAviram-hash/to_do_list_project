import React, { memo, useState } from "react";
import { Paper } from "@mui/material";
import { useDroppable } from "@dnd-kit/react";

// Sub-components
import { ColumnHeader } from "./ColumnHeader";
import { ColumnDropZone } from "./ColumnDropZone";
// יבוא של הדיאלוג המקורי שלך (ודאי שהנתיב מדויק לפי הפרויקט)
import { CreateTaskDialog } from "../../Task/dialogs/CreateTaskDialog";

// Types
import type { Column, ColumnTheme } from "../models/Column";
import type { Task } from "../../Task/models/Task";

// Hooks
import { useColumns } from "../hooks/useColumns";

interface ColumnProps {
  column: Column;
  tasks: Task[];
  columns: Column[];
  onOpenAddTaskModal?: (columnId: string) => void;
}

function Column({ tasks, columns, column, onOpenAddTaskModal }: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id: column.id });
  const { updateColumn, deleteColumn } = useColumns(column.boardId);

  // 1. State לפתיחת וסגירת הדיאלוג
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // 2. בלחיצה על פלוס - פותחים את הדיאלוג במקום ליצור משימה סתם
  const handleAddTask = (columnId: string) => {
    if (onOpenAddTaskModal) {
      onOpenAddTaskModal(columnId);
    } else {
      setIsAddTaskOpen(true);
    }
  };

  // טיפול בשינוי Theme בעמודה
  const handleThemeChange = async (columnId: string, theme: ColumnTheme) => {
    await updateColumn(columnId, { theme });
  };

  return (
    <>
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
        {/* ה-ColumnHeader המקורי והשלם שלך נשאר ללא שום שינוי! */}
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

      {/* הדיאלוג המקורי שלך נפלט פה ופתוח/סגור לפי ה-State */}
      <CreateTaskDialog
        open={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        columns={columns}
      />
    </>
  );
}

export default memo(Column);
