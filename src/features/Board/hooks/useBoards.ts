import { useState, useEffect, useCallback } from "react";
import * as boardService from "../services/boardsService";
import type { Board } from "../models/Board";
import { useSnack } from "../../../providers/SnackProvider"; // ⚡ 1. יבוא ה-Snack Hook

export function useBoards(userId?: string) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ⚡ 2. שליפת פונקציות ה-Snack
  const { showSuccess, showError } = useSnack();

  // 1. האזנה לשינויים בזמן אמת
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = boardService.listenToBoards(
      (updatedBoards) => {
        setBoards(updatedBoards);

        // 💡 שימוש ב-Functional Updater למניעת Stale Closure
        setActiveBoardId((currentActiveId) => {
          const stillExists = updatedBoards.some(
            (b) => b.id === currentActiveId,
          );
          if (stillExists) {
            return currentActiveId;
          }
          return updatedBoards.length > 0 ? updatedBoards[0].id : null;
        });

        setLoading(false);
      },
      (err) => {
        const message = err.message || "שגיאה בטעינת הלוחות";
        setError(message);
        showError(message); // ⚡ התראה בלייב על שגיאת תקשורת/הרשאות
        setLoading(false);
      },
      userId,
    );

    return () => unsubscribe();
  }, [userId, showError]);

  // 2. הוספת לוח חדש
  const addBoard = useCallback(
    async (boardData: Omit<Board, "id" | "createdAt" | "updatedAt">) => {
      try {
        setError(null);
        const newBoardId = await boardService.addNewBoard(boardData);

        setActiveBoardId(newBoardId);
        showSuccess(`הלוח "${boardData.title}" נוצר בהצלחה!`); // ⚡ חיווי הצלחה
        return newBoardId;
      } catch (err: any) {
        console.error("Failed to add board:", err);
        const message = err.message || "שגיאה בהוספת הלוח";
        setError(message);
        showError(message); // ⚡ חיווי שגיאה
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 3. עדכון לוח קיים (Optimistic UI)
  const updateBoard = useCallback(
    async (id: string, updatedFields: Partial<Board>) => {
      let previousBoards: Board[] = [];

      setBoards((prev) => {
        previousBoards = prev;
        return prev.map((board) =>
          board.id === id ? { ...board, ...updatedFields } : board,
        );
      });

      try {
        setError(null);
        await boardService.editBoard(id, updatedFields);
        showSuccess("הלוח עודכן בהצלחה"); // ⚡ חיווי הצלחה
      } catch (err: any) {
        console.error("Failed to update board:", err);
        setBoards(previousBoards); // Rollback מקומי
        const message = err.message || "שגיאה בעדכון הלוח";
        setError(message);
        showError(message); // ⚡ חיווי שגיאה במקרה של ביטול השינויים
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 4. מחיקת לוח (Optimistic UI)

  const deleteBoard = useCallback(
    async (boardId: string, hasColumns: boolean) => {
      // ⚡ 1. עצירה מיידית ברמת ה-UI - ללא קריאת שרת בכלל!
      if (hasColumns) {
        showError("לא ניתן למחוק לוח שמכיל עמודות. יש למחוק אותן תחילה!");
        return;
      }

      // 2. רק אם הלוח ריק - ממשיכים ל-Optimistic Delete ולמחיקה ב-Firebase
      setBoards((prev) => prev.filter((board) => board.id !== boardId));

      try {
        await boardService.removeBoard(boardId);
        showSuccess("הלוח נמחק בהצלחה");
      } catch (err: any) {
        // טיפול בשגיאות רשת כלליות בלבד
        showError("שגיאה בתקשורת מול השרת");
      }
    },
    [showSuccess, showError],
  );

  // אובייקט הלוח הפעיל הנוכחי לשליפה קלה ב-UI
  const activeBoard = boards.find((b) => b.id === activeBoardId) || null;

  return {
    boards,
    activeBoardId,
    activeBoard,
    setActiveBoardId,
    loading,
    error,
    addBoard,
    updateBoard,
    deleteBoard,
  };
}
