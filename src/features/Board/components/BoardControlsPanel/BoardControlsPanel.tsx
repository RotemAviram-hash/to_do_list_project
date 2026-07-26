import React, { useState } from "react";
import { Box } from "@mui/material";
import type { Board } from "../../models/Board";
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
  getColumnCount?: (id: string) => number;
  currentUserId?: string;
  // מצבי סינון המשימות שמועברים למעלה/למכולה הראשית
  searchQuery: string;
  onSearchChange: (val: string) => void;
  showOnlySaved: boolean;
  onToggleSaved: (val: boolean) => void;
  showOnlyMine: boolean;
  onToggleMine: (val: boolean) => void;
}

export const BoardControlsPanel: React.FC<BoardControlsPanelProps> = ({
  boards,
  activeBoardId,
  onTabChange,
  getColumnCount = () => 0,
  currentUserId = "",
  searchQuery,
  onSearchChange,
  showOnlySaved,
  onToggleSaved,
  showOnlyMine,
  onToggleMine,
}) => {
  const { deleteBoard } = useBoards(currentUserId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const handleDeleteActiveBoard = async () => {
    if (!activeBoardId) return;

    if (window.confirm(`האם למחוק את הלוח "${activeBoard?.title || ""}"?`)) {
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
      {/* שורה 1: טאבים של כל הלוחות */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
      >
        <BoardOptionsMenu
          onEdit={() => setIsEditOpen(true)}
          onDelete={handleDeleteActiveBoard}
        />
        <BoardTabsBar
          boards={boards} // 👈 מקבל את כל הלוחות כרגיל!
          activeBoardId={activeBoardId}
          onTabChange={onTabChange}
          getColumnCount={getColumnCount}
          onCreateBoard={() => setIsCreateOpen(true)}
        />
      </Box>

      {/* שורה 2: סרגל סינון המשימות */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}
      >
        <BoardSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <BoardFilterButtons
          showOnlySaved={showOnlySaved}
          onToggleSaved={onToggleSaved}
          showOnlyMine={showOnlyMine}
          onToggleMine={onToggleMine}
        />
      </Box>

      {/* דיאלוגים */}
      <CreateBoardDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        currentUserId={currentUserId}
      />

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
