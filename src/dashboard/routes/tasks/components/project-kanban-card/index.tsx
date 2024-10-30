import { memo, useMemo } from "react";

import { useDelete, useNavigation } from "@refinedev/core";

import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MessageOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Skeleton,
  Space,
  Tag,
  theme,
  Tooltip,
} from "antd";
import dayjs from "dayjs";

import { CustomAvatar, Text, TextIcon } from "@/dashboard/components";
import { Task } from "@/dashboard/lib";
import { getDateColor } from "@/utilities";

type ProjectCardProps = {
  task: Task;
};

export const ProjectCard = ({ task }: ProjectCardProps) => {
  const { id, title, checkList, comments, dueDate, users } = task;

  const { token } = theme.useToken();
  const { edit } = useNavigation();
  const { mutate } = useDelete();

  const dropdownItems = useMemo(() => {
    const dropdownItems: MenuProps["items"] = [
      {
        label: "View card",
        key: "1",
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <EyeOutlined />,
        onClick: () => {
          edit("tasks", id, "replace");
        },
      },
      {
        danger: true,
        label: "Delete card",
        key: "2",
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon: <DeleteOutlined />,
        onClick: () => {
          mutate({
            resource: "tasks",
            id,
            meta: {
              operation: "task",
            },
          });
        },
      },
    ];

    return dropdownItems;
  }, []);

  const dueDateOptions = useMemo(() => {
    if (!dueDate) return null;

    const date = dayjs(dueDate);

    return {
      color: getDateColor({ date: dueDate }) as string,
      text: date.format("MMM D"),
    };
  }, [dueDate]);

  const checkListCompletionCountOptions = useMemo(() => {
    const hasCheckList = checkList && checkList.length > 0;
    if (!hasCheckList) {
      return null;
    }

    const total = checkList.length;
    const checked = checkList?.filter((item) => item.checked).length;

    const defaulOptions = {
      color: "default",
      text: `${checked}/${total}`,
      allCompleted: false,
    };

    if (checked === total) {
      defaulOptions.color = "success";
      defaulOptions.allCompleted = true;
      return defaulOptions;
    }

    return defaulOptions;
  }, [checkList]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            colorText: token.colorTextSecondary,
          },
          Card: {
            headerBg: "transparent",
          },
        },
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{ tooltip: title }}>{title}</Text>}
        onClick={() => {
          edit("tasks", id, "replace");
        }}
        extra={
          <Dropdown
            trigger={["click"]}
            menu={{
              items: dropdownItems,
              onPointerDown: (e) => {
                e.stopPropagation();
              },
              onClick: (e) => {
                e.domEvent.stopPropagation();
              },
            }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="text"
              shape="circle"
              icon={
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                <MoreOutlined
                  style={{
                    transform: "rotate(90deg)",
                  }}
                />
              }
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Dropdown>
        }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TextIcon
            style={{
              marginRight: "4px",
            }}
          />
          {!!comments?.length && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
              <MessageOutlined
                style={{
                  color: token.colorTextSecondary,
                  fontSize: "12px",
                }}
              />
              <Text size="xs" type="secondary">
                {comments.length}
              </Text>
            </div>
          )}
          {dueDateOptions && (
            <Tag
              icon={
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                <ClockCircleOutlined
                  style={{
                    fontSize: "12px",
                  }}
                />
              }
              style={{
                padding: "0 4px",
                marginInlineEnd: "0",
                backgroundColor:
                  dueDateOptions.color === "default" ? "transparent" : "unset",
              }}
              color={dueDateOptions.color}
              bordered={dueDateOptions.color !== "default"}
            >
              {dueDateOptions.text}
            </Tag>
          )}
          {checkListCompletionCountOptions && (
            <Tag
              icon={
                // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                <CheckSquareOutlined
                  style={{
                    fontSize: "12px",
                  }}
                />
              }
              style={{
                padding: "0 4px",
                marginInlineEnd: "0",
                backgroundColor:
                  checkListCompletionCountOptions.color === "default"
                    ? "transparent"
                    : "unset",
              }}
              color={checkListCompletionCountOptions.color}
              bordered={checkListCompletionCountOptions.color !== "default"}
            >
              {checkListCompletionCountOptions.text}
            </Tag>
          )}
          {!!users?.length && (
            <Space
              size={4}
              wrap
              direction="horizontal"
              align="center"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginLeft: "auto",
                marginRight: "0",
              }}
            >
              {users.map((user) => {
                return (
                  <Tooltip key={user.id} title={user.username}>
                    <CustomAvatar name={user.username} src={user.avatarUrl} />
                  </Tooltip>
                );
              })}
            </Space>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <Card
      size="small"
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
      }}
      title={
        <Skeleton.Button
          active
          size="small"
          style={{
            width: "200px",
            height: "22px",
          }}
        />
      }
    >
      <Skeleton.Button
        active
        size="small"
        style={{
          width: "200px",
        }}
      />
      <Skeleton.Avatar active size="small" />
    </Card>
  );
};

export const ProjectCardMemo = memo(ProjectCard, (prev, next) => {
  return (
    prev.task.id === next.task.id &&
    prev.task.title === next.task.title &&
    prev.task.dueDate === next.task.dueDate &&
    prev.task.comments?.length === next.task.comments?.length &&
    prev.task.checkList?.length === next.task.checkList?.length &&
    prev.task.users?.length === next.task.users?.length
  );
});
