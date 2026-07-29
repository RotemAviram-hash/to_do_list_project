import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { UserProfile } from "../models/User";

export interface UsersContextType {
  users: UserProfile[]; // 👈 תמיכה לאחור בסינון/מיפוי ברכיבים קיימים
  usersMap: Record<string, UserProfile>;
  getUserName: (userId?: string) => string;
  loading: boolean;
}

export const UsersContext = createContext<UsersContextType | undefined>(
  undefined,
);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersMap, setUsersMap] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🎧 האזנה בלייב לכל המשתמשים ב-Firestore
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersData: Record<string, UserProfile> = {};

        snapshot.docs.forEach((doc) => {
          usersData[doc.id] = { id: doc.id, ...doc.data() } as UserProfile;
        });

        setUsersMap(usersData);
        setLoading(false);
      },
      (error) => {
        console.error("❌ שגיאה בהאזנה למשתמשים:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // 🟢 המרה למערך עבור רכיבים שזקוקים ל-users.map()
  const users = useMemo(() => Object.values(usersMap), [usersMap]);

  // ⚡ שליפת שם בביצועי O(1)
  const getUserName = useCallback(
    (userId?: string): string => {
      if (!userId) return "אין אחראי";
      const user = usersMap[userId];
      return user?.displayName || user?.email || userId;
    },
    [usersMap],
  );

  // ⚡ ייצוב ה-Context
  const contextValue = useMemo(
    () => ({
      users,
      usersMap,
      getUserName,
      loading,
    }),
    [users, usersMap, getUserName, loading],
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};
