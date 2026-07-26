import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type { Column } from "../models/Column";
import { ColumnForm } from "./ColumnForm";
import { useColumns } from "../hooks/useColumns";

interface EditColumnDialogProps {
  open: boolean;
  onClose: () => void;
  column: Column;
  boardId: string;
}

export function EditColumnDialog({
  open,
  onClose,
  column,
  boardId,
}: EditColumnDialogProps) {
  // העברת ה-boardId להוק
  const { updateColumn } = useColumns(boardId);

  const handleSubmit = async (data: Column) => {
    try {
      const { id, ...updatedFields } = data;
      await updateColumn(column.id || id, updatedFields);
      onClose();
    } catch (err) {
      console.error("שגיאה בעדכון עמודה:", err);
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
              עריכת עמודה
            </Typography>
            <Typography variant="caption" color="text.secondary">
              עדכן את פרטי העמודה הקיימת
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

      {/* key מבוסס id עמודה מבטיח רענון נתונים בעת החלפת עמודה ושומר על הנתונים בזמן היציאה */}
      <ColumnForm
        key={column.id}
        initialValues={column}
        onSubmit={handleSubmit}
        onClose={onClose}
        submitLabel="שמור שינויים"
        isEdit={true}
      />
    </Dialog>
  );
}
