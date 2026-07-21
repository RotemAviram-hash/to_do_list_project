import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import type { Task, Column } from "../../workspace/types/WorkspaceTypes";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Task;
  columns: Column[];
  handleSave: (data: Task) => void;
  currentUserId: string; // מזהה המשתמש הנוכחי לצורך יצירה
}

// הגדרת סכמת הוולידציה עם Joi בהתאם לטיפוס החדש
const taskSchema = Joi.object({
  id: Joi.string().optional(),
  columnId: Joi.string().required().messages({
    "string.empty": "יש לבחור עמודה",
  }),
  title: Joi.string().min(3).required().messages({
    "string.empty": "כותרת המשימה היא שדה חובה",
    "string.min": "הכותרת חייבת להכיל לפחות 3 תווים",
  }),
  description: Joi.string().allow("").optional(),
  createdBy: Joi.string().required(),
  assigneeId: Joi.string().allow("").optional(),
  savedBy: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.string().required(),
  duDate: Joi.string().required().messages({
    "string.empty": "תאריך יעד הוא שדה חובה",
  }),
});

function TaskFormDialog({
  open,
  onClose,
  initialValues,
  columns,
  handleSave,
  currentUserId,
}: TaskFormDialogProps) {
  // ערכי ברירת מחדל מותאמים במדויק לטיפוס המעודכן
  const defaultValues: Partial<Task> = initialValues ?? {
    title: "",
    description: "",
    columnId: columns[0]?.id ?? "",
    createdBy: currentUserId,
    assigneeId: "",
    savedBy: [],
    createdAt: new Date().toISOString(),
    duDate: new Date().toISOString().split("T")[0], // פורמט YYYY-MM-DD עבור ה-input
  };

  const { control, handleSubmit, reset } = useForm<Task>({
    resolver: joiResolver(taskSchema),
    defaultValues,
  });

  const onSubmit = (data: Task) => {
    handleSave(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
    >
      <DialogTitle sx={{ fontWeight: 600, px: 3, pt: 3 }}>
        {initialValues ? "עריכת משימה" : "הוספת משימה חדשה"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ px: 3, py: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* כותרת */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="כותרת המשימה"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              )}
            />

            {/* תיאור */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תיאור"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              )}
            />

            {/* בחירת עמודה לפי columnId */}
            <Controller
              name="columnId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="עמודה"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                >
                  {columns.map((col) => (
                    <MenuItem key={col.id} value={col.id}>
                      {col.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            {/* תאריך יעד (duDate) */}
            <Controller
              name="duDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="תאריך יעד"
                  type="date"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  // משתמשים ב-slotProps החדש במקום ב-InputLabelProps הישן
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 500 }}>
            ביטול
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 3, borderRadius: "8px", fontWeight: 600 }}
          >
            {initialValues ? "שמור שינויים" : "צור משימה"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskFormDialog;
