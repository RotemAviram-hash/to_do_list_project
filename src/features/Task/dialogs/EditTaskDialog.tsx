import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../models/Task";
import { TaskForm } from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../../User/hooks/useUsers";

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  columns: Column[];
}

export function EditTaskDialog({
  open,
  onClose,
  task,
  columns,
}: EditTaskDialogProps) {
  const { updateTask } = useTasks();
  const { users } = useUsers();
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
              עריכת משימה
            </Typography>
            <Typography variant="caption" color="text.secondary">
              עדכן את פרטי המשימה הקיימת
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

      <TaskForm
        key={task.id} // 👈 מבטיח עדכון משימות חלק ושמירה על התוכן באנימציית הסגירה
        initialValues={task}
        columns={columns}
        onSubmit={(data) => {
          updateTask(data.id, data);
          onClose();
        }}
        onClose={onClose}
        submitLabel="שמור שינויים"
        isEdit={true}
        users={users}
      />
    </Dialog>
  );
}
