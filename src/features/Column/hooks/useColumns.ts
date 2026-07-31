import { useState, useEffect, useCallback, useRef } from "react";
import * as columnService from "../services/columnsService";
import type { Column } from "../models/Column";
import { useUser } from "../../User/hooks/useUser";
import { useSnack } from "../../../providers/SnackProvider"; // ⚡ 1. יבוא ה-Snack Hook

// טיפוס עזר לנתונים הנדרשים ביצירת עמודה
type NewColumnInput = Omit<Column, "id" | "createdAt" | "updatedAt">;

export function useColumns(boardId?: string) {
  const { user } = useUser();
  const userId = user?.id || "";

  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ⚡ 2. שליפת פונקציות ה-Snack
  const { showSuccess, showError } = useSnack();

  // ⚡ אופטימיזציה: שמירת הרפרנס של העמודות כדי למנוע יצירה מחדש של פונקציות
  const columnsRef = useRef(columns);
  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  // 1. האזנה בזמן אמת לשינויים בעמודות
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = columnService.listenToColumns(
      (updatedColumns) => {
        setColumns(updatedColumns);
        setLoading(false);
      },
      (err: Error) => {
        const message = err.message || "שגיאה בטעינת העמודות";
        setError(message);
        showError(message); // ⚡ חיווי אדום במקרה של שגיאת התחברות/הרשאות
        setLoading(false);
      },
      boardId,
    );

    return () => unsubscribe();
  }, [boardId, showError]);

  // 2. הוספת עמודה חדשה - 100% Type-Safe + יציבות בזיכרון
  const addColumn = useCallback(
    async (columnData: Partial<NewColumnInput> & { title: string }) => {
      try {
        setError(null);

        const dataToSave: NewColumnInput = {
          theme: "blue",
          createdBy: userId || "guest",
          order: columnsRef.current.length, // ⚡ שימוש ב-Ref מונע re-render של הפונקציה!
          boardId: boardId || "",
          ...columnData,
        };

        const newColumnId = await columnService.addNewColumn(dataToSave);
        showSuccess(`העמודה "${columnData.title}" נוצרה בהצלחה!`); // ⚡ חיווי הצלחה
        return newColumnId;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה בהוספת העמודה";
        console.error("Failed to add column:", err);
        setError(message);
        showError(message); // ⚡ חיווי שגיאה
        throw err;
      }
    },
    [boardId, userId, showSuccess, showError], // ⚡ תלויות יציבות! הפונקציה לא משתנה בשינוי אורך המערך
  );

  // 3. עדכון עמודה קיימת (Optimistic UI)
  const updateColumn = useCallback(
    async (id: string, updatedFields: Partial<Column>) => {
      let previousColumns: Column[] = [];

      setColumns((prev) => {
        previousColumns = prev;
        return prev.map((col) =>
          col.id === id ? { ...col, ...updatedFields } : col,
        );
      });

      try {
        setError(null);
        await columnService.editColumn(id, updatedFields);
        showSuccess("העמודה עודכנה בהצלחה"); // ⚡ חיווי הצלחה
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה בעדכון העמודה";
        console.error("Failed to update column:", err);
        setColumns(previousColumns); // Rollback
        setError(message);
        showError(message); // ⚡ חיווי שגיאה במקרה של ביטול
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 4. מחיקת עמודה (Optimistic UI)
  const deleteColumn = useCallback(
    async (id: string, hasTasks: boolean = false) => {
      if (!boardId) {
        const msg = "חובה לספק boardId למחיקת עמודה";
        showError(msg);
        throw new Error(msg);
      }

      // ⚡ 1. עצירה מיידית ברמת ה-UI - ללא קריאת שרת וללא Optimistic Delete מיותר!
      if (hasTasks) {
        const msg =
          "לא ניתן למחוק עמודה שמכילה משימות. יש למחוק או להעביר אותן תחילה!";
        showError(msg);
        return;
      }

      let previousColumns: Column[] = [];

      // 2. Optimistic UI - העלמה מיידית מהמסך רק אם העמודה באמת ריקה
      setColumns((prev) => {
        previousColumns = prev;
        return prev.filter((col) => col.id !== id);
      });

      try {
        setError(null);
        await columnService.removeColumn(id, boardId);
        showSuccess("העמודה נמחקה בהצלחה");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה במחיקת העמודה";
        console.error("Failed to delete column:", err);
        setColumns(previousColumns); // Rollback במקרה של שגיאת תקשורת
        setError(message);
        showError(message);
        throw err;
      }
    },
    [boardId, showSuccess, showError],
  );

  // 5. שינוי סדר העמודות (Optimistic UI)
  const reorderColumns = useCallback(
    async (newOrderedColumns: Column[]) => {
      let previousColumns: Column[] = [];

      setColumns((prev) => {
        previousColumns = prev;
        return newOrderedColumns;
      });

      try {
        setError(null);

        const updatePromises = newOrderedColumns.map((col, index) => {
          if (col.order !== index) {
            return columnService.editColumn(col.id, { order: index });
          }
          return Promise.resolve();
        });

        await Promise.all(updatePromises);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה בסידור מחדש של העמודות";
        console.error("Failed to reorder columns:", err);
        setColumns(previousColumns); // Rollback
        setError(message);
        showError(message); // ⚡ חיווי שגיאה בלבד (שומר על שקט בגרירות תקינות)
        throw err;
      }
    },
    [showError],
  );

  return {
    columns,
    loading,
    error,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
  };
}
