import { useState, useCallback, useContext } from "react";
import type { Task } from "../types/Task";
import { SnackContext } from "../providers/SnackProvider";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
} from "../services/tasksDataServiceFireBase"; // ודא שהנתיב תקין
import { useUser } from "../providers/UserProvider";

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);

  const { raiseSnack } = useContext(SnackContext) as any;
  const {user}=useUser()

  // READ
  const handleGetTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedTasks = await getTasks();
      setTasks(savedTasks);
    } catch (e) {
      raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
      setError("Error fetching tasks");
    }
    finally {     
     setIsLoading(false);

    }
  }, [raiseSnack]);

  // CREATE
  const handleAddNewTask = useCallback(
    async (task: Omit<Task, "id">) => {
      if (!task.column) {
        raiseSnack("error", "יש לבחור עמודה למשימה");
        return;
      }

      const newTaskData = {
        ...task,
        likes: [],
        dislikes: [],
        userId: user?.id ?? "unknown", // הוספת userId
      };

      try {
        // המתנה ליצירת המשימה וקבלת ה-ID מפיירבייס
        const newId = await addTask(newTaskData);

        const newTask: Task = {
          ...newTaskData,
          id: newId,
        };

        setTasks((prev) => [...prev, newTask]);
        raiseSnack("success", "משימה חדשה התווספה בהצלחה");
      } catch (error) {
        raiseSnack("error", "התרחשה שגיאה ביצירת המשימה");
      }
    },
    [raiseSnack],
  );

  // UPDATE - Move Column (Optimistic Update)
  const moveTaskToColumn = useCallback(
    (taskId: string, columnId: string) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === taskId);
        if (!task || task.column === columnId) return prev;

        // עדכון פיירבייס ברקע
        updateTask(taskId, { column: columnId }).catch(() => {
          raiseSnack("error", "שגיאה בשמירת מיקום המשימה");
          // במקרה של שגיאה אפשר לקרוא ל-handleGetTasks כדי לסנכרן חזרה מהשרת
        });

        // עדכון UI מידי
        return prev.map((t) =>
          t.id === taskId ? { ...t, column: columnId } : t,
        );
      });
    },
    [raiseSnack],
  );

  // UPDATE - Full Edit
  const handleEditTask = useCallback(
    async (task: Task) => {
      if (!task.id) return;

      try {
        await updateTask(task.id, task);
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
        raiseSnack("success", "משימה נערכה בהצלחה");
      } catch (error) {
        raiseSnack("error", "שגיאה בעריכת המשימה");
      }
    },
    [raiseSnack],
  );

  // DELETE
  const handleDeleteTask = useCallback(
    async (id: string) => {
      if (confirm("האם את/ה בטוח/ה שברצונך למחוק את המשימה?")) {
        try {
          await deleteTask(id);
          setTasks((prev) => prev.filter((t) => t.id !== id));
          raiseSnack("success", "המשימה נמחקה בהצלחה");
        } catch (error) {
          raiseSnack("error", "שגיאה במחיקת המשימה");
        }
      }
    },
    [raiseSnack],
  );

  // UPDATE - Likes (Optimistic Update)
  const updateLikes = useCallback(
    async (id: string, action: "inc" | "dec") => {

      const updatedTask = await getTaskById(id);
      setTasks((prev) => {
        const task = updatedTask
        if (!task) return prev;
        const field = action==="inc" ? "likes" : "dislikes";
        let newLikes = [...task[field]];
        if(user){
        let isTheUserAlreadyExists = newLikes.includes(user?.id);
        if (!isTheUserAlreadyExists) {
          newLikes.push(user?.id);
        } else {
          newLikes = newLikes.filter((likeId) => likeId !== user?.id);
        }
        }
        // עדכון פיירבייס ברקע
        updateTask(id, { [field]: newLikes }).catch(() => {
          raiseSnack("error", "שגיאה בעדכון הלייקים");
        });

        // עדכון UI מידי
        return prev.map((t) => (t.id === id ? { ...t, [field]: newLikes } : t));
       
      });
    },
    [raiseSnack],
  );

  return {
    tasks,
    handleAddNewTask,
    handleEditTask,
    handleDeleteTask,
    handleGetTasks,
    updateLikes,
    moveTaskToColumn,
    isLoading,
    error,
  };
}

export default useTasks;
