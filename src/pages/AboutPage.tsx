import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LayersIcon from "@mui/icons-material/Layers";
import SecurityIcon from "@mui/icons-material/Security";
import DevicesIcon from "@mui/icons-material/Devices";
import BlockIcon from "@mui/icons-material/Block";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import ROUTES from "../router/routes"; // ודא שהנתיב ל-ROUTES נכון אצלך

interface AboutPageProps {
  onNavigateToRegister?: () => void;
  onNavigateToLogin?: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToRegister,
  onNavigateToLogin,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  // פיצ'רים מרכזיים
  const features = [
    {
      title: "ניהול חכם",
      description: "מעקב דינמי ואוטומטי אחר כל המשימות שלכם בלוח Kanban מתקדם.",
      icon: <LayersIcon sx={{ color: "#1976d2" }} />,
      bgColor: alpha("#1976d2", 0.1),
    },
    {
      title: "סדרי עדיפויות",
      description:
        "הגדרת דחיפות, תיוג חכם ולוחות זמנים ברורים כדי שלא תפספסו דבר.",
      icon: <FlashOnIcon sx={{ color: "#ed6c02" }} />,
      bgColor: alpha("#ed6c02", 0.1),
    },
    {
      title: "חוויית משתמש (UX)",
      description:
        "ממשק פשוט, נקי, מודרני ואינטואיטיבי המותאם לעבודה מהירה וחלקה.",
      icon: <AutoAwesomeIcon sx={{ color: "#9c27b0" }} />,
      bgColor: alpha("#9c27b0", 0.1),
    },
    {
      title: "מקסימום פרודוקטיביות",
      description:
        "סנכרון מלא של הנתונים המאפשר לכם להישאר ממוקדים במה שחשוב באמת.",
      icon: <SpeedIcon sx={{ color: "#2e7d32" }} />,
      bgColor: alpha("#2e7d32", 0.1),
    },
  ];

  // ערכי יסוד אמיתיים
  const coreValues = [
    {
      title: "פרטיות מלאה",
      subtitle: "הנתונים שלכם שמורים באופן מאובטח",
      icon: <SecurityIcon color="primary" />,
    },
    {
      title: "חוויה נקייה",
      subtitle: "אפס פרסומות, מקסימום פוקוס",
      icon: <BlockIcon color="primary" />,
    },
    {
      title: "רספונסיביות מלאה",
      subtitle: "עובד בצורה מושלמת בנייד ובמחשב",
      icon: <DevicesIcon color="primary" />,
    },
  ];

  // צעדי העבודה האמיתיים במערכת
  const quickSteps = [
    {
      num: "01",
      title: "יוצרים לוח חדש",
      desc: "פותחים לוח עבודה מותאם אישית עבור הפרויקט או הנושא שלכם",
    },
    {
      num: "02",
      title: "מגדירים עמודות",
      desc: "מארגנים את שלבי העבודה (למשל: 'לביצוע', 'בתהליך', 'הושלם')",
    },
    {
      num: "03",
      title: "מוסיפים משימות",
      desc: "יוצרים משימות, מנהלים תיוגים, זמנים ומתקדמים לביצוע",
    },
  ];

