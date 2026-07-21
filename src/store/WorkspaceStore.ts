import { useState, useMemo, useRef, useLayoutEffect } from "react";
import type {
  Board,
  Column,
  Task,
} from "../features/Workspace/workspace/types/WorkspaceTypes";

// === נתונים פיקטיביים (Mock Data) ===
const INITIAL_BOARDS: Board[] = [
  {
    id: "b1",
    title: "פרויקט גמר ריאקט",
    createdBy: "user123",
    createdAt: 1710000000000,
    public: false,
  },
  {
    id: "b2",
    title: "משימות בית וסידורים",
    createdBy: "user123",
    createdAt: 1710000100000,
    public: false,
  },
];

const INITIAL_COLUMNS: Column[] = [
  {
    id: "c1",
    boardId: "b1",
    title: "לביצוע (Todo)",
    createdBy: "user123",
    createdAt: 1,
    color: "#FFF5F5",
    borderColor: "#FEB2B2",
  },
  {
    id: "c2",
    boardId: "b1",
    title: "בתהליך (In Progress)",
    createdBy: "user123",
    createdAt: 2,
    color: "#EBF8FF",
    borderColor: "#90CDF4",
  },
  {
    id: "c3",
    boardId: "b1",
    title: "בבדיקה (QA & Review)",
    createdBy: "user123",
    createdAt: 3,
    color: "#FEFCBF",
    borderColor: "#F6E05E",
  },
  {
    id: "c4",
    boardId: "b1",
    title: "הסתיים (Done)",
    createdBy: "user123",
    createdAt: 4,
    color: "#F0FFF4",
    borderColor: "#9AE6B4",
  },
  {
    id: "c5",
    boardId: "b2",
    title: "קניות לשבת",
    createdBy: "user123",
    createdAt: 5,
    color: "#FFFAF0",
    borderColor: "#FBD38D",
  },
  {
    id: "c6",
    boardId: "b2",
    title: "מטלות דחופות",
    createdBy: "user123",
    createdAt: 6,
    color: "#FAF5FF",
    borderColor: "#D6BCFA",
  },
  {
    id: "c7",
    boardId: "b1",
    title: "מטלות דחופות",
    createdBy: "user123",
    createdAt: 6,
    color: "#FAF5FF",
    borderColor: "#D6BCFA",
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    columnId: "c1",
    title: "אפיון ממשק משתמש (UI)",
    description:
      "לשדרג את הטאבים של הלוחות, לעצב כרטיסי משימות יוקרתיים ולהוסיף חיווי צבעוני מותאם.",
    createdBy: "user123",
    assigneeId: "רתם אבירם",
    savedBy: ["user123", "manager"],
    createdAt: "11 ביול׳",
    duDate: "12 ביול׳",
  },
  {
    id: "t2",
    columnId: "c1",
    title: "הגדרת Zustand Store",
    description:
      "ארגון הארגז הקסום, הגדרת Actions עבור יצירה ומחיקה של עמודות ומשימות.",
    createdBy: "user123",
    assigneeId: "",
    savedBy: [],
    createdAt: "11 ביול׳",
    duDate: "11 ביול׳",
  },
  {
    id: "t3",
    columnId: "c2",
    title: "חיבור פיירבייס לסרביס",
    description:
      "כתיבת פונקציות ה-CRUD האסינכרוניות מול השרת וסנכרון מלא של הסטייט הלוקאלי.",
    createdBy: "user123",
    assigneeId: "רתם אבירם",
    savedBy: ["user123"],
    createdAt: "10 ביול׳",
    duDate: "11 ביול׳",
  },
  {
    id: "t4",
    columnId: "c3",
    title: "טסטים וולידציות קלט",
    description:
      "לוודא שלא ניתן ליצור עמודה ריקה או משימה ללא כותרת. בדיקת שגיאות רשת עם סנאקבר.",
    createdBy: "user123",
    assigneeId: "בודק תוכנה",
    savedBy: [],
    createdAt: "09 ביול׳",
    duDate: "11 ביול׳",
  },
  {
    id: "t5",
    columnId: "c4",
    title: "הקמת הפרויקט ב-GitHub",
    description:
      "יצירת מאגר פרטי, הגדרת קובץ README מפורט והזמנת חברי הצוות לפיתוח משותף.",
    createdBy: "user123",
    assigneeId: "רתם אבירם",
    savedBy: [],
    createdAt: "05 ביול׳",
    duDate: "11 ביול׳",
  },
  {
    id: "t6",
    columnId: "c5",
    title: "חומרי גלם לאפייה",
    description: "קמח כוסמין, שוקולד צ'יפס מריר, תמצית וניל איכותית וחמאה.",
    createdBy: "user123",
    assigneeId: "",
    savedBy: [],
    createdAt: "12 ביול׳",
    duDate: "11 ביול׳",
  },
];

