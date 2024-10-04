import { type FC,useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
import {
  type HttpError,
  type RedirectAction,
  useNavigation,
} from "@refinedev/core";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Upload } from "antd";

import { dataProvider } from "@/dashboard/providers";


type Props = {
  action: "create" | "edit";
  redirect?: RedirectAction;
  onMutationSuccess?: () => void;
  onCancel?: () => void;
};

export const FilesFormModal: FC<Props> = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
}) => {
  const { pathname } = useLocation();
  const params = useParams<{ id: string }>();
  const { list } = useNavigation();
  const [loading, setLoading] = useState(false)

  const { formProps, modalProps, close } = useModalForm({
    resource: "files",
    action,
    id: params.id,
    defaultVisible: true,
    redirect,
    meta: {
      async onFinish(values) {
        try {
          if (action === "create") {
            await dataProvider.create({
              resource: "files",
              variables: values,
            });
          } else if (action === "edit") {
            await dataProvider.update({
              resource: "files",
              id: params.id!,
              variables: values,
            });
          }

          onMutationSuccess?.();
        } catch (error) {
          console.error("Error submitting the form:", error);
        }
      },
    },
  });

  const form = formProps.form;

  const handleFileChange = ({ file }) => {
    console.log(form.getFieldsValue());
    console.log(file);
    console.log(file.status);

      const { name, type } = file;
      console.log(form.getFieldsValue());
      form.setFieldsValue({
        name: name,
        type: type,
      });
  };

  return (
    <Modal
      {...modalProps}
      confirmLoading={loading}
      width={560}
      onCancel={() => {
        if (onCancel) {
          onCancel();
          return;
        }
        close();
        list("files", "replace");
      }}
    >
      <Spin spinning={loading}>
        <Form {...formProps} layout="vertical">
          <Form.Item label="Upload File" rules={[{ required: true }]}>
            <Upload
              beforeUpload={() => false} // Prevent auto-upload
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="name"
            label="File Name"
          >
            <Input placeholder="Please enter file name" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="type"
            label="File Type"
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} placeholder="Enter any notes about the file" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
