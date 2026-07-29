import { type ReactNode } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import { useUser } from "../features/User/hooks/useUser"; // וודאי שהנתיב תואם למיקום הקובץ אצלך

function Layout({ children }: { children: ReactNode }) {
  const { user } = useUser();

  return (
    <>
      {/* ה-Sidebar מוצג אך ורק כשהמשתמש מחובר */}
      {user && <Sidebar />}

      <Header />

      <Main>{children}</Main>

      <Footer />
    </>
  );
}

export default Layout;
