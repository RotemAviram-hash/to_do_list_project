import React, { useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import type { Board } from "../../models/Board";

// שליפת המשתמש המחובר באופן ישיר
import { useUser } from "../../../User/hooks/useUser";

// ייבוא הטיפוס מההוק
import type { FilterOptions } from "../../../Task/hooks/useTaskFilters";
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
  onDeleteBoard: (boardId: string) => Promise<void> | void;

  // 🌟 דרך א' (מומלצת): העברת אובייקט הפילטרים ועדכון ה-State ישירות
  filters?: FilterOptions;
  setFilters?: React.Dispatch<React.SetStateAction<FilterOptions>>;

  // 🔄 דרך ב' (תמיכה לאחור ב-Props פרטניים)
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  showOnlySaved?: boolean;
  onToggleSaved?: (val: boolean) => void;
  showOnlyMine?: boolean;
  onToggleMine?: (val: boolean) => void;
}

// ⚡ אופטימיזציה: עטיפה ב-React.memo למניעת רירונדר כשהורה מתרנדר ללא שינוי בפרופס
export const BoardControlsPanel: React.FC<BoardControlsPanelProps> = React.memo(
  ({
    boards,
    activeBoardId,
    onTabChange,
    getColumnCount,
    onDeleteBoard,
    // אובייקט פילטרים ישיר
    filters,
    setFilters,
    // Props פרטניים למקרה שלא הועבר filters
    searchQuery: propSearchQuery = "",
    onSearchChange,
    showOnlySaved: propShowOnlySaved = false,
    onToggleSaved,
    showOnlyMine: propShowOnlyMine = false,
    onToggleMine,
  }) => {
    const { user } = useUser();
    const currentUserId = user?.id || "";

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 🎯 חילוץ הערכים הפעילים מתוך filters או מתוך ה-Props הבודדים
    const currentSearchQuery = filters?.searchQuery ?? propSearchQuery;
    const currentShowSaved = filters?.showOnlySaved ?? propShowOnlySaved;
    const currentShowMine = filters?.showOnlyMine ?? propShowOnlyMine;

    // ⚡ אופטימיזציה: חישוב הלוח הפעיל ממומק ולא רץ מחדש ללא צורך
    const activeBoard = useMemo(
      () => boards.find((b) => b.id === activeBoardId),
      [boards, activeBoardId],
    );

    // ⚡ הטיפול בשינוי טקסט חיפוש
    const handleSearchChange = useCallback(
      (val: string) => {
        if (setFilters) {
          setFilters((prev) => ({ ...prev, searchQuery: val }));
        } else if (onSearchChange) {
          onSearchChange(val);
        }
      },
      [setFilters, onSearchChange],
    );

    // ⚡ פונקציות יציבות לפתיחה/סגירה של הדיאלוגים
    const handleOpenCreate = useCallback(() => setIsCreateOpen(true), []);
    const handleCloseCreate = useCallback(() => setIsCreateOpen(false), []);
    const handleOpenEdit = useCallback(() => setIsEditOpen(true), []);
    const handleCloseEdit = useCallback(() => setIsEditOpen(false), []);

    // 🟢 שליפה אוטומטית של columnCount מתוך אובייקט ה-Board במידה ולא הועברה פונקציה
    const resolveColumnCount = useCallback(
      (id: string) => {
        if (getColumnCount) return getColumnCount(id);
        const board = boards.find((b) => b.id === id);
        return board?.columnCount ?? 0;
      },
      [boards, getColumnCount],
    );

    // מחיקת לוח פעיל
    const handleDeleteActiveBoard = useCallback(async () => {
      if (!activeBoardId || isDeleting) return;

      if (window.confirm(`האם למחוק את הלוח "${activeBoard?.title || ""}"?`)) {
        try {
          setIsDeleting(true);
          await onDeleteBoard(activeBoardId);
        } catch (err) {
          console.error("שגיאה במחיקת הלוח:", err);
        } finally {
          setIsDeleting(false);
        }
      }
    }, [activeBoardId, activeBoard?.title, isDeleting, onDeleteBoard]);

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
            onEdit={handleOpenEdit}
            onDelete={handleDeleteActiveBoard}
            disabled={!activeBoard || isDeleting}
          />
          <BoardTabsBar
            boards={boards}
            activeBoardId={activeBoardId}
            onTabChange={onTabChange}
            getColumnCount={resolveColumnCount}
            onCreateBoard={handleOpenCreate}
          />
        </Box>

        {/* שורה 2: סרגל סינון המשימות */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: "100%",
          }}
        >
          <BoardSearchBar
            searchQuery={currentSearchQuery}
            onSearchChange={handleSearchChange}
          />

          <BoardFilterButtons
            filters={filters}
            setFilters={setFilters}
            showOnlySaved={currentShowSaved}
            onToggleSaved={onToggleSaved}
            showOnlyMine={currentShowMine}
            onToggleMine={onToggleMine}
          />
        </Box>

        {/* דיאלוגים */}
        <CreateBoardDialog
          open={isCreateOpen}
          onClose={handleCloseCreate}
          currentUserId={currentUserId}
        />

        {activeBoard && (
          <EditBoardDialog
            open={isEditOpen}
            onClose={handleCloseEdit}
            board={activeBoard}
          />
        )}
      </Box>
    );
  },
);

BoardControlsPanel.displayName = "BoardControlsPanel";
