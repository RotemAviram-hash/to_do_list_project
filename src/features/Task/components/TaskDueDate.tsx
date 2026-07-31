import { memo } from "react";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface TaskDueDateProps {
  dueDate: string;
  isDark: boolean;
}

export const TaskDueDate = memo(
  function TaskDueDate({ dueDate, isDark }: TaskDueDateProps) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          px: "8px",
          py: "3px",
          borderRadius: "6px",
        }}
      >
        <CalendarTodayIcon sx={{ fontSize: 12, color: "text.secondary" }} />
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, fontSize: "0.725rem" }}
        >
          {dueDate}
        </Typography>
      </Box>
    );
  },
  (prev, next) => prev.dueDate === next.dueDate && prev.isDark === next.isDark,
);
