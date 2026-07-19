/* useBoardStore.ts
import { create } from "zustand";
import type { Column } from "../components/Column/Column.type";
import type { Task } from "../components/Task/Task.type";
import type { Board } from "../components/Board/Board.type"; // ה-Interface החדש של הלוח
import {
  addColumn,
  getColumns,
  updateColumn,
  deleteColumn,
} from "../components/Column/columnsDataServiceFireBase";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById,
} from "../components/Task/tasksDataServiceFireBase";
import {
  addBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from "../components/Board/boardDataServiceFireBase"; // הסרביס של הלוחות שהבאת מקודם



interface BoardState {
  boards: Board[]; // סטייט הלוחות החדש
  columns: Column[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions Boards
  fetchBoards: (raiseSnack: any) => Promise<void>;
  createBoard: (
    board: Omit<Board, "id">,
    raiseSnack: any,
  ) => Promise<string | undefined>;
  editBoard: (
    id: string,
    updatedData: Partial<Board>,
    raiseSnack: any,
  ) => Promise<void>;
  removeBoard: (id: string, raiseSnack: any) => Promise<void>;

  // Actions Columns
  fetchColumns: (raiseSnack: any) => Promise<void>;
  createColumn: (column: Omit<Column, "id">, raiseSnack: any) => Promise<void>;
  editColumn: (column: Column, raiseSnack: any) => Promise<void>;
  removeColumn: (id: string, raiseSnack: any) => Promise<void>;

  // Actions Tasks
  fetchTasks: (raiseSnack: any) => Promise<void>;
  createTask: (
    task: Omit<Task, "id">,
    user: any,
    raiseSnack: any,
  ) => Promise<void>;
  editTask: (task: Task, raiseSnack: any) => Promise<void>;
  removeTask: (id: string, raiseSnack: any) => Promise<void>;
  moveTask: (taskId: string, columnId: string, raiseSnack: any) => void;
  toggleLikeDislike: (
    id: string,
    action: "inc" | "dec",
    user: any,
    raiseSnack: any,
  ) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [], 
  columns: [],
  tasks: [],
  isLoading: false,
  error: null,

  //                                    --- BOARDS ACTIONS ---
  fetchBoards: async (raiseSnack) => {
    set({ isLoading: true });
    try {
      const savedBoards = await getBoards();
      set({ boards: savedBoards, error: null });
    } catch {
      raiseSnack("error", "התרחשה שגיאה בייבוא הלוחות");
      set({ error: "Error fetching boards" });
    } finally {
      set({ isLoading: false });
    }
  },

  createBoard: async (board, raiseSnack) => {
    try {
      const newId = await addBoard(board);
      const newBoard: Board = { ...board, id: newId } as Board;
      set((state) => ({ boards: [...state.boards, newBoard] }));
      raiseSnack("success", "לוח חדש נוצר בהצלחה");
      return newId;
    } catch {
      raiseSnack("error", "התרחשה שגיאה ביצירת הלוח");
    }
  },

  editBoard: async (id, updatedData, raiseSnack) => {
    try {
      await updateBoard(id, updatedData);
      set((state) => ({
        boards: state.boards.map((b) =>
          b.id === id ? { ...b, ...updatedData } : b,
        ),
      }));
      raiseSnack("success", "הלוח עודכן בהצלחה");
    } catch {
      raiseSnack("error", "שגיאה בעדכון הלוח");
    }
  },

  removeBoard: async (id, raiseSnack) => {
    if (confirm("האם את/ה בטוח/ה שברצונך למחוק את הלוח כולו?")) {
      try {
        await deleteBoard(id);
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== id),
        }));
        raiseSnack("success", "הלוח נמחק בהצלחה");
      } catch {
        raiseSnack("error", "שגיאה במחיקת הלוח");
      }
    }
  },

  //                                  --- COLUMNS ACTIONS ---
  fetchColumns: async (raiseSnack) => {
    try {
      const savedColumns = await getColumns();
      set({ columns: savedColumns });
    } catch {
      raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
    }
  },

  createColumn: async (column, raiseSnack) => {
    try {
      const newId = await addColumn(column);
      const newColumn: Column = {
        ...column,
        id: newId,
      };
      set((state) => ({ columns: [...state.columns, newColumn] }));
      raiseSnack("success", "עמודה חדשה התווספה בהצלחה");
    } catch {
      raiseSnack("error", "התרחשה שגיאה ביצירת העמודה");
    }
  },

  editColumn: async (column, raiseSnack) => {
    if (!column.id) return;
    try {
      await updateColumn(column.id, column);
      set((state) => ({
        columns: state.columns.map((c) => (c.id === column.id ? column : c)),
      }));
      raiseSnack("success", "עמודה נערכה בהצלחה");
    } catch {
      raiseSnack("error", "שגיאה בעריכת העמודה");
    }
  },

  removeColumn: async (id, raiseSnack) => {
    try {
      const tasks = get().tasks;
      if (tasks.some((t) => t.column === id)) {
        raiseSnack("warning", "שים לב! לא ניתן למחוק עמודה שמכילה משימות");
        return;
      }

      await deleteColumn(id);
      set((state) => ({
        columns: state.columns.filter((c) => c.id !== id),
      }));
      raiseSnack("success", "עמודה נמחקה בהצלחה");
    } catch {
      raiseSnack("error", "שגיאה במחיקת העמודה");
    }
  },

  // --- TASKS ACTIONS ---
  fetchTasks: async (raiseSnack) => {
    set({ isLoading: true });
    try {
      const savedTasks = await getTasks();
      set({ tasks: savedTasks, error: null });
    } catch {
      raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
      set({ error: "Error fetching tasks" });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (task, user, raiseSnack) => {
    if (!task.column) {
      raiseSnack("error", "יש לבחור עמודה למשימה");
      return;
    }

    const newTaskData = {
      ...task,
      likes: [],
      dislikes: [],
      userId: user?.id ?? "unknown",
    };

    try {
      const newId = await addTask(newTaskData);
      const newTask: Task = { ...newTaskData, id: newId };
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      raiseSnack("success", "משימה חדשה התווספה בהצלחה");
    } catch {
      raiseSnack("error", "התרחשה שגיאה ביצירת המשימה");
    }
  },

  editTask: async (task, raiseSnack) => {
    if (!task.id) return;
    try {
      await updateTask(task.id, task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
      }));
      raiseSnack("success", "משימה נערכה בהצלחה");
    } catch {
      raiseSnack("error", "שגיאה בעריכת המשימה");
    }
  },

  removeTask: async (id, raiseSnack) => {
    if (confirm("האם את/ה בטוח/ה שברצונך למחוק את המשימה?")) {
      try {
        await deleteTask(id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        raiseSnack("success", "המשימה נמחקה בהצלחה");
      } catch {
        raiseSnack("error", "שגיאה במחיקת המשימה");
      }
    }
  },

  moveTask: (taskId, columnId, raiseSnack) => {
    const previousTasks = get().tasks;
    const task = previousTasks.find((t) => t.id === taskId);
    if (!task || task.column === columnId) return;

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, column: columnId } : t,
      ),
    }));

    updateTask(taskId, { column: columnId }).catch(() => {
      raiseSnack("error", "שגיאה בשמירת מיקום המשימה");
      set({ tasks: previousTasks });
    });
  },

  toggleLikeDislike: async (id, action, user, raiseSnack) => {
    const updatedTask = await getTaskById(id);
    if (!updatedTask) return;

    const field = action === "inc" ? "likes" : "dislikes";
    let newLikes = [...updatedTask[field]];

    if (user) {
      let isTheUserAlreadyExists = newLikes.includes(user?.id);
      if (!isTheUserAlreadyExists) {
        newLikes.push(user?.id);
      } else {
        newLikes = newLikes.filter((likeId) => likeId !== user?.id);
      }
    }

    const previousTasks = get().tasks;

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, [field]: newLikes } : t,
      ),
    }));

    updateTask(id, { [field]: newLikes }).catch(() => {
      raiseSnack("error", "שגיאה בעדכון הלייקים");
      set({ tasks: previousTasks });
    });
  },
}));*/
