import { Box, IconButton, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useDroppable } from "@dnd-kit/react";
import { memo } from "react";
import type { Column as ColumnType } from "../types/Column";
import type { Task } from "../types/Task";
import DraggableTaskCard from "./DraggableTaskCard";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  columns: ColumnType[];
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string, action: "inc" | "dec") => void;
}

function Column({
  column,
  tasks,
  columns,
  onEditColumn,
  onDeleteColumn,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
  });

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 290,
        maxWidth: 320,
        maxHeight: "85vh", // מגביל את גובה העמודה כדי לאפשר גלילה פנימית במידת הצורך
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: isDropTarget ? "action.hover" : "background.default", // שינוי ל-default נותן קונטרסט יפה לעומת הכרטיסים
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isDropTarget ? "primary.main" : "divider",
        transition: "all 0.2s ease-in-out",
        boxShadow: isDropTarget ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* כותרת העמודה ופעולות */}
      <Box
        sx={{
          p: 2,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            noWrap
            sx={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "text.primary",
            }}
          >
            {column.name}
          </Typography>

          {/* בועית קטנה ואלגנטית שמציגה את כמות המשימות בעמודה */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: "action.selected",
              px: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "text.secondary",
              }}
            >
              {tasks.length}
            </Typography>
          </Box>
        </Box>

        {/* לחצני פעולות לעמודה */}
        <Box sx={{ display: "flex", gap: 0.25 }}>
          <IconButton
            size="small"
            onClick={() => onEditColumn(column)}
            aria-label="עריכת עמודה"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDeleteColumn(column.id)}
            aria-label="מחיקת עמודה"
            sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => {}}
            aria-label="מועדפים"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <StarBorderIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {}}
            aria-label="סגירה/פתיחה"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <CloseFullscreenRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* אזור גרירת המשימות (Drop Area) */}
      <Box
        ref={ref}
        sx={{
          p: 2,
          pt: 0.5,
          flex: 1,
          minHeight: 250,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          overflowY: "auto", // מאפשר גלילה חלקה בתוך העמודה עצמה
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "action.disabledBackground",
            borderRadius: "4px",
          },
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              columns={columns}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              updateLikes={updateLikes}
            />
          ))
        ) : (
          /* מצב ריק (Empty State) מעוצב ועדין יותר */
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: "12px",
              py: 4,
              px: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.disabled",
                fontWeight: "500",
              }}
            >
              אין משימות בעמודה
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default memo(Column);
