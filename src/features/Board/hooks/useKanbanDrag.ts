import { useCallback, useRef, useEffect } from "react";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../../Task/models/Task";
import { useSnack } from "../../../providers/SnackProvider";

interface UseKanbanDragProps {
  columns: Column[];
  tasks: Task[];
  moveTaskToColumn: (taskId: string, targetColumnId: string) => Promise<void>;
  reorderColumns: (newColumns: Column[]) => Promise<void>;
}

export function useKanbanDrag({
  columns,
  tasks,
  moveTaskToColumn,
  reorderColumns,
}: UseKanbanDragProps) {
  const { showError } = useSnack();

  // ⚡ אופטימיזציית עומק: שמירת ערכים מעודכנים ב-Ref
  // זה שומר על הפונקציה handleDragEnd יציבה לחלוטין בזיכרון (Zero Re-creations)
  const columnsRef = useRef(columns);
  const tasksRef = useRef(tasks);

  useEffect(() => {
    columnsRef.current = columns;
    tasksRef.current = tasks;
  }, [columns, tasks]);

  const handleDragEnd = useCallback(
    async (event: any) => {
      if (event.canceled) return;

      const currentColumns = columnsRef.current;
      const currentTasks = tasksRef.current;

      const sourceId = event.operation.source?.id
        ? String(event.operation.source.id)
        : null;
      const targetId = event.operation.target?.id
        ? String(event.operation.target.id)
        : null;

      if (!sourceId || !targetId || sourceId === targetId) return;

      // ⚡ O(1) Lookup עבור בדיקת עמודות
      const columnIdsSet = new Set(currentColumns.map((c) => String(c.id)));

      try {
        // ----------------------------------------------------
        // תרחיש א': גרירת עמודה (Column Reordering)
        // ----------------------------------------------------
        if (columnIdsSet.has(sourceId) && columnIdsSet.has(targetId)) {
          const oldIndex = currentColumns.findIndex(
            (c) => String(c.id) === sourceId,
          );
          const newIndex = currentColumns.findIndex(
            (c) => String(c.id) === targetId,
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            const updatedColumns = [...currentColumns];
            const [movedColumn] = updatedColumns.splice(oldIndex, 1);
            updatedColumns.splice(newIndex, 0, movedColumn);

            await reorderColumns(updatedColumns);
          }
          return;
        }

        // ----------------------------------------------------
        // תרחיש ב': גרירת משימה (Task Movement)
        // ----------------------------------------------------
        let targetColumnId: string | undefined;

        if (columnIdsSet.has(targetId)) {
          targetColumnId = targetId;
        } else {
          const targetTask = currentTasks.find(
            (t) => String(t.id) === targetId,
          );
          targetColumnId = targetTask?.columnId;
        }

        if (!targetColumnId) return;

        const currentTask = currentTasks.find((t) => String(t.id) === sourceId);
        if (currentTask && String(currentTask.columnId) !== targetColumnId) {
          await moveTaskToColumn(sourceId, targetColumnId);
        }
      } catch (err: any) {
        console.error("❌ Drag operation failed:", err);
        showError(err.message || "שגיאה בעדכון מיקום הנגרר");
      }
    },
    [moveTaskToColumn, reorderColumns, showError], // ⚡ תלויות יציבות בלבד! לא נבנית מחדש לעולם בעת שינוי משימה
  );

  return {
    handleDragEnd,
  };
}
