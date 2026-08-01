import { useState, useEffect, useCallback } from "react";
import * as taskService from "../services/tasksService";
import type { Task } from "../models/Task";
import { useUser } from "../../User/hooks/useUser";
import { useSnack } from "../../../providers/SnackProvider";

// הגדרת ממשק עזר לטיפוס משתמש למקרה שיש שדות דינמיים כמו uid / id
interface CustomUser {
  id?: string;
  uid?: string;
}

export function useTasks(boardId?: string) {
  // 👈 1. מקבלים כעת boardId
  const { user, loading: isUserLoading } = useUser();
  const { showSuccess, showError } = useSnack();

  // חילוץ מזהה המשתמש בצורה בטוחה ויציבה
  const typedUser = user as CustomUser | string | null;
  const userId =
    typeof typedUser === "string"
      ? typedUser
      : typedUser?.id || typedUser?.uid || "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. האזנה בזמן אמת לשינויים במשימות הלוח
  useEffect(() => {
    if (isUserLoading) {
      setLoading(true);
      return;
    }

    // 👈 2. בודקים שיש boardId ולא מזהה משתמש
    if (!boardId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 👈 3. העברת boardId ל-service
    const unsubscribe = taskService.listenToTasks(
      boardId,
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        const errMsg = err.message || "שגיאה בטעינת המשימות";
        setError(errMsg);
        showError(errMsg);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [boardId, isUserLoading, showError]); // 👈 4. התלויות התעדכנו ל-boardId

  // 2. הוספת משימה חדשה
  const addTask = useCallback(
    async (newTaskData: Omit<Task, "id">) => {
      try {
        setError(null);
        const taskWithUser = {
          ...newTaskData,
          boardId: newTaskData.boardId || boardId || "",
          createdBy: newTaskData.createdBy || userId,
        };
        const newTaskId = await taskService.addNewTask(taskWithUser);
        showSuccess("המשימה נוצרה בהצלחה!");
        return newTaskId;
      } catch (err: unknown) {
        console.error("Failed to add task:", err);
        const errMsg =
          err instanceof Error ? err.message : "שגיאה בהוספת המשימה";
        setError(errMsg);
        showError(errMsg);
        throw err;
      }
    },
    [boardId, userId, showSuccess, showError], // 👈 6. הוספת boardId לרשימת התלויות
  );

  // 3. עדכון משימה קיימת (Optimistic UI)
  const updateTask = useCallback(
    async (id: string, updatedFields: Partial<Task>) => {
      let previousTasks: Task[] = [];

      setTasks((prev) => {
        previousTasks = prev;
        return prev.map((task) =>
          task.id === id ? { ...task, ...updatedFields } : task,
        );
      });

      try {
        setError(null);
        await taskService.editTask(id, updatedFields);
        showSuccess("המשימה עודכנה בהצלחה!");
      } catch (err: unknown) {
        console.error("Failed to update task:", err);
        setTasks(previousTasks); // Rollback במקרה של שגיאה
        const errMsg =
          err instanceof Error ? err.message : "שגיאה בעדכון המשימה";
        setError(errMsg);
        showError(errMsg);
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 4. מחיקת משימה (Optimistic UI)
  const deleteTask = useCallback(
    async (id: string) => {
      let previousTasks: Task[] = [];

      setTasks((prev) => {
        previousTasks = prev;
        return prev.filter((task) => task.id !== id);
      });

      try {
        setError(null);
        await taskService.removeTask(id);
        showSuccess("המשימה נמחקה בהצלחה!");
      } catch (err: unknown) {
        console.error("Failed to delete task:", err);
        setTasks(previousTasks); // Rollback במקרה של שגיאה
        const errMsg =
          err instanceof Error ? err.message : "שגיאה במחיקת המשימה";
        setError(errMsg);
        showError(errMsg);
        throw err;
      }
    },
    [showSuccess, showError],
  );

  // 5. העברת משימה לעמודה חדשה - Drag & Drop (Optimistic UI)
  const moveTaskToColumn = useCallback(
    async (taskId: string, targetColumnId: string) => {
      let previousTasks: Task[] = [];

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
      } catch (err: unknown) {
        console.error("Failed to move task to column:", err);
        setTasks(previousTasks); // Rollback
        const errMsg =
          err instanceof Error
            ? err.message
            : "שגיאה בהעברת המשימה לעמודה החדשה";
        setError(errMsg);
        showError(errMsg);
        throw err;
      }
    },
    [showError],
  );

  return {
    tasks,
    loading: loading || isUserLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToColumn,
  };
}
