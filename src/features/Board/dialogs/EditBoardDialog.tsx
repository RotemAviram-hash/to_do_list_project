import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type { Board } from "../models/Board";
import { BoardForm } from "./BoardForm";
import { useBoards } from "../hooks/useBoards";

interface EditBoardDialogProps {
  open: boolean;
  onClose: () => void;
  board: Board;
}

export function EditBoardDialog({
  open,
  onClose,
  board,
}: EditBoardDialogProps) {
  const { updateBoard } = useBoards();

  // 1. טיפול אסינכרוני נקי בעדכון
  const handleSubmit = async (data: Board) => {
    try {
      // מפרידים את ה-id משאר השדות ומעדכנים
      const { id, ...updatedFields } = data;
      await updateBoard(board.id || id, updatedFields);
      onClose();
    } catch (err) {
      console.error("שגיאה בעדכון הלוח:", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            p: 1,
            boxShadow: "0px 10px 35px rgba(0,0,0,0.08)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.5,
          pt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: (theme) => theme.palette.primary.main + "15",
              color: "primary.main",
              p: 1.2,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <EditNoteIcon />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "700", lineHeight: 1.2 }}
            >
              עריכת לוח
            </Typography>
            <Typography variant="caption" color="text.secondary">
              עדכן את פרטי הלוח הקיים
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* key={board.id} מבטיח טעינה מחדש נקייה בעת החלפת לוח ושומר על הנתונים בזמן היציאה */}
      <BoardForm
        key={board.id}
        initialValues={board}
        onSubmit={handleSubmit}
        onClose={onClose}
        submitLabel="שמור שינויים"
        isEdit={true}
      />
    </Dialog>
  );
}
