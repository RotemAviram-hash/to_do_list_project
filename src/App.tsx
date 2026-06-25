import Router from "./router/Router";
import Layout from "./layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { ProjectThemeProvider } from "./providers/ProjectThemeProvider";
import { SnackProvider } from "./providers/SnackProvider";
import { UserProvider } from "./providers/UserProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <ProjectThemeProvider>
                <SnackProvider>
                  <Layout>
                    <Router />
                  </Layout>
                </SnackProvider>
              </ProjectThemeProvider>
            </UserProvider>
          </QueryClientProvider>
        </Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
