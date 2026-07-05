import Router from "./router/Router";
import Layout from "./layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { ProjectThemeProvider } from "./providers/ProjectThemeProvider";
import { SnackProvider } from "./providers/SnackProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import { UserProvider } from "./user/providers/UserProvider";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
