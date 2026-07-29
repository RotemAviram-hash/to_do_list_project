import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { useUser } from "../hooks/useUser";
import { registerSchema, type RegisterFormData } from "./userSchemas";

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterDialog: React.FC<RegisterDialogProps> = ({
  open,
  onClose,
  onSwitchToLogin,
}) => {
  const theme = useTheme();
  const { signup } = useUser();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: joiResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      role: "member",
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    setShowPassword(false);
    onClose();
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      await signup(data.email, data.password, {
        displayName: data.displayName,
        role: data.role || "member",
      });
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("שגיאה ביצירת החשבון. נסה שוב.");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: alpha(theme.palette.common.black, 0.4),
          },
        },
        paper: {
          sx: {
            borderRadius: 4,
            boxShadow: "0 24px 48px rgba(0,0,0,0.16)",
            backgroundImage: "none",
            margin: { xs: 2, sm: 3 }, // מרווח שוליים מהמסך
          },
        },
      }}
    >
      {/* כותרת */}
      <DialogTitle
        sx={{
          pt: 3,
          pb: 1,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
              width: 46,
              height: 46,
            }}
          >
            <PersonAddOutlinedIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: "1.15rem" }}
            >
              הרשמה למערכת
            </Typography>
            <Typography variant="caption" color="text.secondary">
              צור חשבון כדי להתחיל לעבוד
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="סגור"
          sx={{
            color: "text.secondary",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: alpha(theme.palette.text.primary, 0.08),
              transform: "rotate(90deg)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* תוכן הטופס עם פתרון הריפוד והחיתוך */}
      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: "16px !important", // מונע חיתוך של הלייבל העליון
          pb: 3.5, // מרווח תחתון נדיב
          overflowY: "auto", // גלילה חלקה במסכים נמוכים
        }}
      >
        {serverError && (
          <Fade in={Boolean(serverError)}>
            <Alert
              severity="error"
              onClose={() => setServerError(null)}
              sx={{ mb: 2.5, borderRadius: 2 }}
            >
              {serverError}
            </Alert>
          </Fade>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* שם תצוגה */}
            <TextField
              {...register("displayName")}
              label="שם תצוגה מלא"
              placeholder="לדוגמה: ישראל ישראלי"
              autoComplete="name"
              fullWidth
              error={!!errors.displayName}
              helperText={errors.displayName?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* דואר אלקטרוני */}
            <TextField
              {...register("email")}
              label="דואר אלקטרוני"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* סיסמה */}
            <TextField
              {...register("password")}
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        aria-label="הצג או הסתר סיסמה"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* כפתור הרשמה */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                mt: 1,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: 2.5,
                textTransform: "none",
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.38)}`,
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={26} color="inherit" />
              ) : (
                "צור חשבון חדש"
              )}
            </Button>

            {onSwitchToLogin && (
              <>
                <Divider sx={{ my: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    או
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: "center", pb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    כבר יש לך חשבון?{" "}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        handleClose();
                        onSwitchToLogin();
                      }}
                      sx={{
                        fontWeight: 700,
                        textTransform: "none",
                        p: 0,
                        minWidth: "auto",
                        verticalAlign: "baseline",
                        ml: 0.5,
                      }}
                    >
                      התחבר כאן
                    </Button>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
