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
  alpha,
  useTheme,
} from "@mui/material";

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
  onDeleteBoard: (boardId: string) => Promise<void> | void;

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
    const isDarkMode = theme.palette.mode === "dark";
    const { user } = useUser();
    const currentUserId = user?.id || "";

    // Dialogs State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Menu State
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    // Filter Active Values
    const currentSearchQuery = filters?.searchQuery ?? propSearchQuery;
    const isSavedActive = filters?.showOnlySaved ?? propShowOnlySaved ?? false;
    const isMineActive = filters?.showOnlyMine ?? propShowOnlyMine ?? false;

    // Active Board Object
    const activeBoard = useMemo(
      () => boards.find((b) => b.id === activeBoardId),
      [boards, activeBoardId],
    );

    const validActiveValue = boards.some((b) => b.id === activeBoardId)
      ? activeBoardId
      : false;

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
      <Paper
        sx={{
          p: 1.8,
          mb: 3,
          borderRadius: "20px",
          bgcolor: theme.palette.background.paper, // #1C2541 בחושך / #FFFFFF באור
          boxShadow: isDarkMode
            ? "0 10px 30px -10px rgba(0,0,0,0.4)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 1.8,
          width: "100%",
        }}
      >
        {/* שורה 1: סרגל הטאבים (שכבת הביניים action.hover) + כפתור הוספה + 3 נקודות */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            bgcolor: theme.palette.action.hover, // #111A33 בחושך / #F1F3F5 באור
            p: 0.6,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: theme.palette.divider,
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

                    // 1️⃣ צבע דיפולטיבי לפני בחירה
                    color: theme.palette.text.primary,
                    background: isActive
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                      : "transparent",
                    boxShadow: isActive
                      ? `0 4px 14px ${alpha(theme.palette.primary.main, isDarkMode ? 0.45 : 0.3)}`
                      : "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

                    // 2️⃣ 🔑 התיקון הקריטי: דריסת העיצוב המובנה של MUI לטאב נבחר!
                    "&.Mui-selected": {
                      color: `${theme.palette.primary.contrastText} !important`,
                    },

                    "&:hover": {
                      color: isActive
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      bgcolor: isActive
                        ? undefined
                        : alpha(
                            theme.palette.primary.main,
                            isDarkMode ? 0.15 : 0.08,
                          ),
                    },
                  }}
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.2 }}
                    >
                      {/* 3️⃣ וידוא שהטקסט הפנימי יורש את הצבע הנכון */}
                      <span
                        style={{
                          color: isActive
                            ? theme.palette.primary.contrastText
                            : "inherit",
                        }}
                      >
                        {board.title}
                      </span>

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
                            : isDarkMode
                              ? alpha(theme.palette.common.white, 0.1)
                              : alpha(theme.palette.common.black, 0.06),
                          color: isActive
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
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
              onClick={() => setIsCreateOpen(true)}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                color: theme.palette.primary.main,
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDarkMode ? 0.15 : 0.08,
                ),
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.25),
                flexShrink: 0,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* תפריט 3 נקודות ללוח */}
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
                  color: theme.palette.text.secondary,
                  bgcolor: theme.palette.background.paper,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* שורה 2: חיפוש וסינונים (צמודים) */}
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
              bgcolor: theme.palette.action.hover, // שכבת ביניים אחידה לטאבים
              border: "1.5px solid",
              borderColor: currentSearchQuery
                ? theme.palette.primary.main
                : theme.palette.divider,
              transition: "all 0.2s ease",
              width: { xs: "100%", sm: 280 },
              "&:focus-within": {
                borderColor: theme.palette.primary.main,
                bgcolor: theme.palette.background.paper,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            }}
          >
            <SearchIcon
              sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1 }}
            />
            <InputBase
              placeholder="חיפוש משימות..."
              value={currentSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              sx={{
                fontSize: "0.88rem",
                width: "100%",
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            />
            {currentSearchQuery && (
              <IconButton
                size="small"
                onClick={() => handleSearchChange("")}
                sx={{ p: 0.2 }}
              >
                <ClearIcon
                  sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                />
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
                  <BookmarkIcon
                    sx={{ fontSize: 18, color: theme.palette.warning.main }}
                  />
                ) : (
                  <BookmarkBorderIcon
                    sx={{ fontSize: 18, color: theme.palette.warning.main }}
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
                color: isSavedActive
                  ? theme.palette.warning.main
                  : theme.palette.text.primary,
                bgcolor: isSavedActive
                  ? alpha(theme.palette.warning.main, isDarkMode ? 0.2 : 0.12)
                  : theme.palette.action.hover,
                border: "1.5px solid",
                borderColor: isSavedActive
                  ? theme.palette.warning.main
                  : theme.palette.divider,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                  borderColor: theme.palette.warning.main,
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
                  <PersonIcon
                    sx={{ fontSize: 18, color: theme.palette.secondary.main }}
                  />
                ) : (
                  <PersonOutlineIcon
                    sx={{ fontSize: 18, color: theme.palette.secondary.main }}
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
                color: isMineActive
                  ? theme.palette.secondary.main
                  : theme.palette.text.primary,
                bgcolor: isMineActive
                  ? alpha(theme.palette.secondary.main, isDarkMode ? 0.2 : 0.12)
                  : theme.palette.action.hover,
                border: "1.5px solid",
                borderColor: isMineActive
                  ? theme.palette.secondary.main
                  : theme.palette.divider,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.secondary.main, 0.2),
                  borderColor: theme.palette.secondary.main,
                },
              }}
            >
              המשימות שלי
            </Button>
          </Box>
        </Box>

        {/* תפריט נפתח (3 נקודות) */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "14px",
                minWidth: 160,
                mt: 1,
                boxShadow: theme.shadows[8],
                bgcolor: theme.palette.background.paper,
              },
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              setMenuAnchorEl(null);
              setIsEditOpen(true);
            }}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon>
              <EditOutlinedIcon
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
            </ListItemIcon>
            <ListItemText
              primary="עריכת לוח"
              primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
            />
          </MenuItem>

          <MenuItem
            onClick={handleDeleteActiveBoard}
            sx={{
              py: 1,
              px: 2,
              color: theme.palette.error.main,
              "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.08) },
            }}
          >
            <ListItemIcon>
              <DeleteOutlinedIcon
                sx={{ fontSize: 18, color: theme.palette.error.main }}
              />
            </ListItemIcon>
            <ListItemText
              primary="מחיקת לוח"
              primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>

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
      </Paper>
    );
  },
);

BoardControlsPanel.displayName = "BoardControlsPanel";
