import { Box } from "@mui/material";
import type { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "80vh", // מגדיר גובה עמוד
        backgroundColor: "#f5f5f5", // צבע רקע
        padding: 2,
      }}
    >
      {children}
    </Box>
  );
}

export default Main;
