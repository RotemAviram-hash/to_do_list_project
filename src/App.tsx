import Router from "./router/Router";
import Layout from "./layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { ProjectThemeProvider } from "./providers/ProjectThemeProvider";
import { SnackProvider } from "./providers/SnackProvider";

import CssBaseline from "@mui/material/CssBaseline";
import { UserProvider } from "./features/user/providers/UserProvider";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <ProjectThemeProvider>
            <CssBaseline />
            <SnackProvider>
              <Layout>
                <Router />
              </Layout>
            </SnackProvider>
          </ProjectThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
