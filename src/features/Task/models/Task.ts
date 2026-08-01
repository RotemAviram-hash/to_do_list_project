export interface Task {
  id: string;
  columnId: string;
  boardId: string;

  title: string;
  description: string;

  createdBy: string;
  assigneeId: string;

  savedBy: string[];

  createdAt: string;
  dueDate: string;
}
