import {
  Typography,
  Box,
  Divider,
  Container,
  CircularProgress,
  Button,
  Paper,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Task } from "../features/Task/models/Task";

// פונקציית עזר להמרת כל פורמט תאריך למחרוזת מוצגת בטוחה
const formatDate = (dateValue: any): string => {
  if (!dateValue) return "לא הוגדר";

  // מקרה 1: Firebase Timestamp (מכיל אובייקט עם seconds)
  if (typeof dateValue === "object" && "seconds" in dateValue) {
    return new Date(dateValue.seconds * 1000).toLocaleDateString("en-GB");
  }

  // מקרה 2: אובייקט Date של JS
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString("en-GB");
  }

  // מקרה 3: מחרוזת (למשל "2026-03-30" או ISO String)
  if (typeof dateValue === "string") {
    const parsedDate = new Date(dateValue);
    // בדיקה שהמחרוזת אכן המירה לתאריך תקין
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString("en-GB");
    }
    return dateValue; // אם זו כבר מחרוזת מוכנה לתצוגה
  }

  return String(dateValue);
};

export default function TaskPage() {
  const [task] = useState<Task | null>(null);
  const [loading] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "85vh",
        py: 4,
      }}
    >
      <Container maxWidth="sm" dir="rtl">
        {/* כפתור חזרה */}
        <Button
          startIcon={
            <ArrowBackIcon sx={{ transform: "scaleX(-1)", ml: 0.5 }} />
          }
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            fontWeight: "600",
            color: "text.secondary",
            fontSize: "0.85rem",
            "&:hover": { bgcolor: "action.hover" },
          }}
          variant="text"
          size="small"
        >
          חזרה למשימות
        </Button>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} thickness={4} />
          </Box>
        ) : task ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "12px",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* כותרת */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 1.5,
              }}
            >
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: "700",
                  color: "text.primary",
                  lineHeight: 1.3,
                }}
              >
                {task.title}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5, opacity: 0.5 }} />

            {/* תיאור */}
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.925rem",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                mb: 3,
              }}
            >
              {task.description || "אין תיאור זמין למשימה זו."}
            </Typography>

            {/* שורת מידע תחתית */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                pt: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* תאריך יעד - שימוש בפונקציית העזר הבטוחה */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                }}
              >
                <CalendarTodayIcon
                  sx={{
                    fontSize: "0.9rem",
                    color: "text.secondary",
                    opacity: 0.8,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "500", display: "block" }}
                >
                  תאריך יעד: {formatDate(task.dueDate)}
                </Typography>
              </Box>

              {/* שיוך מערכת */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                }}
              >
                <AccessTimeIcon
                  sx={{
                    fontSize: "0.9rem",
                    color: "text.secondary",
                    opacity: 0.6,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "500", display: "block", opacity: 0.7 }}
                >
                  TaskFlow
                </Typography>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
            }}
            elevation={0}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "600", color: "text.secondary" }}
            >
              המשימה לא נמצאה
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
