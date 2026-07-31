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

  // ⚡ 1. חילוץ ונרמול מזהה המשתמש מחוץ ל-useMemo כדי להבטיח ערך פרימיטיבי יציב
  const cleanUserId = useMemo(() => {
    if (typeof currentUserId === "string") return currentUserId.trim();
    return (currentUserId as any)?.id || (currentUserId as any)?._id || "";
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
        const isSaved = savedByArray.some((item: any) => {
          if (typeof item === "string") return item.trim() === cleanUserId;
          if (typeof item === "object" && item !== null) {
            return (item.id || item._id) === cleanUserId;
          }
          return false;
        });

        if (!isSaved) return false;
      }

      // --- ג. סינון המשימות שלי (שוקצו לי או נוצרו על ידי) ---
      if (showOnlyMine) {
        if (!cleanUserId) return false;

        const assigneeId =
          typeof task.assigneeId === "object" && task.assigneeId !== null
            ? (task.assigneeId as any).id || (task.assigneeId as any)._id
            : String(task.assigneeId || "").trim();

        const createdBy =
          typeof task.createdBy === "object" && task.createdBy !== null
            ? (task.createdBy as any).id || (task.createdBy as any)._id
            : String(task.createdBy || "").trim();

        const isMine = assigneeId === cleanUserId || createdBy === cleanUserId;
        if (!isMine) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, showOnlySaved, showOnlyMine, cleanUserId]);

  return { filteredTasks };
}
