import Router from "./router/Router";
import Layout from "./layout/Layout";
import { AppProviders } from "./providers/AppProviders";

function App() {
  return (
    <AppProviders>
      <Layout>
        <Router />
      </Layout>
    </AppProviders>
  );
}

export default App;
