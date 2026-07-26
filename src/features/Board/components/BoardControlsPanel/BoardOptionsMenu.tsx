import React, { useState } from "react";
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
}

export const BoardOptionsMenu: React.FC<BoardOptionsMenuProps> = ({
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="אפשרויות לוח">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "10px",
            p: 0.8,
          }}
        >
          <MoreVertIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { borderRadius: "12px", minWidth: 150, mt: 1, boxShadow: 4 },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit?.();
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText primary="עריכת לוח" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onDelete?.();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteOutlinedIcon sx={{ fontSize: 18, color: "error.main" }} />
          </ListItemIcon>
          <ListItemText primary="מחיקת לוח" />
        </MenuItem>
      </Menu>
    </>
  );
};
