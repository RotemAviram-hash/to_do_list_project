import { Box, Button, TextField, Paper, Container } from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useUser } from "../providers/UserProvider";
import ROUTES from "../router/routes";
import { Navigate } from "react-router-dom";

// 1. הגדרת סכימת הולידציה (נשאר בדיוק אותו דבר)
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // ולידציה לאימייל תקני
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
    }),
  password: Joi.string()
    .min(6) // מינימום 6 תווים
    .required()
    .messages({
      "string.empty": "סיסמה היא שדה חובה",
      "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
    }),
});

function LoginPage() {
  // 2. חיבור ה-Resolver ל-useForm (נשאר בדיוק אותו דבר)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema),
  });

  const { login, user } = useUser();

  const onSubmit = async (data: any) => {
    await login(data.email, data.password);
    console.log("Form Data:", data);
  };

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    // Container שדואג למרכז את הכרטיס יפה במסך
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {/* כרטיס מעוצב שעוטף את הטופס */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5, // רווח קצת יותר נעים לעין בין השדות
            }}
          >
            {/* שדה אימייל */}
            <TextField
              {...register("email")}
              label="Email" // שינוי מ-placeholder ל-label צף ותקני של MUI
              variant="outlined"
              fullWidth
              error={!!errors.email} // צובע באדום אם יש שגיאה
              helperText={errors.email?.message as string} // מציג את הודעת השגיאה
            />

            {/* שדה סיסמה */}
            <TextField
              {...register("password")}
              label="Password" // שינוי מ-placeholder ל-label צף ותקני של MUI
              type="password"
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message as string}
            />

            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{
                py: 1.2,
                fontWeight: "600",
                borderRadius: 2,
              }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
