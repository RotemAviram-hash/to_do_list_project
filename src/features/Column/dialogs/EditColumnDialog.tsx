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
}

export function EditColumnDialog({
  open,
  onClose,
  column,
}: EditColumnDialogProps) {
  const { updateColumn } = useColumns();

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

      <ColumnForm
        initialValues={column}
        onSubmit={(data) => {
          updateColumn(data.id, data);
          onClose();
        }}
        onClose={onClose}
        submitLabel="שמור שינויים"
        isEdit={true}
      />
    </Dialog>
  );
}
