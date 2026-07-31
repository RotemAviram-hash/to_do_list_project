import React, { useState, useCallback } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  alpha,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface BoardOptionsMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

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
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px",
                p: 0.8,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.action.hover, 0.1),
                  borderColor: "text.secondary",
                },
              }}
            >
              <MoreVertIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </IconButton>
          </span>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "12px",
                minWidth: 160,
                mt: 1,
                boxShadow: (theme) => theme.shadows[4],
                border: "1px solid",
                borderColor: "divider",
              },
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <MenuItem onClick={handleEditClick} sx={{ py: 1, px: 1.5 }}>
            <ListItemIcon>
              <EditOutlinedIcon
                sx={{ fontSize: 18, color: "text.secondary" }}
              />
            </ListItemIcon>

            <ListItemText
              primary="עריכת לוח"
              slotProps={{
                primary: {
                  sx: { fontSize: "0.85rem", fontWeight: 500 },
                },
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={handleDeleteClick}
            sx={{
              py: 1,
              px: 1.5,
              color: "error.main",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon>
              <DeleteOutlinedIcon sx={{ fontSize: 18, color: "error.main" }} />
            </ListItemIcon>
            <ListItemText
              primary="מחיקת לוח"
              slotProps={{
                primary: {
                  sx: { fontSize: "0.85rem", fontWeight: 500 },
                },
              }}
            />
          </MenuItem>
        </Menu>
      </>
    );
  },
);

BoardOptionsMenu.displayName = "BoardOptionsMenu";
