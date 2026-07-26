import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Components
import { BoardControlsPanel } from "../features/Board/components/BoardControlsPanel/BoardControlsPanel";
import { KanbanBoardContainer } from "../features/Board/components/KanbanBoard/KanbanBoardContainer";

// Custom Hooks
import { useBoards } from "../features/Board/hooks/useBoards";
import { useColumns } from "../features/Column/hooks/useColumns";

export default function KanbanPreview({ userId }: { userId?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    loading: loadingBoards,
    error: errorBoards,
    addBoard,
  } = useBoards(userId);

  const {
    columns,
    loading: loadingColumns,
    error: errorColumns,
  } = useColumns(activeBoardId || undefined);

  // הוספת לוח חדש
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      await addBoard({
        title: newBoardTitle,
        createdBy: userId || "guest",
        isPublic: false,
      });
      setNewBoardTitle("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

  if (loadingBoards || loadingColumns) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorBoards || errorColumns) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{errorBoards || errorColumns}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* פאנל שליטה */}
      <BoardControlsPanel
        boards={boards}
        activeBoardId={activeBoardId || ""}
        onTabChange={(_, newBoardId) => setActiveBoardId(newBoardId)}
        getColumnCount={(boardId) =>
          columns.filter((col) => col.boardId === boardId).length
        }
      />

      {/* תצוגה ראשית: אם יש לוח פעיל מציגים אותו, אחרת מציגים כפתור ליצירת לוח ראשון */}
      {activeBoardId ? (
        <KanbanBoardContainer boardId={activeBoardId} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 8,
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            עדיין אין לך לוחות במערכת.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            צור את הלוח הראשון שלך
          </Button>
        </Box>
      )}

      {/* דיאלוג/מודאל ליצירת לוח חדש */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>יצירת לוח חדש</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם הלוח"
            fullWidth
            variant="outlined"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>ביטול</Button>
          <Button
            onClick={handleCreateBoard}
            variant="contained"
            disabled={!newBoardTitle.trim()}
          >
            צור לוח
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
