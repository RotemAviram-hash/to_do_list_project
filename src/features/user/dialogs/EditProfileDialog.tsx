import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  Tooltip,
  InputAdornment,
} from "@mui/material";

// אייקונים
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  initialDisplayName?: string;
  initialPhotoURL?: string;
  initialAvatarColor?: string;
  onSave?: (data: {
    displayName: string;
    photoURL?: string;
    avatarColor?: string;
  }) => Promise<void> | void;
}

// פלטת צבעים שמחה, חיה ותוססת! 🌈
const VIBRANT_COLORS = [
  "#4F46E5", // אינדיגו חשמלי
  "#06B6D4", // טורקיז/ציאן זוהר
  "#10B981", // ירוק אמרלד רענן
  "#FF6B6B", // קורל/אלמוג תוסס
  "#F59E0B", // צהוב-זהב שמשי
  "#EC4899", // ורוד פופ כיפי
  "#8B5CF6", // סגול ויולט עמוק
  "#F97316", // כתום תפוז אנרגטי
];

export function EditProfileDialog({
  open,
  onClose,
  initialDisplayName = "",
  initialPhotoURL = "",
  initialAvatarColor,
  onSave,
}: EditProfileDialogProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const defaultColor = VIBRANT_COLORS[0];

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [photoURL, setPhotoURL] = useState(initialPhotoURL);
  const [avatarColor, setAvatarColor] = useState(
    initialAvatarColor || defaultColor,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayName(initialDisplayName);
      setPhotoURL(initialPhotoURL);
      setAvatarColor(initialAvatarColor || defaultColor);
    }
  }, [
    open,
    initialDisplayName,
    initialPhotoURL,
    initialAvatarColor,
    defaultColor,
  ]);

  // האות הראשונה של השם לתצוגה המקדימה
  const initialLetter = displayName.trim()
    ? displayName.trim().charAt(0).toUpperCase()
    : "?";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({ displayName, photoURL, avatarColor });
      }
      onClose();
    } catch (error) {
      console.error("נכשלה עדכון פרטי המשתמש:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 1.5,
            boxShadow: isDark
              ? "0 20px 40px rgba(0,0,0,0.6)"
              : "0 20px 40px rgba(0,0,0,0.12)",
            backgroundImage: "none",
          },
        },
      }}
    >
      {/* כותרת מודרנית עם כפתור סגירה */}
      <DialogTitle
        sx={{
          m: 0,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: "1.2rem",
        }}
      >
        עריכת פרטי פרופיל
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={3}>
          {/* תצוגה מקדימה חיה של האווטאר */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 2,
              px: 3,
              borderRadius: 3,
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: "1px dashed",
              borderColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.08)",
            }}
          >
            <Avatar
              src={photoURL}
              alt={displayName}
              sx={{
                width: 76,
                height: 76,
                bgcolor: avatarColor,
                color: "#ffffff",
                fontSize: "2rem",
                fontWeight: 700,
                boxShadow: `0 8px 22px ${avatarColor}66`,
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                mb: 1,
              }}
            >
              {!photoURL ? initialLetter : null}
            </Avatar>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              תצוגה מקדימה בלייב
            </Typography>
          </Box>

          {/* שדות קלט */}
          <Stack spacing={2}>
            <TextField
              label="שם תצוגה"
              fullWidth
              variant="outlined"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2.5 },
                },
              }}
            />

            <TextField
              label="קישור לתמונה (URL)"
              fullWidth
              variant="outlined"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2.5 },
                },
              }}
            />
          </Stack>

          {/* סקציית בחירת צבע תוסס */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ColorLensOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                צבע פרופיל
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.2,
                justifyContent: "flex-start",
              }}
            >
              {VIBRANT_COLORS.map((color) => {
                const isSelected =
                  avatarColor.toLowerCase() === color.toLowerCase();
                return (
                  <Box
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      bgcolor: color,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition:
                        "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s",
                      boxShadow: isSelected
                        ? `0 4px 14px ${color}99`
                        : "0 2px 5px rgba(0,0,0,0.1)",
                      transform: isSelected ? "scale(1.18)" : "scale(1)",
                      outline: isSelected
                        ? `2px solid ${theme.palette.text.primary}`
                        : "none",
                      outlineOffset: 2,
                      "&:hover": {
                        transform: isSelected ? "scale(1.2)" : "scale(1.1)",
                      },
                    }}
                  >
                    {isSelected && (
                      <CheckIcon sx={{ fontSize: 18, color: "#ffffff" }} />
                    )}
                  </Box>
                );
              })}

              {/* דוגם צבע מותאם אישית */}
              <Tooltip title="צבע מותאם אישית" arrow placement="top">
                <Box
                  component="label"
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "conic-gradient(from 180deg, #FF453A, #FF9F0A, #FFD60A, #30D158, #64D2FF, #0A84FF, #BF5AF2, #FF453A)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.1)" },
                    position: "relative",
                    overflow: "hidden",
                    border: "2px solid #fff",
                  }}
                >
                  <input
                    type="color"
                    value={avatarColor}
                    onChange={(e) => setAvatarColor(e.target.value)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 1.5, pt: 0, gap: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            borderRadius: 2.5,
            px: 2.5,
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving}
          sx={{
            borderRadius: 2.5,
            px: 3.5,
            py: 1,
            fontWeight: 700,
            boxShadow: `0 4px 14px ${avatarColor}66`,
            bgcolor: avatarColor,
            color: "#ffffff",
            "&:hover": {
              bgcolor: avatarColor,
              filter: "brightness(0.9)",
              boxShadow: `0 6px 18px ${avatarColor}88`,
            },
          }}
        >
          {isSaving ? "שומר..." : "שמירה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
