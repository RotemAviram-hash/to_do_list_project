// src/features/Board/components/KanbanBoardContainer.tsx
import React, { useState, useCallback, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { DragDropProvider } from "@dnd-kit/react";

import { BoardHeader } from "./BoardHeader";
import { BoardColumnsList } from "./BoardColumnsList";
import { ShareBoardDialog } from "../../dialogs/ShareBoardDialog";
import { CreateColumnDialog } from "../../../Column/dialogs/CreateColumnDialog";
import { EditColumnDialog } from "../../../Column/dialogs/EditColumnDialog";
import { CalendarView } from "../../../Calendar/components/CalendarView";

import { useBoards } from "../../hooks/useBoards";
import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";
import {
  useTaskFilters,
  type FilterOptions,
} from "../../../Task/hooks/useTaskFilters";
import type { Column as ColumnType } from "../../../Column/models/Column";
import type { BoardMemberRole } from "../../models/Board";

interface KanbanBoardContainerProps {
  boardId: string;
  userId?: string;
  filters?: FilterOptions;
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
  isOwner?: boolean; // 👈 מקבל מ-KanbanPreview (ברירת מחדל: false)
  canEdit?: boolean; // 👈 מקבל מ-KanbanPreview (ברירת מחדל: false)
}

export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> =
  React.memo(
    ({
      boardId,
      userId = "",
      filters,
      searchQuery = "",
      showOnlySaved = false,
      showOnlyMine = false,
      isOwner = false,
      canEdit = false,
    }) => {
      // 📅 1. ניהול תצוגת הלוח (קנבן מול לוח שנה)
      const [viewMode, setViewMode] = useState<"kanban" | "calendar">("kanban");

      // 2. חיבור ל-useBoards
      const { boards, addMemberToBoard, removeMemberFromBoard } =
        useBoards(userId);

      // מציאת הלוח הנוכחי מתוך רשימת הלוחות
      const currentBoard = useMemo(
        () => boards.find((b) => b.id === boardId),
        [boards, boardId],
      );

      // 3. ניהול עמודות ומשימות
      const { columns, reorderColumns } = useColumns(boardId);
      const { tasks, moveTaskToColumn } = useTasks(boardId);
      // 4. סינון משימות עבור תצוגת הקנבן ולוח השנה
      const activeFilters = useMemo<FilterOptions>(
        () => ({
          searchQuery: filters?.searchQuery ?? searchQuery,
          showOnlySaved: filters?.showOnlySaved ?? showOnlySaved,
          showOnlyMine: filters?.showOnlyMine ?? showOnlyMine,
        }),
        [filters, searchQuery, showOnlySaved, showOnlyMine],
      );

      const boardTasks = useMemo(
        () => tasks.filter((t) => t.boardId === boardId),
        [tasks, boardId],
      );

      const { filteredTasks } = useTaskFilters(
        boardTasks,
        userId,
        activeFilters,
      );

      // 5. ניהול דיאלוגים
      const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
      const [isShareBoardOpen, setIsShareBoardOpen] = useState(false);
      const [editingColumn, setEditingColumn] = useState<ColumnType | null>(
        null,
      );

      // ⚡ 6. פונקציות מעודכנות לשיתוף
      const handleAddMember = useCallback(
        async (targetUserId: string, role: BoardMemberRole) => {
          if (!boardId) return;
          await addMemberToBoard(boardId, targetUserId, role);
        },
        [boardId, addMemberToBoard],
      );

      const handleRemoveMember = useCallback(
        async (targetUserId: string) => {
          if (!boardId) return;
          await removeMemberFromBoard(boardId, targetUserId);
        },
        [boardId, removeMemberFromBoard],
      );

      // 7. לוגיקת גרירה
      const { handleDragEnd } = useKanbanDrag({
        columns,
        tasks: filteredTasks,
        moveTaskToColumn,
        reorderColumns,
      });

      // 🛡️ במידה והלוח עדיין נטען
      if (!currentBoard) {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              p: 4,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        );
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* סרגל עליון - מקבל את הדגלים להסתרת/הצגת כפתורים */}
          <BoardHeader
            onAddColumn={() => setIsCreateColumnOpen(true)}
            onAddMember={() => setIsShareBoardOpen(true)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isOwner={isOwner} // 👈 שרשור
            canEdit={canEdit} // 👈 שרשור
          />

          {/* 📅 תצוגת לוח שנה או תצוגת קנבן */}
          {viewMode === "calendar" ? (
            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
              <CalendarView tasks={filteredTasks} />
            </Box>
          ) : (
            /* 🚫 מניעת גרירה לחלוטין אם המשתמש הוא Viewer בלבד */
            <DragDropProvider onDragEnd={canEdit ? handleDragEnd : undefined}>
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <BoardColumnsList
                  columns={columns}
                  tasks={filteredTasks}
                  onAddColumn={() => setIsCreateColumnOpen(true)}
                  canEdit={canEdit} // 👈 שרשור לרשימת העמודות והכרטיסים
                />
              </Box>
            </DragDropProvider>
          )}

          {/* 🛠️ דיאלוגים */}
          {canEdit && (
            <CreateColumnDialog
              open={isCreateColumnOpen}
              onClose={() => setIsCreateColumnOpen(false)}
              boardId={boardId}
              currentUserId={userId}
            />
          )}

          {isOwner && currentBoard && (
            <ShareBoardDialog
              open={isShareBoardOpen}
              onClose={() => setIsShareBoardOpen(false)}
              board={currentBoard}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {canEdit && editingColumn && (
            <EditColumnDialog
              open={Boolean(editingColumn)}
              onClose={() => setEditingColumn(null)}
              column={editingColumn}
              boardId={boardId}
            />
          )}
        </Box>
      );
    },
  );

KanbanBoardContainer.displayName = "KanbanBoardContainer";
