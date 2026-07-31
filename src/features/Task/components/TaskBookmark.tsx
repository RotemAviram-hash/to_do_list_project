import { memo } from "react";
import { Tooltip, Button } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

interface TaskBookmarkProps {
  isSavedByMe: boolean;
  savedByCount: number;
  isDark: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onPointerDown: (e: React.PointerEvent) => void;
}

export const TaskBookmark = memo(
  function TaskBookmark({
    isSavedByMe,
    savedByCount,
    isDark,
    onToggleSave,
    onPointerDown,
  }: TaskBookmarkProps) {
    const isAnySaved = isSavedByMe || savedByCount > 0;

    return (
      <Tooltip title={isSavedByMe ? "הסר משימה מהשמורות שלי" : "שמור משימה"}>
        <Button
          onPointerDown={onPointerDown}
          onClick={onToggleSave}
          size="small"
          startIcon={
            isSavedByMe ? (
              <BookmarkIcon sx={{ fontSize: 14 }} />
            ) : (
              <BookmarkBorderIcon sx={{ fontSize: 14 }} />
            )
          }
          sx={{
            minWidth: "auto",
            p: "3px 8px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 600,
            bgcolor: isSavedByMe
              ? isDark
                ? "rgba(49, 130, 206, 0.15)"
                : "rgba(49, 130, 206, 0.08)"
              : "transparent",
            color: isAnySaved
              ? isDark
                ? "#63B3ED"
                : "#2B6CB0"
              : "text.secondary",
            "&:hover": {
              bgcolor: isDark
                ? "rgba(49, 130, 206, 0.25)"
                : "rgba(49, 130, 206, 0.12)",
            },
          }}
        >
          {savedByCount}
        </Button>
      </Tooltip>
    );
  },
  (prev, next) =>
    prev.isSavedByMe === next.isSavedByMe &&
    prev.savedByCount === next.savedByCount &&
    prev.isDark === next.isDark,
);
