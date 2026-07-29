/**
 * מייצג את תפקיד המשתמש במערכת (לניהול הרשאות בעתיד)
 */
export type UserRole = "admin" | "member" | "viewer";

/**
 * המודל הראשי של פרופיל המשתמש במערכת
 */
export interface UserProfile {
  id: string; // ה-UID הייחודי שמתקבל מ-Firebase Auth
  email: string; // כתובת האימייל של המשתמש
  displayName: string; // שם תצוגה (למשל: "ישראל ישראלי")
  photoURL?: string; // קישור לתמונת פרופיל / אווטאר (אופציונלי)
  avatarColor?: string; // צבע רקע מותאם אישית לאווטאר (אופציונלי, למשל: "#f44336")
  role?: UserRole; // תפקיד במערכת (ברירת מחדל: member)
  createdAt?: string; // תאריך יצירת החשבון (ISO String)
  updatedAt?: string; // תאריך עדכון אחרון של הפרטים
}

/**
 * טיפוס קל משקל של משתמש – מעולה להצגה בכרטיסיות משימה / חברי לוח
 */
export type UserShortInfo = Pick<
  UserProfile,
  "id" | "displayName" | "photoURL" | "avatarColor"
>;
