import React from "react";
import { Box } from "@mui/material";
import type { Board } from "../../models/Board";
import { useBoardFilters } from "../../hooks/useBoardFilters";

import { BoardOptionsMenu } from "./BoardOptionsMenu";
import { BoardTabsBar } from "./BoardTabsBar";
import { BoardSearchBar } from "./BoardSearchBar";
import { BoardFilterButtons } from "./BoardFilterButtons";

interface BoardControlsPanelProps {
  boards: Board[];
  activeBoardId: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  getColumnCount: (id: string) => number;
  onEditBoard?: () => void;
  onDeleteBoard?: () => void;
  onCreateBoard?: () => void;
}

export const BoardControlsPanel: React.FC<BoardControlsPanelProps> = ({
  boards,
  activeBoardId,
  onTabChange,
  getColumnCount,
  onEditBoard,
  onDeleteBoard,
  onCreateBoard,
}) => {
  // שליפת מצבי הסינון ישירות מההוק
  const {
    searchQuery,
    setSearchQuery,
    showOnlySaved,
    setShowOnlySaved,
    showOnlyMine,
    setShowOnlyMine,
  } = useBoardFilters();

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
        <BoardOptionsMenu onEdit={onEditBoard} onDelete={onDeleteBoard} />
        <BoardTabsBar
          boards={boards}
          activeBoardId={activeBoardId}
          onTabChange={onTabChange}
          getColumnCount={getColumnCount}
          onCreateBoard={onCreateBoard}
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
    </Box>
  );
};
