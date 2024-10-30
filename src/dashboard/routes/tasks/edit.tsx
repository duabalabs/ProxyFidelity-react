import { useState } from "react";

import { useModal } from "@refinedev/antd";
import { useNavigation, useShow } from "@refinedev/core";

import {
  AlignLeftOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";

import { Task } from "@/dashboard/lib";

import {
  Accordion,
  CheckListForm,
  CommentForm,
  CommentList,
  DescriptionForm,
  DescriptionHeader,
  DueDateForm,
  DueDateHeader,
  ModalFooter,
  StageForm,
  TitleForm,
  UsersForm,
  UsersHeader,
} from "./components";

export const KanbanEditPage = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>();

  const { list } = useNavigation();
  const { modalProps, close } = useModal({
    modalProps: { open: true },
  });

  const {
    query: { data, isLoading },
  } = useShow<Task>({
    // meta: { gqlQuery: KANBAN_GET_TASK_QUERY },
  });

  const { description, completed, stage, dueDate, users, checkList, title } =
    data?.data ?? {};

  return (
    <Modal
      {...modalProps}
      className="kanban-update-modal"
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title={
        <TitleForm initialValues={{ title }} isLoading={isLoading ?? true} />
      }
      width={586}
      footer={<ModalFooter />}
    >
      <StageForm
        initialValues={{ completed: completed ?? false, stage }}
        isLoading={isLoading}
      />
      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DescriptionHeader description={description} />}
        isLoading={isLoading}
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          initialValues={{ description }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>
      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DueDateHeader dueData={dueDate} />}
        isLoading={isLoading}
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          initialValues={{ dueDate: dueDate ?? undefined }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>
      <Accordion
        accordionKey="users"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<UsersHeader users={users} />}
        isLoading={isLoading}
        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
        icon={<UsergroupAddOutlined />}
        label="Users"
      >
        <UsersForm
          initialValues={{
            userIds: users?.map((user) => ({
              label: user.username,
              value: user.id,
            })),
          }}
          cancelForm={() => setActiveKey(undefined)}
        />
      </Accordion>
      <CheckListForm
        isLoading={isLoading}
        initialValues={{ checklist: checkList }}
      />

      <div
        style={{
          backgroundColor: "#f0f2f5",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          borderBottom: "1px solid #d9d9d9",
        }}
      >
        <CommentForm />
        <CommentList />
      </div>
    </Modal>
  );
};
