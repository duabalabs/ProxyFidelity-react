import { type FC, useState } from "react";
import { useParams } from "react-router-dom";

import { getValueFromEvent, useModalForm } from "@refinedev/antd";
import {
  file2Base64,
  type RedirectAction,
  useNavigation,
} from "@refinedev/core";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin, Upload } from "antd";
import Parse from "parse";

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
  const params = useParams<{ id: string }>();
  const { list } = useNavigation();
  const [loading, setLoading] = useState(false);

  const { formProps, modalProps, close, onFinish } = useModalForm({
    resource: "files",
    action,
    id: params.id,
    defaultVisible: true,
    redirect
  });

  const handleOnFinish = async (values) => {
    const { file, notes } = values;
    setLoading(true);
    await Promise.all(file.forEach(async (item) => {
      const { name, type, originFileObj } = item;
      try {
        const parseFile = new Parse.File(name, originFileObj);
        await parseFile.save(); // Save the file to Parse first
        onFinish({
          name,
          type,
          file: parseFile,
        });
      } catch (error) {
        console.error(`Error uploading ${name}`, error);
      }
    }));
    setLoading(false);
      onMutationSuccess?.();
  };

  const handleFileChange = async ({ file }) => {
    // if (file.status !== 'uploading') {
    //   console.log(file);
    // }
    // const { name, type, originFileObj } = file;
    // console.log(file);
    // console.log(file.status);
    // console.log(originFileObj);
    // form.setFieldsValue({
    //   name: name,
    //   type: type,
    // });
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
        <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
          <Form.Item
            name="file"
            getValueFromEvent={getValueFromEvent}
            label="Upload File"
            rules={[{ required: true }]}
          >
            <Upload beforeUpload={() => false} onChange={handleFileChange}>
              <Button
                icon={
                  <UploadOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              >
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>
          {/* <Form.Item name="notes" label="Notes">
            <Input.TextArea
              rows={4}
              placeholder="Enter any notes about the file"
            />
          </Form.Item> */}
        </Form>
      </Spin>
    </Modal>
  );
};
