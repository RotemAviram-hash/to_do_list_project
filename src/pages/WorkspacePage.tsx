import React, { useState } from "react";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";

// Components
import { BoardControlsPanel } from "../features/Board/components/BoardControlsPanel/BoardControlsPanel";
import { KanbanBoardContainer } from "../features/Board/components/KanbanBoard/KanbanBoardContainer";

// Custom Hooks
import { useBoards } from "../features/Board/hooks/useBoards";
import { useColumns } from "../features/Column/hooks/useColumns";

export default function KanbanPreview({ userId }: { userId?: string }) {
  // 1. סטייטים לסינון
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  // 2. קריאה יחידה לשרת עבור כל הלוחות
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    toggleBoardPrivacy, // 👈 הפונקציה מההוק
    loading: loadingBoards,
    error: errorBoards,
  } = useBoards(userId);

  // 3. שליפת עמודות לספירה בטאבים
  const { columns } = useColumns();

  // שליפת הלוח הפעיל הנוכחי ומצב הפרטיות שלו
  const activeBoard = boards.find((b) => b.id === activeBoardId);

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
        }
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
          isPublic={activeBoard?.isPublic ?? false}
          onTogglePrivacy={() =>
            toggleBoardPrivacy(activeBoardId, activeBoard?.isPublic ?? false)
          }
          userId={userId}
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
