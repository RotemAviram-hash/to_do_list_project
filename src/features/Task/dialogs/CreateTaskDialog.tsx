import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddTaskIcon from "@mui/icons-material/AddTask";
import type { Column } from "../../Column";
import type { Task } from "../models/Task";
import { TaskForm } from "./TaskForm";
import type { User } from "../../../user";
import { useTasks } from "../hooks/useTasks";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  columns: Column[];
  users?: User[];
  boardId?: string; // 👈 הוספנו: מזהה הלוח
  defaultColumnId?: string; // 👈 הוספנו: מזהה העמודה שנלחצה
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export function CreateTaskDialog({
  open,
  onClose,
  columns,
  users,
  boardId,
  defaultColumnId,
}: CreateTaskDialogProps) {
  const { addTask } = useTasks();

  // מציאת העמודה הנבחרת או העמודה הראשונה
  const selectedColumn =
    columns.find((c) => c.id === defaultColumnId) || columns[0];

  // חילוץ ה-boardId מהעמודה אם לא מועבר מפורשות
  const effectiveBoardId = boardId || selectedColumn?.boardId || "";

  const defaultValues: Task = {
    id: "",
    title: "",
    description: "",
    dueDate: getTodayString(),
    columnId: selectedColumn?.id ?? "",
    boardId: effectiveBoardId, // 👈 כעת ה-boardId תקין ולא ריק!
    createdBy: "",
    assigneeId: "",
    savedBy: [],
    createdAt: new Date().toISOString(),
    order: 0,
  };

  // טיפול אסינכרוני בשליחה
  const handleSubmit = async (data: Task) => {
    try {
      const { id, ...taskWithoutId } = data;

      // שולחים את המשימה ללא ה-id הריק
      await addTask(taskWithoutId as any);

      onClose();
    } catch (err) {
      console.error("שגיאה ביצירת משימה:", err);
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
            <AddTaskIcon />
          </Box>
          <Box>
            <Typography
              sx={{ variant: "h6", fontWeight: "700", lineHeight: 1.2 }}
            >
              משימה חדשה
            </Typography>
            <Typography variant="caption" color="text.secondary">
              מלא את הפרטים ליצירת משימה
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
        initialValues={defaultValues}
        columns={columns}
        onSubmit={handleSubmit}
        onClose={onClose}
        submitLabel="צור משימה"
        isEdit={false}
        users={users}
      />
    </Dialog>
  );
}
