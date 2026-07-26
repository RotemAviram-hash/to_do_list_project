import type { Column } from "../features/Column/models/Column";
import type { Task } from "../features/Task/models/Task";

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
