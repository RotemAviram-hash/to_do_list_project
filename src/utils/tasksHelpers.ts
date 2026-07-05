import type { Column } from "../components/Column/Column.type";
import type { Task } from "../components/Task/Task.type";

export const getColumnName = (columnId: string, columns: Column[]) => {
  return columns.find((c) => c.id === columnId)?.name ?? columnId;
};

// פונקציות עזר לקביעת צבעים לפי סטטוס ועדיפות
export const getStatusColor = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "warning";
    default:
      return "default";
  }
};

export const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "info";

    default:
      return "default";
  }
};
