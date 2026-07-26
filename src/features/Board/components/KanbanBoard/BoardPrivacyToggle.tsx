import React from "react";
import { Button, alpha, useTheme } from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

interface BoardPrivacyToggleProps {
  isPublic: boolean;
  onToggle: () => void;
}

export const BoardPrivacyToggle: React.FC<BoardPrivacyToggleProps> = ({
  isPublic,
  onToggle,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Button
      size="small"
      onClick={onToggle}
      startIcon={
        isPublic ? (
          <PublicRoundedIcon sx={{ fontSize: 16 }} />
        ) : (
          <LockRoundedIcon sx={{ fontSize: 16 }} />
        )
      }
      sx={{
        borderRadius: "8px",
        px: 1.75,
        py: 0.5,
        fontSize: "0.775rem",
        fontWeight: 600,
        textTransform: "none",
        bgcolor: isPublic
          ? alpha(theme.palette.success.main, isDark ? 0.15 : 0.08)
          : alpha(theme.palette.warning.main, isDark ? 0.15 : 0.08),
        color: isPublic
          ? isDark
            ? theme.palette.success.light
            : theme.palette.success.dark
          : isDark
            ? theme.palette.warning.light
            : theme.palette.warning.dark,
        border: "1px solid",
        borderColor: isPublic
          ? alpha(theme.palette.success.main, 0.25)
          : alpha(theme.palette.warning.main, 0.25),
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: isPublic
            ? alpha(theme.palette.success.main, isDark ? 0.25 : 0.15)
            : alpha(theme.palette.warning.main, isDark ? 0.25 : 0.15),
        },
      }}
    >
      {isPublic ? "לוח ציבורי" : "לוח פרטי"}
    </Button>
  );
};
