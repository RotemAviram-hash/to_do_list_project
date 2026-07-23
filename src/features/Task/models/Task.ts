export interface Task {
  id: string;
  columnId: string;

  title: string;
  description: string;

  createdBy: string;
  assigneeId: string;

  savedBy: string[];

  createdAt: string;
  dueDate: string;

  order: number;
}
