import { useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../providers/ProjectThemeProvider";

// מערך הקישורים עם התוכן הדינמי לכל דיאלוג
const FOOTER_LINKS = [
  {
    id: "terms",
    label: "תנאי שימוש",
    title: "תנאי השימוש (האותיות הקטנות 📜)",
    content:
      "TaskFlow היא אפליקציית דמו שנבנתה באהבה לתיק העבודות שלי 🚀. המערכת מוגשת 'כמו שהיא' כדי להשוויץ ביכולות פיתוח Full-Stack, ניהול משימות חלק ועיצוב מנצח. אזהרה: שימוש במערכת עלול לגרום לפרודוקטיביות יתר! 😉",
  },
  {
    id: "privacy",
    label: "פרטיות",
    title: "מדיניות פרטיות (סודי ביותר 🕵️‍♀️)",
    content:
      "אנחנו משתמשים ב-Firebase Authentication כדי לוודא שאתם זה אתם 🔒. כל המידע שנשמר נועד אך ורק להדגים פעולות בסיס נתונים (CRUD). המידע שלכם בטוח לחלוטין – אנחנו לא עוקבים, לא מוכרים מידע לצד שלישי, ובטח שלא נציק עם ספאם! ✨",
  },
];

function Footer() {
  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;

  // State לניהול הדיאלוג (שומר את התוכן הפעיל או null כשסגור)
  const [activeModal, setActiveModal] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleClose = () => {
    setActiveModal(null);
  };

  return (
    <>
      <Paper
        component="footer"
        elevation={0}
        sx={{
          mt: "auto",
          py: 2.5,
          px: 3,
          bgcolor: "background.paper", // צבע רקע מעט שונה ב-Light Mode כדי לתת מסגרת יפה לעמוד
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "center", // ממרכז את כל הפוטר למרכז המסך
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap", // מוודא שבמסכים קטנים זה ירד שורה בצורה יפה
          }}
        >
          {/* מותג */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: "700",
              fontSize: "0.85rem",
              background: isDark
                ? "linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)"
                : "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              userSelect: "none",
            }}
          >
            TaskFlow
          </Typography>

          {/* נקודת הפרדה עדינה */}
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            •
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: "500",
              fontSize: "0.8rem",
            }}
          >
            &copy; {new Date().getFullYear()} All rights reserved
          </Typography>

          {/* נקודת הפרדה עדינה */}
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            •
          </Typography>

          {/* קישורים טקסטואליים צמודים */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.id}
                component="button"
                onClick={() =>
                  setActiveModal({
                    title: link.title,
                    content: link.content,
                  })
                }
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  p: 0,
                  verticalAlign: "baseline",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* מודאל MUI דינמי */}
      <Dialog
        open={Boolean(activeModal)}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, fontSize: "1.1rem" }}>
          {activeModal?.title}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {activeModal?.content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pt: 1, px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            size="small"
            disableElevation
            sx={{ borderRadius: "8px", fontWeight: 600, px: 2.5 }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Footer;
