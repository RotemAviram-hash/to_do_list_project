import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  alpha,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { DragDropProvider } from "@dnd-kit/react";

import { CreateColumnDialog } from "../../../Column/dialogs/CreateColumnDialog";
import { EditColumnDialog } from "../../../Column/dialogs/EditColumnDialog";
import Column from "../../../Column/components/Column";

// 📅 ייבוא לוח השנה
import { CalendarView } from "../../../Calendar/components/CalendarView";

// הוקים וטיפוסים
import { useColumns } from "../../../Column/hooks/useColumns";
import { useTasks } from "../../../Task/hooks/useTasks";
import { useKanbanDrag } from "../../hooks/useKanbanDrag";
import {
  useTaskFilters,
  type FilterOptions,
} from "../../../Task/hooks/useTaskFilters";

import type { Column as ColumnType } from "../../../Column/models/Column";
import type { Task } from "../../../Task/models/Task";

// ==========================================
// 1. BoardHeader Component
// ==========================================
interface BoardHeaderProps {
  onAddColumn: () => void;
  viewMode: "kanban" | "calendar";
  onViewModeChange: (mode: "kanban" | "calendar") => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = React.memo(
  ({ onAddColumn, viewMode, onViewModeChange }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.8,
          mb: 2,
          borderBottom: "1px solid",
          borderColor: theme.palette.divider,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* כפתור הוספת עמודה (שרלוונטי רק לתצוגת קנבן) */}
          {viewMode === "kanban" && (
            <Button
              size="small"
              onClick={onAddColumn}
              startIcon={<AddRoundedIcon sx={{ fontSize: 19 }} />}
              sx={{
                borderRadius: "12px",
                px: 2.2,
                py: 0.8,
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.18 : 0.08,
                ),
                color: theme.palette.primary.main,
                border: "1px solid",
                borderColor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.3 : 0.2,
                ),
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 4px 14px ${alpha(
                    theme.palette.primary.main,
                    0.35,
                  )}`,
                },
              }}
            >
              עמודה חדשה
            </Button>
          )}

          {/* 🔀 מחליף תצוגות (Kanban vs Calendar) */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && onViewModeChange(val)}
            size="small"
            sx={{
              bgcolor: theme.palette.action.hover,
              p: 0.4,
              borderRadius: "12px",
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                fontWeight: 600,
                fontSize: "0.82rem",
                textTransform: "none",
                "&.Mui-selected": {
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  boxShadow: theme.shadows[1],
                },
              },
            }}
          >
            <ToggleButton value="kanban">
              <ViewWeekRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} /> קנבן
            </ToggleButton>
            <ToggleButton value="calendar">
              <CalendarMonthRoundedIcon sx={{ fontSize: 18, mr: 0.8 }} /> לוח
              שנה
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    );
  },
);

BoardHeader.displayName = "BoardHeader";

// ==========================================
// 2. BoardColumnsList Component
// ==========================================
interface BoardColumnsListProps {
  columns: ColumnType[];
  tasks: Task[];
  onAddColumn?: () => void;
}

export const BoardColumnsList: React.FC<BoardColumnsListProps> = React.memo(
  ({ columns, tasks, onAddColumn }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const tasksByColumnMap = useMemo(() => {
      const map: Record<string, Task[]> = {};
      for (const task of tasks) {
        if (!map[task.columnId]) {
          map[task.columnId] = [];
        }
        map[task.columnId].push(task);
      }
      return map;
    }, [tasks]);

    if (columns.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            my: 4,
            borderRadius: "16px",
            border: "2px dashed",
            borderColor: theme.palette.divider,
            bgcolor: theme.palette.action.hover,
            textAlign: "center",
            gap: 1.5,
          }}
        >
          <ViewColumnOutlinedIcon
            sx={{
              fontSize: 48,
              color: theme.palette.text.secondary,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            אין עמודות בלוח זה עדיין
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", maxWidth: 360 }}
          >
            לחצי על "עמודה חדשה" כדי להתחיל לארגן את המשימות בלוח.
          </Typography>
          {onAddColumn && (
            <Button
              variant="outlined"
              size="small"
              onClick={onAddColumn}
              startIcon={<AddRoundedIcon />}
              sx={{ mt: 1, borderRadius: "10px", fontWeight: 600 }}
            >
              הוספת עמודה ראשונה
            </Button>
          )}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 2,
          pt: 0.5,
          px: 0.5,
          alignItems: "flex-start",
          flexGrow: 1,
          width: "100%",
          "&::-webkit-scrollbar": { height: "8px" },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark
              ? alpha(theme.palette.common.white, 0.15)
              : alpha(theme.palette.common.black, 0.15),
            borderRadius: "10px",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: isDark
                ? alpha(theme.palette.common.white, 0.28)
                : alpha(theme.palette.common.black, 0.28),
            },
          },
        }}
      >
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              minWidth: { xs: 280, sm: 320 },
              maxWidth: { xs: 280, sm: 340 },
              flexShrink: 0,
            }}
          >
            <Column
              column={column}
              tasks={tasksByColumnMap[column.id] || []}
              columns={columns}
            />
          </Box>
        ))}
      </Box>
    );
  },
);

BoardColumnsList.displayName = "BoardColumnsList";

// ==========================================
// 3. KanbanBoardContainer Component
// ==========================================
interface KanbanBoardContainerProps {
  boardId: string;
  userId?: string;
  filters?: FilterOptions;
  searchQuery?: string;
  showOnlySaved?: boolean;
  showOnlyMine?: boolean;
}

export const KanbanBoardContainer: React.FC<KanbanBoardContainerProps> =
  React.memo(
    ({
      boardId,
      userId = "",
      filters,
      searchQuery = "",
      showOnlySaved = false,
      showOnlyMine = false,
    }) => {
      // 0. State להחלת התצוגה (Kanban או Calendar)
      const [viewMode, setViewMode] = useState<"kanban" | "calendar">("kanban");

      // 1. ניהול עמודות ומשימות
      const { columns, reorderColumns } = useColumns(boardId);
      const { tasks, moveTaskToColumn } = useTasks();

      // 2. נרמול אובייקט הפילטרים
      const activeFilters = useMemo<FilterOptions>(
        () => ({
          searchQuery: filters?.searchQuery ?? searchQuery,
          showOnlySaved: filters?.showOnlySaved ?? showOnlySaved,
          showOnlyMine: filters?.showOnlyMine ?? showOnlyMine,
        }),
        [filters, searchQuery, showOnlySaved, showOnlyMine],
      );

      // 3. סינון משימות
      const boardTasks = useMemo(
        () => tasks.filter((t) => t.boardId === boardId),
        [tasks, boardId],
      );

      const { filteredTasks } = useTaskFilters(
        boardTasks,
        userId,
        activeFilters,
      );

      // 4. מצבים לפתיחת דיאלוגים
      const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
      const [editingColumn, setEditingColumn] = useState<ColumnType | null>(
        null,
      );

      const handleOpenCreateColumn = useCallback(
        () => setIsCreateColumnOpen(true),
        [],
      );
      const handleCloseCreateColumn = useCallback(
        () => setIsCreateColumnOpen(false),
        [],
      );
      const handleCloseEditColumn = useCallback(
        () => setEditingColumn(null),
        [],
      );

      // 5. גרירה
      const { handleDragEnd } = useKanbanDrag({
        columns,
        tasks: filteredTasks,
        moveTaskToColumn,
        reorderColumns,
      });

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Header כולל Toggle לעבור בין קנבן ללוח שנה */}
          <BoardHeader
            onAddColumn={handleOpenCreateColumn}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* הצגת התוכן לפי המצב הנבחר */}
          {viewMode === "calendar" ? (
            <CalendarView tasks={filteredTasks} />
          ) : (
            <DragDropProvider onDragEnd={handleDragEnd}>
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <BoardColumnsList
                  columns={columns}
                  tasks={filteredTasks}
                  onAddColumn={handleOpenCreateColumn}
                />

                <CreateColumnDialog
                  open={isCreateColumnOpen}
                  onClose={handleCloseCreateColumn}
                  boardId={boardId}
                  currentUserId={userId}
                />

                {editingColumn && (
                  <EditColumnDialog
                    open={Boolean(editingColumn)}
                    onClose={handleCloseEditColumn}
                    column={editingColumn}
                    boardId={boardId}
                  />
                )}
              </Box>
            </DragDropProvider>
          )}
        </Box>
      );
    },
  );

KanbanBoardContainer.displayName = "KanbanBoardContainer";
