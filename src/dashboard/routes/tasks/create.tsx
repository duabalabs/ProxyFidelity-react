import { useSearchParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { Form, Input, Modal } from "antd";

import { useAppData } from "@/dashboard/context";
import { Task, TASK_CLASSNAME } from "@/dashboard/lib";

export const KanbanCreatePage = () => {
  const { activeProject } = useAppData();
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();
  const { formProps, modalProps, close, onFinish } = useModalForm<Task>({
    resource: TASK_CLASSNAME,
    action: "create",
    defaultVisible: true,
    // meta: { gqlMutation: KANBAN_CREATE_TASK_MUTATION },
  });
  const form = formProps.form;

  const handleOnFinish = (values) => {
    formProps?.onFinish?.({
      ...values,
      project: activeProject,
      stage: searchParams.get("stage"),
      users: [],
    });
    // message.success("Transaction added successfully.");
    form.resetFields();
    close();
    list("transaction", "replace");
  };
  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title="Add new card"
      width={512}
    >
      <Form {...formProps} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
