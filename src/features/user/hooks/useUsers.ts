import { useContext } from "react";
import { UsersContext } from "../providers/UsersProvider"; // 👈 ודאי שהנתיב לקובץ ה-Context מדויק

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
