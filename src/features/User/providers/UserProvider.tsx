import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo, // 👈 1. מייבאים useMemo
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

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) {
        throw new Error("Cannot update profile: No authenticated user");
      }

      const updatedFields: Partial<UserProfile> = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await userRepository.update(user.id, updatedFields);
    },
    [user],
  );

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((userProfile) => {
      setUser(userProfile);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⚡ 2. אופטימיזציה מלאה: עטיפת אובייקט ה-Context ב-useMemo
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      updateProfile,
    }),
    [user, loading, signup, login, logout, updateProfile],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
