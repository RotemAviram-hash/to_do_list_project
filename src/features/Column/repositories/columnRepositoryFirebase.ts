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
  type Unsubscribe,
  QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { Column } from "../models/Column";

const COLUMNS_COLLECTION = "columns";
const columnsCollectionRef = collection(db, COLUMNS_COLLECTION);

/**
 * 1. הרשמה לקבלת העמודות בזמן אמת (עם תמיכה בסינון לפי boardId)
 * @param onUpdate callback שמקבל את העמודות המעודכנות
 * @param onError callback לטיפול בשגיאות
 * @param boardId פרמטר אופציונלי לסינון עמודות לפי לוח ספציפי
 */
export const subscribeToColumnsRepo = (
  onUpdate: (columns: Column[]) => void,
  onError?: (error: Error) => void,
  boardId?: string,
): Unsubscribe => {
  // בניית השאילתה - אם נשלח boardId נסנן לפיו, אחרת נביא את כולם
  let q = query(columnsCollectionRef);

  if (boardId) {
    q = query(columnsCollectionRef, where("boardId", "==", boardId));
  }

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const columns: Column[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Column[];

      onUpdate(columns);
    },
    (error) => {
      console.error("Error listening to columns collection:", error);
      if (onError) onError(error);
    },
  );
};

/**
 * 2. שליפת עמודה בודדת לפי ID
 */
export const getColumnByIdRepo = async (id: string): Promise<Column | null> => {
  try {
    const colDocRef = doc(db, COLUMNS_COLLECTION, id);
    const docSnap = await getDoc(colDocRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Column;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching column with ID ${id}:`, error);
    throw error;
  }
};

/**
 * 3. הוספת עמודה חדשה
 */
export const addColumnRepo = async (
  columnData: Omit<Column, "id">,
): Promise<string> => {
  try {
    const docRef = await addDoc(columnsCollectionRef, columnData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding column to DB:", error);
    throw error;
  }
};

/**
 * 4. עדכון עמודה קיימת (שינוי שם, שינוי מיקום order וכד')
 */
export const updateColumnRepo = async (
  id: string,
  updatedData: Partial<Column>,
): Promise<void> => {
  try {
    const { id: _, ...dataToUpdate } = updatedData;

    // ניקוי ערכי undefined לפני שליחה ל-Firestore
    const cleanData = Object.fromEntries(
      Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined),
    );

    const colDocRef = doc(db, COLUMNS_COLLECTION, id);
    await updateDoc(colDocRef, cleanData);
  } catch (error) {
    console.error(`Error updating column ${id}:`, error);
    throw error;
  }
};

/**
 * 5. מחיקת עמודה
 */
export const deleteColumnRepo = async (id: string): Promise<void> => {
  try {
    const colDocRef = doc(db, COLUMNS_COLLECTION, id);
    await deleteDoc(colDocRef);
  } catch (error) {
    console.error(`Error deleting column ${id}:`, error);
    throw error;
  }
};
