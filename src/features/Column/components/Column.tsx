import { memo, useState, useCallback, useMemo } from "react";
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

// ⚡ מיפוי מורחב ועשיר של צבעים לעמודות
const columnThemeMap: Record<
  ColumnTheme,
  { main: string; lightBg: string; darkBg: string; border: string }
> = {
  blue: {
    main: "#3b82f6",
    lightBg: "rgba(59, 130, 246, 0.03)",
    darkBg: "rgba(59, 130, 246, 0.07)",
    border: "rgba(59, 130, 246, 0.2)",
  },
  red: {
    main: "#ef4444",
    lightBg: "rgba(239, 68, 68, 0.03)",
    darkBg: "rgba(239, 68, 68, 0.07)",
    border: "rgba(239, 68, 68, 0.2)",
  },
  green: {
    main: "#22c55e",
    lightBg: "rgba(34, 197, 94, 0.03)",
    darkBg: "rgba(34, 197, 94, 0.07)",
    border: "rgba(34, 197, 94, 0.2)",
  },
  yellow: {
    main: "#eab308",
    lightBg: "rgba(234, 179, 8, 0.03)",
    darkBg: "rgba(234, 179, 8, 0.07)",
    border: "rgba(234, 179, 8, 0.2)",
  },
  purple: {
    main: "#a855f7",
    lightBg: "rgba(168, 85, 247, 0.03)",
    darkBg: "rgba(168, 85, 247, 0.07)",
    border: "rgba(168, 85, 247, 0.2)",
  },
  gray: {
    main: "#64748b",
    lightBg: "rgba(100, 116, 139, 0.03)",
    darkBg: "rgba(100, 116, 139, 0.07)",
    border: "rgba(100, 116, 139, 0.2)",
  },
  cyan: {
    main: "#06b6d4",
    lightBg: "rgba(6, 182, 212, 0.03)",
    darkBg: "rgba(6, 182, 212, 0.07)",
    border: "rgba(6, 182, 212, 0.2)",
  },
  pink: {
    main: "#ec4899",
    lightBg: "rgba(236, 72, 153, 0.03)",
    darkBg: "rgba(236, 72, 153, 0.07)",
    border: "rgba(236, 72, 153, 0.2)",
  },
  orange: {
    main: "#f97316",
    lightBg: "rgba(249, 115, 22, 0.03)",
    darkBg: "rgba(249, 115, 22, 0.07)",
    border: "rgba(249, 115, 22, 0.2)",
  },
  indigo: {
    main: "#6366f1",
    lightBg: "rgba(99, 102, 241, 0.03)",
    darkBg: "rgba(99, 102, 241, 0.07)",
    border: "rgba(99, 102, 241, 0.2)",
  },
  teal: {
    main: "#14b8a6",
    lightBg: "rgba(20, 184, 166, 0.03)",
    darkBg: "rgba(20, 184, 166, 0.07)",
    border: "rgba(20, 184, 166, 0.2)",
  },
};

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  columns: ColumnType[];
  onOpenAddTaskModal?: (columnId: string) => void;
  canEdit?: boolean; // 👈 מקבל את הרשאת העריכה (ברירת מחדל: false)
}

function Column({
  tasks,
  columns,
  column,
  onOpenAddTaskModal,
  canEdit = false,
}: ColumnProps) {
  // 🚫 המנעות מחיבור לדרג/דרופ במידה ואין הרשאת עריכה
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
    disabled: !canEdit,
  });

  const { updateColumn, deleteColumn } = useColumns(column.boardId);

  // State לפתיחת וסגירת הדיאלוג
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // ⚡ אופטימיזציה: שליפת צבעי הנושא של העמודה
  const themeColors = useMemo(() => {
    return columnThemeMap[column.theme] || columnThemeMap.blue;
  }, [column.theme]);

  // ⚡ היינדלרים
  const handleAddTask = useCallback(
    (columnId: string) => {
      if (!canEdit) return;
      if (onOpenAddTaskModal) {
        onOpenAddTaskModal(columnId);
      } else {
        setIsAddTaskOpen(true);
      }
    },
    [canEdit, onOpenAddTaskModal],
  );

  const handleCloseAddTask = useCallback(() => {
    setIsAddTaskOpen(false);
  }, []);

  const handleThemeChange = useCallback(
    async (columnId: string, theme: ColumnTheme) => {
      if (!canEdit) return;
      await updateColumn(columnId, { theme });
    },
    [canEdit, updateColumn],
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          minWidth: 290,
          maxWidth: 320,
          height: "100%",
          maxHeight: "calc(100vh - 180px)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: "16px",
          border: "1px solid",
          borderColor: isDropTarget ? themeColors.main : themeColors.border,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? themeColors.darkBg
              : themeColors.lightBg,
          transition: "border-color 0.2s ease, background-color 0.3s ease",
        }}
      >
        <ColumnHeader
          column={column}
          boardId={column.boardId}
          taskCount={tasks.length}
          onEditColumn={updateColumn}
          onDeleteColumn={deleteColumn}
          onAddTask={handleAddTask}
          onThemeChange={handleThemeChange}
          canEdit={canEdit} // 👈 שרשור ל-ColumnHeader
        />

        <ColumnDropZone
          dropRef={ref}
          tasks={tasks}
          columns={columns}
          canEdit={canEdit} // 👈 שרשור ל-ColumnDropZone (להעברה לכרטיסי המשימה)
        />
      </Paper>

      {/* דיאלוג יפתח רק אם קיימת הרשאת עריכה */}
      {canEdit && (
        <CreateTaskDialog
          open={isAddTaskOpen}
          onClose={handleCloseAddTask}
          columns={columns}
          defaultColumnId={column.id}
          boardId={column.boardId}
        />
      )}
    </>
  );
}

export default memo(Column);
