import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../../../config/firebase";

import type { UserProfile } from "../models/User";
import { userRepository } from "../repositories/userRepository";

export const authService = {
  /**
   * הרשמת משתמש חדש: יוצר משתמש ב-Auth ואז שומר את הפרופיל ב-DB
   */
  async register(
    email: string,
    pass: string,
    extraData: Omit<UserProfile, "id" | "email">,
  ): Promise<UserProfile> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass,
    );
    const uid = userCredential.user.uid;

    const newProfile: UserProfile = {
      id: uid,
      email,
      ...extraData,
    };

    await userRepository.create(newProfile);
    return newProfile;
  },

  /**
   * התחברות למערכת
   */
  async login(email: string, pass: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, pass);
  },

  /**
   * התנתקות מהמערכת
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * 🎧 האזנה משולבת: מזהה התחברות/התנתקות ב-Auth ופותחת מאזין בלייב ל-Firestore
   */
  subscribeToAuthChanges(callback: (userProfile: UserProfile | null) => void) {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        // ניקוי המאזין הישן במידה והיה משתמש קודם
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
          unsubscribeFirestore = null;
        }

        if (!firebaseUser) {
          callback(null);
          return;
        }

        // פתיחת מאזין בזמן אמת לשינויים ב-Firestore
        unsubscribeFirestore = userRepository.subscribeToUser(
          firebaseUser.uid,
          (profile) => {
            if (profile) {
              callback(profile);
            } else {
              // מקרה קצה: המסמך עדיין לא נכתב ב-DB
              callback({
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "משתמש",
              });
            }
          },
        );
      },
    );

    // מחזירים פונקציה המנקה את שני המאזינים (Auth + Firestore)
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  },
};
