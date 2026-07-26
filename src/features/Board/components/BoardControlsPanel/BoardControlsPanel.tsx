import React, { useState } from "react";
import { Box } from "@mui/material";
import type { Board } from "../../models/Board";
import { useBoardFilters } from "../../hooks/useBoardFilters";
import { useBoards } from "../../hooks/useBoards";

import { BoardOptionsMenu } from "./BoardOptionsMenu";
import { BoardTabsBar } from "./BoardTabsBar";
import { BoardSearchBar } from "./BoardSearchBar";
import { BoardFilterButtons } from "./BoardFilterButtons";

import { CreateBoardDialog } from "../../dialogs/CreateBoardDialog";
import { EditBoardDialog } from "../../dialogs/EditBoardDialog";

interface BoardControlsPanelProps {
  boards: Board[];
  activeBoardId: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  getColumnCount: (id: string) => number;
  currentUserId?: string;
}

export const BoardControlsPanel: React.FC<BoardControlsPanelProps> = ({
  boards,
  activeBoardId,
  onTabChange,
  getColumnCount,
  currentUserId = "",
}) => {
  // 1. שליפת מצבי הסינון מההוק
  const {
    searchQuery,
    setSearchQuery,
    showOnlySaved,
    setShowOnlySaved,
    showOnlyMine,
    setShowOnlyMine,
  } = useBoardFilters();

  // 2. הוק הלוחות - לשליפת פונקציית המחיקה
  const { deleteBoard } = useBoards(currentUserId);

  // 3. ניהול מצבי הדיאלוגים (פתוח/סגור)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // מציאת אובייקט הלוח הפעיל הנוכחי לצורך עריכה ומחיקה
  const activeBoard = boards.find((b) => b.id === activeBoardId);

  // 4. טיפול במחיקת הלוח הפעיל
  const handleDeleteActiveBoard = async () => {
    if (!activeBoardId) return;

    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את הלוח "${activeBoard?.title || ""}"?`,
    );

    if (confirmDelete) {
      try {
        await deleteBoard(activeBoardId);
      } catch (err) {
        console.error("שגיאה במחיקת הלוח:", err);
      }
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      {/* שורה 1: תפריט 3 נקודות + קופסת הטאבים והפלוס */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          width: "100%",
        }}
      >
        <BoardOptionsMenu
          onEdit={() => setIsEditOpen(true)}
          onDelete={handleDeleteActiveBoard}
        />
        <BoardTabsBar
          boards={boards}
          activeBoardId={activeBoardId}
          onTabChange={onTabChange}
          getColumnCount={getColumnCount}
          onCreateBoard={() => setIsCreateOpen(true)}
        />
      </Box>

      {/* שורה 2: חיפוש ופילטרים */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        <BoardSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <BoardFilterButtons
          showOnlySaved={showOnlySaved}
          onToggleSaved={setShowOnlySaved}
          showOnlyMine={showOnlyMine}
          onToggleMine={setShowOnlyMine}
        />
      </Box>

      {/* דיאלוג יצירת לוח חדש */}
      <CreateBoardDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        currentUserId={currentUserId}
      />

      {/* דיאלוג עריכת הלוח הפעיל */}
      {activeBoard && (
        <EditBoardDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          board={activeBoard}
        />
      )}
    </Box>
  );
};
