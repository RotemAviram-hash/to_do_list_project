import type { ReactNode } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <Header />

      <Main>{children}</Main>

      <Footer />
    </>
  );
}

export default Layout;
