import React, { useCallback } from "react";
import { Box, AvatarGroup, Avatar, Tooltip, useTheme } from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

export interface BoardMember {
  id: string;
  name: string;
  avatar?: string;
}

interface BoardMembersAccessProps {
  members: BoardMember[];
  onManageAccess?: () => void;
}

// ⚡ אופטימיזציה: עטיפה ב-React.memo ותיקון שגיאת ה-JSX הקטועה מהמקור
export const BoardMembersAccess: React.FC<BoardMembersAccessProps> = React.memo(
  ({ members, onManageAccess }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // ⚡ אופטימיזציה: הוספת Handler מיוצב למניעת יצירת פונקציות inline ב-onClick
    const handleClick = useCallback(() => {
      if (onManageAccess) {
        onManageAccess();
      } else {
        alert("פתיחת חלון ניהול גישת משתמשים");
      }
    }, [onManageAccess]);

    return (
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 0.4,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.08)",
          bgcolor: isDark
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(255, 255, 255, 0.6)",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Tooltip title="ניהול גישה והרשאות">
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": {
                width: 26,
                height: 26,
                fontSize: "0.75rem",
                fontWeight: 600,
                borderWidth: "1.5px",
              },
            }}
          >
            {members.map((member) => (
              <Avatar key={member.id} alt={member.name} src={member.avatar}>
                {member.name.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </Tooltip>

        <PersonAddRoundedIcon
          sx={{
            fontSize: 16,
            color: "text.secondary",
            ml: 0.5,
          }}
        />
      </Box>
    );
  },
);

BoardMembersAccess.displayName = "BoardMembersAccess";
