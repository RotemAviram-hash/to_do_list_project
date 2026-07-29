import { Routes, Route } from "react-router-dom";
import ROUTES from "./routes";
import ProtectedRoute from "./ProtectedRoute"; // התאימי את נתיב הקובץ

import HeroPage from "../pages/HeroPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import TaskPage from "../pages/TaskPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import WorkspacePage from "../pages/WorkspacePage";
import PageNotFound from "../pages/PageNotFound";
import { CalendarView } from "../pages/CalendarView";

function Router() {
  return (
    <Routes>
      {/* ========================================== */}
      {/* עמודים ציבוריים (פתוחים לכולם) */}
      {/* ========================================== */}
      <Route path={ROUTES.HOME} element={<HeroPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.TASK_PAGE + ":id"} element={<TaskPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* ========================================== */}
      {/* WORKSPACE - מעביר ל-LOGIN אם לא מחוברים */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute redirectTo={ROUTES.LOGIN} />}>
        <Route path={ROUTES.WORKSPACE} element={<WorkspacePage />} />
      </Route>

      {/* ========================================== */}
      {/* עמודים מיוחדים - מעבירים ל-HOME אם לא מחוברים */}
      {/* ========================================== */}
      <Route element={<ProtectedRoute redirectTo={ROUTES.HOME} />}>
        <Route path={ROUTES.CALENDAR} element={<CalendarView />} />
        <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />
      </Route>

      {/* עמוד 404 */}
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
