import { useState, memo, useContext, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// הקונטקסטים וההוקים
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../../providers/ProjectThemeProvider";
import ROUTES from "../../../router/routes";
import { useUser } from "../../User/hooks/useUser";
import { useUsers } from "../../User/hooks/useUsers";
import type { Column } from "../../Column/models/Column";
import type { Task } from "../models/Task";
import { EditTaskDialog } from "../dialogs/EditTaskDialog";
import { useTasks } from "../hooks/useTasks";

// תת-קומפוננטות והקבועים
import { THEME_COLOR_MAP } from "./TaskCardConstants";
import { TaskActions } from "./TaskActions";
import { TaskDueDate } from "./TaskDueDate";
import { TaskBookmark } from "./TaskBookmark";
import { TaskAssignee } from "./TaskAssignee";
import { TaskComments } from "./TaskComments";

interface TaskCardProps {
  task: Task;
  columns: Column[];
  borderColor?: string;
  isDragging?: boolean;
  cardRef?: (node: HTMLElement | null) => void;
}

function TaskCard({
  task,
  columns,
  borderColor = "#199ed2",
  isDragging = false,
  cardRef,
}: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;
  const { user } = useUser();
  const { getUserName, usersMap } = useUsers();
  const { updateTask, deleteTask } = useTasks();

  const currentUserId = user?.id || "";

  // ⚡ איתור העמודה הנוכחית
  const currentColumn = useMemo(() => {
    return columns.find((col) => col.id === task.columnId);
  }, [columns, task.columnId]);

  // ⚡ חילוץ צבע העמודה הישיר והתאמה מיידית
  const activeColor = useMemo(() => {
    // 1. אם העבירו borderColor מפורש שאינו ברירת המחדל
    if (borderColor && borderColor !== "#199ed2") {
      return borderColor;
    }
    // 2. אם בעמודה יש שדה color ישיר (כמו Hex code: "#ff0000")
    if ((currentColumn as any)?.color) {
      return (currentColumn as any).color;
    }
    // 3. אם בעמודה יש שדה theme (מתוך מפת המנגנון)
    if (currentColumn?.theme) {
      return THEME_COLOR_MAP[currentColumn.theme]?.main || currentColumn.theme;
    }
    // 4. ברירת מחדל
    return "#199ed2";
  }, [borderColor, currentColumn]);

  // ⚡ חישוב נתונים נגזרים ב-useMemo
  const isSavedByMe = useMemo(() => {
    return task.savedBy?.includes(currentUserId) || false;
  }, [task.savedBy, currentUserId]);

  const commentsCount = useMemo(() => {
    return task.comments?.length || 0;
  }, [task.comments]);

  const assigneeName = useMemo(() => {
    return getUserName(task.assigneeId);
  }, [getUserName, task.assigneeId]);

  const assigneeUser = useMemo(() => {
    return task.assigneeId ? usersMap[task.assigneeId] : null;
  }, [usersMap, task.assigneeId]);

  // ⚡ Handlers עטופים ב-useCallback
  const handleToggleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUserId) return;

      const currentSaved = task.savedBy || [];
      const newSavedBy = isSavedByMe
        ? currentSaved.filter((id) => id !== currentUserId)
        : [...currentSaved, currentUserId];

      await updateTask(task.id, { savedBy: newSavedBy });
    },
    [currentUserId, task.savedBy, task.id, isSavedByMe, updateTask],
  );

  const handleOpenEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  const handleDeleteTask = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // מונע פתיחה של ה-Modal/Card בטעות

      // חלון אישור לפני מחיקה
      if (window.confirm(`האם למחוק את המשימה "${task.title || ""}"?`)) {
        deleteTask(task.id);
      }
    },
    [deleteTask, task.id, task.title], // 👈 הוספת task.title למערך התלויות
  );

  const handleNavigate = useCallback(() => {
    navigate(ROUTES.TASK_PAGE + task.id);
  }, [navigate, task.id]);

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Card
      ref={cardRef}
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isDragging ? activeColor : "divider",
        bgcolor: isDark ? "background.paper" : "#ffffff",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        width: "100%",
        boxSizing: "border-box",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        flexShrink: 0,
        height: "auto",
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.03)",
        transition: isDragging
          ? "none"
          : "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: isDragging ? "none" : "translateY(-3px)",
          boxShadow: isDark
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",
          borderColor: activeColor,
          "& .task-actions": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* פס צבע בצד הכרטיס */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 5,
          bgcolor: activeColor,
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      />

      {/* כפתורי פעולות (עריכה ומחיקה) */}
      {user && (
        <TaskActions
          isDark={isDark}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteTask}
          onPointerDown={handlePointerDown}
        />
      )}

      {/* גוף הכרטיס הלחיץ */}
      <CardActionArea
        component="div"
        onClick={handleNavigate}
        sx={{ borderRadius: "16px" }}
      >
        <CardContent
          sx={{ p: "18px 20px 14px 20px", "&:last-child": { pb: "14px" } }}
        >
          {/* כותרת המשימה */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: task.description ? 1 : 1.5,
              lineHeight: 1.4,
              pr: 1,
              pl: user ? 7 : 0,
              fontSize: "0.95rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
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
                lineHeight: 1.5,
                fontSize: "0.825rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                pr: 1,
              }}
            >
              {task.description}
            </Typography>
          )}

          <Divider sx={{ my: 1.25, opacity: 0.6 }} />

          {/* פוטר הכרטיס */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              {task.dueDate && (
                <TaskDueDate dueDate={task.dueDate} isDark={isDark} />
              )}

              <TaskComments count={commentsCount} isDark={isDark} />

              <TaskBookmark
                isSavedByMe={isSavedByMe}
                savedByCount={task.savedBy?.length || 0}
                isDark={isDark}
                onToggleSave={handleToggleSave}
                onPointerDown={handlePointerDown}
              />
            </Box>

            <TaskAssignee
              assigneeId={task.assigneeId}
              assigneeName={assigneeName}
              assigneeUser={assigneeUser}
              isDark={isDark}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* דיאלוג עריכה */}
      {isOpen && (
        <EditTaskDialog
          open={isOpen}
          onClose={handleCloseDialog}
          task={task}
          columns={columns}
        />
      )}
    </Card>
  );
}

// ⚡ אופטימיזציה מקסימלית: בדיקת Props חכמה שמבטיחה עדכון צבעים ונתונים מידי
export default memo(TaskCard, (prevProps, nextProps) => {
  const isSavedByEqual =
    prevProps.task.savedBy === nextProps.task.savedBy ||
    (prevProps.task.savedBy?.length === nextProps.task.savedBy?.length &&
      prevProps.task.savedBy?.every(
        (val, idx) => val === nextProps.task.savedBy?.[idx],
      ));

  const isCommentsEqual =
    prevProps.task.comments === nextProps.task.comments ||
    prevProps.task.comments?.length === nextProps.task.comments?.length;

  return (
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.borderColor === nextProps.borderColor &&
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.dueDate === nextProps.task.dueDate &&
    prevProps.task.assigneeId === nextProps.task.assigneeId &&
    prevProps.task.columnId === nextProps.task.columnId &&
    isSavedByEqual &&
    isCommentsEqual &&
    prevProps.columns === nextProps.columns
  );
});
