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
  canEdit?: boolean; // 👈 הרשאת עריכה
}

export const ColumnDropZone: React.FC<ColumnDropZoneProps> = memo(
  ({ dropRef, tasks, columns, canEdit = false }) => {
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
          bgcolor: "transparent",
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
            <DraggableTaskCard
              key={task.id}
              task={task}
              columns={columns}
              canEdit={canEdit} // 👈 העברת הרשאת העריכה למשימה
            />
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
              "&:hover": canEdit
                ? {
                    borderColor: "primary.main",
                  }
                : undefined,
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
            {canEdit && (
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
            )}
          </Box>
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.tasks === nextProps.tasks &&
      prevProps.columns === nextProps.columns &&
      prevProps.columnTheme === nextProps.columnTheme &&
      prevProps.canEdit === nextProps.canEdit
    );
  },
);

ColumnDropZone.displayName = "ColumnDropZone";
