import { useDraggable } from "@dnd-kit/react";
import { memo } from "react";

import TaskCard from "./TaskCard";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../models/Task";

interface DraggableTaskCardProps {
  task: Task;
  columns: Column[];
  canEdit?: boolean; // 👈 מקבל את הרשאת העריכה
}

function DraggableTaskCard({
  task,
  columns,
  canEdit = false,
}: DraggableTaskCardProps) {
  // חיבור הגרירה ישירות לכרטיס (מנוטרל במידה ואין הרשאת עריכה)
  const { ref, isDragging } = useDraggable({
    id: task.id,
    data: { columnId: task.columnId },
    disabled: !canEdit, // 👈 ניטרול הגרירה
  });

  return (
    <TaskCard
      cardRef={ref}
      task={task}
      columns={columns}
      isDragging={isDragging}
      canEdit={canEdit} // 👈 העברה ל-TaskCard
    />
  );
}

export default memo(DraggableTaskCard);
