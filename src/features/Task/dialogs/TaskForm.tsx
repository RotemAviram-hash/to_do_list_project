import {
  TextField,
  MenuItem,
  Stack,
  Button,
  DialogActions,
  DialogContent,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../models/Task";
import type { UserProfile } from "../../User/models/User";
import { UserAvatar } from "../../User/components/UserAvatar"; // עדכני לפי הנתיב בפרויקט

// 1. הגדרת סכמת הוולידציה עבור משימה
const taskSchema = Joi.object<Task>({
  id: Joi.string().allow(""),
  title: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "כותרת המשימה היא שדה חובה",
    "string.min": "כותרת המשימה חייבת להכיל לפחות 2 תווים",
    "string.max": "כותרת המשימה לא יכולה לעבור 150 תווים",
  }),
  description: Joi.string().allow("").max(1000).messages({
    "string.max": "התיאור אינו יכול לעבור 1000 תווים",
  }),
  columnId: Joi.string().required().messages({
    "string.empty": "יש לבחור עמודה",
    "any.required": "יש לבחור עמודה",
  }),
  assigneeId: Joi.string().allow(""),
  dueDate: Joi.string().allow(""),
  boardId: Joi.string().allow(""),
  createdAt: Joi.string().allow(""),
  createdBy: Joi.string().allow(""),
}).unknown(true);

interface TaskFormProps {
  initialValues: Task;
  columns: Column[];
  users?: UserProfile[];
  onSubmit: (data: Task) => void;
  onClose: () => void;
  submitLabel: string;
  isEdit?: boolean;
}

export function TaskForm({
  initialValues,
  columns,
  users = [],
  onSubmit,
  onClose,
  submitLabel,
  isEdit = false,
}: TaskFormProps) {
  // 2. חיבור Joi Resolver ל-React Hook Form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Task>({
    resolver: joiResolver(taskSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent dividers sx={{ borderColor: "divider", py: 3 }}>
        <Stack spacing={2.5}>
          {/* 1. כותרת המשימה */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="כותרת המשימה *"
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "12px" },
                  },
                }}
              />
            )}
          />

          {/* 2. תיאור המשימה */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="תיאור המשימה (אופציונלי)"
                fullWidth
                multiline
                rows={3}
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.2 }}
                      >
                        <DescriptionIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "12px" },
                  },
                }}
              />
            )}
          />

          {/* 3. עמודה ואחראי */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="columnId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  select
                  label="עמודה / סטטוס *"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ViewColumnIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "12px" },
                    },
                  }}
                >
                  {columns.map((col) => (
                    <MenuItem key={col.id} value={col.id}>
                      {col.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  select
                  label="אחראי משימה"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "12px" },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>ללא אחראי</em>
                  </MenuItem>
                  {users.map((user) => {
                    const userName = user.displayName || user.email || "משתמש";

                    return (
                      <MenuItem key={user.id} value={user.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            width: "100%",
                          }}
                        >
                          <UserAvatar user={user} size={26} />
                          <Typography variant="body2">{userName}</Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </TextField>
              )}
            />
          </Stack>

          {/* 4. תאריך יעד */}
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="תאריך יעד"
                type="date"
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "12px" },
                  },
                }}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ pt: 2, pb: 1, px: 3 }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          color="inherit"
          sx={{ borderRadius: "10px", fontWeight: 600, px: 3 }}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          color={isEdit ? "primary" : "success"}
          startIcon={isEdit ? <SaveIcon /> : <AddTaskIcon />}
          sx={{
            borderRadius: "10px",
            fontWeight: 600,
            px: 3.5,
            py: 0.8,
            boxShadow: isEdit
              ? "0px 4px 12px rgba(25, 118, 210, 0.25)"
              : "0px 4px 12px rgba(46, 125, 50, 0.25)",
            textTransform: "none",
          }}
        >
          {isSubmitting ? "שומר..." : submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}
