import React from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { BoardHeader } from "./BoardHeader";
import { BoardColumnsList } from "./BoardColumnsList";
import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";

interface KanbanBoardContainerProps {
  boardId: string;
}

export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> = ({
  boardId,
}) => {
  // 1. הוקים לניהול דאטה
  const { columns, updateColumn, deleteColumn, addColumn, reorderColumns } =
    useColumns(boardId);
  const { tasks, moveTaskToColumn } = useTasks();

  // 2. הוק מרוכז לגרירה
  const { handleDragEnd } = useKanbanDrag({
    columns,
    tasks,
    moveTaskToColumn,
    reorderColumns,
  });

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <BoardHeader
        onAddColumn={() =>
          addColumn({ title: "עמודה חדשה", boardId, order: columns.length })
        }
        isPublic={false}
        onTogglePrivacy={() => {}}
        members={[]}
      />

      <BoardColumnsList
        columns={columns}
        tasks={tasks.filter((t) => t.boardId === boardId)} // סינון לפי הלוח הנוכחי
        onEditColumn={(col) => updateColumn(col.id, col)}
        onDeleteColumn={(id) => deleteColumn(id)}
      />
    </DragDropProvider>
  );
};
