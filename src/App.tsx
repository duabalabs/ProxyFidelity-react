import { BrowserRouter } from "react-router-dom";

import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";

import { App as AntdApp, ConfigProvider } from "antd";

import { themeConfig } from "@/config";

import Dashboard from "./dashboard";
import { AlgoliaSearchWrapper } from "./dashboard/components";
import LandingPage from "./landing-page";

import "./utilities/init-dayjs";
import "@refinedev/antd/dist/reset.css";
import "./styles/antd.css";
import "./styles/fc.css";
import "./styles/index.css";
import "./styles/layout.css"
import "./styles/oldbootstrap.css"

const App: React.FC = () => {
  const hostname = window.location.hostname;

  return (
    <AlgoliaSearchWrapper>
      <BrowserRouter>
        <ConfigProvider theme={themeConfig}>
          <AntdApp>
            <DevtoolsProvider>
              
              {hostname === 'my.proxyfidelity.duckdns.org' ? (
                <>
                  {/* Dashboard Routes */}
                  <Dashboard />
                </>
              ) : (
                <>
                  {/* Landing Page Routes */}
                  <LandingPage />
                </>
              )}
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </AlgoliaSearchWrapper>
  );
};

export default App;
