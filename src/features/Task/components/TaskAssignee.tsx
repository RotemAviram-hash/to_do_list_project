import { memo, useMemo } from "react";
import { Box, Tooltip } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { UserAvatar } from "../../User/components/UserAvatar";

interface TaskAssigneeProps {
  assigneeId?: string;
  assigneeName: string;
  assigneeUser: any;
  isDark: boolean;
}

export const TaskAssignee = memo(
  function TaskAssignee({
    assigneeId,
    assigneeName,
    assigneeUser,
    isDark,
  }: TaskAssigneeProps) {
    const userForAvatar = useMemo(() => {
      return assigneeUser || { displayName: assigneeName };
    }, [assigneeUser, assigneeName]);

    if (!assigneeId) {
      return (
        <Tooltip title="אין אחראי כרגע">
          <Box
            sx={{
              color: "text.disabled",
              display: "flex",
              p: "4px",
              borderRadius: "50%",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            }}
          >
            <AssignmentIndIcon sx={{ fontSize: 16 }} />
          </Box>
        </Tooltip>
      );
    }

    return (
      <Tooltip title={`אחראי: ${assigneeName}`}>
        <Box component="span" sx={{ display: "inline-flex" }}>
          <UserAvatar user={userForAvatar} size={26} />
        </Box>
      </Tooltip>
    );
  },
  (prev, next) =>
    prev.assigneeId === next.assigneeId &&
    prev.assigneeName === next.assigneeName &&
    prev.assigneeUser === next.assigneeUser &&
    prev.isDark === next.isDark,
);
