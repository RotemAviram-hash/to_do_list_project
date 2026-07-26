import { memo } from "react";
import { Paper } from "@mui/material";
import { useDroppable } from "@dnd-kit/react";

// Sub-components
import { ColumnHeader } from "./ColumnHeader";
import { ColumnDropZone } from "./ColumnDropZone";

// Types
import type { Column as ColumnType } from "../models/Column";
import type { Task } from "../../Task/models/Task";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  columns: ColumnType[];
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  onAddTask?: (columnId: string) => void;
}

function Column({
  column,
  tasks,
  columns,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
}: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({ id: column.id });

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 290,
        maxWidth: 320,
        maxHeight: "85vh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "action.hover",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isDropTarget ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        boxShadow: isDropTarget ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        onEditColumn={onEditColumn}
        onDeleteColumn={onDeleteColumn}
        onAddTask={onAddTask}
      />

      <ColumnDropZone dropRef={ref} tasks={tasks} columns={columns} />
    </Paper>
  );
}

export default memo(Column);
