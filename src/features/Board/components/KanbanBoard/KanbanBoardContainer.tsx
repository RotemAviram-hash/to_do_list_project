import React, { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { BoardHeader } from "./BoardHeader";
import { BoardColumnsList } from "./BoardColumnsList";
import { CreateColumnDialog } from "../../../Column/dialogs/CreateColumnDialog";
import { EditColumnDialog } from "../../../Column/dialogs/EditColumnDialog";

// הוקים (ללא useBoards!)
import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";
import { useTaskFilters } from "../../../Task/hooks/useTaskFilters";

import type { Column } from "../../../Column/models/Column";

interface KanbanBoardContainerProps {
  boardId: string;
  isPublic: boolean; // 👈 מקבל מ-KanbanPreview
  onTogglePrivacy: () => void; // 👈 מקבל מ-KanbanPreview
  userId?: string;
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
}

export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> = ({
  boardId,
  isPublic,
  onTogglePrivacy,
  userId = "",
  searchQuery = "",
  showOnlySaved = false,
  showOnlyMine = false,
}) => {
  // 1. ניהול עמודות ומשימות של הלוח הנוכחי בלבד
  const { columns, reorderColumns } = useColumns(boardId);
  const { tasks, moveTaskToColumn } = useTasks();

  // 2. סינון משימות
  const boardTasks = tasks.filter((t) => t.boardId === boardId);
  const { filteredTasks } = useTaskFilters(boardTasks, userId, {
    searchQuery,
    showOnlySaved,
    showOnlyMine,
  });

  // 3. מצבים לפתיחת דיאלוגים
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  // 4. גרירה
  const { handleDragEnd } = useKanbanDrag({
    columns,
    tasks: filteredTasks,
    moveTaskToColumn,
    reorderColumns,
  });

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <BoardHeader
        onAddColumn={() => setIsCreateColumnOpen(true)}
        isPublic={isPublic} // 👈 עובר הלאה
        onTogglePrivacy={onTogglePrivacy} // 👈 עובר הלאה
        members={[]}
      />

      <BoardColumnsList columns={columns} tasks={filteredTasks} />

      <CreateColumnDialog
        open={isCreateColumnOpen}
        onClose={() => setIsCreateColumnOpen(false)}
        boardId={boardId}
        currentUserId={userId}
      />

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
