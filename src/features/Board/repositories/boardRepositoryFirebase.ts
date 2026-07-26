import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
  QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import app from "../../../config/firebase";
import type { Board } from "../models/Board";

const db = getFirestore(app);
const BOARDS_COLLECTION = "boards";
const boardsCollectionRef = collection(db, BOARDS_COLLECTION);

/**
 * 1. הרשמה לקבלת הלוחות בזמן אמת (עם תמיכה אופציונלית בסינון לפי userId)
 */
export const subscribeToBoardsRepo = (
  onUpdate: (boards: Board[]) => void,
  onError?: (error: Error) => void,
  userId?: string,
): Unsubscribe => {
  let q = query(boardsCollectionRef);

  if (userId) {
    q = query(boardsCollectionRef, where("createdBy", "==", userId));
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
  try {
    const docRef = await addDoc(boardsCollectionRef, boardData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding board to DB:", error);
    throw error;
  }
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
