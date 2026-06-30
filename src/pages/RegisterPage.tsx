import { Box, Button, TextField, Paper, Container, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useUser } from "../providers/UserProvider";
import { Navigate } from "react-router-dom";
import ROUTES from "../router/routes";

// 1. הגדרת סכימת הולידציה (נשאר בדיוק אותו דבר)
const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם פרטי הוא שדה חובה",
    "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
    "any.required": "שם פרטי הוא שדה חובה",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם משפחה הוא שדה חובה",
    "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
    "any.required": "שם משפחה הוא שדה חובה",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
      "any.required": "אימייל הוא שדה חובה",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
    "any.required": "סיסמה היא שדה חובה",
  }),

  phone: Joi.string()
    .pattern(/^[0-9\-\+]{9,15}$/)
    .required()
    .messages({
      "string.empty": "מספר טלפון הוא שדה חובה",
      "string.pattern.base": "מספר הטלפון אינו תקין",
      "any.required": "מספר טלפון הוא שדה חובה",
    }),

  address: Joi.string().min(5).required().messages({
    "string.empty": "כתובת מגורים היא שדה חובה",
    "string.min": "הכתובת חייבת להיות מפורטת יותר",
    "any.required": "כתובת מגורים היא שדה חובה",
  }),
});

function RegisterPage() {
  // 2. חיבור ה-Resolver ל-useForm (נשאר בדיוק אותו דבר)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(userSchema),
  });

  const { signup, user } = useUser();

  const onSubmit = (data: any) => {
    signup(data);
    console.log("Form Data:", data);
  };

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    // מרכז ומגביל את רוחב הטופס לרמה קריאה ונוחה (סביב 550px)
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* שימוש בקונטיינר גריד תקני ומרווח עם size */}
          <Grid container spacing={2.5}>
            {/* שם פרטי ושם משפחה יושבים זה לצד זה במסכים רחבים */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register("firstName")}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message as string}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register("lastName")}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message as string}
              />
            </Grid>

            {/* שדות אימייל וסיסמה זה לצד זה */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register("email")}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register("password")}
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message as string}
              />
            </Grid>

            {/* טלפון תופס שורה שלמה או חצי בהתאם לבחירתך, כרטיס מלא לטובת מראה נקי */}
            <Grid size={12}>
              <TextField
                {...register("phone")}
                label="Phone Number"
                type="tel"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone?.message as string}
              />
            </Grid>

            {/* שדה כתובת מגורים רחב */}
            <Grid size={12}>
              <TextField
                {...register("address")}
                label="Address"
                multiline
                rows={2}
                fullWidth
                error={!!errors.address}
                helperText={errors.address?.message as string}
              />
            </Grid>

            {/* כפתור שליחה */}
            <Grid size={12} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                type="submit"
                size="large"
                fullWidth
                sx={{
                  py: 1.4,
                  fontWeight: "600",
                  borderRadius: 2,
                }}
              >
                Sign up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
