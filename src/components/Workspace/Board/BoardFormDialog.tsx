import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import type { Board } from "../WorkspaceTypes";

interface BoardFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Board;
  handleSave: (data: Board) => void;
  currentUserId: string;
}

const boardSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().min(3).required().messages({
    "string.empty": "שם הלוח הוא שדה חובה",
    "string.min": "שם הלוח חייב להכיל לפחות 3 תווים",
  }),
  createdBy: Joi.string().required(),
  createdAt: Joi.number().required(),
  public: Joi.boolean().required(),
});

function BoardFormDialog({
  open,
  onClose,
  initialValues,
  handleSave,
  currentUserId,
}: BoardFormDialogProps) {
  const defaultValues: Partial<Board> = initialValues ?? {
    title: "",
    createdBy: currentUserId,
    createdAt: Date.now(),
    public: false,
  };

  const { control, handleSubmit, reset } = useForm<Board>({
    resolver: joiResolver(boardSchema),
    defaultValues,
  });

  const onSubmit = (data: Board) => {
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
        {initialValues ? "עריכת לוח" : "לוח עבודה חדש"}
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
                  label="שם הלוח"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              )}
            />

            <Controller
              name="public"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="לוח ציבורי (גלוי לכולם)"
                  sx={{ userSelect: "none" }}
                />
              )}
            />
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
            {initialValues ? "שמור" : "צור לוח"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BoardFormDialog;
