import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import { getValueFromEvent, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Upload } from "antd";

import { useAppData } from "@/dashboard/context/app-data";
import { useUpload } from "@/dashboard/context/upload-data"; // Import the upload context

export const FilesFormModal = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
}) => {
  const params = useParams<{ id: string }>();
  const { list } = useNavigation();
  const [loading, setLoading] = useState(false);
  const { activeProject } = useAppData();
  const { addFiles } = useUpload();

  const { formProps, modalProps, close, onFinish } = useModalForm({
    resource: "ProjectFile",
    action,
    id: params.id,
    defaultVisible: true,
    redirect,
    warnWhenUnsavedChanges: false,
  });

  const form = formProps.form;

  // Handle the form submission and adding files to the upload queue
  const handleOnFinish = useCallback(
    async (values) => {
      const { file } = values;
      setLoading(true);

      try {
        // Add selected files to the upload queue with the project ID
        addFiles(
          file.map((f) => f.originFileObj),
          activeProject.id
        );
        message.success("Files added to upload queue.");
        form.resetFields(); // Reset the form after successful addition
        close(); // Close the modal after files are added to the queue
        list("files", "replace"); // Refresh the file list
      } catch (error) {
        console.error(`Error adding files to upload queue`, error);
        message.error("Failed to add the file(s) to the upload queue.");
      } finally {
        setLoading(false);
      }
    },
    [activeProject, addFiles, form, close, list]
  );

  const handleBeforeUpload = () => {
    return false; // Prevent default auto-upload behavior
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
        form.resetFields();
        close();
        list("files", "replace");
      }}
    >
      <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
        <Form.Item
          name="file"
          getValueFromEvent={getValueFromEvent}
          label="Upload Files"
        >
          <Upload
            multiple
            beforeUpload={handleBeforeUpload}
            listType="text"
            maxCount={10}
          >
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
      </Form>
    </Modal>
  );
};
