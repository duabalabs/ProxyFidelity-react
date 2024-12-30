import { ReactNode } from "react";

import { Grid, Layout as AntdLayout } from "antd";

import { useUpload } from "@/context";

import { UploadFloatingActionButton } from "../floating-file-upload-button";
import { UploadManagerModal } from "../upload-manager";
import { Header } from "./header";
import { Sider } from "./sider";

interface HomeProps {
  children: ReactNode;
}

export const Home: React.FC<HomeProps> = ({ children }) => {
  const breakpoint = Grid.useBreakpoint();

  const { openUploadManager, closeUploadManager, isUploadManagerVisible } =
    useUpload();

  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;
  return (
    <>
      <Sider />
      <AntdLayout>
        <Header />
        <UploadFloatingActionButton openUploadManager={openUploadManager} />
        <AntdLayout.Content
          style={{
            padding: isSmall ? 32 : 16,
          }}
        >
          {children}
        </AntdLayout.Content>
      </AntdLayout>
      <UploadManagerModal
        visible={isUploadManagerVisible}
        closeModal={closeUploadManager}
      />
    </>
  );
};
