import { useCallback } from "react";
import type { Column } from "../../Column";
import type { Task } from "../../Task/models/Task";

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
  const handleDragEnd = useCallback(
    async (event: any) => {
      // 1. ביטול גרירה
      if (event.canceled) return;

      const sourceId = event.operation.source?.id
        ? String(event.operation.source.id)
        : null;
      const targetId = event.operation.target?.id
        ? String(event.operation.target.id)
        : null;

      if (!sourceId || !targetId || sourceId === targetId) return;

      const columnIdsSet = new Set(columns.map((c) => String(c.id)));

      // ----------------------------------------------------
      // תרחיש א': גרירת עמודה (Column Reordering)
      // ----------------------------------------------------
      if (columnIdsSet.has(sourceId) && columnIdsSet.has(targetId)) {
        const oldIndex = columns.findIndex((c) => String(c.id) === sourceId);
        const newIndex = columns.findIndex((c) => String(c.id) === targetId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const updatedColumns = [...columns];
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

      // 1. השמטה ישירות על שטח העמודה
      if (columnIdsSet.has(targetId)) {
        targetColumnId = targetId;
      } else {
        // 2. השמטה מעל משימה אחרת בתוך עמודה
        const targetTask = tasks.find((t) => String(t.id) === targetId);
        targetColumnId = targetTask?.columnId;
      }

      if (!targetColumnId) return;

      // בדיקה אם המשימה אכן שינתה עמודה
      const currentTask = tasks.find((t) => String(t.id) === sourceId);
      if (currentTask && String(currentTask.columnId) !== targetColumnId) {
        await moveTaskToColumn(sourceId, targetColumnId);
      }
    },
    [columns, tasks, moveTaskToColumn, reorderColumns],
  );

  return {
    handleDragEnd,
  };
}
