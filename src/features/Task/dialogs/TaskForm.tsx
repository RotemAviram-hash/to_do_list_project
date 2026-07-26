import {
  TextField,
  MenuItem,
  Stack,
  Button,
  DialogActions,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useForm, Controller } from "react-hook-form";
import type { Column } from "../../Column";
import type { Task } from "../models/Task";
import type { User } from "../../../user";

// טיפוס בסיסי למשתמשים (התאם לפי המודל הקיים אצלך)
export interface UserOption {
  id: string;
  name: string;
}

interface TaskFormProps {
  initialValues: Task;
  columns: Column[];
  users?: User[]; // הרשימה של המשתמשים לבחירה
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
  const { control, handleSubmit } = useForm<Task>({
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent dividers sx={{ borderColor: "divider", py: 3 }}>
        <Stack spacing={2.5}>
          {/* 1. כותרת המשימה (title) */}
          <Controller
            name="title"
            control={control}
            rules={{ required: "זהו שדה חובה" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="כותרת המשימה"
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

          {/* 2. תיאור המשימה (description) */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="תיאור המשימה"
                fullWidth
                multiline
                rows={3}
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

          {/* 3. שורה כפולה: עמודה (columnId) ואחראי (assigneeId) */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* עמודה / סטטוס */}
            <Controller
              name="columnId"
              control={control}
              rules={{ required: "יש לבחור עמודה" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  label="עמודה / סטטוס"
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

            {/* מוקצה ל... / אחראי (assigneeId) */}
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
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
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName + user.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          {/* 4. תאריך יעד (dueDate) */}
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
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

      {/* כפתורי שמירה וביטול */}
      <DialogActions sx={{ pt: 2, pb: 1, px: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ borderRadius: "10px", fontWeight: 600, px: 3 }}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          variant="contained"
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
          {submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}
