import React from "react";
import { Box, Paper, useTheme } from "@mui/material";

import type { CalendarViewProps } from "../modles/Calendar";
import { useCalendar } from "../hooks/useCalendar"; // 👈 ייבוא ה-Hook החדש

import { CalendarWelcomeBanner } from "./CalendarWelcomeBanner";
import { CalendarToolbar } from "./CalendarToolbar";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";

export const CalendarView: React.FC<CalendarViewProps> = React.memo(
  ({ tasks = [], onTaskClick }) => {
    const theme = useTheme();

    // ⚡ כל השדות והלוגיקה נשלפים מההוק החדש
    const {
      currentDate,
      viewMode,
      setViewMode,
      todayTasksCount,
      monthDays,
      weekDays,
      todayStr,
      getTasksForDay,
      handlePrev,
      handleNext,
      handleToday,
    } = useCalendar(tasks);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          width: "100%",
        }}
      >
        {/* 🎈 באנר הודעת ברכה */}
        <CalendarWelcomeBanner todayTasksCount={todayTasksCount} />

        {/* 🕹️ סרגל כלים וניווט */}
        <CalendarToolbar
          currentDate={currentDate}
          viewMode={viewMode}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewModeChange={setViewMode}
        />

        {/* 📅 תצוגות הלוח */}
        <Paper
          sx={{
            p: 2,
            borderRadius: "18px",
            bgcolor: theme.palette.background.paper,
          }}
        >
          {viewMode === "month" && (
            <MonthView
              monthDays={monthDays}
              currentDate={currentDate}
              todayStr={todayStr}
              getTasksForDay={getTasksForDay}
              onTaskClick={onTaskClick}
            />
          )}

          {viewMode === "week" && (
            <WeekView
              weekDays={weekDays}
              todayStr={todayStr}
              getTasksForDay={getTasksForDay}
              onTaskClick={onTaskClick}
            />
          )}

          {viewMode === "day" && (
            <DayView
              currentDate={currentDate}
              dayTasks={getTasksForDay(currentDate)}
              onTaskClick={onTaskClick}
            />
          )}
        </Paper>
      </Box>
    );
  },
);

CalendarView.displayName = "CalendarView";
