import { useMemo } from "react";
import type { Task } from "../models/Task";

export interface FilterOptions {
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
}

export function useTaskFilters(
  tasks: Task[] = [],
  currentUserId: string = "",
  filters: FilterOptions = {},
) {
  const {
    searchQuery = "",
    showOnlySaved = false,
    showOnlyMine = false,
  } = filters;

  const filteredTasks = useMemo(() => {
    // ⚡ נרמול וניקוי מזהה המשתמש ומילת החיפוש
    const cleanUserId =
      typeof currentUserId === "string"
        ? currentUserId.trim()
        : (currentUserId as any)?.id || (currentUserId as any)?._id || "";

    const normalizedQuery = searchQuery.trim().toLowerCase();

    // 🔍 קבוצת לוגים ראשית
    console.groupCollapsed("🔍 [useTaskFilters] הרצת סינון משימות");
    console.log("📥 פרמטרי קלט:", {
      totalTasksReceived: tasks?.length || 0,
      currentUserId: cleanUserId || "⚠️ (ריק / לא מחובר)",
      filters: { searchQuery, showOnlySaved, showOnlyMine },
    });

    // 1. הגנה מפני מערך ריק או לא תקין
    if (!Array.isArray(tasks) || tasks.length === 0) {
      console.warn("⚠️ מערך ה-tasks ריק או שאינו Array!");
      console.groupEnd();
      return [];
    }

    // 2. אזהרה במקרה שנדרש פילטר משתמש אך חסר ID
    if ((showOnlySaved || showOnlyMine) && !cleanUserId) {
      console.warn(
        "⚠️ פילטר 'השמורות שלי' או 'המשימות שלי' פעיל, אך currentUserId ריק!",
      );
    }

    const result = tasks.filter((task, index) => {
      if (!task) {
        console.warn(`❌ [אינדקס ${index}] המשימה היא null/undefined`);
        return false;
      }

      const taskId = task.id || `index-${index}`;
      const taskTitle = task.title || "(ללא כותרת)";

      // --- א. חיפוש טקסט (כותרת ותיאור) ---
      if (normalizedQuery) {
        const titleMatch =
          task.title?.toLowerCase().includes(normalizedQuery) ?? false;
        const descMatch =
          task.description?.toLowerCase().includes(normalizedQuery) ?? false;

        if (!titleMatch && !descMatch) {
          console.log(
            `❌ [נפסל בחיפוש] "${taskTitle}" (${taskId}) - לא מכיל "${normalizedQuery}"`,
          );
          return false;
        }
      }

      // --- ב. סינון משימות שמורות ---
      if (showOnlySaved) {
        if (!cleanUserId) {
          console.log(`❌ [נפסל בשמורות] "${taskTitle}" - חסר currentUserId`);
          return false;
        }

        const savedByArray = Array.isArray(task.savedBy) ? task.savedBy : [];

        // תמיכה בשרשור ID ישיר או באובייקטים
        const isSaved = savedByArray.some((item: any) => {
          if (typeof item === "string") return item.trim() === cleanUserId;
          if (typeof item === "object" && item !== null) {
            return (item.id || item._id) === cleanUserId;
          }
          return false;
        });

        if (!isSaved) {
          console.log(`❌ [נפסל בשמורות] "${taskTitle}" (${taskId})`, {
            expectedUserId: cleanUserId,
            actualSavedBy: savedByArray,
          });
          return false;
        }
      }

      // --- ג. סינון המשימות שלי (שוקצו לי או נוצרו על ידי) ---
      if (showOnlyMine) {
        if (!cleanUserId) {
          console.log(
            `❌ [נפסל במשימות שלי] "${taskTitle}" - חסר currentUserId`,
          );
          return false;
        }

        // חילוץ בטוח של ID למקרה שזה אובייקט
        const assigneeId =
          typeof task.assigneeId === "object" && task.assigneeId !== null
            ? (task.assigneeId as any).id || (task.assigneeId as any)._id
            : String(task.assigneeId || "").trim();

        const createdBy =
          typeof task.createdBy === "object" && task.createdBy !== null
            ? (task.createdBy as any).id || (task.createdBy as any)._id
            : String(task.createdBy || "").trim();

        const isMine = assigneeId === cleanUserId || createdBy === cleanUserId;

        if (!isMine) {
          console.log(`❌ [נפסל במשימות שלי] "${taskTitle}" (${taskId})`, {
            expectedUserId: cleanUserId,
            taskAssigneeId: assigneeId,
            taskCreatedBy: createdBy,
          });
          return false;
        }
      }

      console.log(`✅ [עבר סינון] "${taskTitle}" (${taskId})`);
      return true;
    });

    console.log(
      `📊 סיכום: מתוך ${tasks.length} משימות, נשארו ${result.length} משימות בעמודה/במסך.`,
    );
    console.groupEnd();

    return result;
  }, [tasks, searchQuery, showOnlySaved, showOnlyMine, currentUserId]);

  return { filteredTasks };
}
