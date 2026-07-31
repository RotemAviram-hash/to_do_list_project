import { useState, useMemo, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/he";
import type { Task } from "../../Task/models/Task";
import type { CalendarViewMode } from "../modles/Calendar";

dayjs.locale("he");

export function useCalendar(tasks: Task[] = []) {
  // State
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  // 1️⃣ Map אופטימלי לכל המשימות לפי תאריך (O(N))
  const tasksByDateMap = useMemo(() => {
    const map = new Map<string, Task[]>();
    const safeList = Array.isArray(tasks) ? tasks : [];

    for (let i = 0; i < safeList.length; i++) {
      const task = safeList[i];
      if (!task?.dueDate) continue;

      const dateStr = dayjs(task.dueDate).format("YYYY-MM-DD");
      const existing = map.get(dateStr);
      if (existing) {
        existing.push(task);
      } else {
        map.set(dateStr, [task]);
      }
    }
    return map;
  }, [tasks]);

  // שליפה מהירה בלוק-אפ O(1)
  const getTasksForDay = useCallback(
    (date: Dayjs): Task[] => {
      const dateStr = date.format("YYYY-MM-DD");
      return tasksByDateMap.get(dateStr) || [];
    },
    [tasksByDateMap],
  );

  // ספירת משימות להיום
  const todayTasksCount = useMemo(() => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    return (tasksByDateMap.get(todayStr) || []).length;
  }, [tasksByDateMap]);

  // פונקציות ניווט ממוקשות
  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === "month") return prev.subtract(1, "month");
      if (viewMode === "week") return prev.subtract(1, "week");
      return prev.subtract(1, "day");
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === "month") return prev.add(1, "month");
      if (viewMode === "week") return prev.add(1, "week");
      return prev.add(1, "day");
    });
  }, [viewMode]);

  const handleToday = useCallback(() => setCurrentDate(dayjs()), []);

  // חישוב מערכי ימים
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

  const weekDays = useMemo(() => {
    const startOfWeek = currentDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }, [currentDate]);

  const todayStr = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

  return {
    currentDate,
    setCurrentDate,
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
  };
}
