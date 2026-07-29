import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddTaskIcon from "@mui/icons-material/AddTask";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../models/Task";
import { TaskForm } from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../../User/hooks/useUsers";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  columns: Column[];
  boardId?: string;
  defaultColumnId?: string;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export function CreateTaskDialog({
  open,
  onClose,
  columns,
  boardId,
  defaultColumnId,
}: CreateTaskDialogProps) {
  const { users } = useUsers(); //
  const { addTask } = useTasks();

  // 🟢 1. מציאת העמודה הנבחרת ע"י המרה בטוחה ל-String
  const selectedColumn =
    columns.find((c) => String(c.id) === String(defaultColumnId)) || columns[0];

  const effectiveBoardId = boardId || selectedColumn?.boardId || "";

  // 🟢 2. ערכי ברירת המחדל עם ה-columnId שנמצא
  const defaultValues: Task = {
    id: "",
    title: "",
    description: "",
    dueDate: getTodayString(),
    columnId: selectedColumn?.id ?? "",
    boardId: effectiveBoardId,
    createdBy: "",
    assigneeId: "",
    savedBy: [],
    createdAt: new Date().toISOString(),
    order: 0,
  };

  const handleSubmit = async (data: Task) => {
    try {
      const { id, ...taskWithoutId } = data;
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
              variant="h6"
              sx={{ fontWeight: "700", lineHeight: 1.2 }}
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
        // 🟢 key מורכב שמבטיח איפוס מחדש של הטופס בכל שינוי של defaultColumnId
        key={open ? `open-${selectedColumn?.id || "default"}` : "closed"}
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
