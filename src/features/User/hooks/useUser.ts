import { useContext } from "react";
import { UserContext, type UserContextType } from "../providers/UserProvider";

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
