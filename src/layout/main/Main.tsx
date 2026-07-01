import { Box } from "@mui/material";
import type { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: "background.default",
        padding: 2,
      }}
    >
      {children}
    </Box>
  );
}

export default Main;
