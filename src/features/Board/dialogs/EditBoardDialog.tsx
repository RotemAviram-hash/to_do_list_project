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
              sx={{ variant: "h6", fontWeight: "700", lineHeight: 1.2 }}
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

      <BoardForm
        initialValues={board}
        onSubmit={(data) => {
          updateBoard(data.id, data);
          onClose();
        }}
        onClose={onClose}
        submitLabel="שמור שינויים"
        isEdit={true}
      />
    </Dialog>
  );
}
