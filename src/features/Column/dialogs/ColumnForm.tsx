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
import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import type { Column } from "../models/Column";

// 1. הגדרת סכמת הוולידציה עבור עמודה
const columnSchema = Joi.object<Column>({
  id: Joi.string().allow(""),
  title: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "שם העמודה הוא שדה חובה",
    "string.min": "שם העמודה חייב להכיל לפחות 2 תווים",
    "string.max": "שם העמודה לא יכול לעבור 50 תווים",
  }),
  theme: Joi.string().required().messages({
    "string.empty": "יש לבחור ערכת צבעים",
    "any.required": "יש לבחור ערכת צבעים",
  }),
  boardId: Joi.string().allow(""),
  order: Joi.number().optional(),
  createdAt: Joi.string().allow(""),
  createdBy: Joi.string().allow(""),
}).unknown(true);

export interface ColumnFormProps {
  initialValues: Column;
  onSubmit: (data: Column) => void;
  onClose: () => void;
  submitLabel: string;
  isEdit?: boolean;
}

const THEME_OPTIONS = [
  { value: "blue", label: "כחול" },
  { value: "green", label: "ירוק" },
  { value: "yellow", label: "צהוב" },
  { value: "red", label: "אדום" },
  { value: "purple", label: "סגול" },
  { value: "gray", label: "אפור" },
];

export function ColumnForm({
  initialValues,
  onSubmit,
  onClose,
  submitLabel,
  isEdit = false,
}: ColumnFormProps) {
  // 2. חיבור Joi Resolver ל-React Hook Form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Column>({
    resolver: joiResolver(columnSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent dividers sx={{ borderColor: "divider", py: 3 }}>
        <Stack spacing={2.5}>
          {/* 1. שם העמודה (title) */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="שם העמודה *"
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

          {/* 2. ערכת צבעים (theme) */}
          <Controller
            name="theme"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                select
                label="ערכת צבעים *"
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaletteIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "12px" },
                  },
                }}
              >
                {THEME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>
      </DialogContent>

      {/* כפתורי שמירה וביטול */}
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
          startIcon={isEdit ? <SaveIcon /> : <ViewColumnIcon />}
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
