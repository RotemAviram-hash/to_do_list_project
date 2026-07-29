import React from "react";
import { Box, Tabs, Tab, IconButton, Tooltip, alpha } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { Board } from "../../models/Board";

interface BoardTabsBarProps {
  boards: Board[];
  activeBoardId: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  getColumnCount: (id: string) => number;
  onCreateBoard?: () => void;
}

interface BoardTabItemProps {
  board: Board;
  isActive: boolean;
  count: number;
  value: string;
}

const BoardTabItem = React.memo<BoardTabItemProps>(
  ({ board, isActive, count, value, ...otherProps }) => {
    return (
      <Tab
        value={value}
        {...otherProps}
        disableRipple
        disableFocusRipple
        sx={{
          minHeight: "36px",
          py: 0.6,
          px: 2,
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: isActive ? 600 : 500,
          textTransform: "none",
          color: isActive ? "text.primary" : "text.secondary",
          bgcolor: isActive ? "background.paper" : "transparent",
          boxShadow: isActive ? (theme) => theme.shadows[1] : "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            color: "text.primary",
            bgcolor: isActive
              ? "background.paper"
              : (theme) => alpha(theme.palette.action.active, 0.04),
          },
        }}
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span>{board.title}</span>
            <Box
              component="span"
              sx={{
                px: 0.9,
                py: 0.2,
                borderRadius: "12px",
                fontSize: "0.72rem",
                fontWeight: 700,
                bgcolor: isActive
                  ? (theme) => alpha(theme.palette.primary.main, 0.12)
                  : (theme) => alpha(theme.palette.action.disabled, 0.1),
                color: isActive ? "primary.main" : "text.secondary",
                transition: "all 0.2s ease",
              }}
            >
              {count}
            </Box>
          </Box>
        }
      />
    );
  },
);

BoardTabItem.displayName = "BoardTabItem";

export const BoardTabsBar: React.FC<BoardTabsBarProps> = React.memo(
  ({ boards, activeBoardId, onTabChange, getColumnCount, onCreateBoard }) => {
    const validActiveValue = boards.some((b) => b.id === activeBoardId)
      ? activeBoardId
      : false;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.common.black, 0.03),
          p: 0.6,
          borderRadius: "12px",
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
            minHeight: "36px",
            alignItems: "center",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTabs-flexContainer": { gap: 0.5 },
          }}
        >
          {boards.map((board) => {
            const count = getColumnCount(board.id);
            const isActive = validActiveValue === board.id;

            return (
              <BoardTabItem
                key={board.id}
                value={board.id}
                board={board}
                isActive={isActive}
                count={count}
              />
            );
          })}
        </Tabs>

        <Tooltip title="יצירת לוח חדש">
          <IconButton
            size="small"
            onClick={onCreateBoard}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              color: "text.secondary",
              border: "1px dashed",
              borderColor: "divider",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                color: "primary.main",
                borderColor: "primary.main",
              },
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  },
);

BoardTabsBar.displayName = "BoardTabsBar";
