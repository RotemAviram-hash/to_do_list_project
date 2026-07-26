import {
  TextField,
  Stack,
  Button,
  DialogActions,
  DialogContent,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import PublicIcon from "@mui/icons-material/Public";
import SaveIcon from "@mui/icons-material/Save";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import type { Board } from "../models/Board";

// 1. הגדרת סכמת הוולידציה עם Joi
const boardSchema = Joi.object<Board>({
  id: Joi.string().allow(""),
  title: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "שם הלוח הוא שדה חובה",
    "string.min": "שם הלוח חייב להכיל לפחות 2 תווים",
    "string.max": "שם הלוח לא יכול לעבור 100 תווים",
  }),
  description: Joi.string().allow("").max(500).messages({
    "string.max": "התיאור אינו יכול לעבור 500 תווים",
  }),
  isPublic: Joi.boolean().default(false),
  createdAt: Joi.string().allow(""),
  createdBy: Joi.string().allow(""),
}).unknown(true); // 👈 מאפשר מאפיינים נוספים של האובייקט ללא הכשלת הווילדציה

export interface BoardFormProps {
  initialValues: Board;
  onSubmit: (data: Board) => void;
  onClose: () => void;
  submitLabel: string;
  isEdit?: boolean;
}

export function BoardForm({
  initialValues,
  onSubmit,
  onClose,
  submitLabel,
  isEdit = false,
}: BoardFormProps) {
  // 2. חיבור Joi Resolver ל-React Hook Form עם defaultValues יציב
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Board>({
    resolver: joiResolver(boardSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent dividers sx={{ borderColor: "divider", py: 3 }}>
        <Stack spacing={2.5}>
          {/* 1. שם הלוח (title) */}
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="שם הלוח *"
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

          {/* 2. תיאור הלוח (description) */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="תיאור הלוח (אופציונלי)"
                multiline
                rows={3}
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
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

          {/* 3. לוח ציבורי (isPublic) */}
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    icon={<PublicIcon color="disabled" />}
                    checkedIcon={<PublicIcon color="primary" />}
                  />
                }
                label="לוח ציבורי (גלוי לכל משתמשי המערכת)"
                sx={{ ml: 0 }}
              />
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
          startIcon={isEdit ? <SaveIcon /> : <DashboardIcon />}
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
