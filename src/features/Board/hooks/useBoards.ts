import { useState, useEffect, useCallback } from "react";
import * as boardService from "../services/boardsService";
import type { Board, BoardMemberRole } from "../models/Board";
import { useSnack } from "../../../providers/SnackProvider";

// פונקציית עזר לחילוץ הודעת שגיאה בצורה בטוחה מכל אובייקט שגיאה (unknown)
const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as Record<string, unknown>).message === "string"
  ) {
    return (err as Record<string, unknown>).message as string;
  }
  return fallback;
};

export function useBoards(userId?: string) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useSnack();

  // 1. האזנה לשינויים בזמן אמת
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = boardService.listenToBoards(
      (updatedBoards) => {
        setBoards(updatedBoards);

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
      (err: unknown) => {
        const message = getErrorMessage(err, "שגיאה בטעינת הלוחות");
        setError(message);
        showError(message);
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
        showSuccess(`הלוח "${boardData.title}" נוצר בהצלחה!`);
        return newBoardId;
      } catch (err: unknown) {
        console.error("Failed to add board:", err);
        const message = getErrorMessage(err, "שגיאה בהוספת הלוח");
        setError(message);
        showError(message);
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
        showSuccess("הלוח עודכן בהצלחה");
      } catch (err: unknown) {
        console.error("Failed to update board:", err);
        setBoards(previousBoards);
        const message = getErrorMessage(err, "שגיאה בעדכון הלוח");
        setError(message);
        showError(message);
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 4. מחיקת לוח (Optimistic UI)
  const deleteBoard = useCallback(
    async (boardId: string, hasColumns: boolean) => {
      if (hasColumns) {
        showError("לא ניתן למחוק לוח שמכיל עמודות. יש למחוק אותן תחילה!");
        return;
      }

      setBoards((prev) => prev.filter((board) => board.id !== boardId));

      try {
        await boardService.removeBoard(boardId);
        showSuccess("הלוח נמחק בהצלחה");
      } catch (err: unknown) {
        console.error("Failed to delete board:", err);
        showError("שגיאה בתקשורת מול השרת");
      }
    },
    [showSuccess, showError],
  );

  // 5. הוספת/עדכון משתמש בלוח (שיתוף לוח + הגדרת תפקיד)
  const addMemberToBoard = useCallback(
    async (
      boardId: string,
      targetUserId: string,
      role: BoardMemberRole = "editor",
    ) => {
      try {
        setError(null);
        await boardService.addMemberToBoard(boardId, targetUserId, role);
        showSuccess("המשתמש נוסף ללוח בהצלחה!");
      } catch (err: unknown) {
        console.error("Failed to add member to board:", err);
        const message = getErrorMessage(err, "שגיאה בהוספת המשתמש ללוח");
        setError(message);
        showError(message);
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 6. הסרת משתמש מלוח
  const removeMemberFromBoard = useCallback(
    async (boardId: string, targetUserId: string) => {
      try {
        setError(null);
        await boardService.removeMemberFromBoard(boardId, targetUserId);
        showSuccess("המשתמש הוסר מהלוח בהצלחה");
      } catch (err: unknown) {
        console.error("Failed to remove member from board:", err);
        const message = getErrorMessage(err, "שגיאה בהסרת המשתמש מהלוח");
        setError(message);
        showError(message);
        throw err;
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
    addMemberToBoard,
    removeMemberFromBoard,
  };
}
