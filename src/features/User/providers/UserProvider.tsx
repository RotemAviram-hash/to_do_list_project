import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UserProfile } from "../models/User";
import { authService } from "../services/authService";
import { userRepository } from "../repositories/userRepository";

export interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  signup: (
    email: string,
    pass: string,
    extraData: Omit<UserProfile, "id" | "email">,
  ) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = useCallback(
    async (
      email: string,
      pass: string,
      extraData: Omit<UserProfile, "id" | "email">,
    ) => {
      await authService.register(email, pass, extraData);
    },
    [],
  );

  const login = useCallback(async (email: string, pass: string) => {
    await authService.login(email, pass);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // 🟢 כותב ל-Firestore בלבד – המאזין דואג לעדכן את ה-UI בלייב!
  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      console.log("1. updateProfile נקראה עם הנתונים:", data);

      if (!user) {
        console.error("❌ שגיאה: user ב-Store הוא null!");
        return;
      }

      try {
        const updatedFields: Partial<UserProfile> = {
          ...data,
          updatedAt: new Date().toISOString(),
        };

        console.log("2. שולח עדכון ל-Firestore עבור UID:", user.id);
        await userRepository.update(user.id, updatedFields);
        console.log("3. ✅ העדכון נשלח בהצלחה ל-Firestore!");
      } catch (error) {
        console.error("❌ שגיאה בשליחה ל-Firestore:", error);
      }
    },
    [user],
  );

  useEffect(() => {
    // 🎧 הירשמות למאזין הראשי בלייב
    const unsubscribe = authService.subscribeToAuthChanges((userProfile) => {
      setUser(userProfile);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, signup, login, logout, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};
