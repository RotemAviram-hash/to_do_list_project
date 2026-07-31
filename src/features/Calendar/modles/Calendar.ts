import type { Task } from "../../Task/models/Task";

export type CalendarViewMode = "month" | "week" | "day";

export interface CalendarViewProps {
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
}
