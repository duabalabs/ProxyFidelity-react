import React from "react";

import { ThemedLayoutContextProvider } from "@refinedev/antd";

import { Layout as AntdLayout } from "antd";

import { UploadProvider } from "@/dashboard/context";
import { AppDataProvider } from "@/dashboard/context/app-data";

import { Home } from "./home";

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemedLayoutContextProvider>
      <AntdLayout hasSider style={{ minHeight: "100vh" }}>
        <AppDataProvider>
          <UploadProvider>
            <Home>{children}</Home>
          </UploadProvider>
        </AppDataProvider>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
