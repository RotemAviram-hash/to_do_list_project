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

  // 3. מחיקת משימה עם Optimistic UI Update
  const deleteTask = useCallback(async (id: string) => {
    let previousTasks: Task[] = [];

    // עדכון מיידי ב-UI
    setTasks((prev) => {
      previousTasks = prev;
      return prev.filter((task) => task.id !== id);
    });

    try {
      setError(null);
      await taskService.removeTask(id);
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      setTasks(previousTasks); // שחזור (Rollback) במקרה של שגיאה
      setError(err.message || "שגיאה במחיקת המשימה");
      throw err;
    }
  }, []);

  // 4. העברת משימה לעמודה חדשה עם Optimistic UI Update (מעולה ל-DND!)
  const moveTaskToColumn = useCallback(
    async (taskId: string, targetColumnId: string) => {
      let previousTasks: Task[] = [];

      // עדכון מיידי ב-UI ב-0 מילי-שניות
      setTasks((prev) => {
        previousTasks = prev;
        return prev.map((task) =>
          task.id === taskId
            ? { ...task, columnId: targetColumnId as Task["columnId"] }
            : task,
        );
      });

      try {
        setError(null);
        await taskService.editTask(taskId, {
          columnId: targetColumnId as Task["columnId"],
        });
      } catch (err: any) {
        console.error("Failed to move task to column:", err);
        setTasks(previousTasks); // שחזור (Rollback) במקרה של שגיאה
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
    moveTaskToColumn, // הוחזר בהצלחה!
  };
}
