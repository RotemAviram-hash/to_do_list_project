import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent, // <-- נוסיף את זה
  closestCorners,
  DragOverlay, // <-- נוסיף את זה
} from "@dnd-kit/core";
import { ColumnBoard } from "../../Column/ColumnBoard";
import { TaskCard } from "../../Task/TaskCard"; // <-- נייבא את ה-TaskCard לתצוגת הריחוף
import { type Column, type Task } from "../../WorkspaceTypes";
import { currentUserId } from "../../../../store/WorkspaceStore";

interface BoardGridProps {
  columns: Column[];
  tasks: Task[];
  searchQuery: string;
  showOnlySaved: boolean;
  showOnlyMine: boolean;
  isDarkMode: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isScrollable: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScroll: () => void;
  onScrollClick: (direction: "left" | "right") => void;
  onToggleSave: (id: string) => void;
  onMoveTask: (activeId: string, overId: string) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  columns,
  tasks,
  searchQuery,
  showOnlySaved,
  showOnlyMine,
  isDarkMode,
  scrollContainerRef,
  isScrollable,
  canScrollLeft,
  canScrollRight,
  onScroll,
  onScrollClick,
  onToggleSave,
  onMoveTask,
}) => {
  // נשמור בסטייט את המשימה שנגררת כרגע
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null); // איפוס המשימה הנגררת בסיום

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    onMoveTask(activeId, overId);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart} // <-- רישום התחלת גרירה
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ position: "relative", width: "100%" }}>
        <Box
          ref={scrollContainerRef}
          onScroll={onScroll}
          sx={{
            width: "100%",
            overflowX: "auto",
            pb: 3,
            px: 1,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* כפתורי הניווט (chevron) */}
          {isScrollable && (
            <>
              <IconButton
                onClick={() => onScrollClick("left")}
                disabled={!canScrollLeft}
                sx={{
                  position: "absolute",
                  left: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => onScrollClick("right")}
                disabled={!canScrollRight}
                sx={{
                  position: "absolute",
                  right: -20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                  "&:hover": { bgcolor: "background.default" },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {/* גריד העמודות */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, minmax(280px, 1fr))`,
              gap: 3,
              width: "100%",
              minWidth:
                columns.length > 4 ? `${columns.length * 300}px` : "100%",
              alignItems: "flex-start",
            }}
          >
            {columns.map((column) => {
              const lowerQuery = searchQuery.toLowerCase();

              const filteredTasks = tasks.filter((task) => {
                const matchesColumn = task.columnId === column.id;
                const matchesSearch =
                  !lowerQuery ||
                  task.title?.toLowerCase().includes(lowerQuery) ||
                  task.description?.toLowerCase().includes(lowerQuery);
                const matchesSaved =
                  !showOnlySaved || task.savedBy?.includes(currentUserId);
                const matchesMine =
                  !showOnlyMine || task.assigneeId === currentUserId;

                return (
                  matchesColumn && matchesSearch && matchesSaved && matchesMine
                );
              });

              return (
                <ColumnBoard
                  key={column.id}
                  column={column}
                  tasks={filteredTasks}
                  isDarkMode={isDarkMode}
                  onToggleSave={onToggleSave}
                />
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* שכבת הריחוף הגלובלית - משחררת את הכרטיס מכל גבולות ה-CSS של העמודות! */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <Box
            sx={{
              width: "100%",
              transform: "rotate(3deg)",
              cursor: "grabbing",
            }}
          >
            <TaskCard
              task={activeTask}
              borderColor={
                columns.find((col) => col.id === activeTask.columnId)
                  ?.borderColor || "transparent"
              }
              isDarkMode={isDarkMode}
              onToggleSave={onToggleSave}
              isDragging={true}
            />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
