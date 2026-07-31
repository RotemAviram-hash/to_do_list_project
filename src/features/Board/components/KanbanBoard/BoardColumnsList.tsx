import React, { useMemo } from "react";
import { Box, Typography, Button, Paper, alpha, useTheme } from "@mui/material";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { Column as ColumnType } from "../../../Column/models/Column";
import type { Task } from "../../../Task/models/Task";
import Column from "../../../Column/components/Column";

interface BoardColumnsListProps {
  columns: ColumnType[];
  tasks: Task[];
  onAddColumn?: () => void;
}

export const BoardColumnsList: React.FC<BoardColumnsListProps> = React.memo(
  ({ columns, tasks, onAddColumn }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // ⚡ אופטימיזציה: מילון משימות לפי columnId בסיבוכיות O(N)
    const tasksByColumnMap = useMemo(() => {
      const map: Record<string, Task[]> = {};
      for (const task of tasks) {
        if (!map[task.columnId]) {
          map[task.columnId] = [];
        }
        map[task.columnId].push(task);
      }
      return map;
    }, [tasks]);

    // 🌟 מצב ריק (Empty State) במידה ואין עמודות בלוח
    if (columns.length === 0) {
      return (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            my: 3,
            borderRadius: "16px",
            borderStyle: "dashed",
            borderWidth: "2px",
            borderColor: alpha(theme.palette.divider, 0.8),
            bgcolor: isDark
              ? alpha(theme.palette.background.paper, 0.4)
              : alpha(theme.palette.action.hover, 0.3),
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              mb: 2,
              display: "flex",
            }}
          >
            <ViewColumnRoundedIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            אין עמודות בלוח זה עדיין
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 360, mb: 3 }}
          >
            כדי להתחיל לארגן את המשימות שלך, צור את העמודה הראשונה (כמו
            "לביצוע", "בתהליך" או "הושלם").
          </Typography>
          {onAddColumn && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={onAddColumn}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              הוסף עמודה ראשונה
            </Button>
          )}
        </Paper>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 2,
          pt: 1,
          px: 0.5,
          alignItems: "flex-start",
          flexGrow: 1,
          scrollBehavior: "smooth",

          // עיצוב פס גלילה מודרני ועדין
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: isDark
              ? alpha(theme.palette.common.white, 0.03)
              : alpha(theme.palette.common.black, 0.03),
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark
              ? alpha(theme.palette.common.white, 0.15)
              : alpha(theme.palette.common.black, 0.15),
            borderRadius: "8px",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: isDark
                ? alpha(theme.palette.common.white, 0.3)
                : alpha(theme.palette.common.black, 0.3),
            },
          },
        }}
      >
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              minWidth: { xs: 280, sm: 320 },
              maxWidth: { xs: 280, sm: 340 },
              flexShrink: 0,
            }}
          >
            <Column
              column={column}
              tasks={tasksByColumnMap[column.id] || []}
              columns={columns}
            />
          </Box>
        ))}
      </Box>
    );
  },
);

BoardColumnsList.displayName = "BoardColumnsList";
