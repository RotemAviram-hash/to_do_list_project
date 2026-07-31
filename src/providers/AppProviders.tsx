import React from "react";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { UserProvider } from "../features/User/providers/UserProvider";
import { UsersProvider } from "../features/User/providers/UsersProvider";
import { ProjectThemeProvider } from "./ProjectThemeProvider";
import { SnackProvider } from "./SnackProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <UserProvider>
        <UsersProvider>
          <ProjectThemeProvider>
            <CssBaseline />
            <SnackProvider>{children}</SnackProvider>
          </ProjectThemeProvider>
        </UsersProvider>
      </UserProvider>
    </BrowserRouter>
  );
};
