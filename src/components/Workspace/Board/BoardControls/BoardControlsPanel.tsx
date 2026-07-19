import React from "react";
import {
  Paper,
  Box,
  Tabs,
  Tab,
  Chip,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Board } from "../../WorkspaceTypes";

interface BoardControlsPanelProps {
  boards: Board[];
  activeBoardId: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  getColumnCount: (id: string) => number;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  showOnlySaved: boolean;
  onToggleSaved: (val: boolean) => void;
  showOnlyMine: boolean;
  onToggleMine: (val: boolean) => void;
  isDarkMode: boolean;
}

export const BoardControlsPanel: React.FC<BoardControlsPanelProps> = ({
  boards,
  activeBoardId,
  onTabChange,
  getColumnCount,
  searchQuery,
  onSearchChange,
  showOnlySaved,
  onToggleSaved,
  showOnlyMine,
  onToggleMine,
  isDarkMode,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 3, mb: 3, overflow: "hidden" }}
    >
      {/* טאבים */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 2,
          bgcolor: isDarkMode
            ? "rgba(255, 255, 255, 0.02)"
            : "rgba(0, 0, 0, 0.01)",
        }}
      >
        <Tabs
          value={activeBoardId}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flexGrow: 1,
            "& .MuiTabs-indicator": {
              bgcolor: isDarkMode ? "text.primary" : "#2D3748",
              height: 3,
            },
            "& .MuiTab-root": {
              fontSize: "0.95rem",
              fontWeight: 600,
              py: 2,
              minHeight: 60,
            },
          }}
        >
          {boards.map((board) => {
            const count = getColumnCount(board.id);
            const isActive = activeBoardId === board.id;
            return (
              <Tab
                key={board.id}
                value={board.id}
                icon={<ViewColumnIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
                sx={{ gap: 1, minWidth: 150 }}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="inherit">{board.title}</Typography>
                    <Chip
                      label={`${count} עמודות`}
                      size="small"
                      sx={{ height: 20, fontSize: "0.75rem", fontWeight: 600 }}
                    />
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        <Button
          variant="outlined"
          onClick={() => alert("פונקציית יצירת לוח")}
          startIcon={<DashboardCustomizeIcon />}
          sx={{ height: 38, borderRadius: 2 }}
        >
          לוח חדש
        </Button>
      </Box>

      <Divider />

      {/* פילטרים ופעולות */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* חיפוש וסינון */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <TextField
            size="small"
            placeholder="חיפוש משימה בלוח..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: "100%", sm: 240 } }}
          />

          <Button
            variant="outlined"
            onClick={() => onToggleSaved(!showOnlySaved)}
            startIcon={
              showOnlySaved ? <BookmarkIcon /> : <BookmarkBorderIcon />
            }
            sx={{ borderRadius: 2.5, height: 40 }}
          >
            השמורות שלי
          </Button>

          <Button
            variant="outlined"
            onClick={() => onToggleMine(!showOnlyMine)}
            startIcon={<AssignmentIndIcon />}
            sx={{ borderRadius: 2.5, height: 40 }}
          >
            המשימות שלי
          </Button>
        </Box>

        {/* פעולות */}
        <Box
          sx={{ display: "flex", gap: 1.5, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => alert("הוספת עמודה")}
            sx={{ borderRadius: 2.5 }}
          >
            הוספת עמודה
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => alert("עריכה")}
            sx={{ borderRadius: 2.5 }}
          >
            עריכת לוח
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => alert("מחיקה")}
            sx={{ borderRadius: 2.5 }}
          >
            מחיקת לוח
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
