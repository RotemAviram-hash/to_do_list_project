export interface Task {
  id: string; //פנימי
  columnId: string;
  boardId: string;

  title: string;
  description: string;

  createdBy: string; //פנימי
  assigneeId: string;

  savedBy: string[];

  createdAt: string; //פנימי
  dueDate: string;

  order: number; //פנימי
}
