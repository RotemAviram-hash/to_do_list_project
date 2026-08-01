import React, { useState, useCallback, useMemo } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";

// Components
import { BoardControlsPanel } from "../features/Board/components/BoardControlsPanel/BoardControlsPanel";
import { KanbanBoardContainer } from "../features/Board/components/KanbanBoard/KanbanBoardContainer";
import { EmptyBoardsState } from "../features/Board/components/KanbanBoard/EmptyBoardsState";
import { CreateBoardDialog } from "../features/Board/dialogs/CreateBoardDialog";

// Custom Hooks & Context
import { useUser } from "../features/User/hooks/useUser";
import { useBoards } from "../features/Board/hooks/useBoards";

// Models & Types
import type { FilterOptions } from "../features/Task/hooks/useTaskFilters";
import type { BoardMemberRole } from "../features/Board/models/Board";

export default function KanbanPreview() {
  const { user, loading: loadingUser } = useUser();
  const userId = user?.id || "";

  // 🎯 State לניהול פתיחת דיאלוג יצירת לוח חדש
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const handleOpenCreateBoard = useCallback(() => {
    setIsCreateBoardOpen(true);
  }, []);

  const handleCloseCreateBoard = useCallback(() => {
    setIsCreateBoardOpen(false);
  }, []);

  // 🎯 איחוד ה-State של כל הפילטרים לאובייקט יחיד
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    showOnlySaved: false,
    showOnlyMine: false,
  });

  // קריאה לשרת עבור כל הלוחות
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    deleteBoard,
    loading: loadingBoards,
    error: errorBoards,
  } = useBoards(userId);

  // 👑 מציאת הלוח הפעיל מתוך רשימת הלוחות
  const currentBoard = useMemo(() => {
    return boards.find((b) => b.id === activeBoardId) || null;
  }, [boards, activeBoardId]);

  // 🛡️ חישוב הרשאת המשתמש בלוח הפעיל
  const userRole = useMemo<BoardMemberRole>(() => {
    if (!currentBoard || !userId) return "viewer";
    if (currentBoard.createdBy === userId) return "owner";
    return currentBoard.members?.[userId] || "viewer";
  }, [currentBoard, userId]);

  // 🚩 דגלי הרשאות מרכזיים להעברה לרכיבי ה-UI
  const isOwner = userRole === "owner";
  const canEdit = isOwner || userRole === "editor"; // CRUD (יצירה, עריכה, מחיקה) מורשה רק ל-Owner ו-Editor

  // ⚡ אופטימיזציה: יצירת מילון שליפה מהיר O(1) לספירת עמודות
  const columnCountMap = useMemo(() => {
    const map = new Map<string, number>();
    boards.forEach((board) => {
      map.set(board.id, board.columnCount || 0);
    });
    return map;
  }, [boards]);

  // שליפת כמות העמודות ב-O(1)
  const getColumnCount = useCallback(
    (bId: string) => columnCountMap.get(bId) || 0,
    [columnCountMap],
  );

  // 🟢 useCallback למניעת רנדורים מיותרים של פאנל השליטה
  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newBoardId: string) => {
      setActiveBoardId(newBoardId);
    },
    [setActiveBoardId],
  );

  // טעינה
  if (loadingUser || loadingBoards) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // שגיאה
  if (errorBoards) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{errorBoards}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* פאנל שליטה */}
      {boards.length > 0 && (
        <BoardControlsPanel
          boards={boards}
          activeBoardId={activeBoardId || ""}
          onTabChange={handleTabChange}
          getColumnCount={getColumnCount}
          onDeleteBoard={deleteBoard}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {/* תצוגה ראשית של הלוח הפעיל / מצב ריק */}
      {activeBoardId ? (
        <KanbanBoardContainer
          boardId={activeBoardId}
          userId={userId}
          filters={filters}
          isOwner={isOwner} // 👈 דגל ראשון: האם המשתמש בעלי הלוח (מורשה לשתף/למחוק לוח)
          canEdit={canEdit} // 👈 דגל שני: האם המשתמש מורשה ל-CRUD (עריכה/גרירה/הוספה)
        />
      ) : (
        <EmptyBoardsState onCreateBoard={handleOpenCreateBoard} />
      )}

      {/* דיאלוג ליצירת לוח חדש */}
      <CreateBoardDialog
        open={isCreateBoardOpen}
        onClose={handleCloseCreateBoard}
        currentUserId={userId}
      />
    </Box>
  );
}
