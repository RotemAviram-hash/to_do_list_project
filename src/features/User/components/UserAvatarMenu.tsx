import { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { EditProfileDialog } from "../dialogs/EditProfileDialog";
import type { UserProfile } from "../models/User";
import { useUser } from "../hooks/useUser"; // 👈 ייבוא ה-Hook לצורך גיבוי

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  onUpdateProfile?: (data: {
    displayName: string;
    photoURL?: string;
    avatarColor?: string;
  }) => Promise<void> | void;
}

export function UserMenu({
  anchorEl,
  open,
  onClose,
  user,

  onLogout,
  onUpdateProfile,
}: UserMenuProps) {
  const { updateProfile } = useUser(); // 👈 גיבוי מה-Context
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 🟢 שימוש בפרופ או בגיבוי מ-Context
  const handleSave = onUpdateProfile || updateProfile;

  const handleOpenEdit = () => {
    setIsEditOpen(true);
    onClose();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout?.();
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 230,
              borderRadius: 2,
              overflow: "visible",
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 16,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", lineHeight: 1.2 }}
            noWrap
          >
            {user.displayName || "משתמש"}
          </Typography>
          {user.email && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ fontSize: "0.8rem", mt: 0.3 }}
            >
              {user.email}
            </Typography>
          )}
        </Box>

        <Divider />

        <MenuItem onClick={handleOpenEdit} sx={{ py: 1 }}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="עריכת שם ותמונה" />
        </MenuItem>

        {onLogout && (
          <>
            <Divider />
            <MenuItem
              onClick={handleLogoutClick}
              sx={{ color: "error.main", py: 1 }}
            >
              <ListItemIcon sx={{ color: "error.main" }}>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="התנתקות" />
            </MenuItem>
          </>
        )}
      </Menu>

      <EditProfileDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialDisplayName={user.displayName || ""}
        initialPhotoURL={user.photoURL || ""}
        initialAvatarColor={user.avatarColor || ""}
        onSave={handleSave} /* 👈 כעת מועברת פונקציה פעילה ובטוחה */
      />
    </>
  );
}
