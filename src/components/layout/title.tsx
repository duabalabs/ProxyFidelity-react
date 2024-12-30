import React, { useState } from "react";

import type { RefineLayoutThemedTitleProps } from "@refinedev/antd";

import { Button, Flex, Space, theme, Typography } from "antd";

import { ProjectSelectorModal } from "@/components";
import { useAppData } from "@/context/app-data";

import { Logo } from "./logo";

const { useToken } = theme;

export const Title: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  wrapperStyles,
}) => {
  const { token } = useToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { activeProject } = useAppData();

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };
  return (
    <div
      style={{
        display: "inline-block",
        textDecoration: "none",
      }}
    >
      <Button onClick={handleOpenModal} type="text">
        <Space
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "inherit",
            ...wrapperStyles,
          }}
        >
          <div
            style={{
              height: "24px",
              width: "24px",
              color: token.colorPrimary,
            }}
          >
            <Logo />
          </div>

          {!collapsed && (
            <Flex vertical>
              <Typography.Title
                style={{
                  fontSize: "inherit",
                  marginBottom: 0,
                  fontWeight: 700,
                }}
              >
                {activeProject?.name}
              </Typography.Title>
              <Typography.Text
                style={{
                  fontSize: "smaller",
                }}
              >
                {"Select Project"}
              </Typography.Text>
            </Flex>
          )}
        </Space>
      </Button>

      <ProjectSelectorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};
