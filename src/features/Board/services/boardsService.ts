import * as boardRepo from "../repositories/boardRepositoryFirebase";
import type { Board, BoardMemberRole } from "../models/Board";

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

/**
 * 5. עדכון סטטוס פרטיות של לוח (ציבורי / פרטי)
 */
export const updateBoardPrivacy = async (
  id: string,
  isPublic: boolean,
): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID לעדכון פרטיות הלוח");
  }

  return await editBoard(id, { isPublic });
};

/**
 * 6. הוספת / עדכון משתמש בלוח (שיתוף לוח)
 */
export const addMemberToBoard = async (
  boardId: string,
  targetUserId: string,
  role: BoardMemberRole = "editor",
): Promise<void> => {
  if (!boardId) {
    throw new Error("חובה לספק ID של הלוח");
  }

  if (!targetUserId) {
    throw new Error("חובה לספק ID של המשתמש להוספה");
  }

  return await boardRepo.addMemberToBoardRepo(boardId, targetUserId, role);
};

/**
 * 7. הסרת משתמש מלוח
 */
export const removeMemberFromBoard = async (
  boardId: string,
  targetUserId: string,
): Promise<void> => {
  if (!boardId) {
    throw new Error("חובה לספק ID של הלוח");
  }

  if (!targetUserId) {
    throw new Error("חובה לספק ID של המשתמש להסרה");
  }

  return await boardRepo.removeMemberFromBoardRepo(boardId, targetUserId);
};
