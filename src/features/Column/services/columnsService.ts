import * as columnRepo from "../repositories/columnRepositoryFirebase";
import type { Column } from "../models/Column";

/**
 * 1. הרשמה לקבלת העמודות בזמן אמת (ממוינות לפי order)
 */
export const listenToColumns = (
  onColumnsChange: (columns: Column[]) => void,
  onError?: (error: Error) => void,
  boardId?: string,
) => {
  return columnRepo.subscribeToColumnsRepo(
    (columns) => {
      // אופטימיזציה: מיון העמודות לפי ה-order שלהן (מציג משמאל לימין)
      // משתמשים ב-[...columns] כדי לא לבצע מוטציה על המערך המקורי
      const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

      onColumnsChange(sortedColumns);
    },
    onError,
    boardId,
  );
};

/**
 * 2. יצירת עמודה חדשה כולל ולידציות והוספת תאריכים
 */
export const addNewColumn = async (
  columnData: Omit<Column, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  // ולידציה: כותרת לא ריקה
  if (!columnData.title || columnData.title.trim() === "") {
    throw new Error("כותרת העמודה אינה יכולה להיות ריקה");
  }

  // ולידציה: חובה לשייך ללוח
  if (!columnData.boardId) {
    throw new Error("חובה לשייך את העמודה ל-boardId");
  }

  // הכנת האובייקט לשמירה עם תאריך יצירה עדכני
  const cleanColumnData: Omit<Column, "id"> = {
    ...columnData,
    title: columnData.title.trim(),
    createdAt: new Date().toISOString(),
  };

  return await columnRepo.addColumnRepo(cleanColumnData);
};

/**
 * 3. עדכון עמודה קיימת (שינוי שם, צבע theme, מיקום order וכו')
 */
export const editColumn = async (
  id: string,
  updatedFields: Partial<Column>,
): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID לעדכון העמודה");
  }

  // אם מעדכנים כותרת, בודקים שהיא לא ריקה
  if (updatedFields.title !== undefined && updatedFields.title.trim() === "") {
    throw new Error("כותרת העמודה אינה יכולה להיות ריקה");
  }

  // מוסיפים תאריך עדכון אוטומטית
  const fieldsToSave: Partial<Column> = {
    ...updatedFields,
    ...(updatedFields.title && { title: updatedFields.title.trim() }),
    updatedAt: new Date().toISOString(),
  };

  return await columnRepo.updateColumnRepo(id, fieldsToSave);
};

/**
 * 4. מחיקת עמודה
 */
export const removeColumn = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID למחיקת העמודה");
  }

  return await columnRepo.deleteColumnRepo(id);
};
