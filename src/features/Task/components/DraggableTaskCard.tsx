import { Box, IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useDraggable } from "@dnd-kit/react";
import { memo } from "react";

import TaskCard from "./TaskCard";
import type { Column } from "../../Column";
import type { Task } from "../models/Task";

interface DraggableTaskCardProps {
  task: Task;
  columns: Column[];
}

function DraggableTaskCard({ task, columns }: DraggableTaskCardProps) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: task.id,
    data: { columnId: task.columnId },
  });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        gap: 0.5,
        alignItems: "flex-start",
      }}
    >
      <IconButton
        ref={handleRef}
        size="small"
        aria-label="גרור משימה"
        sx={{ mt: 1, cursor: "grab" }}
      >
        <DragIndicatorIcon />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TaskCard task={task} columns={columns} />
      </Box>
    </Box>
  );
}

export default memo(DraggableTaskCard);
