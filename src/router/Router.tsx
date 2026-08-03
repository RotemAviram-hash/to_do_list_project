import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import ROUTES from "./routes";
import ProtectedRoute from "./ProtectedRoute";

// טעינה דינמית של העמודים במידת הצורך
const HeroPage = lazy(() => import("../pages/HeroPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const WorkspacePage = lazy(() => import("../pages/WorkspacePage"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));

// רכיב טעינה קטן וממורכז בזמן שהעמוד יורד
const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress />
  </Box>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}

export default Router;
