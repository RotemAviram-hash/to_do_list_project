import React, { useState, useCallback, useMemo } from "react";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";

// Components
import { BoardControlsPanel } from "../features/Board/components/BoardControlsPanel/BoardControlsPanel";
import { KanbanBoardContainer } from "../features/Board/components/KanbanBoard/KanbanBoardContainer";

// Custom Hooks & Context
import { useUser } from "../features/User/hooks/useUser";
import { useBoards } from "../features/Board/hooks/useBoards";

// ייבוא טיפוס הפילטרים מההוק
import type { FilterOptions } from "../features/Task/hooks/useTaskFilters";

export default function KanbanPreview() {
  const { user, loading: loadingUser } = useUser();
  const userId = user?.id || "";

  // 🎯 1. איחוד ה-State של כל הפילטרים לאובייקט יחיד
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

  // ⚡ 2. אופטימיזציה: יצירת מילון שליפה מהיר O(1) לספירת עמודות
  const columnCountMap = useMemo(() => {
    const map = new Map<string, number>();
    boards.forEach((board) => {
      map.set(board.id, board.columnCount || 0);
    });
    return map;
  }, [boards]);

  // שליפת כמות העמודות ב-O(1) ללא סריקת המערך מחדש בכל טאב
  const getColumnCount = useCallback(
    (bId: string) => columnCountMap.get(bId) || 0,
    [columnCountMap],
  );

  // 🟢 אופטימיזציה: useCallback למניעת רנדורים מיותרים של פאנל השליטה
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
      <BoardControlsPanel
        boards={boards}
        activeBoardId={activeBoardId || ""}
        onTabChange={handleTabChange}
        getColumnCount={getColumnCount}
        onDeleteBoard={deleteBoard}
        filters={filters}
        setFilters={setFilters}
      />

      {/* תצוגה ראשית של הלוח הפעיל */}
      {activeBoardId ? (
        <KanbanBoardContainer
          boardId={activeBoardId}
          userId={userId}
          filters={filters}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 8,
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            עדיין אין לך לוחות במערכת.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
