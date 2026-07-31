import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import {
  Snackbar,
  Box,
  Typography,
  IconButton,
  Slide,
  type SlideProps,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export type SnackColor = "success" | "error" | "warning" | "info";

interface SnackContextType {
  raiseSnack: (color: SnackColor, message: string, delay?: number) => void;
  showSuccess: (message: string, delay?: number) => void;
  showError: (message: string, delay?: number) => void;
  showWarning: (message: string, delay?: number) => void;
  showInfo: (message: string, delay?: number) => void;
}

const SnackContext = createContext<SnackContextType | undefined>(undefined);

function SlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const STATUS_CONFIG = {
  success: {
    icon: CheckCircleRoundedIcon,
    color: "#10b981",
    bgTint: "rgba(16, 185, 129, 0.12)",
  },
  error: {
    icon: ErrorRoundedIcon,
    color: "#ef4444",
    bgTint: "rgba(239, 68, 68, 0.12)",
  },
  warning: {
    icon: WarningRoundedIcon,
    color: "#f59e0b",
    bgTint: "rgba(245, 158, 11, 0.12)",
  },
  info: {
    icon: InfoRoundedIcon,
    color: "#3b82f6",
    bgTint: "rgba(59, 130, 246, 0.12)",
  },
};

export function SnackProvider({ children }: { children: ReactNode }) {
  const [isSnackOpen, setOpenSnack] = useState(false);
  const [snackColor, setSnackColor] = useState<SnackColor>("success");
  const [snackMessage, setSnackMessage] = useState("");
  const [delay, setDelay] = useState(4000);

  const raiseSnack = useCallback(
    (color: SnackColor, message: string, delay = 4000) => {
      setSnackColor(color);
      setSnackMessage(message);
      setDelay(delay);
      setOpenSnack(true);
    },
    [],
  );

  const showSuccess = useCallback(
    (msg: string, d?: number) => raiseSnack("success", msg, d),
    [raiseSnack],
  );
  const showError = useCallback(
    (msg: string, d?: number) => raiseSnack("error", msg, d),
    [raiseSnack],
  );
  const showWarning = useCallback(
    (msg: string, d?: number) => raiseSnack("warning", msg, d),
    [raiseSnack],
  );
  const showInfo = useCallback(
    (msg: string, d?: number) => raiseSnack("info", msg, d),
    [raiseSnack],
  );

  const handleClose = useCallback(
    (_?: SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") return;
      setOpenSnack(false);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ raiseSnack, showSuccess, showError, showWarning, showInfo }),
    [raiseSnack, showSuccess, showError, showWarning, showInfo],
  );

  const CurrentIcon = STATUS_CONFIG[snackColor].icon;
  const activeColor = STATUS_CONFIG[snackColor].color;
  const activeBgTint = STATUS_CONFIG[snackColor].bgTint;

  return (
    <SnackContext.Provider value={contextValue}>
      {children}

      <Snackbar
        /* ⚡ מיקוד במרכז למטה (אפשר לשנות ל-"left" אם תרצי בצד שמאל) */
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={isSnackOpen}
        onClose={handleClose}
        autoHideDuration={delay}
        slots={{ transition: SlideUp }}
        sx={{ bottom: { xs: 20, sm: 32 } }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: "260px",
            maxWidth: "400px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
            color: "text.primary",
            px: 2,
            py: 1.25,
            borderRadius: "999px",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(226, 232, 240, 0.8)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0.75,
              borderRadius: "50%",
              bgcolor: activeBgTint,
              color: activeColor,
              flexShrink: 0,
            }}
          >
            <CurrentIcon sx={{ fontSize: 20 }} />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              flexGrow: 1,
              fontSize: "0.875rem",
              color: "text.primary",
              letterSpacing: "0.1px",
            }}
          >
            {snackMessage}
          </Typography>

          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              p: 0.5,
              borderRadius: "50%",
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.04)",
              },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Snackbar>
    </SnackContext.Provider>
  );
}

export const useSnack = () => {
  const context = useContext(SnackContext);
  if (!context) {
    throw new Error("useSnack must be used within a SnackProvider");
  }
  return context;
};
