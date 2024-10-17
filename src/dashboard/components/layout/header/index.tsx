import React from "react";

import { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";

import { Button, Layout, Space, theme } from "antd";

import { searchClient } from "@/dashboard/providers";
import { useConfigProvider } from "@/dashboard/providers/config-provider";

import { IconMoon, IconSun } from "../../icons";
import { AlgoliaSearch } from "../algolia-search";
import { CurrentUser } from "../current-user";
import { Notifications } from "../notifications";
import { useStyles } from "./styled";

const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const { mode, setMode } = useConfigProvider();
  const { token } = useToken();
  const { styles } = useStyles();
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: searchClient ? "space-between" : "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };

  return (
    <Layout.Header style={headerStyles}>
      {searchClient ? <AlgoliaSearch /> : null}
      <Space align="center" size="middle">
        <Button
          className={styles.themeSwitch}
          type="text"
          icon={mode === "light" ? <IconMoon /> : <IconSun />}
          onClick={() => {
            setMode?.(mode === "light" ? "dark" : "light");
          }}
        />
        <Notifications />
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};
