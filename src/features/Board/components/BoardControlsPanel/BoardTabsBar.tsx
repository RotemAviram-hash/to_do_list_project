import React from "react";
import { Box, Tabs, Tab, IconButton, Tooltip, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { Board } from "../../models/Board";

interface BoardTabsBarProps {
  boards: Board[];
  activeBoardId: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  getColumnCount: (id: string) => number;
  onCreateBoard?: () => void;
}

export const BoardTabsBar: React.FC<BoardTabsBarProps> = ({
  boards,
  activeBoardId,
  onTabChange,
  getColumnCount,
  onCreateBoard,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        bgcolor: isDarkMode
          ? "rgba(255, 255, 255, 0.03)"
          : "rgba(0, 0, 0, 0.03)",
        p: 0.6,
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Tabs
        value={activeBoardId}
        onChange={onTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: "36px",
          "& .MuiTabs-indicator": { display: "none" },
        }}
      >
        {boards.map((board) => {
          const count = getColumnCount(board.id);
          const isActive = activeBoardId === board.id;

          return (
            <Tab
              key={board.id}
              value={board.id}
              disableRipple
              disableFocusRipple
              sx={{
                minHeight: "36px",
                py: 0.5,
                px: 2,
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : 500,
                textTransform: "none",
                color: isActive ? "text.primary" : "text.secondary",
                bgcolor: isActive ? "background.paper" : "transparent",
                boxShadow: isActive
                  ? isDarkMode
                    ? "0 2px 8px rgba(0,0,0,0.4)"
                    : "0 2px 6px rgba(0,0,0,0.06)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": { color: "text.primary" },
              }}
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span>{board.title}</span>
                  <Box
                    component="span"
                    sx={{
                      px: 0.8,
                      py: 0.1,
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      bgcolor: isActive
                        ? isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.06)"
                        : "transparent",
                      color: isActive ? "text.primary" : "text.disabled",
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
            "&:hover": {
              bgcolor: isDarkMode
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
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
};
