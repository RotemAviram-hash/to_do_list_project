import { useState, useEffect, useCallback } from "react";
import * as columnService from "../services/columnsService";
import type { Column } from "../models/Column";
import { useUser } from "../../User/hooks/useUser";

// טיפוס עזר לנתונים הנדרשים ביצירת עמודה
type NewColumnInput = Omit<Column, "id" | "createdAt" | "updatedAt">;

export function useColumns(boardId?: string) {
  const { user } = useUser();
  const userId = user?.id || "";

  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message || "שגיאה בטעינת העמודות");
        setLoading(false);
      },
      boardId,
    );

    return () => unsubscribe();
  }, [boardId]);

  // 2. הוספת עמודה חדשה - 100% Type-Safe ללא as any
  const addColumn = useCallback(
    async (columnData: Partial<NewColumnInput> & { title: string }) => {
      try {
        setError(null);

        const dataToSave: NewColumnInput = {
          theme: "blue",
          createdBy: userId || "guest",
          order: columns.length,
          boardId: boardId || "",
          ...columnData,
        };

        return await columnService.addNewColumn(dataToSave);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה בהוספת העמודה";
        console.error("Failed to add column:", err);
        setError(message);
        throw err;
      }
    },
    [boardId, columns.length, userId],
  );

  // 3. עדכון עמודה קיימת
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
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה בעדכון העמודה";
        console.error("Failed to update column:", err);
        setColumns(previousColumns); // Rollback
        setError(message);
        throw err;
      }
    },
    [],
  );

  // 4. 🟢 מחיקת עמודה - מקבלת רק ID! ה-boardId נלקח ישירות מההוק
  const deleteColumn = useCallback(
    async (id: string) => {
      if (!boardId) {
        throw new Error("חובה לספק boardId למחיקת עמודה");
      }

      let previousColumns: Column[] = [];

      // עדכון אופטימיסטי ב-UI
      setColumns((prev) => {
        previousColumns = prev;
        return prev.filter((col) => col.id !== id);
      });

      try {
        setError(null);
        await columnService.removeColumn(id, boardId);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "שגיאה במחיקת העמודה";
        console.error("Failed to delete column:", err);
        setColumns(previousColumns); // Rollback במקרה של שגיאה
        setError(message);
        throw err;
      }
    },
    [boardId],
  );

  // 5. שינוי סדר העמודות
  const reorderColumns = useCallback(async (newOrderedColumns: Column[]) => {
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
    reorderColumns,
  };
}
