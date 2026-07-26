import { useMemo } from "react";
import type { Task } from "../models/Task";

interface FilterOptions {
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
    return tasks.filter((task) => {
      // 1. חיפוש טקסט
      const matchesSearch =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        task.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase().trim());

      // 2. משימות שמורות - בדיקה בטוחה כולל ולידציה ש-currentUserId קיים!
      const matchesSaved = showOnlySaved
        ? Boolean(
            currentUserId &&
            Array.isArray(task.savedBy) &&
            task.savedBy.includes(currentUserId),
          )
        : true;

      // 3. המשימות שלי
      const matchesMine = showOnlyMine
        ? Boolean(
            currentUserId &&
            (task.assigneeId === currentUserId ||
              task.createdBy === currentUserId),
          )
        : true;

      return matchesSearch && matchesSaved && matchesMine;
    });
  }, [tasks, searchQuery, showOnlySaved, showOnlyMine, currentUserId]);
  console.log("🔍 בדיקת פילטר שמורות:", {
    showOnlySaved,
    currentUserId,
    tasksCount: tasks.length,
    firstTaskSavedBy: tasks[0]?.savedBy,
  });
  return { filteredTasks };
}
