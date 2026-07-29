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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import { useUser } from "../hooks/useUser";

export interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = Joi.object<LoginFormData>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
    }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
  }),
});

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  onClose,
  onSwitchToRegister,
}) => {
  const theme = useTheme();
  const { login } = useUser();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    setShowPassword(false);
    onClose();
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      await login(data.email, data.password);
      handleClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("שגיאה בהתחברות. בדוק את הנתונים ונסה שוב.");
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
            margin: { xs: 2, sm: 3 }, // מונע מגע בקצוות המסך בנייד
          },
        },
      }}
    >
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
            <LockOutlinedIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: "1.15rem" }}
            >
              התחברות למערכת
            </Typography>
            <Typography variant="caption" color="text.secondary">
              הזן את פרטי החשבון שלך
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

      {/* הוספת ריפודים ורווחים ב-DialogContent */}
      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: "16px !important", // מונע חיתוך של ה-Labels העליונים
          pb: 3.5, // רווח נקי בתחתית
          overflowY: "auto", // גלילה חלקת במידה והמסך נמוך
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
            <TextField
              {...register("email")}
              label="דואר אלקטרוני"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
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

            <TextField
              {...register("password")}
              label="סיסמה"
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="current-password"
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
                "התחבר"
              )}
            </Button>

            {onSwitchToRegister && (
              <>
                <Divider sx={{ my: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    או
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: "center", pb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    עדיין אין לך חשבון?{" "}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        handleClose();
                        onSwitchToRegister();
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
                      הירשם עכשיו
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