  return (
    <Box
      dir="rtl"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        py: { xs: 5, sm: 8, md: 10 },
        minHeight: "100vh",
      }}
    >
      {/* תאורת רקע עדינה (Ambient Glow) */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "50%",
          transform: "translateX(50%)",
          width: { xs: "300px", sm: "500px", md: "600px" },
          height: { xs: "200px", sm: "350px", md: "400px" },
          background: isDark
            ? "radial-gradient(circle, rgba(144,202,249,0.12) 0%, rgba(0,0,0,0) 70%)"
            : "radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 2.5, sm: 3, md: 4 },
        }}
      >
        {/* אזור ה-Hero */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, sm: 8, md: 9 },
            mt: { xs: 2, md: 4 },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Chip
            icon={
              <TaskAltIcon sx={{ fontSize: "1.1rem !important", ml: 0.5 }} />
            }
            label="מערכת ניהול משימות אישית"
            color="primary"
            variant="outlined"
            sx={{
              mb: 3,
              fontWeight: 600,
              borderRadius: "20px",
              px: 1.5,
              py: 0.5,
              borderColor: alpha(theme.palette.primary.main, 0.3),
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          />

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
              lineHeight: 1.25,
              mb: 2.5,
              background: isDark
                ? "linear-gradient(135deg, #ffffff 30%, #90caf9 90%)"
                : "linear-gradient(135deg, #1a202c 30%, #1976d2 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            אודות TaskFlow
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              color: "text.secondary",
              maxWidth: "680px",
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            המטרה המרכזית שעמדה לנגד עינינו בפיתוח המערכת היא להעניק לכם כלי
            עוצמתי, פשוט ויעיל לעשות סדר בבלאגן, כדי שתוכלו להתמקד במה שבאמת
            חשוב.
          </Typography>
        </Box>

        {/* סרגל ערכים אמיתיים */}
        <Grid
          container
          spacing={{ xs: 2.5, md: 3 }}
          sx={{ mb: { xs: 6, sm: 8, md: 9 } }}
        >
          {coreValues.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 4 }} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: "16px",
                  bgcolor: isDark
                    ? alpha("#ffffff", 0.02)
                    : alpha("#000000", 0.02),
                  border: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="700"
                    color="text.primary"
                    sx={{ mb: 0.25 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    {item.subtitle}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* גריד הפיצ'רים המרכזי */}
        <Box sx={{ mb: { xs: 6, sm: 8, md: 9 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: { xs: 3, md: 4 },
              textAlign: { xs: "center", sm: "right" },
              color: "text.primary",
              fontSize: { xs: "1.5rem", md: "1.85rem" },
            }}
          >
            מה המערכת מציעה?
          </Typography>

          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: "divider",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      boxShadow: isDark
                        ? "0 12px 32px rgba(0,0,0,0.5)"
                        : "0 12px 28px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      bgcolor: feature.bgColor,
                      mb: 2.5,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "text.primary",
                      fontSize: "1.1rem",
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* שלבי העבודה */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5, md: 6 },
            mb: { xs: 6, sm: 8, md: 9 },
            borderRadius: "24px",
            bgcolor: isDark ? alpha("#ffffff", 0.02) : "#f8fafc",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="800"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 5 },
              color: "text.primary",
            }}
          >
            איך מתחילים לעבוד ב-3 צעדים פשוטים?
          </Typography>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {quickSteps.map((step, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Box
                  sx={{
                    textAlign: "center",
                    px: { xs: 1, sm: 2 },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight="900"
                    sx={{
                      color: alpha(theme.palette.primary.main, 0.25),
                      mb: -1,
                      fontFamily: "monospace",
                    }}
                  >
                    {step.num}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{ mb: 1, color: "text.primary" }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* הנעה לפעולה (CTA) – הרשמה / התחברות */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            borderRadius: "24px",
            background: isDark
              ? "linear-gradient(135deg, rgba(25,118,210,0.25) 0%, rgba(156,39,176,0.18) 100%)"
              : "linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)",
            color: "#ffffff",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
          }}
        >
          <Box
            sx={{
              maxWidth: "650px",
              mx: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                mb: 2,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }}
            >
              מוכנים לקחת שליטה על הזמן שלכם?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                lineHeight: 1.7,
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                px: { xs: 1, sm: 0 },
              }}
            >
              הירשמו עכשיו כדי להתחיל לארגן את הלוחות והמשימות שלכם במקום אחד.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row-reverse" }}
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(ROUTES.REGISTER)}
                startIcon={<PersonAddOutlinedIcon sx={{ ml: 1, mr: -0.5 }} />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#1976d2",
                  fontWeight: 700,
                  px: 4,
                  py: 1.3,
                  borderRadius: "12px",
                  width: { xs: "100%", sm: "auto" },
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  "&:hover": {
                    bgcolor: alpha("#ffffff", 0.92),
                  },
                }}
              >
                להרשמה
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
