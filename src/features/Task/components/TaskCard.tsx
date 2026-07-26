import { useState, memo, useContext } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// האייקונים מהעיצוב החדש + עריכה
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

// Imports של המערכת שלך
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../../providers/ProjectThemeProvider";
import ROUTES from "../../../router/routes";
import { useUser } from "../../../user";
import type { Column } from "../../Column";
import type { Task } from "../models/Task";
import { EditTaskDialog } from "../dialogs/EditTaskDialog";
import { useTasks } from "../hooks/useTasks";

interface TaskCardProps {
  task: Task;
  columns: Column[];
  borderColor?: string;
  isDragging?: boolean;
  cardRef?: (node: HTMLElement | null) => void; // מקבל את ה-ref מה-Draggable
}

function TaskCard({
  task,
  columns,
  borderColor = "#1976d2", // צבע ברירת מחדל אם לא מועבר צבע עמודה
  isDragging = false,
  cardRef,
}: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // הוקים ו-Contexts קיימים במערכת
  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;
  const { user } = useUser();
  const { updateTask, deleteTask } = useTasks();

  // בדיקת שמירה לפי המשתמש המחובר כעת
  const currentUserId = user?.id || "";
  const isSavedByMe = task.savedBy?.includes(currentUserId) || false;

  // פונקציית Toggle לשמירת משימה
  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;

    const currentSaved = task.savedBy || [];
    const newSavedBy = isSavedByMe
      ? currentSaved.filter((id) => id !== currentUserId)
      : [...currentSaved, currentUserId];

    await updateTask(task.id, { savedBy: newSavedBy });
  };

  return (
    <Card
      ref={cardRef} // 👈 פה מולבשת הגרירה על כל הכרטיס!
      sx={{
        borderRadius: 3,
        borderColor: "divider",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        width: "100%",
        boxSizing: "border-box",
        cursor: isDragging ? "grabbing" : "grab", // 👈 אינדיקציה ויזואלית לעכבר תופס/גורר
        opacity: isDragging ? 0.6 : 1,
        transition: isDragging
          ? "none"
          : "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          transform: isDragging ? "none" : "translateY(-2px)",
          boxShadow: isDragging
            ? "none"
            : isDark
              ? "0px 8px 24px rgba(0,0,0,0.3)"
              : "0px 8px 24px rgba(0,0,0,0.06)",
          borderColor: borderColor,
        },
      }}
    >
      {/* סרגל שוליים צבעוני בצד הימני של הכרטיס */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 4,
          bgcolor: borderColor,
        }}
      />

      {/* כפתורי פעולה עליונים (עריכה ומחיקה) מופיעים למשתמש מחובר */}
      {user && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            display: "flex",
            gap: 0.5,
          }}
        >
          <Tooltip title="עריכת משימה">
            <IconButton
              size="small"
              onPointerDown={(e) => e.stopPropagation()} // מונע מאירוע הגרירה להתחיל בלחיצה על כפתור
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: isDark
                    ? "rgba(25, 118, 210, 0.12)"
                    : "rgba(25, 118, 210, 0.06)",
                },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="מחיקת משימה">
            <IconButton
              size="small"
              onPointerDown={(e) => e.stopPropagation()} // מונע מאירוע הגרירה להתחיל בלחיצה על כפתור
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "error.main",
                  bgcolor: isDark
                    ? "rgba(244, 67, 54, 0.08)"
                    : "rgba(211, 47, 47, 0.04)",
                },
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* component="div" פותר לחלוטין את שגיאת ה-button בתוך button! */}
      <CardActionArea
        component="div"
        onClick={() => navigate(ROUTES.TASK_PAGE + task.id)}
        sx={{ borderRadius: 3 }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2 } }}>
          {/* כותרת המשימה */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
              lineHeight: 1.4,
              pl: user ? 7 : 0, // מרווח למניעת חפיפה עם כפתורי הפעולה
            }}
          >
            {task.title}
          </Typography>

          {/* תיאור המשימה */}
          {task.description && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2,
                lineHeight: 1.6,
                fontSize: "0.875rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {task.description}
            </Typography>
          )}

          <Divider sx={{ my: 1.5 }} />

          {/* חלק תחתון: תאריך, שמירות/לייקים ואחראי */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              {/* תאריך יעד */}
              {task.dueDate && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 13 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {task.dueDate}
                  </Typography>
                </Box>
              )}

              {/* כפתור שמירה / לייק */}
              <Tooltip
                title={isSavedByMe ? "הסר משימה מהשמורות שלי" : "שמור משימה"}
              >
                <Button
                  onPointerDown={(e) => e.stopPropagation()} // מונע התחלת גרירה בזמן שמירה
                  onClick={handleToggleSave}
                  size="small"
                  startIcon={
                    isSavedByMe ? (
                      <BookmarkIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <BookmarkBorderIcon sx={{ fontSize: 14 }} />
                    )
                  }
                  sx={{
                    minWidth: "auto",
                    p: "2px 6px",
                    borderRadius: 1.5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color:
                      isSavedByMe || (task.savedBy && task.savedBy.length > 0)
                        ? isDark
                          ? "#63B3ED"
                          : "#3182CE"
                        : "text.secondary",
                  }}
                >
                  {task.savedBy?.length || 0}
                </Button>
              </Tooltip>
            </Box>

            {/* תמונת פרופיל / אווטאר של ה-Assignee */}
            {task.assigneeId ? (
              <Tooltip title={`אחראי: ${task.assigneeId}`}>
                <Avatar
                  sx={{
                    width: 26,
                    height: 26,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    bgcolor: borderColor,
                    color: isDark ? "#0A1128" : "#2D3748",
                  }}
                >
                  {task.assigneeId.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            ) : (
              <Tooltip title="אין אחראי כרגע">
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <AssignmentIndIcon sx={{ fontSize: 20 }} />
                </Box>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      {/* דיאלוג עריכה */}
      {isOpen && (
        <EditTaskDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          task={task}
          columns={columns}
          handleUpdate={updateTask}
        />
      )}
    </Card>
  );
}

export default memo(TaskCard);
