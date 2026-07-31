import React from "react";
import { Dayjs } from "dayjs";
import {
  Box,
  Button,
  IconButton,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import type { CalendarViewMode } from "../modles/Calendar";

interface CalendarToolbarProps {
  currentDate: Dayjs;
  viewMode: CalendarViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = React.memo(
  ({ currentDate, viewMode, onPrev, onNext, onToday, onViewModeChange }) => {
    const theme = useTheme();

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onToday}
            startIcon={<TodayIcon />}
            sx={{
              borderRadius: "10px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            היום
          </Button>

          <IconButton onClick={onPrev} size="small">
            <ChevronRightIcon />
          </IconButton>
          <IconButton onClick={onNext} size="small">
            <ChevronLeftIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 170 }}>
            {viewMode === "day"
              ? currentDate.format("DD MMMM YYYY")
              : currentDate.format("MMMM YYYY")}
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && onViewModeChange(val)}
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
    );
  },
);

CalendarToolbar.displayName = "CalendarToolbar";
