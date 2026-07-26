import * as boardRepo from "../repositories/boardRepositoryFirebase";
import type { Board } from "../models/Board";

/**
 * 1. הרשמה לקבלת הלוחות בזמן אמת (ממוינים מהחדש לישן)
 */
export const listenToBoards = (
  onBoardsChange: (boards: Board[]) => void,
  onError?: (error: Error) => void,
  userId?: string,
) => {
  return boardRepo.subscribeToBoardsRepo(
    (boards) => {
      // מיון הלוחות כך שהלוח החדש ביותר מופיע ראשון
      const sortedBoards = [...boards].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      onBoardsChange(sortedBoards);
    },
    onError,
    userId,
  );
};

/**
 * 2. יצירת לוח חדש כולל ולידציה
 */
export const addNewBoard = async (
  boardData: Omit<Board, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  if (!boardData.title || boardData.title.trim() === "") {
    throw new Error("כותרת הלוח אינה יכולה להיות ריקה");
  }

  const cleanBoardData: Omit<Board, "id"> = {
    ...boardData,
    title: boardData.title.trim(),
    createdAt: new Date().toISOString(),
  };

  return await boardRepo.addBoardRepo(cleanBoardData);
};

/**
 * 3. עדכון לוח קיים
 */
export const editBoard = async (
  id: string,
  updatedFields: Partial<Board>,
): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID לעדכון הלוח");
  }

  if (updatedFields.title !== undefined && updatedFields.title.trim() === "") {
    throw new Error("כותרת הלוח אינה יכולה להיות ריקה");
  }

  const fieldsToSave: Partial<Board> = {
    ...updatedFields,
    ...(updatedFields.title && { title: updatedFields.title.trim() }),
    updatedAt: new Date().toISOString(),
  };

  return await boardRepo.updateBoardRepo(id, fieldsToSave);
};

/**
 * 4. מחיקת לוח
 */
export const removeBoard = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID למחיקת הלוח");
  }

  return await boardRepo.deleteBoardRepo(id);
};
