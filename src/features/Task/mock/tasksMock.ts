import type { Task } from "../models/Task";

export const tasksMock: Task[] = [
  {
    id: "task-1",
    columnId: "column-1",

    title: "לעצב את TaskCard",
    description: "לבנות קומפוננטת משימה מודולרית",

    createdBy: "user-1",
    assigneeId: "user-2",

    savedBy: ["user-1"],

    createdAt: "2025-07-22",
    dueDate: "2025-07-30",

    order: 0,
  },
  {
    id: "task-2",
    columnId: "column-1",

    title: "להקים Repository",
    description: "לבנות שכבת נתונים למשימות",

    createdBy: "user-1",
    assigneeId: "",

    savedBy: [],

    createdAt: "2025-07-22",
    dueDate: "2025-07-28",

    order: 1,
  },
  {
    id: "task-3",
    columnId: "column-2",

    title: "לחבר Firebase",
    description: "להחליף את ה-Mock Repository",

    createdBy: "user-1",
    assigneeId: "user-3",

    savedBy: [],

    createdAt: "2025-07-22",
    dueDate: "2025-08-01",

    order: 0,
  },
];
