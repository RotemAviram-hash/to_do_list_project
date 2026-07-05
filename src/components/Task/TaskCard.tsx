import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { Task } from "./Task.type";
import ROUTES from "../../router/routes";
import EditIcon from "@mui/icons-material/Edit";

import { useState, memo, useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../providers/ProjectThemeProvider";
import TaskFormDialog from "./TaskFormDialog";
import type { Column } from "../Column/Column.type";
import { useUser } from "../../user/providers/UserProvider";

interface TaskProps {
  task: Task;
  columns: Column[];
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string, action: "inc" | "dec") => void;
}

function TaskCard({
  task,
  columns,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: TaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;
  const { user } = useUser();

  const isCompleted = task.status === "completed";

  return (
    <Card
      elevation={0}
      sx={{
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 12px rgba(0,0,0,0.05)",
          borderColor: "text.disabled",
        },
      }}
    >
      <CardActionArea
        onClick={() => {
          navigate(ROUTES.TASK_PAGE + task.id);
        }}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <CardContent sx={{ p: 2.5, pb: 1, flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "600",
                lineHeight: 1.3,
                textDecoration: isCompleted ? "line-through" : "none",
                opacity: isCompleted ? 0.6 : 1,
              }}
            >
              {task.title}
            </Typography>

            <Chip
              label={task.status}
              size="small"
              sx={{
                textTransform: "capitalize",
                fontWeight: "600",
                fontSize: "0.75rem",
                borderRadius: "6px",
                bgcolor: isCompleted
                  ? isDark
                    ? "rgba(46, 125, 50, 0.2)"
                    : "#e8f5e9"
                  : isDark
                    ? "rgba(239, 108, 0, 0.2)"
                    : "#fff3e0",
                color: isCompleted
                  ? isDark
                    ? "#81c784"
                    : "#2e7d32"
                  : isDark
                    ? "#ffb74d"
                    : "#ef6c00",
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.5,
            }}
          >
            {task.description}
          </Typography>
        </CardContent>
      </CardActionArea>

      {user && (
        <CardActions
          sx={{
            px: 2,
            pb: 1.5,
            pt: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* קבוצת כפתורי עריכה ומחיקה */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setIsOpen(true)}
              aria-label="Edit task"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => handleDeleteTask(task.id)}
              aria-label="Delete task"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "error.main" },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* קבוצת הלייקים והאינטראקציה */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => updateLikes(task.id, "inc")}
                aria-label="Like"
                sx={{
                  color: isDark ? "#90caf9" : "#1976d2",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ThumbUpIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "600",
                  color: "text.secondary",
                }}
              >
                {task.likes.length}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => updateLikes(task.id, "dec")}
                aria-label="DisLike"
                sx={{
                  color: isDark ? "#f48fb1" : "#d32f2f",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ThumbDownIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: "600",
                  color: "text.secondary",
                }}
              >
                {task.dislikes.length}
              </Typography>
            </Box>
          </Box>
        </CardActions>
      )}

      {isOpen && (
        <TaskFormDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialValues={task}
          columns={columns}
          handleSave={handleEditTask}
        />
      )}
    </Card>
  );
}

export default memo(TaskCard);
