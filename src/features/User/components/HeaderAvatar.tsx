import React, { useState } from "react";
import { useUser } from "../hooks/useUser"; // עדכני לפי הנתיב בפרויקט
import { UserAvatar } from "./UserAvatar";
import { UserMenu } from "./UserAvatarMenu";

export interface HeaderAvatarProps {
  size?: number;
  onLogout?: () => void;
  onUpdateProfile?: (data: {
    displayName: string;
    photoURL?: string;
    avatarColor?: string;
  }) => Promise<void> | void;
}

export function HeaderAvatar({
  size = 40,
  onLogout,
  onUpdateProfile: customUpdateProfile,
}: HeaderAvatarProps) {
  const { user, updateProfile } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

  const activeUpdateProfile = customUpdateProfile || updateProfile;
  const isMenuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* תצוגת האווטר בלבד */}
      <UserAvatar user={user} size={size} onClick={handleAvatarClick} />

      {/* תפריט המשתמש */}
      <UserMenu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        user={user}
        onLogout={onLogout}
        onUpdateProfile={activeUpdateProfile}
      />
    </>
  );
}
