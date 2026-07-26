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
import type { Column } from "../models/Column";

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
  const { control, handleSubmit } = useForm<Column>({
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
            rules={{ required: "זהו שדה חובה" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="שם העמודה"
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
            rules={{ required: "יש לבחור ערכת צבעים" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="ערכת צבעים"
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
          color="inherit"
          sx={{ borderRadius: "10px", fontWeight: 600, px: 3 }}
        >
          ביטול
        </Button>
        <Button
          type="submit"
          variant="contained"
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
          {submitLabel}
        </Button>
      </DialogActions>
    </form>
  );
}
