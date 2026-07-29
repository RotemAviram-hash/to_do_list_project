import { memo, useState, useCallback } from "react";
import { Paper } from "@mui/material";
import { useDroppable } from "@dnd-kit/react";

// Sub-components
import { ColumnHeader } from "./ColumnHeader";
import { ColumnDropZone } from "./ColumnDropZone";
import { CreateTaskDialog } from "../../Task/dialogs/CreateTaskDialog";

// Types
import type { Column as ColumnType, ColumnTheme } from "../models/Column";
import type { Task } from "../../Task/models/Task";

// Hooks
import { useColumns } from "../hooks/useColumns";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  columns: ColumnType[];
  onOpenAddTaskModal?: (columnId: string) => void;
}

function Column({ tasks, columns, column, onOpenAddTaskModal }: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id: column.id });
  const { updateColumn, deleteColumn } = useColumns(column.boardId);

  // State לפתיחת וסגירת הדיאלוג
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // ⚡ אופטימיזציה: היינדלרים מיוצבים למניעת רנדורים מיותרים ברכיבי בנות
  const handleAddTask = useCallback(
    (columnId: string) => {
      if (onOpenAddTaskModal) {
        onOpenAddTaskModal(columnId);
      } else {
        setIsAddTaskOpen(true);
      }
    },
    [onOpenAddTaskModal],
  );

  const handleCloseAddTask = useCallback(() => {
    setIsAddTaskOpen(false);
  }, []);

  const handleThemeChange = useCallback(
    async (columnId: string, theme: ColumnTheme) => {
      await updateColumn(columnId, { theme });
    },
    [updateColumn],
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          minWidth: 290,
          maxWidth: 320,
          height: "100%", // 🟢 לוקח את גובה המכולה
          maxHeight: "calc(100vh - 180px)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden", // 🟢 קוטם משימות מילדות שלא יגלשו החוצה
          bgcolor: "action.hover",
          borderRadius: "16px",
          border: "1px solid",

          borderColor: isDropTarget ? "primary.main" : "divider",
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

      {/* 🟢 הוספת defaultColumnId ו-boardId פותרת את הבעיה ב-100% */}
      <CreateTaskDialog
        open={isAddTaskOpen}
        onClose={handleCloseAddTask}
        columns={columns}
        defaultColumnId={column.id}
        boardId={column.boardId}
      />
    </>
  );
}

export default memo(Column);
