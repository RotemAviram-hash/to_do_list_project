import { Box } from "@mui/material";
import type { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  );
}

export default Main;
