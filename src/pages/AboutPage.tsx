import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  useTheme,
  Grid,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
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
import ROUTES from "../router/routes";

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const features = [
    {
      title: "ניהול חכם",
      description: "מעקב דינמי ואוטומטי אחר כל המשימות שלכם בלוח Kanban מתקדם.",
      icon: <LayersIcon color="primary" />,
      bgColor: alpha(theme.palette.primary.main, 0.12),
    },
    {
      title: "סדרי עדיפויות",
      description:
        "הגדרת דחיפות, תיוג חכם ולוחות זמנים ברורים כדי שלא תפספסו דבר.",
      icon: <FlashOnIcon color="warning" />,
      bgColor: alpha(theme.palette.warning.main, 0.12),
    },
    {
      title: "חוויית משתמש (UX)",
      description:
        "ממשק פשוט, נקי, מודרני ואינטואיטיבי המותאם לעבודה מהירה וחלקה.",
      icon: <AutoAwesomeIcon color="secondary" />,
      bgColor: alpha(theme.palette.secondary.main, 0.12),
    },
    {
      title: "מקסימום פרודוקטיביות",
      description:
        "סנכרון מלא של הנתונים המאפשר לכם להישאר ממוקדים במה שחשוב באמת.",
      icon: <SpeedIcon color="success" />,
      bgColor: alpha(theme.palette.success.main, 0.12),
    },
  ];

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
            ? `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.15)} 0%, rgba(0,0,0,0) 70%)`
            : `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, rgba(255,255,255,0) 70%)`,
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
            icon={<TaskAltIcon sx={{ fontSize: "1.1rem !important" }} />}
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
                ? `linear-gradient(135deg, #ffffff 30%, ${theme.palette.primary.light} 90%)`
                : `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 90%)`,
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

        {/* סרגל ערכים */}
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
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      mb: 0.25,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.4,
                    }}
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
            bgcolor: isDark
              ? alpha("#ffffff", 0.02)
              : alpha(theme.palette.primary.main, 0.02),
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
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
                    sx={{
                      fontWeight: 900,
                      color: alpha(theme.palette.primary.main, 0.25),
                      mb: -1,
                      fontFamily: "monospace",
                    }}
                  >
                    {step.num}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: "text.primary",
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* הנעה לפעולה (CTA) */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            py: { xs: 6, sm: 8 }, // מרווח אנכי נדיב למעלה ולמטה
            px: { xs: 3, sm: 6 },
            borderRadius: "28px",
            background: isDark
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`
              : `linear-gradient(135deg, ${alpha("#6366f1", 0.06)} 0%, ${alpha("#a855f7", 0.05)} 100%)`,
            border: "1px solid",
            borderColor: isDark
              ? alpha(theme.palette.primary.main, 0.25)
              : alpha("#6366f1", 0.15),
            textAlign: "center",
          }}
        >
          {/* הילת עננים עדינה ברקע */}
          <Box
            sx={{
              position: "absolute",
              top: "-40%",
              right: "-10%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha("#8b5cf6", 0.08)} 0%, rgba(255,255,255,0) 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* קונטיינר Flex ראשי – gap כופה מרווח מדויק בין כל שורה ושורה */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: "640px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 2.5, sm: 3.5 }, // הרווח האנכי המדוייק בין האלמנטים!
            }}
          >
            {/* 1. תגית עליונה */}
            <Chip
              icon={
                <AutoAwesomeIcon
                  sx={{ fontSize: "1rem !important", color: "#7c3aed" }}
                />
              }
              label="הצעד הבא שלכם לפרודוקטיביות"
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: "50px",
                px: 1.5,
                py: 0.6,
                borderColor: alpha("#7c3aed", 0.3),
                bgcolor: alpha("#7c3aed", 0.1),
                color: isDark ? theme.palette.primary.light : "#6d28d9",
              }}
            />

            {/* 2. כותרת מרכזית */}
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.5rem" },
                lineHeight: 1.3,
                m: 0, // איפוס Margin ישן כדי למנוע התנגשויות
              }}
            >
              מוכנים לקחת שליטה על הזמן שלכם?
            </Typography>

            {/* 3. תת-כותרת */}
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.75,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                maxWidth: "540px",
                m: 0,
              }}
            >
              הירשמו עכשיו כדי להתחיל לארגן את הלוחות והמשימות שלכם במקום אחד
              בצורה חכמה, מהירה ומהנה.
            </Typography>

            {/* 4. אזור כפתורים עם Flex & Gap אופקי ואנכי */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2.5, // מרווח נפרד וברור בין שני הכפתורים
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                pt: 1, // דחיפה קלה נוספת כלפי מטה מרכיב הטקסט
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleRegister}
                startIcon={<PersonAddOutlinedIcon />}
                sx={{
                  fontWeight: 700,
                  px: 4.5,
                  py: 1.4,
                  borderRadius: "12px",
                  fontSize: "0.98rem",
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "#6366f1",
                  boxShadow: `0 6px 20px ${alpha("#6366f1", 0.3)}`,
                  "&:hover": {
                    bgcolor: "#4f46e5",
                    boxShadow: `0 8px 25px ${alpha("#6366f1", 0.4)}`,
                  },
                }}
              >
                להרשמה בחינם
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleLogin}
                startIcon={<LoginIcon />}
                sx={{
                  fontWeight: 700,
                  px: 4.5,
                  py: 1.4,
                  borderRadius: "12px",
                  fontSize: "0.98rem",
                  width: { xs: "100%", sm: "auto" },
                  borderColor: alpha("#6366f1", 0.35),
                  color: isDark ? "#ffffff" : "#4f46e5",
                  bgcolor: alpha("#ffffff", 0.05),
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    borderColor: "#6366f1",
                    bgcolor: alpha("#6366f1", 0.12),
                  },
                }}
              >
                התחברות למערכת
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;
