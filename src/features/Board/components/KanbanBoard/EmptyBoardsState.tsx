import React from "react";
import { Box, Typography, Button, Paper, alpha, useTheme } from "@mui/material";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface EmptyBoardsStateProps {
  onCreateBoard: () => void;
}

export const EmptyBoardsState: React.FC<EmptyBoardsStateProps> = React.memo(
  ({ onCreateBoard }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 4, sm: 6 },
          my: 5,
          mx: "auto",
          maxWidth: 500,
          borderRadius: "20px",
          borderStyle: "dashed",
          borderWidth: "2px",
          borderColor: alpha(theme.palette.divider, 0.8),
          bgcolor: isDark
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.action.hover, 0.25),
          textAlign: "center",
          transition: "border-color 0.2s ease-in-out",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
        }}
      >
        {/* אייקון מרכזי עם הילה עדינה */}
        <Box
          sx={{
            p: 2.2,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            mb: 2.5,
            display: "flex",
            boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          <DashboardCustomizeRoundedIcon sx={{ fontSize: 44 }} />
        </Box>

        {/* כותרת ראשית */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 750, color: "text.primary", mb: 1 }}
        >
          אין לוחות עבודה עדיין
        </Typography>

        {/* תיאור */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360, mb: 3.5, lineHeight: 1.6 }}
        >
          צור את הלוח הראשון שלך כדי להתחיל לארגן את המשימות, המעקב והפרויקטים
          במקום אחד.
        </Typography>

        {/* כפתור יצירת לוח ראשון */}
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRoundedIcon />}
          onClick={onCreateBoard}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            px: 3.5,
            py: 1.2,
            fontSize: "0.95rem",
            boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}`,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 8px 22px ${alpha(theme.palette.primary.main, 0.45)}`,
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          צור לוח ראשון
        </Button>
      </Paper>
    );
  },
);

EmptyBoardsState.displayName = "EmptyBoardsState";
