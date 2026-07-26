import { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/tasksService";
import type { Task } from "../models/Task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // ה-Listener הזה כבר עושה עבודה מושלמת ומעדכן את המשימות בזמן אמת!
    const unsubscribe = taskService.listenToTasks(
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "שגיאה בטעינת המשימות");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // 1. הוספת משימה חדשה
  const addTask = useCallback(async (newTaskData: Omit<Task, "id">) => {
    try {
      setError(null);
      await taskService.addNewTask(newTaskData);
    } catch (err: any) {
      console.error("Failed to add task:", err);
      setError(err.message || "שגיאה בהוספת המשימה");
      throw err;
    }
  }, []);

  // 2. עדכון משימה קיימת
  const updateTask = useCallback(
    async (id: string, updatedFields: Partial<Task>) => {
      try {
        setError(null);
        await taskService.editTask(id, updatedFields);
      } catch (err: any) {
        console.error("Failed to update task:", err);
        setError(err.message || "שגיאה בעדכון המשימה");
        throw err;
      }
    },
    [],
  );

  // 3. מחיקת משימה (הוסר ה-Optimistic UI הידני)
  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      await taskService.removeTask(id);
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setError(err.message || "שגיאה במחיקת המשימה");
      throw err;
    }
  }, []);

  // 4. העברת משימה לעמודה חדשה (הוסר ה-Optimistic UI הידני)
  const moveTaskToColumn = useCallback(
    async (taskId: string, targetColumnId: string) => {
      try {
        setError(null);
        // רק שולחים בקשה לשרת, ה-Listener למעלה יתפוס את השינוי ויעדכן את המסך
        await taskService.editTask(taskId, {
          columnId: targetColumnId as Task["columnId"],
        });
      } catch (err: any) {
        console.error("Failed to move task to column:", err);
        setError(err.message || "שגיאה בהעברת המשימה לעמודה החדשה");
        throw err;
      }
    },
    [],
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToColumn,
  };
}
