import React from "react";
import { Paper, Typography, Avatar, alpha, useTheme, Box } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

interface CalendarWelcomeBannerProps {
  todayTasksCount: number;
}

export const CalendarWelcomeBanner: React.FC<CalendarWelcomeBannerProps> =
  React.memo(({ todayTasksCount }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
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
    );
  });

CalendarWelcomeBanner.displayName = "CalendarWelcomeBanner";
