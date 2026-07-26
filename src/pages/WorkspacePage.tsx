import React, { useState } from "react";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";

// Components
import { BoardControlsPanel } from "../features/Board/components/BoardControlsPanel/BoardControlsPanel";
import { KanbanBoardContainer } from "../features/Board/components/KanbanBoard/KanbanBoardContainer";

// Custom Hooks
import { useBoards } from "../features/Board/hooks/useBoards";
import { useColumns } from "../features/Column/hooks/useColumns"; // 👈 1. מייבאים את הוק העמודות

export default function KanbanPreview({ userId }: { userId?: string }) {
  // 1. ניהול הסטייטים של סינון המשימות
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  // 2. שליפת הלוחות והלוח הפעיל
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    loading: loadingBoards,
    error: errorBoards,
  } = useBoards(userId);

  // 3. שליפת העמודות עבור ספירת העמודות בטאבים
  const { columns } = useColumns(); // 👈 2. שולפים את כל העמודות

  // 4. מצב טעינה
  if (loadingBoards) {
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

  // 5. מצב שגיאה
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
        onTabChange={(_, newBoardId) => setActiveBoardId(newBoardId)}
        getColumnCount={(bId) =>
          columns.filter((c) => c.boardId === bId).length
        } // 👈 3. מחשבים כמה עמודות יש לכל לוח!
        currentUserId={userId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showOnlySaved={showOnlySaved}
        onToggleSaved={setShowOnlySaved}
        showOnlyMine={showOnlyMine}
        onToggleMine={setShowOnlyMine}
      />

      {/* תצוגה ראשית של הלוח הפעיל */}
      {activeBoardId ? (
        <KanbanBoardContainer
          boardId={activeBoardId}
          userId={userId}
          searchQuery={searchQuery}
          showOnlySaved={showOnlySaved}
          showOnlyMine={showOnlyMine}
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
