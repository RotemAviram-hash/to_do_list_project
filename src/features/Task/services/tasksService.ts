import * as taskRepo from "../repositories/taskRepositoryFirebase";
import type { Task } from "../models/Task";

/**
 * 1. הרשמה לקבלת המשימות בזמן אמת
 */
export const listenToTasks = (
  onTasksChange: (tasks: Task[]) => void,
  onError?: (error: Error) => void,
) => {
  return taskRepo.subscribeToTasksRepo((tasks) => {
    // אופטימיזציה: שימוש ב-[...tasks] למניעת מוטציה על המערך המקורי
    const sortedTasks = [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    onTasksChange(sortedTasks);
  }, onError);
};

/**
 * 2. יצירת משימה חדשה כולל ולידציה
 */
export const addNewTask = async (
  taskData: Omit<Task, "id">,
): Promise<string> => {
  if (!taskData.title || taskData.title.trim() === "") {
    throw new Error("כותרת המשימה אינה יכולה להיות ריקה");
  }

  const cleanTaskData = {
    ...taskData,
    title: taskData.title.trim(),
  };

  return await taskRepo.addTaskRepo(cleanTaskData);
};

/**
 * 3. עדכון משימה קיימת
 */
export const editTask = async (
  id: string,
  updatedFields: Partial<Task>,
): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID לעדכון המשימה");
  }

  if (updatedFields.title !== undefined && updatedFields.title.trim() === "") {
    throw new Error("כותרת המשימה אינה יכולה להיות ריקה");
  }

  return await taskRepo.updateTaskRepo(id, updatedFields);
};

/**
 * 4. מחיקת משימה
 */
export const removeTask = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("חובה לספק ID למחיקת המשימה");
  }

  return await taskRepo.deleteTaskRepo(id);
};
