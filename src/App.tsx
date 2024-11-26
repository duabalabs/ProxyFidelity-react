import { BrowserRouter } from "react-router-dom";

import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";

import { App as AntdApp, ConfigProvider as AntdConfigProvider } from "antd";

import Dashboard from "./dashboard";
import { AlgoliaSearchWrapper } from "./dashboard/components";
import { ConfigProvider } from "./dashboard/providers/config-provider";

import "./utilities/init-dayjs";
import "@refinedev/antd/dist/reset.css";
import "./styles/antd.css";
import "./styles/fc.css";
import "./styles/index.css";
import "./styles/layout.css";
import "./styles/oldbootstrap.css";

const App: React.FC = () => {
  return (
    <AlgoliaSearchWrapper>
      <BrowserRouter>
        <ConfigProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Dashboard />
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </AlgoliaSearchWrapper>
  );
};

export default App;
