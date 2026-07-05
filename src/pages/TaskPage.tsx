import {
  Typography,
  Chip,
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
import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { Task } from "../components/Task/Task.type";
import { getPriorityColor, getStatusColor } from "../utils/tasksHelpers";
import { getTaskById } from "../components/Task/tasksDataServiceFireBase";

export default function TaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGetTask = useCallback(async () => {
    if (id) {
      setLoading(true);
      try {
        const savedTask = await getTaskById(id);
        if (savedTask) {
          savedTask.dueDate = new Date(
            (savedTask.dueDate as any).seconds * 1000,
          );
          setTask(savedTask);
        }
      } catch (e) {
        console.log("tasks is not a valid json", e);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    handleGetTask();
  }, [handleGetTask]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "85vh",
        py: 4,
      }}
    >
      <Container maxWidth="sm" dir="rtl">
        {/* כפתור חזרה מינימליסטי ושקט */}
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
          /* כרטיס אחד מהודק, נקי ולא צעקני */
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
            {/* שורת כותרת ותגיות */}
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

              {/* תגיות קטנות ורגועות (size="small") */}
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                <Chip
                  label={task.priority.toUpperCase()}
                  color={getPriorityColor(task.priority)}
                  variant="outlined"
                  size="small"
                  sx={{
                    fontWeight: "600",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    height: "20px",
                  }}
                />
                <Chip
                  label={task.status.toUpperCase()}
                  color={getStatusColor(task.status)}
                  size="small"
                  sx={{
                    fontWeight: "600",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    height: "20px",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 1.5, opacity: 0.5 }} />

            {/* תיאור המשימה - פונט קריא, בגודל רגוע ובצבע מעט עמום שלא יצעק */}
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

            {/* שורת מידע תחתית (Meta) - נקייה, קטנה ומיושרת בשורה אחת */}
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
              {/* תאריך יעד */}
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
                  תאריך יעד: {task.dueDate.toLocaleDateString("en-GB")}
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
