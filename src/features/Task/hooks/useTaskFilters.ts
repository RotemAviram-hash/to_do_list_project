import { useMemo } from "react";
import type { Task } from "../models/Task";

export interface FilterOptions {
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
}

// ממשק עזר לטיפול במקרים שבהם המזהה מגיע כאובייקט
interface EntityWithId {
  id?: string;
  _id?: string;
}

const extractId = (val: unknown): string => {
  if (typeof val === "string") {
    return val.trim();
  }
  if (typeof val === "object" && val !== null) {
    const entity = val as EntityWithId;
    return (entity.id || entity._id || "").trim();
  }
  return "";
};

export function useTaskFilters(
  tasks: Task[] = [],
  currentUserId: unknown = "",
  filters: FilterOptions = {},
) {
  const {
    searchQuery = "",
    showOnlySaved = false,
    showOnlyMine = false,
  } = filters;

  // ⚡ 1. חילוץ ונרמול מזהה המשתמש מחוץ ל-useMemo כדי להבטיח ערך פרימיטיבי יציב
  const cleanUserId = useMemo(() => {
    return extractId(currentUserId);
  }, [currentUserId]);

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const isSearching = normalizedQuery.length > 0;

    return tasks.filter((task) => {
      if (!task) return false;

      // --- א. חיפוש טקסט (כותרת ותיאור) ---
      if (isSearching) {
        const titleMatch =
          task.title?.toLowerCase().includes(normalizedQuery) ?? false;
        const descMatch =
          task.description?.toLowerCase().includes(normalizedQuery) ?? false;

        if (!titleMatch && !descMatch) return false;
      }

      // --- ב. סינון משימות שמורות ---
      if (showOnlySaved) {
        if (!cleanUserId) return false;

        const savedByArray = Array.isArray(task.savedBy) ? task.savedBy : [];
        const isSaved = savedByArray.some((item: unknown) => {
          const itemId = extractId(item);
          return itemId === cleanUserId;
        });

        if (!isSaved) return false;
      }

      // --- ג. סינון המשימות שלי (שוקצו לי או נוצרו על ידי) ---
      if (showOnlyMine) {
        if (!cleanUserId) return false;

        const assigneeId = extractId(task.assigneeId);
        const createdBy = extractId(task.createdBy);

        const isMine = assigneeId === cleanUserId || createdBy === cleanUserId;
        if (!isMine) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, showOnlySaved, showOnlyMine, cleanUserId]);

  return { filteredTasks };
}
