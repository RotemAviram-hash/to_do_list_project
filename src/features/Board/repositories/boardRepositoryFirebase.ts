// src/features/Board/repositories/boardRepositoryFirebase.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  or,
  arrayUnion,
  arrayRemove,
  deleteField,
  increment,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { Board, BoardMemberRole } from "../models/Board";

const BOARDS_COLLECTION = "boards";
const boardsCollectionRef = collection(db, BOARDS_COLLECTION);

/**
 * 1. הרשמה לקבלת הלוחות בזמן אמת (נוצרו ע"י המשתמש OR שהוא חבר בהם)
 */
export const subscribeToBoardsRepo = (
  onUpdate: (boards: Board[]) => void,
  onError?: (error: Error) => void,
  userId?: string,
): Unsubscribe => {
  let q = query(boardsCollectionRef);

  if (userId) {
    q = query(
      boardsCollectionRef,
      or(
        where("createdBy", "==", userId),
        where("memberIds", "array-contains", userId),
      ),
    );
  }

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const boards: Board[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Board[];

      onUpdate(boards);
    },
    (error) => {
      console.error("Error listening to boards collection:", error);
      if (onError) onError(error);
    },
  );
};

/**
 * 2. שליפת לוח בודד לפי ID
 */
export const getBoardByIdRepo = async (id: string): Promise<Board | null> => {
  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, id);
    const docSnap = await getDoc(boardDocRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Board;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching board with ID ${id}:`, error);
    throw error;
  }
};

/**
 * 3. הוספת לוח חדש
 */
export const addBoardRepo = async (
  boardData: Omit<Board, "id">,
): Promise<string> => {
  // ניקוי ושליפת מזהה ה יוצר
  const creatorId = boardData.createdBy?.trim();

  // 1. יצירת אובייקט members חדש ונקי
  const initialMembers: Record<string, BoardMemberRole> = {
    ...(boardData.members || {}),
  };

  // 2. הבטחה שיוצר הלוח רשום מפורשות כ-owner בלבד אם ה-ID תקין
  if (creatorId) {
    initialMembers[creatorId] = "owner";
  } else {
    console.warn("⚠️ addBoardRepo: createdBy is missing or empty.");
  }

  // 3. יצירת מערך memberIds ייחודי
  const initialMemberIds = Array.from(
    new Set([
      ...(boardData.memberIds || []),
      ...(creatorId ? [creatorId] : []),
    ]),
  );

  // 4. ניקוי שדות undefined מכלל האובייקט
  const cleanBoardData = Object.fromEntries(
    Object.entries({
      ...boardData,
      members: initialMembers,
      memberIds: initialMemberIds,
    }).filter(([_, value]) => value !== undefined),
  );

  // 5. שמירה ב-Firestore
  const docRef = await addDoc(boardsCollectionRef, cleanBoardData);
  return docRef.id;
};

/**
 * 4. עדכון לוח קיים
 */
export const updateBoardRepo = async (
  id: string,
  updatedData: Partial<Board>,
): Promise<void> => {
  try {
    const { id: _, ...dataToUpdate } = updatedData;

    // ניקוי ערכי undefined לפני שליחה ל-Firestore
    const cleanData = Object.fromEntries(
      Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined),
    );

    const boardDocRef = doc(db, BOARDS_COLLECTION, id);
    await updateDoc(boardDocRef, cleanData);
  } catch (error) {
    console.error(`Error updating board ${id}:`, error);
    throw error;
  }
};

/**
 * 5. מחיקת לוח
 */
export const deleteBoardRepo = async (id: string): Promise<void> => {
  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, id);
    await deleteDoc(boardDocRef);
  } catch (error) {
    console.error(`Error deleting board ${id}:`, error);
    throw error;
  }
};

/**
 * 6. עדכון אטומי של ספירת העמודות בלוח (+1 או -1)
 */
export const incrementColumnCountRepo = async (
  boardId: string,
  delta: number,
): Promise<void> => {
  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, boardId);
    await updateDoc(boardDocRef, {
      columnCount: increment(delta),
    });
  } catch (error) {
    console.error(`Error updating column count for board ${boardId}:`, error);
    throw error;
  }
};

/**
 * 7. הוספת / עדכון משתמש בלוח (כולל הגדרת תפקיד)
 */
export const addMemberToBoardRepo = async (
  boardId: string,
  targetUserId: string,
  role: BoardMemberRole = "editor",
): Promise<void> => {
  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, boardId);

    await updateDoc(boardDocRef, {
      memberIds: arrayUnion(targetUserId),
      [`members.${targetUserId}`]: role || "editor",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      `Error adding member ${targetUserId} to board ${boardId}:`,
      error,
    );
    throw error;
  }
};

/**
 * 8. הסרת משתמש מלוח
 */
export const removeMemberFromBoardRepo = async (
  boardId: string,
  targetUserId: string,
): Promise<void> => {
  try {
    const boardDocRef = doc(db, BOARDS_COLLECTION, boardId);

    await updateDoc(boardDocRef, {
      memberIds: arrayRemove(targetUserId),
      [`members.${targetUserId}`]: deleteField(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      `Error removing member ${targetUserId} from board ${boardId}:`,
      error,
    );
    throw error;
  }
};
