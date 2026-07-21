import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import type { Column } from "../../workspace/types/WorkspaceTypes";

interface ColumnFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Column;
  boardId: string;
  handleSave: (data: Column) => void;
  currentUserId: string;
}

const columnSchema = Joi.object({
  id: Joi.string().optional(),
  boardId: Joi.string().required(),
  title: Joi.string().min(2).required().messages({
    "string.empty": "שם העמודה הוא שדה חובה",
    "string.min": "שם העמודה חייב להכיל לפחות 2 תווים",
  }),
  createdBy: Joi.string().required(),
  createdAt: Joi.number().required(),
  color: Joi.string().default("#ffffff"),
  borderColor: Joi.string().default("#cccccc"),
});

function ColumnFormDialog({
  open,
  onClose,
  initialValues,
  boardId,
  handleSave,
  currentUserId,
}: ColumnFormDialogProps) {
  const defaultValues: Partial<Column> = initialValues ?? {
    boardId,
    title: "",
    createdBy: currentUserId,
    createdAt: Date.now(),
    color: "#ffffff",
    borderColor: "#e0e0e0",
  };

  const { control, handleSubmit, reset } = useForm<Column>({
    resolver: joiResolver(columnSchema),
    defaultValues,
  });

  const onSubmit = (data: Column) => {
    handleSave(data);
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{ "& .MuiDialog-paper": { borderRadius: "12px" } }}
    >
      <DialogTitle sx={{ fontWeight: 600, px: 3, pt: 3 }}>
        {initialValues ? "עריכת עמודה" : "עמודה חדשה"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ px: 3, py: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="שם העמודה"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              )}
            />

            <Stack direction="row" spacing={2}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="צבע רקע (Hex)"
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                )}
              />
              <Controller
                name="borderColor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="צבע מסגרת (Hex)"
                    fullWidth
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            ביטול
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ px: 3, borderRadius: "8px" }}
          >
            {initialValues ? "עדכן" : "צור עמודה"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ColumnFormDialog;
