import ROUTES from "../../router/routes";
import {
  Dashboard,
  Assignment,
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
    name: "כל המשימות שלי",
    to: ROUTES.TASK_PAGE || "/boards", // מעודכן לפי ה-TASK_PAGE שראינו בראוטר
    icon: <Assignment />,
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
