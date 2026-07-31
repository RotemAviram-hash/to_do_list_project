import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  InputBase,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// Models & Hooks
import type { Board } from "../../models/Board";
import { useUser } from "../../../User/hooks/useUser";
import type { FilterOptions } from "../../../Task/hooks/useTaskFilters";

// Dialogs
import { CreateBoardDialog } from "../../dialogs/CreateBoardDialog";
import { EditBoardDialog } from "../../dialogs/EditBoardDialog";

interface BoardControlsPanelProps {
  boards: Board[];
  activeBoardId: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  getColumnCount?: (id: string) => number;
  onDeleteBoard: (boardId: string, hasColumns: boolean) => Promise<void>;

  filters?: FilterOptions;
  setFilters?: React.Dispatch<React.SetStateAction<FilterOptions>>;

  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  showOnlySaved?: boolean;
  onToggleSaved?: (val: boolean) => void;
  showOnlyMine?: boolean;
  onToggleMine?: (val: boolean) => void;
}

export const BoardControlsPanel: React.FC<BoardControlsPanelProps> = React.memo(
  ({
    boards,
    activeBoardId,
    onTabChange,
    getColumnCount,
    onDeleteBoard,
    filters,
    setFilters,
    searchQuery: propSearchQuery = "",
    onSearchChange,
    showOnlySaved: propShowOnlySaved = false,
    onToggleSaved,
    showOnlyMine: propShowOnlyMine = false,
    onToggleMine,
  }) => {
    const theme = useTheme();
    const { user } = useUser();
    const currentUserId = user?.id || "";

    // Dialogs & Menu State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    // Derived Active Filter Values
    const currentSearchQuery = filters?.searchQuery ?? propSearchQuery;
    const isSavedActive = filters?.showOnlySaved ?? propShowOnlySaved ?? false;
    const isMineActive = filters?.showOnlyMine ?? propShowOnlyMine ?? false;

    // Active Board Resolution
    const activeBoard = useMemo(
      () => boards.find((b) => b.id === activeBoardId),
      [boards, activeBoardId],
    );

    const validActiveValue = activeBoard ? activeBoardId : false;

    // Handlers
    const handleSearchChange = useCallback(
      (val: string) => {
        if (setFilters) setFilters((prev) => ({ ...prev, searchQuery: val }));
        else if (onSearchChange) onSearchChange(val);
      },
      [setFilters, onSearchChange],
    );

    const handleToggleSaved = useCallback(() => {
      if (setFilters)
        setFilters((prev) => ({ ...prev, showOnlySaved: !prev.showOnlySaved }));
      else if (onToggleSaved) onToggleSaved(!isSavedActive);
    }, [setFilters, onToggleSaved, isSavedActive]);

    const handleToggleMine = useCallback(() => {
      if (setFilters)
        setFilters((prev) => ({ ...prev, showOnlyMine: !prev.showOnlyMine }));
      else if (onToggleMine) onToggleMine(!isMineActive);
    }, [setFilters, onToggleMine, isMineActive]);

    const resolveColumnCount = useCallback(
      (id: string) => {
        if (getColumnCount) return getColumnCount(id);
        return boards.find((b) => b.id === id)?.columnCount ?? 0;
      },
      [boards, getColumnCount],
    );

    const handleDeleteActiveBoard = useCallback(async () => {
      setMenuAnchorEl(null);
      if (!activeBoardId || isDeleting) return;

      const hasColumns = resolveColumnCount(activeBoardId) > 0;

      // 💡 אופטימיזציה: אם יש עמודות, שולחים ישר ל-onDeleteBoard שיציג את ה-Snackbar
      // מבלי להציק למשתמש עם חלון confirm מיותר!
      if (hasColumns) {
        await onDeleteBoard(activeBoardId, true);
        return;
      }

      // רק אם הלוח באמת ריק - שואלים את המשתמש וממשיכים במחיקה
      if (window.confirm(`האם למחוק את הלוח "${activeBoard?.title || ""}"?`)) {
        try {
          setIsDeleting(true);
          await onDeleteBoard(activeBoardId, false);
        } catch (err) {
          console.error("שגיאה במחיקת הלוח:", err);
        } finally {
          setIsDeleting(false);
        }
      }
    }, [
      activeBoardId,
      activeBoard?.title,
      isDeleting,
      onDeleteBoard,
      resolveColumnCount, // 👈 הוסף למערך ה-dependencies
    ]);

    const handleCloseMenu = useCallback(() => setMenuAnchorEl(null), []);
    const handleOpenCreate = useCallback(() => setIsCreateOpen(true), []);
    const handleCloseCreate = useCallback(() => setIsCreateOpen(false), []);
    const handleOpenEdit = useCallback(() => {
      setMenuAnchorEl(null);
      setIsEditOpen(true);
    }, []);
    const handleCloseEdit = useCallback(() => setIsEditOpen(false), []);

    return (
      <Paper
        sx={{
          p: 1.8,
          mb: 3,
          borderRadius: "20px",
          bgcolor: "background.paper",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04)",
          // ✅ MUI v6 Pattern for Dark Mode
          ...theme.applyStyles("dark", {
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.4)",
          }),
          display: "flex",
          flexDirection: "column",
          gap: 1.8,
          width: "100%",
        }}
      >
        {/* שורה 1: סרגל הטאבים + כפתורי פעולה */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            bgcolor: "action.hover",
            p: 0.6,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={validActiveValue}
            onChange={onTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: "42px",
              alignItems: "center",
              flexGrow: 1,
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTabs-flexContainer": { gap: 0.8 },
            }}
          >
            {boards.map((board) => {
              const count = resolveColumnCount(board.id);
              const isActive = validActiveValue === board.id;

              return (
                <Tab
                  key={board.id}
                  value={board.id}
                  disableRipple
                  sx={{
                    minHeight: "38px",
                    py: 0.6,
                    px: 2.2,
                    borderRadius: "10px",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 700 : 500,
                    textTransform: "none",
                    color: isActive ? "primary.contrastText" : "text.primary",
                    background: isActive
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                      : "transparent",
                    boxShadow: isActive
                      ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`
                      : "none",
                    // ✅ MUI v6 applyStyles for tab active state shadow
                    ...(isActive &&
                      theme.applyStyles("dark", {
                        boxShadow: `0 4px 14px ${alpha(
                          theme.palette.primary.main,
                          0.45,
                        )}`,
                      })),
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      color: isActive ? "primary.contrastText" : "text.primary",
                      bgcolor: isActive
                        ? undefined
                        : alpha(theme.palette.primary.main, 0.08),
                      ...(!isActive &&
                        theme.applyStyles("dark", {
                          bgcolor: alpha(theme.palette.primary.main, 0.15),
                        })),
                    },
                  }}
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "inherit",
                          fontWeight: "inherit",
                          color: "inherit",
                        }}
                      >
                        {board.title}
                      </Typography>

                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.2,
                          borderRadius: "8px",
                          fontSize: "0.73rem",
                          fontWeight: 700,
                          bgcolor: isActive
                            ? alpha(theme.palette.primary.contrastText, 0.22)
                            : alpha(theme.palette.common.black, 0.06),
                          color: isActive
                            ? "primary.contrastText"
                            : "text.secondary",
                          ...(!isActive &&
                            theme.applyStyles("dark", {
                              bgcolor: alpha(theme.palette.common.white, 0.1),
                            })),
                          transition: "all 0.2s ease",
                        }}
                      >
                        {count}
                      </Box>
                    </Box>
                  }
                />
              );
            })}
          </Tabs>

          {/* כפתור הוספת לוח */}
          <Tooltip title="יצירת לוח חדש">
            <IconButton
              size="small"
              onClick={handleOpenCreate}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                color: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.25),
                flexShrink: 0,
                transition: "all 0.2s ease",
                ...theme.applyStyles("dark", {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                }),
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.35,
                  )}`,
                },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* תפריט אפשרויות לוח */}
          <Tooltip title={!activeBoard || isDeleting ? "" : "אפשרויות לוח"}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                disabled={!activeBoard || isDeleting}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  color: "text.secondary",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* שורה 2: חיפוש וסינונים */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            width: "100%",
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          {/* שדה חיפוש */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.8,
              py: 0.6,
              borderRadius: "12px",
              bgcolor: "action.hover",
              border: "1.5px solid",
              borderColor: currentSearchQuery ? "primary.main" : "divider",
              transition: "all 0.2s ease",
              width: { xs: "100%", sm: 280 },
              "&:focus-within": {
                borderColor: "primary.main",
                bgcolor: "background.paper",
                boxShadow: `0 0 0 3px ${alpha(
                  theme.palette.primary.main,
                  0.15,
                )}`,
              },
            }}
          >
            <SearchIcon sx={{ fontSize: 20, color: "primary.main", mr: 1 }} />
            <InputBase
              placeholder="חיפוש משימות..."
              value={currentSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{
                fontSize: "0.88rem",
                width: "100%",
                fontWeight: 500,
                color: "text.primary",
              }}
            />
            {currentSearchQuery && (
              <IconButton
                size="small"
                onClick={() => handleSearchChange("")}
                sx={{ p: 0.2 }}
              >
                <ClearIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </IconButton>
            )}
          </Box>

          {/* כפתורי סינון */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              size="small"
              onClick={handleToggleSaved}
              startIcon={
                isSavedActive ? (
                  <BookmarkIcon sx={{ fontSize: 18, color: "warning.main" }} />
                ) : (
                  <BookmarkBorderIcon
                    sx={{ fontSize: 18, color: "warning.main" }}
                  />
                )
              }
              sx={{
                borderRadius: "12px",
                fontSize: "0.84rem",
                fontWeight: isSavedActive ? 700 : 500,
                textTransform: "none",
                px: 2,
                py: 0.75,
                color: isSavedActive ? "warning.main" : "text.primary",
                bgcolor: isSavedActive
                  ? alpha(theme.palette.warning.main, 0.12)
                  : "action.hover",
                ...(isSavedActive &&
                  theme.applyStyles("dark", {
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                  })),
                border: "1.5px solid",
                borderColor: isSavedActive ? "warning.main" : "divider",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                  borderColor: "warning.main",
                },
              }}
            >
              השמורות שלי
            </Button>

            <Button
              size="small"
              onClick={handleToggleMine}
              startIcon={
                isMineActive ? (
                  <PersonIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                ) : (
                  <PersonOutlineIcon
                    sx={{ fontSize: 18, color: "secondary.main" }}
                  />
                )
              }
              sx={{
                borderRadius: "12px",
                fontSize: "0.84rem",
                fontWeight: isMineActive ? 700 : 500,
                textTransform: "none",
                px: 2,
                py: 0.75,
                color: isMineActive ? "secondary.main" : "text.primary",
                bgcolor: isMineActive
                  ? alpha(theme.palette.secondary.main, 0.12)
                  : "action.hover",
                ...(isMineActive &&
                  theme.applyStyles("dark", {
                    bgcolor: alpha(theme.palette.secondary.main, 0.2),
                  })),
                border: "1.5px solid",
                borderColor: isMineActive ? "secondary.main" : "divider",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.secondary.main, 0.2),
                  borderColor: "secondary.main",
                },
              }}
            >
              המשימות שלי
            </Button>
          </Box>
        </Box>

        {/* תפריט 3 נקודות - v6 SlotProps Standard */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "14px",
                minWidth: 160,
                mt: 1,
                boxShadow: theme.shadows[8],
                bgcolor: "background.paper",
              },
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <MenuItem onClick={handleOpenEdit} sx={{ py: 1, px: 2 }}>
            <ListItemIcon>
              <EditOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="עריכת לוח"
              slotProps={{
                primary: {
                  sx: { fontSize: "0.85rem", fontWeight: 600 }, // 👈 העברה לתוך sx
                },
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={handleDeleteActiveBoard}
            sx={{
              py: 1,
              px: 2,
              color: "error.main",
              "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.08) },
            }}
          >
            <ListItemIcon>
              <DeleteOutlinedIcon sx={{ fontSize: 18, color: "error.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="מחיקת לוח"
              slotProps={{
                primary: {
                  sx: { fontSize: "0.85rem", fontWeight: 600 }, // 👈 העברה לתוך sx
                },
              }}
            />
          </MenuItem>
        </Menu>

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
      </Paper>
    );
  },
);

BoardControlsPanel.displayName = "BoardControlsPanel";
