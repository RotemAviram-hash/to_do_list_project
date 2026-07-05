import { Routes, Route } from "react-router-dom";
import WorkspacePage from "../pages/WorkspacePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ROUTES from "./routes";
import TaskPage from "../pages/TaskPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import PageNotFound from "../pages/PageNotFound";
import HeroPage from "../pages/HeroPage";

function Router() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HeroPage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.TASK_PAGE + ":id"} element={<TaskPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.WORKSPACE} element={<WorkspacePage />} />

      <Route path={"/*"} element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
