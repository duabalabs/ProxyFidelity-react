import { FC } from "react";

import { Card, Space } from "antd";

import { CustomAvatar, Text } from "@/dashboard/components";
import { User } from "@/dashboard/lib";

type Props = {
  people: User;
};

export const PeopleCard: FC<Props> = ({ people }) => {
  return (
    <Card size="small">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CustomAvatar
          name={people.username}
          src={people.avatarUrl}
          shape="square"
          size="large"
        />
        <Text strong>{people.username}</Text>
        <Space direction="vertical">
          <Text>{people.email}</Text>
          <Text type="secondary">{people.role.name}</Text>
        </Space>
      </div>
    </Card>
  );
};
