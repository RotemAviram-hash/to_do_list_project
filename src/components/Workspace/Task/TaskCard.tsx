import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { type Task } from "../WorkspaceTypes";
import { currentUserId } from "../../../store/WorkspaceStore";

interface TaskCardProps {
  task: Task;
  borderColor: string;
  isDarkMode: boolean;
  onToggleSave: (id: string) => void;
  // נוסיף פרופ אופציונלי כדי לדעת אם הכרטיס נגרר כרגע, כדי לבטל סגנונות Hover שמפריעים
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  borderColor,
  isDarkMode,
  onToggleSave,
  isDragging = false,
}) => {
  const isSavedByMe = task.savedBy?.includes(currentUserId) || false;

  return (
    <Card
      sx={{
        borderRadius: 3,
        borderColor: "divider",
        bgcolor: "background.paper",
        // מבטלים את המעברים המונפשים בזמן גרירה כדי למנוע השהיית מיקום (lag)
        transition: isDragging
          ? "none"
          : "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          // מפעילים אפקט ריחוף רק כשהכרטיס סטטי במקום
          transform: isDragging ? "none" : "translateY(-2px)",
          boxShadow: isDragging
            ? "none"
            : isDarkMode
              ? "0px 8px 24px rgba(0,0,0,0.3)"
              : "0px 8px 24px rgba(0,0,0,0.04)",
          borderColor: borderColor,
        },
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
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

      {/* כפתור מחיקה */}
      <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
        <Tooltip title="מחיקת משימה">
          <IconButton
            size="small"
            onPointerDown={(e) => e.stopPropagation()} // מונע מהגרירה להשתלט
            onClick={(e) => {
              e.stopPropagation();
              console.log(`לחיצה על מחיקת משימה: ${task.id}`);
            }}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: isDarkMode
                  ? "rgba(244, 67, 54, 0.08)"
                  : "rgba(211, 47, 47, 0.04)",
              },
            }}
          >
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
            lineHeight: 1.4,
            pl: 3,
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
              lineHeight: 1.6,
              fontSize: "0.875rem",
            }}
          >
            {task.description}
          </Typography>
        )}

        <Divider sx={{ my: 1.5 }} />

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {task.duDate}
              </Typography>
            </Box>

            {task.savedBy && (
              <Tooltip
                title={isSavedByMe ? "הסר משימה מהשמורות שלי" : "שמור משימה"}
              >
                <Button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(task.id);
                  }}
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
                      isSavedByMe || task.savedBy.length > 0
                        ? isDarkMode
                          ? "#63B3ED"
                          : "#3182CE"
                        : "text.secondary",
                  }}
                >
                  {task.savedBy.length}
                </Button>
              </Tooltip>
            )}
          </Box>

          {task.assigneeId ? (
            <Tooltip title={`אחראי: ${task.assigneeId}`}>
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  bgcolor: borderColor,
                  color: isDarkMode ? "#0A1128" : "#2D3748",
                }}
              >
                {task.assigneeId.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ) : (
            <Tooltip title="אין אחראי כרגע">
              <Box sx={{ color: "text.secondary", display: "flex" }}>
                <AssignmentIndIcon />
              </Box>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
