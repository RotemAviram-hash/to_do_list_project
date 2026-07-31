import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import DraggableTaskCard from "../../Task/components/DraggableTaskCard";
import type { Task } from "../../Task/models/Task";
import type { Column as ColumnType, ColumnTheme } from "../models/Column";

interface ColumnDropZoneProps {
  dropRef: (node: HTMLElement | null) => void;
  tasks: Task[];
  columns: ColumnType[];
  columnTheme?: ColumnTheme;
}

export const ColumnDropZone: React.FC<ColumnDropZoneProps> = memo(
  ({ dropRef, tasks, columns }) => {
    return (
      <Box
        ref={dropRef}
        sx={{
          p: 2,
          pt: 1.5,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1.75,
          overflowY: "auto",
          position: "relative",
          bgcolor: "transparent", // הרקע מנוהל כעת ע"י הקומפוננטה האב (Column)
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "action.disabledBackground",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "action.active",
          },
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task} columns={columns} />
          ))
        ) : (
          <Box
            sx={{
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: "16px",
              py: 4,
              px: 2,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.01)"
                  : "rgba(0, 0, 0, 0.01)",
              transition: "border-color 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <Box
              sx={{
                mb: 1,
                color: "text.disabled",
                display: "flex",
                p: 1.5,
                borderRadius: "50%",
                bgcolor: "action.hover",
              }}
            >
              <InboxOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "text.disabled",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              אין משימות בעמודה זו
            </Typography>
            <Typography
              variant="caption"
              sx={{
                textAlign: "center",
                color: "text.disabled",
                mt: 0.5,
                opacity: 0.8,
              }}
            >
              גרור לכאן משימות חדשות
            </Typography>
          </Box>
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.tasks === nextProps.tasks &&
      prevProps.columns === nextProps.columns &&
      prevProps.columnTheme === nextProps.columnTheme
    );
  },
);

ColumnDropZone.displayName = "ColumnDropZone";
