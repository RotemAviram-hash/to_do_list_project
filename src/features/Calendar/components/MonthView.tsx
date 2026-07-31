import React from "react";
import { Dayjs } from "dayjs";
import { Box, Typography, Chip, alpha, useTheme } from "@mui/material";
import type { Task } from "../../Task/models/Task";

interface MonthViewProps {
  monthDays: Dayjs[];
  currentDate: Dayjs;
  todayStr: string;
  getTasksForDay: (date: Dayjs) => Task[];
  onTaskClick?: (task: Task) => void;
}

const WEEK_DAYS_NAMES = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

export const MonthView: React.FC<MonthViewProps> = React.memo(
  ({ monthDays, currentDate, todayStr, getTasksForDay, onTaskClick }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}
      >
        {WEEK_DAYS_NAMES.map((dayName) => (
          <Typography
            key={dayName}
            align="center"
            variant="caption"
            sx={{ fontWeight: 700, color: "text.secondary", pb: 1 }}
          >
            {dayName}
          </Typography>
        ))}

        {monthDays.map((dayItem) => {
          const dayStr = dayItem.format("YYYY-MM-DD");
          const isToday = dayStr === todayStr;
          const isCurrentMonth = dayItem.isSame(currentDate, "month");
          const dayTasks = getTasksForDay(dayItem);

          return (
            <Box
              key={dayStr}
              sx={{
                minHeight: 100,
                p: 1,
                borderRadius: "10px",
                bgcolor: isToday
                  ? alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08)
                  : theme.palette.action.hover,
                border: "1px solid",
                borderColor: isToday
                  ? theme.palette.primary.main
                  : theme.palette.divider,
                opacity: isCurrentMonth ? 1 : 0.45,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? "primary.main" : "text.primary",
                }}
              >
                {dayItem.format("D")}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  overflowY: "auto",
                  maxHeight: 75,
                }}
              >
                {dayTasks.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.title}
                    size="small"
                    onClick={() => onTaskClick?.(t)}
                    sx={{
                      height: 22,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      color: "primary.main",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: theme.palette.primary.main,
                        color: "#FFF",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  },
);

MonthView.displayName = "MonthView";
