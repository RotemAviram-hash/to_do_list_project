import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  alpha,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../router/routes";

interface TaskMasterHeroProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

const TaskMasterHero: React.FC<TaskMasterHeroProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      dir="rtl"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        py: { xs: 6, sm: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* רקע דקורטיבי רך */}
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

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, px: { xs: 2.5, sm: 3, md: 4 } }}
      >
        {/* חלק עליון: כותרת ראשית והנעה לפעולה */}
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "780px",
            mx: "auto",
            mb: { xs: 8, md: 10 },
          }}
        >
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
              mb: 3,
            }}
          >
            <WorkspacePremiumRoundedIcon
              sx={{ fontSize: "18px", color: "primary.main" }}
            />
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              הדור הבא של ארגון המשימות והפרויקטים
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.5rem", sm: "3.75rem", md: "4.5rem" },
              lineHeight: 1.1,
              letterSpacing: "-2px",
              mb: 3,
            }}
          >
            הופכים משימות מורכבות ל{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              הצלחה חלקה.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              lineHeight: 1.7,
              mb: 4,
              maxWidth: "640px",
              mx: "auto",
            }}
          >
            מערכת ניהול משימות אינטואיטיבית שתוכננה במיוחד כדי לתת לכם סדר בראש,
            פוקוס מוחלט ויכולת לבצע יותר בפחות מאמץ.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              component={RouterLink}
              to={ROUTES.WORKSPACE}
              variant="contained"
              size="large"
              endIcon={<ArrowBackIcon sx={{ mr: 1, ml: -0.5 }} />}
              sx={{
                px: 4.5,
                py: 1.7,
                borderRadius: "14px",
                fontSize: "1.05rem",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#6366f1",
                color: "#ffffff",
                width: { xs: "100%", sm: "auto" },
                boxShadow: "0 10px 25px rgba(99,102,241,0.35)",
                "&:hover": {
                  bgcolor: "#4f46e5",
                },
              }}
            >
              בוא נתחיל לעבוד
            </Button>
          </Box>
        </Box>

        {/* מבנה Bento Grid חדשני הכולל את לוח השנה */}
        <Grid container spacing={3}>
          {/* כרטיס גדול 1: לוחות עבודה חזותיים */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                height: "100%",
                borderRadius: "28px",
                bgcolor: isDark
                  ? alpha("#ffffff", 0.02)
                  : alpha("#000000", 0.02),
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ maxWidth: "420px", mb: 4 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: alpha("#6366f1", 0.1),
                    color: "#6366f1",
                    mb: 2,
                  }}
                >
                  <LayersRoundedIcon />
                </Box>
                <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }}>
                  לוחות עבודה חכמים (Kanban)
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  שלוט בזרימת העבודה שלך בקלות. גרור משימות בין עמודות, סנן לפי
                  תיוגים ועקוב אחר ההתקדמות בזמן אמת בלי לאבד את הפוקוס.
                </Typography>
              </Box>

              {/* מוקאפ פנימי קטן שממחיש לוח */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 1,
                }}
              >
                <Box
                  sx={{
                    minWidth: "180px",
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "text.secondary",
                      mb: 1.5,
                    }}
                  >
                    📌 לביצוע
                  </Typography>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "8px",
                      bgcolor: isDark
                        ? alpha("#ffffff", 0.03)
                        : alpha("#000000", 0.03),
                      mb: 1,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    עיצוב ממשק משתמש
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "8px",
                      bgcolor: isDark
                        ? alpha("#ffffff", 0.03)
                        : alpha("#000000", 0.03),
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    כתיבת מסמך דרישות
                  </Box>
                </Box>

                <Box
                  sx={{
                    minWidth: "180px",
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#6366f1",
                      mb: 1.5,
                    }}
                  >
                    ⚡ בתהליך עבודה
                  </Typography>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "8px",
                      bgcolor: alpha("#6366f1", 0.08),
                      color: "#6366f1",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    פיתוח רכיבי צד-לקוח
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* כרטיס צדדי 2: לוח שנה חכם (Calendar Feature) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                height: "100%",
                borderRadius: "28px",
                bgcolor: isDark
                  ? alpha("#ffffff", 0.02)
                  : alpha("#000000", 0.02),
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: alpha("#a855f7", 0.1),
                    color: "#a855f7",
                    mb: 2,
                  }}
                >
                  <CalendarMonthRoundedIcon />
                </Box>
                <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }}>
                  לוח שנה וניהול תאריכים
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  תצוגה חודשית ושבועית המרכזת את כל המשימות והדדליינים שלך בצורה
                  ויזואלית נוחה המונעת פספוסים.
                </Typography>
              </Box>

              {/* ווידג'ט לוח שנה מדומה */}
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    📅 יולי 2026
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#a855f7",
                    }}
                  >
                    3 משימות היום
                  </Typography>
                </Box>

                {/* דוגמה למשימה משובצת בלוח השנה */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: alpha("#a855f7", 0.08),
                    border: "1px solid",
                    borderColor: alpha("#a855f7", 0.2),
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      bgcolor: "#a855f7",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    12
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700 }}>
                      הגשת פרויקט גמר
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                    >
                      שעה 14:00 • דדליין ראשי
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TaskMasterHero;
