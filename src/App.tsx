import Router from "./router/Router";
import Layout from "./layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { ProjectThemeProvider } from "./providers/ProjectThemeProvider";
import { SnackProvider } from "./providers/SnackProvider";

import CssBaseline from "@mui/material/CssBaseline";
import { UserProvider } from "./features/User/providers/UserProvider";
import { UsersProvider } from "./features/User/providers/UsersProvider";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <UsersProvider>
            <ProjectThemeProvider>
              <CssBaseline />
              <SnackProvider>
                <Layout>
                  <Router />
                </Layout>
              </SnackProvider>
            </ProjectThemeProvider>
          </UsersProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
