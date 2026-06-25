import {
  createContext,
  useState,
  useContext,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import app from "../config/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const UserContext = createContext<any>(null);

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const signup = useCallback(
    async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    [auth],
  );
  const login = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    [auth],
  );
  const logout = useCallback(async () => {
    await signOut(auth);
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser as any);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
