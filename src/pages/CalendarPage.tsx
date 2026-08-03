import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { CalendarView } from "../features/Calendar/components/CalendarView";
import { useTasks } from "../features/Task/hooks/useTasks";
import type { Task } from "../features/Task/models/Task";

const CalendarPage: React.FC = () => {
  // 💡 במידה ו-useTasks מצפה ל-boardId, יש להעביר אותו כאן
  const { tasks, loading, error } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />

      {/* ⚡ שימוש ב-selectedTask כדי למנוע שגיאת Build של Unused Variable */}
      {selectedTask && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          משימה שנבחרה: {selectedTask.title}
        </Typography>
      )}
    </Box>
  );
};

export default CalendarPage;
