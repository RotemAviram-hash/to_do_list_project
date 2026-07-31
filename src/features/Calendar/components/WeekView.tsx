import React from "react";
import { Dayjs } from "dayjs";
import { Box, Typography, Paper, alpha, useTheme } from "@mui/material";
import type { Task } from "../../Task/models/Task";

interface WeekViewProps {
  weekDays: Dayjs[];
  todayStr: string;
  getTasksForDay: (date: Dayjs) => Task[];
  onTaskClick?: (task: Task) => void;
}

export const WeekView: React.FC<WeekViewProps> = React.memo(
  ({ weekDays, todayStr, getTasksForDay, onTaskClick }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1.5,
        }}
      >
        {weekDays.map((dayItem) => {
          const dayStr = dayItem.format("YYYY-MM-DD");
          const isToday = dayStr === todayStr;
          const dayTasks = getTasksForDay(dayItem);

          return (
            <Box
              key={dayStr}
              sx={{
                minHeight: 280,
                p: 1.2,
                borderRadius: "12px",
                bgcolor: isToday
                  ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06)
                  : theme.palette.action.hover,
                border: "1px solid",
                borderColor: isToday
                  ? theme.palette.primary.main
                  : theme.palette.divider,
              }}
            >
              <Typography
                variant="subtitle2"
                align="center"
                sx={{
                  fontWeight: 700,
                  color: isToday ? "primary.main" : "text.primary",
                  mb: 1,
                }}
              >
                {dayItem.format("ddd D/M")}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {dayTasks.map((t) => (
                  <Paper
                    key={t.id}
                    onClick={() => onTaskClick?.(t)}
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      bgcolor: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontSize: "0.82rem" }}
                    >
                      {t.title}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  },
);

WeekView.displayName = "WeekView";
