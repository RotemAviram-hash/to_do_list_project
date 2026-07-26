import { useState, useEffect, useCallback } from "react";
import * as columnService from "../services/columnsService";
import type { Column } from "../models/Column";

export function useColumns(boardId?: string) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setuserId] = useState("משתמש זמני - לחבר את יוזר !");
  // 1. האזנה בזמן אמת לשינויים בעמודות
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = columnService.listenToColumns(
      (updatedColumns) => {
        setColumns(updatedColumns);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "שגיאה בטעינת העמודות");
        setLoading(false);
      },
      boardId,
    );

    return () => unsubscribe();
  }, [boardId]);

  // 2. הוספת עמודה חדשה
  const addColumn = useCallback(
    async (
      columnData: Partial<Omit<Column, "id" | "createdAt" | "updatedAt">> & {
        title: string;
      },
    ) => {
      try {
        setError(null);
        const dataToSave = {
          theme: "blue", // ברירת מחדל
          createdBy: userId || "guest", // ברירת מחדל אם אין משתמש
          order: columns.length,
          boardId: boardId || "",
          ...columnData, // הערכים שהועברו ידרסו את ברירות המחדל במידת הצורך
        };

        return await columnService.addNewColumn(dataToSave as any);
      } catch (err: any) {
        console.error("Failed to add column:", err);
        setError(err.message || "שגיאה בהוספת העמודה");
        throw err;
      }
    },
    [boardId, columns.length, userId],
  );

  // 3. עדכון עמודה קיימת (שם, צבע theme וכד')
  const updateColumn = useCallback(
    async (id: string, updatedFields: Partial<Column>) => {
      let previousColumns: Column[] = [];

      // עדכון אופטימיסטי ב-UI
      setColumns((prev) => {
        previousColumns = prev;
        return prev.map((col) =>
          col.id === id ? { ...col, ...updatedFields } : col,
        );
      });

      try {
        setError(null);
        await columnService.editColumn(id, updatedFields);
      } catch (err: any) {
        console.error("Failed to update column:", err);
        setColumns(previousColumns); // Rollback
        setError(err.message || "שגיאה בעדכון העמודה");
        throw err;
      }
    },
    [],
  );

  // 4. מחיקת עמודה (עם Optimistic UI)
  const deleteColumn = useCallback(async (id: string) => {
    let previousColumns: Column[] = [];

    // עדכון אופטימיסטי ב-UI
    setColumns((prev) => {
      previousColumns = prev;
      return prev.filter((col) => col.id !== id);
    });

    try {
      setError(null);
      await columnService.removeColumn(id);
    } catch (err: any) {
      console.error("Failed to delete column:", err);
      setColumns(previousColumns); // Rollback
      setError(err.message || "שגיאה במחיקת העמודה");
      throw err;
    }
  }, []);

  // 5. שינוי סדר העמודות (קריטי ל-Drag and Drop של עמודות!)
  const reorderColumns = useCallback(async (newOrderedColumns: Column[]) => {
    let previousColumns: Column[] = [];

    // עדכון אופטימיסטי מיידי של כל הסדר ב-UI
    setColumns((prev) => {
      previousColumns = prev;
      return newOrderedColumns;
    });

    try {
      setError(null);

      // עדכון ה-order של כל עמודה ב-Firebase ברקע
      const updatePromises = newOrderedColumns.map((col, index) => {
        if (col.order !== index) {
          return columnService.editColumn(col.id, { order: index });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
    } catch (err: any) {
      console.error("Failed to reorder columns:", err);
      setColumns(previousColumns); // Rollback
      setError(err.message || "שגיאה בסידור מחדש של העמודות");
      throw err;
    }
  }, []);

  return {
    columns,
    loading,
    error,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns, // פונקציה מיוחדת ושימושית מאוד ל-DND!
  };
}
