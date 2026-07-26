import React, { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { BoardHeader } from "./BoardHeader";
import { BoardColumnsList } from "./BoardColumnsList";
import { CreateColumnDialog } from "../../../Column/dialogs/CreateColumnDialog.tsx";
import { EditColumnDialog } from "../../../Column/dialogs/EditColumnDialog";
import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";
import type { Column } from "../../../Column/models/Column";

interface KanbanBoardContainerProps {
  boardId: string;
  currentUserId?: string;
}

export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> = ({
  boardId,
  currentUserId = "",
}) => {
  // 1. הוקים לניהול דאטה
  const { columns, reorderColumns } = useColumns(boardId);
  const { tasks, moveTaskToColumn } = useTasks();

  // 2. מצבים לפתיחת דיאלוגים של עמודה
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  // 3. הוק מרוכז לגרירה
  const { handleDragEnd } = useKanbanDrag({
    columns,
    tasks,
    moveTaskToColumn,
    reorderColumns,
  });

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <BoardHeader
        onAddColumn={() => setIsCreateColumnOpen(true)}
        isPublic={false}
        onTogglePrivacy={() => {}}
        members={[]}
      />

      <BoardColumnsList
        columns={columns}
        tasks={tasks.filter((t) => t.boardId === boardId)}
      />

      {/* דיאלוג יצירת עמודה חדשה */}
      <CreateColumnDialog
        open={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
        boardId={boardId}
        currentUserId={currentUserId}
      />

      {/* דיאלוג עריכת עמודה */}
      {editingColumn && (
        <EditColumnDialog
          open={Boolean(editingColumn)}
          onClose={() => setEditingColumn(null)}
          column={editingColumn}
          boardId={boardId}
        />
      )}
    </DragDropProvider>
  );
};
