import { Box, useTheme } from "@mui/material";
import { useWorkspaceStore } from "../../../store/WorkspaceStore";
import { BoardControlsPanel } from "../../Board/components/BoardControlsPanel";
import { BoardGrid } from "../../Board/components/BoardGrid";

export default function Workspace() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // כל המידע והאקשנים מגיעים מהסטור המדומה שלנו
  const store = useWorkspaceStore();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 4,
        direction: "rtl",
        transition: "background-color 0.2s ease",
      }}
    >
      {/* סרגל בקרה (טאבים, חיפוש, פילטרים וכפתורי פעולה) */}
      <BoardControlsPanel
        boards={store.boards}
        activeBoardId={store.activeBoardId}
        onTabChange={store.handleTabChange}
        getColumnCount={store.getColumnCountForBoard}
        searchQuery={store.searchQuery}
        onSearchChange={store.setSearchQuery}
        showOnlySaved={store.showOnlySaved}
        onToggleSaved={store.setShowOnlySaved}
        showOnlyMine={store.showOnlyMine}
        onToggleMine={store.setShowOnlyMine}
        isDarkMode={isDarkMode}
      />

      {/* גריד העמודות והמשימות */}
      <BoardGrid
        columns={store.currentColumns}
        tasks={store.tasks}
        searchQuery={store.searchQuery}
        showOnlySaved={store.showOnlySaved}
        showOnlyMine={store.showOnlyMine}
        isDarkMode={isDarkMode}
        scrollContainerRef={store.scrollContainerRef}
        isScrollable={store.isScrollable}
        canScrollLeft={store.canScrollLeft}
        canScrollRight={store.canScrollRight}
        onScroll={store.updateScrollButtonsState}
        onScrollClick={store.handleScroll}
        onToggleSave={store.toggleSaveTask}
        onMoveTask={store.moveTask} // <-- החיבור החשוב שנוסף כאן!
      />
    </Box>
  );
}
