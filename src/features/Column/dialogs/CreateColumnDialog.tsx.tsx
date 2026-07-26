import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import type { Column } from "../models/Column";
import { ColumnForm } from "./ColumnForm";
import { useColumns } from "../hooks/useColumns";

interface CreateColumnDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
}

export function CreateColumnDialog({
  open,
  onClose,
  boardId,
}: CreateColumnDialogProps) {
  const { addColumn } = useColumns();
  const defaultValues: Column = {
    id: "",
    title: "",
    theme: "blue",
    boardId: boardId ?? "",
    order: 0,
    createdAt: new Date().toISOString(),
    createdBy: "", // <-- מזהה המשתמש
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
              bgcolor: (theme) => theme.palette.success.main + "15",
              color: "success.main",
              p: 1.2,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ViewColumnIcon />
          </Box>
          <Box>
            <Typography
              sx={{ variant: "h6", fontWeight: "700", lineHeight: 1.2 }}
            >
              עמודה חדשה
            </Typography>
            <Typography variant="caption" color="text.secondary">
              מלא את הפרטים ליצירת עמודה
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
        initialValues={defaultValues}
        onSubmit={(data) => {
          addColumn(data);
          onClose();
        }}
        onClose={onClose}
        submitLabel="צור עמודה"
        isEdit={false}
      />
    </Dialog>
  );
}
