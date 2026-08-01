// src/features/Board/dialogs/ShareBoardDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import { useUsers } from "../../User/hooks/useUsers";
import { UserAvatar } from "../../User/components/UserAvatar";
import type { ShareBoardFormData } from "../models/ShareBoardFormData";
import type { Board, BoardMemberRole } from "../models/Board";

export interface DisplayMember {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  avatarColor?: string;
  role: BoardMemberRole;
}

interface ShareBoardDialogProps {
  open: boolean;
  onClose: () => void;
  board: Board;
  onAddMember: (targetUserId: string, role: BoardMemberRole) => Promise<void>;
  onRemoveMember?: (targetUserId: string) => Promise<void>;
}

const shareBoardSchema = Joi.object<ShareBoardFormData>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "חובה להזין כתובת אימייל",
      "string.email": "כתובת האימייל אינה תקינה",
    }),
  role: Joi.string().valid("editor", "viewer").required().messages({
    "any.only": "יש לבחור רמת הרשאה תקינה",
  }),
});

export const ShareBoardDialog: React.FC<ShareBoardDialogProps> = ({
  open,
  onClose,
  board,
  onAddMember,
  onRemoveMember,
}) => {
  const { users, usersMap, loading: loadingUsers } = useUsers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ShareBoardFormData>({
    resolver: joiResolver(shareBoardSchema),
    defaultValues: {
      email: "",
      role: "editor",
    },
  });

  if (!open || !board) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ShareBoardFormData) => {
    const targetUser = users.find(
      (u) => u.email?.toLowerCase() === data.email.trim().toLowerCase(),
    );

    if (!targetUser) {
      setError("email", {
        type: "manual",
        message: "משתמש עם אימייל זה אינו רשום במערכת",
      });
      return;
    }

    if (board.members?.[targetUser.id] || targetUser.id === board.createdBy) {
      setError("email", {
        type: "manual",
        message: "משתמש זה כבר שותף בלוח",
      });
      return;
    }

    try {
      await onAddMember(targetUser.id, data.role);
      reset();
    } catch {
      setError("email", {
        type: "manual",
        message: "אירעה שגיאה בעדכון הלוח, נסי שוב",
      });
    }
  };

  const combinedMembers: Record<string, BoardMemberRole> = {
    ...(board.createdBy
      ? { [board.createdBy]: "owner" as BoardMemberRole }
      : {}),
    ...(board.members || {}),
  };

  const memberList: DisplayMember[] = Object.entries(combinedMembers).map(
    ([userId, rawRole]) => {
      const profile = usersMap[userId];

      let role: BoardMemberRole = rawRole;
      if (!role || typeof role !== "string") {
        role = userId === board.createdBy ? "owner" : "editor";
      }

      const displayEmail = profile?.email
        ? profile.email
        : loadingUsers
          ? "טוען אימייל..."
          : `משתמש (${userId.slice(0, 6)}...)`;

      return {
        userId,
        email: displayEmail,
        displayName:
          profile?.displayName ||
          profile?.email ||
          `חבר לוח (${userId.slice(0, 5)})`,
        photoURL: profile?.photoURL,
        avatarColor: profile?.avatarColor,
        role,
      };
    },
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: { borderRadius: "16px", p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PersonAddRoundedIcon color="primary" />
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          שיתוף הלוח וחברים
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            הזיני אימייל כדי להוסיף חבר/ה ללוח:
          </Typography>

          <TextField
            {...register("email")}
            label="כתובת אימייל"
            type="email"
            fullWidth
            size="small"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            placeholder="user@example.com"
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  size="small"
                  error={Boolean(errors.role)}
                >
                  <InputLabel id="role-select-label">הרשאה</InputLabel>
                  <Select {...field} labelId="role-select-label" label="הרשאה">
                    <MenuItem value="editor">עורך/ת (עריכה מלאה)</MenuItem>
                    <MenuItem value="viewer">צופה (צפייה בלבד)</MenuItem>
                  </Select>
                  {errors.role && (
                    <FormHelperText>{errors.role.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                px: 3,
                whiteSpace: "nowrap",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "הוסף"
              )}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          משתתפים בלוח ({memberList.length})
        </Typography>

        <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
          {memberList.map((member) => (
            <ListItem
              key={member.userId}
              secondaryAction={
                member.role !== "owner" && onRemoveMember ? (
                  <IconButton
                    edge="end"
                    size="small"
                    color="error"
                    onClick={() => onRemoveMember(member.userId)}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                ) : null
              }
            >
              <ListItemAvatar>
                <UserAvatar user={member} size={32} />
              </ListItemAvatar>
              <ListItemText
                primary={member.displayName}
                secondary={member.email}
                slotProps={{
                  primary: { sx: { fontSize: "0.85rem", fontWeight: 600 } },
                  secondary: { sx: { fontSize: "0.75rem" } },
                }}
              />
              <Chip
                label={
                  member.role === "owner"
                    ? "בעלים"
                    : member.role === "editor"
                      ? "עורך"
                      : "צופה"
                }
                size="small"
                color={member.role === "owner" ? "primary" : "default"}
                variant="outlined"
                sx={{ mr: 1, height: 20, fontSize: "0.7rem" }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          sx={{ borderRadius: "8px" }}
        >
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};
