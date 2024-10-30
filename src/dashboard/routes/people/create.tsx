import { useLocation, useSearchParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
import {
  type CreateResponse,
  type HttpError,
  useCreateMany,
  useGetToPath,
  useGo,
} from "@refinedev/core";
import type { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
  DeleteOutlined,
  LeftOutlined,
  MailOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

import { SelectOptionWithAvatar } from "@/dashboard/components";
import { User, USER_CLASSNAME } from "@/dashboard/lib";

type Props = {
  isOverModal?: boolean;
};

export const PeopleCreatePage = ({ isOverModal }: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const go = useGo();

  const { formProps, modalProps, close, onFinish } = useModalForm<
    User,
    HttpError
  >({
    action: "create",
    defaultVisible: true,
    resource: USER_CLASSNAME,
    redirect: false,
    warnWhenUnsavedChanges: !isOverModal,
    mutationMode: "pessimistic",
    // meta: {
    //   gqlMutation: COMPANY_CREATE_MUTATION,
    // },
  });

  // const { selectProps, queryResult } = useUsersSelect();

  const { mutateAsync: createManyMutateAsync } = useCreateMany({
    resource: "contacts",
    successNotification: false,
  });

  return (
    <Modal
      {...modalProps}
      mask={!isOverModal}
      onCancel={() => {
        close();
        go({
          to:
            searchParams.get("to") ??
            getToPath({
              action: "list",
            }) ??
            "",
          query: {
            to: undefined,
          },
          options: {
            keepQuery: true,
          },
          type: "replace",
        });
      }}
      title="Add new people"
      width={512}
      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
      closeIcon={<LeftOutlined />}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={async (values) => {
          // try {
          //   const data = await onFinish({
          //     name: values.name,
          //     salesOwnerId: values.salesOwnerId,
          //   });
          //   const createdPeople = (data as CreateResponse<People>)?.data;
          //   if ((values.contacts ?? [])?.length > 0) {
          //     await createManyMutateAsync({
          //       values:
          //         values.contacts?.map((contact) => ({
          //           ...contact,
          //           peopleId: createdPeople.id,
          //           salesOwnerId: createdPeople.salesOwner.id,
          //         })) ?? [],
          //     });
          //   }
          //   go({
          //     to: searchParams.get("to") ?? pathname,
          //     query: {
          //       peopleId: createdPeople.id,
          //       to: undefined,
          //     },
          //     options: {
          //       keepQuery: true,
          //     },
          //     type: "replace",
          //   });
          // } catch (error) {
          //   Promise.reject(error);
          // }
        }}
      >
        <Form.Item label="People name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Please enter people name" />
        </Form.Item>
        {/* <Form.Item
          label="Sales owner"
          name="salesOwnerId"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Please sales owner user"
            {...selectProps}
            options={
              queryResult.data?.data?.map((user) => ({
                value: user.id,
                label: (
                  <SelectOptionWithAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl ?? undefined}
                  />
                ),
              })) ?? []
            }
          />
        </Form.Item> */}
        <Form.List name="contacts">
          {(fields, { add, remove }) => (
            <Space direction="vertical">
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={12} align="middle">
                  <Col span={11}>
                    <Form.Item noStyle {...restField} name={[name, "name"]}>
                      <Input
                        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                        addonBefore={<UserOutlined />}
                        placeholder="Contact name"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item noStyle name={[name, "email"]}>
                      <Input
                        // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                        addonBefore={<MailOutlined />}
                        placeholder="Contact email"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button
                      // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Col>
                </Row>
              ))}
              <Typography.Link onClick={() => add()}>
                {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                <PlusCircleOutlined /> Add new contacts
              </Typography.Link>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
