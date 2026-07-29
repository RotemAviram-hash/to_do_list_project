import React, { useState, useCallback, useMemo } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { BoardHeader } from "./BoardHeader";
import { BoardColumnsList } from "./BoardColumnsList";
import { CreateColumnDialog } from "../../../Column/dialogs/CreateColumnDialog";
import { EditColumnDialog } from "../../../Column/dialogs/EditColumnDialog";

// הוקים וטיפוסים
import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";
import {
  useTaskFilters,
  type FilterOptions,
} from "../../../Task/hooks/useTaskFilters";

import type { Column } from "../../../Column/models/Column";
import type { BoardMember } from "./BoardMembersAccess";

// ⚡ אופטימיזציה קריטית: מערך ריק קבוע מחוץ לקומפוננטה
// מונע יצירת array רפרנס חדש בכל רנדור ושומר על memoization ב-BoardHeader!
const EMPTY_MEMBERS: BoardMember[] = [];

interface KanbanBoardContainerProps {
  boardId: string;
  isPublic: boolean;
  onTogglePrivacy: () => void;
  userId?: string;

  // 🌟 תמיכה באובייקט הפילטרים המלא מ-KanbanPreview
  filters?: FilterOptions;

  // 🔄 תמיכה לאחור ב-Props בודדים
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
}

// ⚡ אופטימיזציה: עטיפה ב-React.memo
export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> =
  React.memo(
    ({
      boardId,
      isPublic,
      onTogglePrivacy,
      userId = "",
      filters,
      searchQuery = "",
      showOnlySaved = false,
      showOnlyMine = false,
    }) => {
      // 1. ניהול עמודות ומשימות של הלוח הנוכחי בלבד
      const { columns, reorderColumns } = useColumns(boardId);
      const { tasks, moveTaskToColumn } = useTasks();

      // 2. ⚡ אופטימיזציה: נרמול אובייקט הפילטרים (בין אם הועבר filters או Props בודדים)
      const activeFilters = useMemo<FilterOptions>(
        () => ({
          searchQuery: filters?.searchQuery ?? searchQuery,
          showOnlySaved: filters?.showOnlySaved ?? showOnlySaved,
          showOnlyMine: filters?.showOnlyMine ?? showOnlyMine,
        }),
        [filters, searchQuery, showOnlySaved, showOnlyMine],
      );

      // 3. ⚡ סינון משימות ממומק דרך ה-Hook שלנו
      const boardTasks = useMemo(
        () => tasks.filter((t) => t.boardId === boardId),
        [tasks, boardId],
      );

      const { filteredTasks } = useTaskFilters(
        boardTasks,
        userId,
        activeFilters,
      );

      // 4. מצבים לפתיחת דיאלוגים
      const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
      const [editingColumn, setEditingColumn] = useState<Column | null>(null);

      // ⚡ אופטימיזציה: פונקציות Handler יציבות
      const handleOpenCreateColumn = useCallback(
        () => setIsCreateColumnOpen(true),
        [],
      );
      const handleCloseCreateColumn = useCallback(
        () => setIsCreateColumnOpen(false),
        [],
      );
      const handleCloseEditColumn = useCallback(
        () => setEditingColumn(null),
        [],
      );

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
            onAddColumn={handleOpenCreateColumn}
            isPublic={isPublic}
            onTogglePrivacy={onTogglePrivacy}
            members={EMPTY_MEMBERS}
          />

          <BoardColumnsList columns={columns} tasks={filteredTasks} />

          <CreateColumnDialog
            open={isCreateColumnOpen}
            onClose={handleCloseCreateColumn}
            boardId={boardId}
            currentUserId={userId}
          />

          {editingColumn && (
            <EditColumnDialog
              open={Boolean(editingColumn)}
              onClose={handleCloseEditColumn}
              column={editingColumn}
              boardId={boardId}
            />
          )}
        </DragDropProvider>
      );
    },
  );

KanbanBoardContainer.displayName = "KanbanBoardContainer";
