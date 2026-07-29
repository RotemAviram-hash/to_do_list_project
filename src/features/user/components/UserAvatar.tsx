import React from "react";
import { Avatar, Box } from "@mui/material";

export interface UserAvatarProps {
  user?: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    avatarColor?: string | null;
  } | null;
  size?: number;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * חילוץ האות הראשונה בלבד מתוך השם
 */
const getInitials = (name?: string): string => {
  if (!name) return "";
  return name.trim().charAt(0).toUpperCase();
};

export function UserAvatar({ user, size = 40, onClick }: UserAvatarProps) {
  if (!user) return null;

  const nameToDisplay = user.displayName || user.email || "";
  const avatarUrl = user.photoURL;
  const initials = getInitials(nameToDisplay);

  // גוון הילת הזוהר (משתמש בצבע המשתמש או בצבע דיפולטיבי)
  const glowColor =
    user.avatarColor && user.avatarColor.startsWith("#")
      ? user.avatarColor
      : "#4F46E5";

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        borderRadius: "50%",
        transition:
          "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
        // 🌟 הילה זוהרת עדינה ורכה
        boxShadow: `0 0 14px ${glowColor}40, 0 2px 6px rgba(0,0,0,0.12)`,
        "&:hover": onClick
          ? {
              transform: "scale(1.06)",
              // 🌟 חיזוק עדין של הזוהר בהובר
              boxShadow: `0 0 20px ${glowColor}70, 0 4px 12px rgba(0,0,0,0.18)`,
            }
          : {},
      }}
    >
      <Avatar
        alt={nameToDisplay}
        src={avatarUrl || undefined}
        sx={{
          width: size,
          height: size,
          fontWeight: 700,
          fontSize: `${size * 0.4}px`,
          bgcolor: user.avatarColor || "primary.main",
          color: "primary.contrastText",
          border: "2px solid",
          borderColor: "background.paper",
        }}
      >
        {!avatarUrl ? initials : null}
      </Avatar>
    </Box>
  );
}
