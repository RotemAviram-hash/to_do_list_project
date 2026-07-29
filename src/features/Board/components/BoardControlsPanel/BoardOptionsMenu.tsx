import React, { useState, useCallback } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface BoardOptionsMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

// ⚡ אופטימיזציה: הוצאת הסטייל הסטטי מחוץ לקומפוננטה
const MENU_PAPER_PROPS = {
  paper: {
    sx: { borderRadius: "12px", minWidth: 150, mt: 1, boxShadow: 4 },
  },
};

const ICON_BUTTON_SX = {
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "10px",
  p: 0.8,
};

// ⚡ אופטימיזציה: עטיפה ב-React.memo
export const BoardOptionsMenu: React.FC<BoardOptionsMenuProps> = React.memo(
  ({ onEdit, onDelete, disabled = false }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleEditClick = useCallback(() => {
      handleClose();
      onEdit?.();
    }, [handleClose, onEdit]);

    const handleDeleteClick = useCallback(() => {
      handleClose();
      onDelete?.();
    }, [handleClose, onDelete]);

    return (
      <>
        <Tooltip title={disabled ? "" : "אפשרויות לוח"}>
          <span>
            <IconButton
              size="small"
              onClick={handleOpen}
              disabled={disabled}
              sx={ICON_BUTTON_SX}
            >
              <MoreVertIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </IconButton>
          </span>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={MENU_PAPER_PROPS}
        >
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText primary="עריכת לוח" />
          </MenuItem>

          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <DeleteOutlinedIcon sx={{ fontSize: 18, color: "error.main" }} />
            </ListItemIcon>
            <ListItemText primary="מחיקת לוח" />
          </MenuItem>
        </Menu>
      </>
    );
  },
);

BoardOptionsMenu.displayName = "BoardOptionsMenu";
