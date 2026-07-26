import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import type { Board } from "../models/Board";
import { BoardForm } from "./BoardForm";
import { useBoards } from "../hooks/useBoards";

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
  currentUserId: string;
}

export function CreateBoardDialog({
  open,
  onClose,
  currentUserId,
}: CreateBoardDialogProps) {
  const { addBoard } = useBoards();

  const defaultValues: Board = {
    id: "",
    title: "",
    description: "",
    isPublic: false,
    createdAt: new Date().toISOString(),
    createdBy: currentUserId,
  };

  // 1. טיפול אסינכרוני תקין בשליחה
  const handleSubmit = async (data: Board) => {
    try {
      // 2. הסרת ה-id והתאריכים כדי ש-Firebase/השרת ייצרו אותם בעצמם
      const { id, createdAt, updatedAt, ...boardData } = data;

      await addBoard({
        ...boardData,
        createdBy: boardData.createdBy || currentUserId,
      });

      onClose();
    } catch (err) {
      console.error("שגיאה ביצירת לוח חדש:", err);
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
            <DashboardIcon />
          </Box>
          <Box>
            {/* 👈 תוקן: variant הוצא אל מחוץ ל-sx */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "700", lineHeight: 1.2 }}
            >
              לוח חדש
            </Typography>
            <Typography variant="caption" color="text.secondary">
              מלא את הפרטים ליצירת לוח עבודה חדש
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

      {/* 3. key=String(open) מבטיח איפוס מלא של הטופס בכל פעם שהדיאלוג נפתח */}
      <BoardForm
        key={String(open)}
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onClose={onClose}
        submitLabel="צור לוח"
        isEdit={false}
      />
    </Dialog>
  );
}
