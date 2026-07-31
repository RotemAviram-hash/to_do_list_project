import React from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface BoardHeaderProps {
  onAddColumn: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = React.memo(
  ({ onAddColumn }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: "1px solid",
          borderColor: isDark
            ? alpha(theme.palette.divider, 0.6)
            : alpha(theme.palette.divider, 0.8),
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* כפתור הוספת עמודה - עיצוב Soft Primary ברמת הגימור */}
        <Button
          size="medium"
          onClick={onAddColumn}
          startIcon={<AddRoundedIcon sx={{ fontSize: 20 }} />}
          sx={{
            borderRadius: "10px",
            px: 2.2,
            py: 0.8,
            fontSize: "0.85rem",
            fontWeight: 650,
            textTransform: "none",
            bgcolor: isDark
              ? alpha(theme.palette.primary.main, 0.16)
              : alpha(theme.palette.primary.main, 0.09),
            color: theme.palette.primary.main,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.25),
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: isDark
                ? alpha(theme.palette.primary.main, 0.28)
                : alpha(theme.palette.primary.main, 0.16),
              borderColor: theme.palette.primary.main,
              transform: "translateY(-1px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          עמודה חדשה
        </Button>
      </Box>
    );
  },
);

BoardHeader.displayName = "BoardHeader";
