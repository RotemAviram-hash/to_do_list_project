import { memo } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";

interface TaskCommentsProps {
  count: number;
  isDark: boolean;
}

export const TaskComments = memo(
  function TaskComments({ count, isDark }: TaskCommentsProps) {
    if (!count || count === 0) return null;

    return (
      <Tooltip title={`${count} תגובות`}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            px: "8px",
            py: "3px",
            borderRadius: "6px",
            color: "text.secondary",
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 13 }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, fontSize: "0.725rem" }}
          >
            {count}
          </Typography>
        </Box>
      </Tooltip>
    );
  },
  (prev, next) => prev.count === next.count && prev.isDark === next.isDark,
);
