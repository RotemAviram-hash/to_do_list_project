export type Task = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "in-progress";
  dueDate: Date;
  priority: "high" | "medium" | "low";
  likes: string[];
  dislikes:string[];
  column: string;
  userId:string
};
