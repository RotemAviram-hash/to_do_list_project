import React, { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { BoardHeader } from "./BoardHeader";
import { BoardColumnsList } from "./BoardColumnsList";
import { CreateColumnDialog } from "../../../Column/dialogs/CreateColumnDialog";
import { EditColumnDialog } from "../../../Column/dialogs/EditColumnDialog";

import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";
import { useTaskFilters } from "../../../Task/hooks/useTaskFilters";

import type { Column } from "../../../Column/models/Column";

interface KanbanBoardContainerProps {
  boardId: string;
  isPublic?: boolean; // 👈 Prop חדש עבור מצב הפרטיות
  onTogglePrivacy?: () => void; // 👈 Prop חדש בלחיצה על שינוי פרטיות
  userId?: string;
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
}

export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> = ({
  boardId,
  isPublic = false,
  onTogglePrivacy = () => {},
  userId = "",
  searchQuery = "",
  showOnlySaved = false,
  showOnlyMine = false,
}) => {
  // 1. הוקים לניהול דאטה של עמודות ומשימות בלבד
  const { columns, reorderColumns } = useColumns(boardId);
  const { tasks, moveTaskToColumn } = useTasks();

  // 2. סינון ראשוני של משימות לפי הלוח
  const boardTasks = tasks.filter((t) => t.boardId === boardId);

  // 3. סינון לפי חיפוש, שמורות והמשימות שלי
  const { filteredTasks } = useTaskFilters(boardTasks, userId, {
    searchQuery,
    showOnlySaved,
    showOnlyMine,
  });

  // 4. מצבים לפתיחת דיאלוגים
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  // 5. גרירה
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
        isPublic={isPublic} // 👈 עובר ישירות ל-Header
        onTogglePrivacy={onTogglePrivacy} // 👈 עובר ישירות ל-Header
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
