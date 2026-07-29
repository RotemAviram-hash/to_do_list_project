import React from "react";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Container,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      dir="rtl"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* תאורת רקע רכה ואבסטרקטית */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "100%", md: "900px" },
          height: "500px",
          background: isDark
            ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle, rgba(79,70,229,0.08) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* כותרת ראשית */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.8,
              borderRadius: "50px",
              bgcolor: isDark ? alpha("#ffffff", 0.04) : alpha("#000000", 0.03),
              border: "1px solid",
              borderColor: "divider",
              mb: 2.5,
            }}
          >
            <SupportAgentRoundedIcon
              sx={{ fontSize: "16px", color: "primary.main" }}
            />
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.secondary",
                letterSpacing: "0.5px",
              }}
            >
              מרכז עזרה ותמיכה
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.25rem", sm: "3.25rem" },
              letterSpacing: "-1.5px",
              mb: 2,
            }}
          >
            איך אפשר לעזור{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              לך היום?
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              maxWidth: "550px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            בחרנו לרכז עבורך את כל דרכי ההתקשרות המהירות ביותר, ללא טפסים
            מיותרים. פשוט פנה אלינו ישירות.
          </Typography>
        </Box>

        {/* מבנה גריד בסגנון Bento */}
        <Grid container spacing={3}>
          {/* כרטיס ראשי - אימייל ישיר */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 5 },
                height: "100%",
                borderRadius: "28px",
                bgcolor: isDark ? alpha("#ffffff", 0.02) : "background.paper",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: isDark
                    ? "0 10px 30px rgba(0,0,0,0.5)"
                    : "0 10px 30px rgba(0,0,0,0.03)",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    bgcolor: alpha("#6366f1", 0.1),
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <EmailRoundedIcon />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  פנייה ישירה בדוא״ל
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}
                >
                  הדרך המהירה ביותר לקבל מענה אנושי אמיתי. שלח אלינו הודעה
                  לכתובת המייל ונחזור אליך תוך מספר שעות בודדות.
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                href="mailto:rotemschool112@gmail.com"
                endIcon={
                  <ArrowBackRoundedIcon
                    sx={{ transform: "scaleX(-1)", mr: 1 }}
                  />
                }
                sx={{
                  alignSelf: "flex-start",
                  py: 1.5,
                  px: 4,
                  borderRadius: "14px",
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#6366f1",
                  color: "#ffffff",
                  boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
                  "&:hover": {
                    bgcolor: "#4f46e5",
                  },
                }}
              >
                rotemschool112@gmail.com
              </Button>
            </Paper>
          </Grid>

          {/* כרטיס צד - טלפון וזמינות (לחיץ לחיוג) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              component="a"
              href="tel:0524010644"
              sx={{
                p: { xs: 4, sm: 5 },
                height: "100%",
                borderRadius: "28px",
                bgcolor: isDark ? alpha("#ffffff", 0.02) : "background.paper",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#10b981",
                  transform: "translateY(-4px)",
                  boxShadow: isDark
                    ? "0 10px 30px rgba(0,0,0,0.5)"
                    : "0 10px 30px rgba(0,0,0,0.03)",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    bgcolor: alpha("#10b981", 0.1),
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <PhoneRoundedIcon />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  מוקד טלפוני
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 3 }}
                >
                  זמינים בימים א'-ה' בין השעות 09:00 עד 18:00. לחץ לחיוג מהיר.
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: isDark
                    ? alpha("#ffffff", 0.02)
                    : alpha("#000000", 0.02),
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      fontWeight: 600,
                    }}
                  >
                    מספר ישיר לחיוג
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "text.primary",
                    }}
                  >
                    0524010644
                  </Typography>
                </Box>
                <PhoneRoundedIcon sx={{ color: "#10b981", fontSize: "20px" }} />
              </Box>
            </Paper>
          </Grid>

          {/* כרטיס תחתון - פידבק מהיר */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "28px",
                bgcolor: isDark ? alpha("#ffffff", 0.02) : "background.paper",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  bgcolor: alpha("#f59e0b", 0.1),
                  color: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ChatRoundedIcon />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, mb: 0.5 }}
                >
                  הצעות לשיפור הפיצ'רים
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  יש לך רעיון למערכת? נשמח לשמוע ולהקדיש על כך מחשבה בעיצוב
                  הגרסאות הבאות. ❤️
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
