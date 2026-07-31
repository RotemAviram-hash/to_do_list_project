import React from "react";
import { Dayjs } from "dayjs";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import type { Task } from "../../Task/models/Task";

interface DayViewProps {
  currentDate: Dayjs;
  dayTasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const DayView: React.FC<DayViewProps> = React.memo(
  ({ currentDate, dayTasks, onTaskClick }) => {
    const theme = useTheme();

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          רשימת משימות ל- {currentDate.format("DD/MM/YYYY")}
        </Typography>

        {dayTasks.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
            <CheckCircleOutlineIcon
              sx={{ fontSize: 48, opacity: 0.5, mb: 1 }}
            />
            <Typography variant="body1">
              אין משימות מתוכננות ליום זה 😎
            </Typography>
          </Box>
        ) : (
          dayTasks.map((t) => (
            <Paper
              key={t.id}
              onClick={() => onTaskClick?.(t)}
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: theme.palette.action.hover,
                border: "1px solid",
                borderColor: theme.palette.divider,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: theme.palette.background.paper,
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {t.title}
              </Typography>
              {t.description && (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", maxWidth: 300 }}
                >
                  {t.description}
                </Typography>
              )}
            </Paper>
          ))
        )}
      </Box>
    );
  },
);

DayView.displayName = "DayView";
