import React from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { BoardMembersAccess, type BoardMember } from "./BoardMembersAccess";
import { BoardPrivacyToggle } from "./BoardPrivacyToggle";

interface BoardHeaderProps {
  onAddColumn?: () => void;
  isPublic: boolean;
  onTogglePrivacy: () => void;
  members: BoardMember[];
  onManageAccess?: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  onAddColumn,
  isPublic,
  onTogglePrivacy,
  members,
  onManageAccess,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      {/* כפתור הוספת עמודה */}
      <Button
        size="small"
        onClick={onAddColumn || (() => alert("הוספת עמודה חדשה"))}
        startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: "8px",
          px: 2,
          py: 0.6,
          fontSize: "0.825rem",
          fontWeight: 600,
          textTransform: "none",
          bgcolor: isDark
            ? alpha(theme.palette.primary.main, 0.15)
            : alpha(theme.palette.primary.main, 0.08),
          color: "primary.main",
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.2),
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: isDark
              ? alpha(theme.palette.primary.main, 0.25)
              : alpha(theme.palette.primary.main, 0.15),
            borderColor: "primary.main",
          },
        }}
      >
        עמודה חדשה
      </Button>

      {/* אזור פרטיות וניהול משתמשים */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {isPublic && (
          <BoardMembersAccess
            members={members}
            onManageAccess={onManageAccess}
          />
        )}
        <BoardPrivacyToggle isPublic={isPublic} onToggle={onTogglePrivacy} />
      </Box>
    </Box>
  );
};
