import { BrowserRouter } from "react-router-dom";

import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";

import { App as AntdApp } from "antd";

import Dashboard from "./dashboard";
import { AlgoliaSearchWrapper } from "./dashboard/components";
import { ConfigProvider } from "./dashboard/providers/config-provider";
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
        <ConfigProvider>
          <AntdApp>
            <DevtoolsProvider>
              
              {hostname === 'my.proxyfidelity.duckdns.org' || hostname === "178.128.162.225" ? (
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