export const currentUserId = "my-user-id";

// === Custom Hook המדמה סטור (Zustand-like Store) ===
export function useWorkspaceStore() {
  const [boards] = useState<Board[]>(INITIAL_BOARDS);
  const [columns] = useState<Column[]>(INITIAL_COLUMNS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const [activeBoardId, setActiveBoardId] = useState<string>(
    boards[0]?.id || "",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);

  // גלילה וחצים
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveBoardId(newValue);
  };

  const currentColumns = useMemo(() => {
    return columns.filter((col) => col.boardId === activeBoardId);
  }, [columns, activeBoardId]);

  const getColumnCountForBoard = (boardId: string) => {
    return columns.filter((col) => col.boardId === boardId).length;
  };

  // פונקציית שמירה/הסרה משמורות במשימה
  const toggleSaveTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        const isSaved = task.savedBy?.includes(currentUserId);
        const updatedSavedBy = isSaved
          ? task.savedBy.filter((id) => id !== currentUserId)
          : [...(task.savedBy || []), currentUserId];

        return { ...task, savedBy: updatedSavedBy };
      }),
    );
  };

  // === פונקציית גרירה והשלכה (Drag and Drop) עבור @dnd-kit ===
  const moveTask = (activeId: string, overId: string) => {
    setTasks((prevTasks) => {
      // 1. מציאת המשימה שנגררה
      const draggedTask = prevTasks.find((t) => t.id === activeId);
      if (!draggedTask) return prevTasks;

      // 2. בדיקה האם המיקום החדש הוא עמודה ריקה או משימה אחרת
      const isOverColumn = columns.some((col) => col.id === overId);

      let targetColumnId = "";
      let targetIndex = 0;

      if (isOverColumn) {
        // גרירה ישירות על עמודה (למשל כשהיא ריקה)
        targetColumnId = overId;
        const destColumnTasks = prevTasks.filter((t) => t.columnId === overId);
        targetIndex = destColumnTasks.length; // בסוף הרשימה
      } else {
        // גרירה מעל משימה אחרת
        const targetTask = prevTasks.find((t) => t.id === overId);
        if (!targetTask) return prevTasks;

        targetColumnId = targetTask.columnId;
        const destColumnTasks = prevTasks.filter(
          (t) => t.columnId === targetColumnId,
        );
        targetIndex = destColumnTasks.findIndex((t) => t.id === overId);
      }

      // 3. יצירת רשימה ללא המשימה הנגררת
      const remainingTasks = prevTasks.filter((t) => t.id !== activeId);

      // 4. עדכון עמודת היעד של המשימה הנגררת
      const updatedTask = { ...draggedTask, columnId: targetColumnId };

      // 5. פיצול המשימות כדי לשלב את המשימה הנגררת באינדקס המדויק בעמודה הנכונה
      const destColumnTasks = remainingTasks.filter(
        (t) => t.columnId === targetColumnId,
      );
      const otherTasks = remainingTasks.filter(
        (t) => t.columnId !== targetColumnId,
      );

      destColumnTasks.splice(targetIndex, 0, updatedTask);

      return [...otherTasks, ...destColumnTasks];
    });
  };

  // עדכון זמינות החצים והגלילה
  const updateScrollButtonsState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const absScrollLeft = Math.abs(scrollLeft);

    setCanScrollRight(absScrollLeft > 5);
    setCanScrollLeft(absScrollLeft < maxScroll - 5);
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollability = () => {
      const hasScroll = container.scrollWidth > container.clientWidth;
      setIsScrollable(hasScroll);
      if (hasScroll) {
        updateScrollButtonsState();
      }
    };

    checkScrollability();

    const resizeObserver = new ResizeObserver(() => {
      checkScrollability();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentColumns]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current;
      const directionMultiplier = direction === "right" ? 1 : -1;

      container.scrollBy({
        left: scrollAmount * directionMultiplier,
        behavior: "smooth",
      });
    }
  };

  return {
    boards,
    columns,
    tasks,
    activeBoardId,
    searchQuery,
    showOnlySaved,
    showOnlyMine,
    currentColumns,
    scrollContainerRef,
    isScrollable,
    canScrollLeft,
    canScrollRight,
    setSearchQuery,
    setShowOnlySaved,
    setShowOnlyMine,
    handleTabChange,
    getColumnCountForBoard,
    toggleSaveTask,
    updateScrollButtonsState,
    handleScroll,
    moveTask, // <-- הפונקציה החדשה נחשפת כאן!
  };
}
