import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function HeroPage() {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 0 },
        direction: "rtl", // התאמה מלאה לעברית
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          {/* צד ימין (בעברית): התוכן וההנעה לפעולה */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "right",
            }}
          >
            {/* תגית סטטוס טכנולוגית קטנה בעברית */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "text.secondary",
                  letterSpacing: "0.5px",
                }}
              >
                גרסה 1.0.0 // מוכן לעבודה
              </Typography>
            </Box>

            {/* כותרת ארכיטקטונית נקייה וסוחפת */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: "800",
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                lineHeight: 1.1,
                color: "text.primary",
                letterSpacing: "-1px",
                mb: 2,
              }}
            >
              תעשו סדר בבלגן. <br />
              <Box component="span" sx={{ color: "primary.main" }}>
                תבנו את לוח העבודה שלכם.
              </Box>
            </Typography>

            {/* תיאור ממוקד מטרה */}
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "480px",
                fontSize: "1.1rem",
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              מערכת חכמה לניהול משימות, פרויקטים ולוחות זמנים בעיצוב הנדסי נקי.
              הדרך המהירה והיעילה ביותר לקחת שליטה על המשימות שלכם, לעקוב אחר
              ההתקדמות ולבנות לוחות עבודה מנצחים.
            </Typography>

            {/* כפתור ההרשמה והתחלת הלוח החדש */}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />} // החץ פונה קדימה לפי כיוון ה-RTL
              sx={{
                px: 4,
                py: 1.8,
                borderRadius: "8px",
                fontSize: "1.05rem",
                fontWeight: "750",
                textTransform: "none",
                bgcolor: "text.primary",
                color: "background.paper",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "text.secondary",
                  transform: "scale(1.02)", // אפקט גדילה קטן ומזמין
                },
              }}
            >
              בואו נתחיל בקסם ✨
            </Button>
          </Box>

          {/* צד שמאל (בעברית): ממשק הלוח המדומה המפשט */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* אפקט זוהר עדין מאחורי הממשק */}
            <Box
              sx={{
                position: "absolute",
                width: "80%",
                height: "80%",
                borderRadius: "50%",
                bgcolor: "primary.light",
                filter: "blur(100px)",
                opacity: 0.08,
                zIndex: 1,
              }}
            />

            {/* קופסת הממשק המדומה - נקייה, ברורה ובלי תהליכים מבלבלים */}
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: 440,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "12px",
                boxShadow: "0px 20px 40px rgba(0,0,0,0.04)",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* כותרת הלוח */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  pb: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: "700", fontSize: "0.95rem" }}>
                  📋 לוח משימות ראשון
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    bgcolor: "action.hover",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    fontWeight: "600",
                  }}
                >
                  ראשי
                </Box>
              </Box>

              {/* משימה 1: מבוצעת */}
              <Box
                sx={{
                  p: 1.8,
                  bgcolor: "action.hover",
                  borderRadius: "8px",
                  borderRight: "4px solid",
                  borderColor: "success.main",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textDecoration: "line-through",
                    color: "text.disabled",
                  }}
                >
                  לבחור קנבס עיצוב סופי לפרויקט
                </Typography>
              </Box>

              {/* משימה 2: בעבודה */}
              <Box
                sx={{
                  p: 1.8,
                  bgcolor: "action.hover",
                  borderRadius: "8px",
                  borderRight: "4px solid",
                  borderColor: "primary.main",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "text.primary",
                  }}
                >
                  🚀 ללחוץ על הכפתור וליצור לוח חדש משלי
                </Typography>
              </Box>

              {/* משימה 3: ממתין */}
              <Box
                sx={{
                  p: 1.8,
                  bgcolor: "action.hover",
                  borderRadius: "8px",
                  borderRight: "4px solid",
                  borderColor: "warning.main",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "text.secondary",
                  }}
                >
                  להזמין את שאר חברי הצוות ללוח
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroPage;
