import { useDraggable } from "@dnd-kit/react";
import { memo } from "react";

import TaskCard from "./TaskCard";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../models/Task";

interface DraggableTaskCardProps {
  task: Task;
  columns: Column[];
}

function DraggableTaskCard({ task, columns }: DraggableTaskCardProps) {
  // חיבור הגרירה ישירות לכרטיס
  const { ref, isDragging } = useDraggable({
    id: task.id,
    data: { columnId: task.columnId },
  });

  return (
    <TaskCard
      cardRef={ref} // 👈 מעבירים את ה-ref של dnd-kit ישירות לקום הכרטיס
      task={task}
      columns={columns}
      isDragging={isDragging}
    />
  );
}

export default memo(DraggableTaskCard);
