import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid, // ייבוא חלק ונקי
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LayersIcon from "@mui/icons-material/Layers";

const AboutPage: React.FC = () => {
  const features = [
    {
      title: "ניהול חכם",
      description: "מעקב דינמי ואוטומטי אחר כל המשימות שלכם בלוח Kanban מתקדם.",
      icon: <LayersIcon color="primary" />,
    },
    {
      title: "סדרי עדיפויות",
      description:
        "הגדרת דחיפות, תיוג חכם ולוחות זמנים ברורים כדי שלא תפספסו דבר.",
      icon: <FlashOnIcon sx={{ color: "#ffb74d" }} />,
    },
    {
      title: "חוויית משתמש (UX)",
      description:
        "ממשק פשוט, נקי, מודרני ואינטואיטיבי המותאם לעבודה מהירה וחלקה.",
      icon: <AutoAwesomeIcon sx={{ color: "#f48fb1" }} />,
    },
    {
      title: "מקסימום פרודוקטיביות",
      description:
        "סנכרון מלא של הנתונים המאפשר לכם להישאר ממוקדים במה שחשוב באמת.",
      icon: <SpeedIcon color="success" />,
    },
  ];

  return (
    <Container maxWidth="lg" dir="rtl" sx={{ py: { xs: 6, md: 10 } }}>
      {/* אזור ה-Hero */}
      <Box sx={{ textAlign: "center", mb: 8, px: 2 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <TaskAltIcon color="primary" sx={{ fontSize: { xs: 32, md: 40 } }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "800",
              fontSize: { xs: "2rem", md: "2.75rem" },
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)"
                  : "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            אודות TaskFlow
          </Typography>
        </Box>

        <Typography
          variant="h6"
          component="p"
          sx={{
            color: "text.secondary",
            maxWidth: "650px",
            margin: "0 auto",
            fontWeight: "500",
            lineHeight: 1.6,
            fontSize: { xs: "1rem", md: "1.15rem" },
          }}
        >
          המטרה המרכזית שעמדה לנגד עינינו בפיתוח המערכת היא להעניק לכם כלי
          עוצמתי, פשוט ויעיל לעשות סדר בבלאגן, כדי שתוכלו להתמקד במה שבאמת חשוב.
        </Typography>
      </Box>

      {/* גריד הפיצ'רים המרכזי */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: "700",
            mb: 4,
            textAlign: { xs: "center", sm: "right" },
            color: "text.primary",
          }}
        >
          מה המערכת מציעה?
        </Typography>

        {/* קונטיינר גריד ראשי */}
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            // שימוש תקין ומדויק ב-size לפי הפרוטוקול החדש של MUI!
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  bgcolor: "background.paper",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 8px 30px rgba(0,0,0,0.4)"
                        : "0 8px 24px rgba(0,0,0,0.04)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    bgcolor: "action.hover",
                  }}
                >
                  {feature.icon}
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    component="h3"
                    sx={{ fontWeight: "700", mb: 0.5, color: "text.primary" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.5,
                      fontWeight: "400",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* פסקת סיום מעודדת */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mt: 10, // 💡 התיקון כאן: דוחף את הפסקה 48 פיקסלים למטה מגריד הפיצ'רים
          mb: 2, // מוסיף מרווח עדין מלמטה כדי שלא יידבק לפוטר של הדף
          textAlign: "center",
          borderRadius: "16px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "#f8f9fa",
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            fontWeight: "600",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          בין אם מדובר בפרויקטים אישיים, ניהול משימות שוטף או עבודה מקצועית –
          המערכת תעזור לכם לוודא ששום משימה לא נופלת בין הכיסאות. הגיע הזמן לקחת
          שליטה על הזמן שלכם.
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutPage;
