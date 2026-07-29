import ROUTES from "../../router/routes";
import {
  Dashboard,
  CalendarMonth,
  Settings,
  Info, // אייקון מתאים לאודות
  Mail, // אייקון מתאים לצור קשר
} from "@mui/icons-material";

export const sidebarList = [
  {
    name: "דף הבית",
    to: ROUTES.WORKSPACE,
    icon: <Dashboard />,
  },

  {
    name: "לוח שנה",
    to: ROUTES.CALENDAR || "/calendar",
    icon: <CalendarMonth />,
  },
  {
    name: "אודות",
    to: ROUTES.ABOUT, // מחובר ישירות ל-ROUTES.ABOUT
    icon: <Info />,
  },
  {
    name: "צור קשר",
    to: ROUTES.CONTACT, // מחובר ישירות ל-ROUTES.CONTACT
    icon: <Mail />,
  },
  {
    name: "הגדרות",
    to: ROUTES.SETTINGS || "/settings",
    icon: <Settings />,
  },
];
