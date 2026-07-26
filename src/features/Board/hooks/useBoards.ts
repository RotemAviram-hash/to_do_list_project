import { useState, useEffect, useCallback } from "react";
import * as boardService from "../services/boardsService";
import type { Board } from "../models/Board";

export function useBoards(userId?: string) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. האזנה לשינויים בזמן אמת
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = boardService.listenToBoards(
      (updatedBoards) => {
        setBoards(updatedBoards);

        // אם עדיין לא נבחר לוח פעיל ויש לוחות, נבחר את הראשון כברירת מחדל
        if (updatedBoards.length > 0 && !activeBoardId) {
          setActiveBoardId(updatedBoards[0].id);
        }

        setLoading(false);
      },
      (err) => {
        setError(err.message || "שגיאה בטעינת הלוחות");
        setLoading(false);
      },
      userId,
    );

    return () => unsubscribe();
  }, [userId]);

  // 2. הוספת לוח חדש
  const addBoard = useCallback(
    async (boardData: Omit<Board, "id" | "createdAt" | "updatedAt">) => {
      try {
        setError(null);
        const newBoardId = await boardService.addNewBoard(boardData);
        // מעבירים את המשתמש ישירות ללוח החדש שנוצר
        setActiveBoardId(newBoardId);
        return newBoardId;
      } catch (err: any) {
        console.error("Failed to add board:", err);
        setError(err.message || "שגיאה בהוספת הלוח");
        throw err;
      }
    },
    [],
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
      } catch (err: any) {
        console.error("Failed to update board:", err);
        setBoards(previousBoards); // Rollback
        setError(err.message || "שגיאה בעדכון הלוח");
        throw err;
      }
    },
    [],
  );

  // 4. מחיקת לוח (Optimistic UI)
  const deleteBoard = useCallback(
    async (id: string) => {
      let previousBoards: Board[] = [];

      setBoards((prev) => {
        previousBoards = prev;
        const filtered = prev.filter((board) => board.id !== id);

        // אם מחקנו את הלוח הפעיל, נעבור ללוח הראשון שנותר (אם יש)
        if (activeBoardId === id) {
          setActiveBoardId(filtered.length > 0 ? filtered[0].id : null);
        }

        return filtered;
      });

      try {
        setError(null);
        await boardService.removeBoard(id);
      } catch (err: any) {
        console.error("Failed to delete board:", err);
        setBoards(previousBoards); // Rollback
        setError(err.message || "שגיאה במחיקת הלוח");
        throw err;
      }
    },
    [activeBoardId],
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
