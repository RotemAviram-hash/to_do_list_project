import { Routes, Route } from "react-router-dom";
import ROUTES from "./routes";
import ProtectedRoute from "./ProtectedRoute";

import HeroPage from "../pages/HeroPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import WorkspacePage from "../pages/WorkspacePage";
import PageNotFound from "../pages/PageNotFound";
import { CalendarPage } from "../pages/CalendarPage";

function Router() {
  return (
    <Routes>
      {/* ========================================== */}
      {/* עמודים ציבוריים */}
      {/* ========================================== */}
      <Route path={ROUTES.HOME} element={<HeroPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* ========================================== */}
      {/* עמודים מוגנים - הפניה ל-LOGIN במידה ולא מחוברים */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute redirectTo={ROUTES.LOGIN} />}>
        <Route path={ROUTES.WORKSPACE} element={<WorkspacePage />} />
        <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
      </Route>

      {/* עמוד 404 - תפיסת כל הנתיבים הלא קיימים */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
