import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Fade,
  Container,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);
    setStatus("ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.");
    setFormData({ fullName: "", email: "", message: "" });
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    // אנימציית כניסה חלקה לכל הדף בזמן טעינה
    <Fade in={true} timeout={600}>
      <Container maxWidth="lg" dir="rtl" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 12px 40px rgba(0,0,0,0.3)"
                : "0 12px 32px rgba(0,0,0,0.03)",
          }}
        >
          <Grid container>
            {/* טור 1: מידע קשר מפותח עם עיצוב זכוכית (Glassmorphism) */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                    : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                color: "white",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 5,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: "800", mb: 2, letterSpacing: "0.5px" }}
                >
                  מידע ליצירת קשר
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.85, lineHeight: 1.6, fontSize: "0.95rem" }}
                >
                  אנחנו כאן בשבילכם לכל שאלה, פידבק או הצעה במערכת. מלאו את
                  הטופס ונציג מהצוות שלנו יחזור אליכם תוך 24 שעות.
                </Typography>
              </Box>

              {/* רשימת פרטי קשר משודרגת ככרטיסים קטנים */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  {
                    icon: <PhoneIcon />,
                    label: "טלפון זמין",
                    value: "050-1234567",
                  },
                  {
                    icon: <EmailIcon />,
                    label: "אימייל לתמיכה",
                    value: "support@taskflow.com",
                  },
                  {
                    icon: <LocationOnIcon />,
                    label: "המיקום שלנו",
                    value: "תל אביב, ישראל",
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(4px)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.12)",
                        transform: "translateX(-4px)", // זז מעט ימינה (RTL) בריחוף
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", color: "white", opacity: 0.9 }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          opacity: 0.6,
                          fontWeight: "500",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", fontSize: "0.95rem" }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Typography
                variant="caption"
                sx={{ opacity: 0.5, fontWeight: "600", letterSpacing: "0.5px" }}
              >
                TaskFlow • פלטפורמה חכמה לניהול משימות
              </Typography>
            </Grid>

            {/* טור 2: הטופס המשודרג עם אייקונים מובנים פנימה */}
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "800",
                  mb: 4,
                  color: "text.primary",
                  letterSpacing: "0.3px",
                }}
              >
                שלחו לנו הודעה
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* שדה שם מלא */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="שם מלא"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon
                                fontSize="small"
                                sx={{ color: "text.secondary" }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  {/* שדה אימייל */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="כתובת אימייל"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon
                                fontSize="small"
                                sx={{ color: "text.secondary" }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  {/* שדה תוכן ההודעה */}
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="מה תרצו להגיד לנו?"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ alignSelf: "flex-start", mt: 1.5 }}
                            >
                              <MessageIcon
                                fontSize="small"
                                sx={{ color: "text.secondary" }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  {/* כפתור שליחה מעוצב עם רוחב מותאם */}
                  <Grid size={12} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      disableElevation
                      endIcon={
                        <SendIcon sx={{ transform: "scaleX(-1)", mr: 1.5 }} />
                      }
                      sx={{
                        px: 5,
                        py: 1.6,
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        borderRadius: "12px",
                        textTransform: "none",
                        boxShadow: (theme) =>
                          theme.palette.mode === "dark"
                            ? "0 4px 12px rgba(144, 202, 249, 0.2)"
                            : "0 4px 12px rgba(25, 118, 210, 0.2)",
                      }}
                    >
                      שליחת הודעה
                    </Button>
                  </Grid>

                  {/* סטטוס שליחה */}
                  {status && (
                    <Grid size={12}>
                      <Fade in={Boolean(status)}>
                        <Alert
                          severity="success"
                          variant="outlined"
                          sx={{ borderRadius: "12px", fontWeight: "600" }}
                        >
                          {status}
                        </Alert>
                      </Fade>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Fade>
  );
};

export default ContactPage;
