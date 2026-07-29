import { useState, memo, useContext, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// אייקונים
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

// הקונטקסטים וההוקים של המערכת
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../../providers/ProjectThemeProvider";
import ROUTES from "../../../router/routes";
import { useUser } from "../../User/hooks/useUser";
import { useUsers } from "../../User/hooks/useUsers";
import { UserAvatar } from "../../User/components/UserAvatar";
import type { Column, ColumnTheme } from "../../Column/models/Column";
import type { Task } from "../models/Task";
import { EditTaskDialog } from "../dialogs/EditTaskDialog";
import { useTasks } from "../hooks/useTasks";

// מפת הצבעים של העמודות (תואמת למה שהוגדר בכותרת העמודה)
export const THEME_COLOR_MAP: Record<
  ColumnTheme,
  { main: string; label: string }
> = {
  blue: { main: "#3b82f6", label: "כחול" },
  red: { main: "#ef4444", label: "אדום" },
  green: { main: "#22c55e", label: "ירוק" },
  yellow: { main: "#eab308", label: "צהוב" },
  purple: { main: "#a855f7", label: "סגול" },
  gray: { main: "#64748b", label: "אפור" },
  cyan: { main: "#06b6d4", label: "ציאן" },
  pink: { main: "#ec4899", label: "ורוד" },
  orange: { main: "#f97316", label: "כתום" },
  indigo: { main: "#6366f1", label: "אינדיגו" },
  teal: { main: "#14b8a6", label: "טיאל" },
};

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

  // ⚡ אופטימיזציה: מציאת העמודה של המשימה והתאמת הצבע שלה מתוך ה-Theme
  const column = useMemo(() => {
    return columns.find((col) => col.id === task.columnId);
  }, [columns, task.columnId]);

  const columnTheme = column?.theme || "gray";
  const themeColorObj = THEME_COLOR_MAP[columnTheme] || THEME_COLOR_MAP.gray;

  // אם לא הועבר borderColor ספציפי מבחוץ, ניקח את הצבע של העמודה
  const activeColor =
    borderColor !== "#199ed2" ? borderColor : themeColorObj.main;

  // ⚡ אופטימיזציה: שמירת חישובים כבדים ב-useMemo למניעת חישוב מיותר ברנדורים
  const isSavedByMe = useMemo(() => {
    return task.savedBy?.includes(currentUserId) || false;
  }, [task.savedBy, currentUserId]);

  const assigneeName = useMemo(() => {
    return getUserName(task.assigneeId);
  }, [getUserName, task.assigneeId]);

  const assigneeUser = useMemo(() => {
    return task.assigneeId ? usersMap[task.assigneeId] : null;
  }, [usersMap, task.assigneeId]);

  // ⚡ אופטימיזציה: מניעת יצירת פונקציות מחדש בכל רנדור בעזרת useCallback
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
      e.stopPropagation();
      deleteTask(task.id);
    },
    [deleteTask, task.id],
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
      {/* פס צבע בצד הכרטיס התואם לעמודה */}
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

      {user && (
        <Box
          className="task-actions"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 3,
            display: "flex",
            gap: 0.5,
            bgcolor: isDark
              ? "rgba(30, 41, 59, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(6px)",
            borderRadius: "10px",
            p: "2px",
            border: "1px solid",
            borderColor: "divider",
            opacity: { xs: 1, sm: 0 },
            transform: { xs: "none", sm: "translateY(2px)" },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Tooltip title="עריכת משימה">
            <IconButton
              size="small"
              onPointerDown={handlePointerDown}
              onClick={handleOpenEdit}
              sx={{
                color: "text.secondary",
                borderRadius: "8px",
                p: "6px",
                "&:hover": {
                  color: "primary.main",
                  bgcolor: isDark
                    ? "rgba(25, 118, 210, 0.15)"
                    : "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="מחיקת משימה">
            <IconButton
              size="small"
              onPointerDown={handlePointerDown}
              onClick={handleDeleteTask}
              sx={{
                color: "text.secondary",
                borderRadius: "8px",
                p: "6px",
                "&:hover": {
                  color: "error.main",
                  bgcolor: isDark
                    ? "rgba(244, 67, 54, 0.15)"
                    : "rgba(211, 47, 47, 0.08)",
                },
              }}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <CardActionArea
        component="div"
        onClick={handleNavigate}
        sx={{ borderRadius: "16px" }}
      >
        <CardContent
          sx={{ p: "18px 20px 14px 20px", "&:last-child": { pb: "14px" } }}
        >
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
                gap: 1.5,
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              {task.dueDate && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.03)",
                    px: "8px",
                    py: "3px",
                    borderRadius: "6px",
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ fontSize: 12, color: "text.secondary" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, fontSize: "0.725rem" }}
                  >
                    {task.dueDate}
                  </Typography>
                </Box>
              )}

              <Tooltip
                title={isSavedByMe ? "הסר משימה מהשמורות שלי" : "שמור משימה"}
              >
                <Button
                  onPointerDown={handlePointerDown}
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
                    p: "3px 8px",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: isSavedByMe
                      ? isDark
                        ? "rgba(49, 130, 206, 0.15)"
                        : "rgba(49, 130, 206, 0.08)"
                      : "transparent",
                    color:
                      isSavedByMe || (task.savedBy && task.savedBy.length > 0)
                        ? isDark
                          ? "#63B3ED"
                          : "#2B6CB0"
                        : "text.secondary",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(49, 130, 206, 0.25)"
                        : "rgba(49, 130, 206, 0.12)",
                    },
                  }}
                >
                  {task.savedBy?.length || 0}
                </Button>
              </Tooltip>
            </Box>

            {task.assigneeId ? (
              <Tooltip title={`אחראי: ${assigneeName}`}>
                <Box component="span" sx={{ display: "inline-flex" }}>
                  <UserAvatar
                    user={
                      assigneeUser || {
                        displayName: assigneeName,
                      }
                    }
                    size={26}
                  />
                </Box>
              </Tooltip>
            ) : (
              <Tooltip title="אין אחראי כרגע">
                <Box
                  sx={{
                    color: "text.disabled",
                    display: "flex",
                    p: "4px",
                    borderRadius: "50%",
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  }}
                >
                  <AssignmentIndIcon sx={{ fontSize: 16 }} />
                </Box>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </CardActionArea>

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

// ⚡ אופטימיזציה ממוקדת להשוואת פרופס מדויקת ב-React.memo
export default memo(TaskCard, (prevProps, nextProps) => {
  return (
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.borderColor === nextProps.borderColor &&
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.dueDate === nextProps.task.dueDate &&
    prevProps.task.assigneeId === nextProps.task.assigneeId &&
    prevProps.task.columnId === nextProps.task.columnId &&
    prevProps.task.savedBy?.length === nextProps.task.savedBy?.length &&
    prevProps.columns === nextProps.columns
  );
});
