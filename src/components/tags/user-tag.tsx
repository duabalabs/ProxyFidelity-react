import type { FC } from "react";

import { Space, Tag } from "antd";

import { User } from "@/lib";

import { CustomAvatar } from "../custom-avatar";

type Props = {
  user: User;
};

export const UserTag: FC<Props> = ({ user }) => {
  return (
    <Tag
      key={user.id}
      style={{
        padding: 2,
        paddingRight: 8,
        borderRadius: 24,
        lineHeight: "unset",
        marginRight: "unset",
      }}
    >
      <Space size={4}>
        <CustomAvatar
          src={user.avatarUrl}
          name={user.username}
          style={{ display: "inline-flex" }}
        />
        {user.username}
      </Space>
    </Tag>
  );
};
