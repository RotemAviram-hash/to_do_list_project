import React, { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/he";

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Avatar,
  alpha,
  useTheme,
} from "@mui/material";

// Icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

import type { Task } from "../../../Task/models/Task";

// הגדרת תמיכה בעברית ל-dayjs
dayjs.locale("he");

type CalendarViewMode = "month" | "week" | "day";

interface CalendarViewProps {
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks = [], // 🛡️ הגנה: ברירת מחדל של מערך ריק במקום undefined
  onTaskClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // State
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  // 🛡️ הגנה נוספת למופע safeTasks
  const safeTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

  // 1️⃣ חישוב משימות להיום (עבור הודעת העידוד)
  const todayTasksCount = useMemo(() => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    return safeTasks.filter((task) => {
      if (!task?.dueDate) return false;
      return dayjs(task.dueDate).format("YYYY-MM-DD") === todayStr;
    }).length;
  }, [safeTasks]);

  // 2️⃣ ניווט תאריכים
  const handlePrev = () => {
    if (viewMode === "month")
      setCurrentDate((prev) => prev.subtract(1, "month"));
    else if (viewMode === "week")
      setCurrentDate((prev) => prev.subtract(1, "week"));
    else setCurrentDate((prev) => prev.subtract(1, "day"));
  };

  const handleNext = () => {
    if (viewMode === "month") setCurrentDate((prev) => prev.add(1, "month"));
    else if (viewMode === "week") setCurrentDate((prev) => prev.add(1, "week"));
    else setCurrentDate((prev) => prev.add(1, "day"));
  };

  const handleToday = () => setCurrentDate(dayjs());

  // 3️⃣ חישוב ימים לתצוגה החודשית
  const monthDays = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startOfWeek = startOfMonth.startOf("week");
    const endOfWeek = endOfMonth.endOf("week");

    const days: Dayjs[] = [];
    let day = startOfWeek;
    while (day.isBefore(endOfWeek, "day") || day.isSame(endOfWeek, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  }, [currentDate]);

  // 4️⃣ חישוב ימים לתצוגה השבועית
  const weekDays = useMemo(() => {
    const startOfWeek = currentDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }, [currentDate]);

  // סינון משימות לפי תאריך ספציפי (עם הגנה מתקדמת)
  const getTasksForDay = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return safeTasks.filter(
      (t) => t?.dueDate && dayjs(t.dueDate).format("YYYY-MM-DD") === dateStr,
    );
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}
    >
      {/* 🎈 1. הודעת קבלת הפנים המעודדת */}
      <Paper
        elevation={0}
        sx={{
          p: 2.2,
          borderRadius: "16px",
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(
                theme.palette.background.paper,
                0.8,
              )} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, #FFFFFF 100%)`,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.25),
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            width: 46,
            height: 46,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <RocketLaunchIcon />
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.05rem" }}
          >
            היי! איזה כיף לראות אותך 👋
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.3 }}>
            {todayTasksCount > 0 ? (
              <>
                יש לך <b>{todayTasksCount}</b>{" "}
                {todayTasksCount === 1 ? "משימה" : "משימות"} לעשות היום, בוא
                ניתן את ה-100% שלנו! 💪
              </>
            ) : (
              "אין לך משימות מתוכננות להיום, זמן מצוין להתקדם במשימות הבאות! ✨"
            )}
          </Typography>
        </Box>
      </Paper>

      {/* 🕹️ 2. סרגל בקרת הלוח שנה */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* כפתורי ניווט + כותרת תאריך */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleToday}
            startIcon={<TodayIcon />}
            sx={{
              borderRadius: "10px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            היום
          </Button>

          <IconButton onClick={handlePrev} size="small">
            <ChevronRightIcon />
          </IconButton>
          <IconButton onClick={handleNext} size="small">
            <ChevronLeftIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 170 }}>
            {viewMode === "day"
              ? currentDate.format("DD MMMM YYYY")
              : currentDate.format("MMMM YYYY")}
          </Typography>
        </Box>

        {/* מחליף תצוגות (Month / Week / Day) */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
          sx={{
            bgcolor: theme.palette.action.hover,
            p: 0.4,
            borderRadius: "12px",
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: "8px",
              px: 1.8,
              py: 0.5,
              fontWeight: 600,
              fontSize: "0.82rem",
              textTransform: "none",
              "&.Mui-selected": {
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                boxShadow: theme.shadows[1],
              },
            },
          }}
        >
          <ToggleButton value="month">
            <CalendarMonthIcon sx={{ fontSize: 18, mr: 0.8 }} /> חודשי
          </ToggleButton>
          <ToggleButton value="week">
            <ViewWeekIcon sx={{ fontSize: 18, mr: 0.8 }} /> שבועי
          </ToggleButton>
          <ToggleButton value="day">
            <ViewDayIcon sx={{ fontSize: 18, mr: 0.8 }} /> יומי
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 📅 3. רנדור ה-Views השונים */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "18px",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* === תצוגה חודשית === */}
        {viewMode === "month" && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"].map((dayName) => (
              <Typography
                key={dayName}
                align="center"
                variant="caption"
                sx={{ fontWeight: 700, color: "text.secondary", pb: 1 }}
              >
                {dayName}
              </Typography>
            ))}

            {monthDays.map((dayItem, index) => {
              const isToday = dayItem.isSame(dayjs(), "day");
              const isCurrentMonth = dayItem.isSame(currentDate, "month");
              const dayTasks = getTasksForDay(dayItem);

              return (
                <Box
                  key={index}
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
        )}

        {/* === תצוגה שבועית === */}
        {viewMode === "week" && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1.5,
            }}
          >
            {weekDays.map((dayItem, index) => {
              const isToday = dayItem.isSame(dayjs(), "day");
              const dayTasks = getTasksForDay(dayItem);

              return (
                <Box
                  key={index}
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

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
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
        )}

        {/* === תצוגה יומית === */}
        {viewMode === "day" && (
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 1 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              רשימת משימות ל- {currentDate.format("DD/MM/YYYY")}
            </Typography>

            {getTasksForDay(currentDate).length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 48, opacity: 0.5, mb: 1 }}
                />
                <Typography variant="body1">
                  אין משימות מתוכננות ליום זה 😎
                </Typography>
              </Box>
            ) : (
              getTasksForDay(currentDate).map((t) => (
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
        )}
      </Paper>
    </Box>
  );
};
