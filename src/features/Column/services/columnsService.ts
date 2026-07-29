import * as columnRepo from "../repositories/columnRepositoryFirebase";
// 🟢 ייבוא הפונקציות מה-Repository של הלוח (כולל שליפת הלוח לבדיקה)
import {
  incrementColumnCountRepo,
  getBoardByIdRepo,
} from "../../Board/repositories/boardRepositoryFirebase";
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
      // מיון העמודות לפי ה-order שלהן
      const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

      onColumnsChange(sortedColumns);
    },
    onError,
    boardId,
  );
};

/**
 * 2. יצירת עמודה חדשה כולל ולידציות, הוספת תאריכים ועדכון ספירת העמודות בלוח (+1)
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

  // 1. הוספת העמודה למסד הנתונים
  const newColumnId = await columnRepo.addColumnRepo(cleanColumnData);

  // 2. 🟢 עדכון אטומי של הלוח (+1 לעמודות)
  try {
    await incrementColumnCountRepo(columnData.boardId, 1);
  } catch (err) {
    console.error("שגיאה בעדכון ספירת העמודות בלוח:", err);
  }

  return newColumnId;
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
 * 4. מחיקת עמודה ועדכון ספירת העמודות בלוח (-1)
 */
export const removeColumn = async (
  id: string,
  boardId: string,
): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID למחיקת העמודה");
  }
  if (!boardId) {
    throw new Error("חובה לספק boardId למחיקת העמודה");
  }

  // 🟢 מקרה קצה: בדיקה שספירת העמודות בלוח לא קטנה מ-1 (מניעת ירידה מתחת ל-0)
  const board = await getBoardByIdRepo(boardId);
  if (!board || (board.columnCount ?? 0) <= 0) {
    throw new Error("לא ניתן למחוק עמודה - אין עמודות קיימות בלוח זה");
  }

  // 1. מחיקת העמודה ממסד הנתונים
  await columnRepo.deleteColumnRepo(id);

  // 2. 🟢 עדכון אטומי של הלוח (-1 לעמודות)
  try {
    await incrementColumnCountRepo(boardId, -1);
  } catch (err) {
    console.error("שגיאה בעדכון ספירת העמודות בלוח לאחר מחיקה:", err);
  }
};
