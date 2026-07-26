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
  currentUserId?: string;
}

export function CreateColumnDialog({
  open,
  onClose,
  boardId,
  currentUserId = "",
}: CreateColumnDialogProps) {
  // העברת ה-boardId להוק
  const { addColumn } = useColumns(boardId);

  const defaultValues: Column = {
    id: "",
    title: "",
    theme: "blue",
    boardId: boardId,
    order: 0,
    createdAt: new Date().toISOString(),
    createdBy: currentUserId,
  };

  const handleSubmit = async (data: Column) => {
    try {
      // הסרת id ו-createdAt כדי שהשרת/Firebase ינפקו בעצמם
      const { id, createdAt, ...columnData } = data;
      await addColumn({
        ...columnData,
        boardId,
        createdBy: columnData.createdBy || currentUserId,
      });
      onClose();
    } catch (err) {
      console.error("שגיאה ביצירת עמודה:", err);
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
              variant="h6"
              sx={{ fontWeight: "700", lineHeight: 1.2 }}
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

      {/* key=String(open) מבטיח שהטופס יתאפס מחדש בכל פתיחה */}
      <ColumnForm
        key={String(open)}
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onClose={onClose}
        submitLabel="צור עמודה"
        isEdit={false}
      />
    </Dialog>
  );
}
