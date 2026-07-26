import { Avatar, Badge, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// עיצוב מותאם אישית לנקודת הסטטוס - נקי לחלוטין מצבעים קשיחים
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    // משיכת צבע ההצלחה/סטטוס ישירות מה-Theme שלך
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface UserAvatarProps {
  name?: string;
  src?: string;
  size?: number;
}

export function UserAvatar({
  name = "רותם אבירם",
  src,
  size = 40,
}: UserAvatarProps) {
  // חילוץ האות הראשונה של השם
  const getInitial = (userName: string) => userName.charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // התאמה ל-RTL
        variant="dot"
      >
        <Avatar
          alt={name}
          src={src}
          sx={{
            width: size,
            height: size,
            bgcolor: "text.primary", // מנוהל מה-Theme
            color: "background.default", // מנוהל מה-Theme
            fontWeight: "700",
            fontSize: `${size * 0.4}px`,
            border: "1px solid",
            borderColor: "divider", // מנוהל מה-Theme
          }}
        >
          {!src ? getInitial(name) : null}
        </Avatar>
      </StyledBadge>
    </Box>
  );
}
