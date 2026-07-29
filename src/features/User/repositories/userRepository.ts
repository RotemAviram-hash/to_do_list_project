import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  onSnapshot, // 🟢 ייבוא ה-Listener בזמן אמת
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { UserProfile } from "../models/User";

const USERS_COLLECTION = "users";

export const userRepository = {
  /**
   * 🎧 מאזין בזמן אמת לשינויים במסמך המשתמש ב-Firestore
   */
  subscribeToUser(
    id: string,
    callback: (user: UserProfile | null) => void,
  ): () => void {
    const docRef = doc(db, USERS_COLLECTION, id);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(null);
          return;
        }

        callback({
          id: snapshot.id,
          ...(snapshot.data() as Omit<UserProfile, "id">),
        });
      },
      (error) => {
        console.error("שגיאה בהאזנה למסמך משתמש:", error);
      },
    );
  },

  /**
   * שליפת פרופיל לפי ID מ-Firestore (פעם אחת)
   */
  async getById(id: string): Promise<UserProfile | null> {
    const docRef = doc(db, USERS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<UserProfile, "id">),
    };
  },

  /**
   * יצירת מסמך משתמש חדש
   */
  async create(user: UserProfile): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(docRef, user);
  },

  /**
   * עדכון שדות בפרופיל משתמש
   */
  async update(id: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, id);

    // סינון ערכי undefined כדי למנוע קריסה ב-Firestore
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    await updateDoc(docRef, cleanData);
  },

  /**
   * שליפת כל המשתמשים במערכת
   */
  async getAll(): Promise<UserProfile[]> {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<UserProfile, "id">),
    }));
  },
};
