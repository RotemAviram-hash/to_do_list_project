import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../router/routes";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOffIcon from "@mui/icons-material/ExploreOff";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "75vh",
          textAlign: "center",
          px: 2,
        }}
      >
        {/* אלמנט ויזואלי מרכזי - קומפוזיציה של ה-404 */}
        <Box sx={{ position: "relative", mb: 4 }}>
          {/* האייקון הענק שברקע (אפקט מטושטש / מודרני) */}
          <ExploreOffIcon
            sx={{
              fontSize: { xs: 120, md: 180 },
              color: "primary.main",
              opacity: 0.12,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* טקסט ה-404 המרכזי עם גרדיאנט */}
          <Typography
            variant="h1"
            component="div"
            sx={{
              fontSize: { xs: "6rem", md: "9rem" },
              fontWeight: "900",
              lineHeight: 1,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #90caf9 30%, #f48fb1 90%)"
                  : "linear-gradient(135deg, #1976d2 30%, #9c27b0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-2px",
            }}
          >
            404
          </Typography>
        </Box>

        {/* הודעת טקסט למשתמש */}
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "800", mb: 2, color: "text.primary" }}
        >
          אופס! הלכת לאיבוד בלוח המשימות?
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: "480px",
            mb: 5,
            lineHeight: 1.6,
            fontSize: "1.1rem",
            fontWeight: 500,
          }}
        >
          העמוד שאתה מחפש לא קיים, הועבר, או שאולי מחקת את המשימה הזו מהלוח
          לצמיתות. אל דאגה, שום דבר לא באמת הלך לאיבוד.
        </Typography>

        {/* כרטיס קטן עם "עצה מהמערכת" לתוספת חן */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            px: 4,
            mb: 5,
            borderRadius: "12px",
            bgcolor: "action.hover",
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "600", color: "text.secondary" }}
          >
            💡 משימה נוכחית: לחזור למסך הבית ולהמשיך להיות פרודוקטיביים.
          </Typography>
        </Paper>

        {/* כפתור חזרה הביתה אינטראקטיבי ומרווח */}
        <Button
          variant="contained"
          size="large"
          disableElevation
          startIcon={<HomeIcon sx={{ ml: 1 }} />} // אייקון בית קטן מימין לטקסט (RTL)
          onClick={() => navigate(ROUTES.HOME)}
          sx={{
            px: 5,
            py: 1.6,
            fontSize: "1rem",
            fontWeight: "700",
            borderRadius: "12px",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(144, 202, 249, 0.25)"
                : "0 4px 20px rgba(25, 118, 210, 0.25)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          חזרה למסך הבית
        </Button>
      </Box>
    </Container>
  );
}

export default PageNotFound;
