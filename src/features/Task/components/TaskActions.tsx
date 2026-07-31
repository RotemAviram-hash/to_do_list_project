import { memo } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface TaskActionsProps {
  isDark: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onPointerDown: (e: React.PointerEvent) => void;
}

export const TaskActions = memo(
  function TaskActions({
    isDark,
    onEdit,
    onDelete,
    onPointerDown,
  }: TaskActionsProps) {
    return (
      <Box
        className="task-actions"
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 3,
          display: "flex",
          gap: 0.5,
          bgcolor: isDark
            ? "rgba(30, 41, 59, 0.85)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(6px)",
          borderRadius: "10px",
          p: "2px",
          border: "1px solid",
          borderColor: "divider",
          opacity: { xs: 1, sm: 0 },
          transform: { xs: "none", sm: "translateY(2px)" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Tooltip title="עריכת משימה">
          <IconButton
            size="small"
            onPointerDown={onPointerDown}
            onClick={onEdit}
            sx={{
              color: "text.secondary",
              borderRadius: "8px",
              p: "6px",
              "&:hover": {
                color: "primary.main",
                bgcolor: isDark
                  ? "rgba(25, 118, 210, 0.15)"
                  : "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="מחיקת משימה">
          <IconButton
            size="small"
            onPointerDown={onPointerDown}
            onClick={onDelete}
            sx={{
              color: "text.secondary",
              borderRadius: "8px",
              p: "6px",
              "&:hover": {
                color: "error.main",
                bgcolor: isDark
                  ? "rgba(244, 67, 54, 0.15)"
                  : "rgba(211, 47, 47, 0.08)",
              },
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  },
  (prev, next) => prev.isDark === next.isDark,
);
