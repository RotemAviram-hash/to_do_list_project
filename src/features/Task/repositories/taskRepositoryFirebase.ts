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
  type Unsubscribe,
  QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { Task } from "../models/Task";

const TASKS_COLLECTION = "tasks";
const tasksCollectionRef = collection(db, TASKS_COLLECTION);

/**
 * 1. הרשמה לקבלת עדכונים בזמן אמת למשתמש ספציפי
 */
export const subscribeToTasksRepo = (
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe => {
  // שאילתה שמסננת משימות שהמשתמש יצר או משויך אליהן
  // (ניתן להתאים את התנאי לפי המבנה המדויק ב-Firestore, למשל where("userId", "==", userId))
  const q = query(
    tasksCollectionRef,
    or(where("createdBy", "==", userId), where("assigneeId", "==", userId)),
  );

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Task[];

      onUpdate(tasks);
    },
    (error) => {
      console.error("Error listening to user tasks collection:", error);
      if (onError) onError(error);
    },
  );
};

/**
 * 2. שליפת משימה בודדת לפי ID
 */
export const getTaskByIdRepo = async (id: string): Promise<Task | null> => {
  try {
    const taskDocRef = doc(db, TASKS_COLLECTION, id);
    const docSnap = await getDoc(taskDocRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Task;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * 3. הוספת משימה חדשה
 */
export const addTaskRepo = async (task: Omit<Task, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(tasksCollectionRef, task);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task to DB:", error);
    throw error;
  }
};

/**
 * 4. עדכון משימה קיימת
 */
export const updateTaskRepo = async (
  id: string,
  updatedData: Partial<Task>,
): Promise<void> => {
  try {
    const { id: _, ...dataToUpdate } = updatedData;

    const cleanData = Object.fromEntries(
      Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined),
    );

    const taskDocRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(taskDocRef, cleanData);
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

/**
 * 5. מחיקת משימה
 */
export const deleteTaskRepo = async (id: string): Promise<void> => {
  try {
    const taskDocRef = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(taskDocRef);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};
