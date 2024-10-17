import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import { getValueFromEvent, useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Upload } from "antd";

import { useAppData } from "@/dashboard/context/app-data";

import { UploadProgressModal } from "./unfinished-upload-modal";

export const FilesFormModal = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
}) => {
  const params = useParams<{ id: string }>();
  const { list } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [uploadProgressModalVisible, setUploadProgressModalVisible] =
    useState(false); // Manage the visibility of the progress modal
  const [fileListForUpload, setFileListForUpload] = useState([]); // Files to upload
  const { activeProject } = useAppData();

  const { formProps, modalProps, close, onFinish } = useModalForm({
    resource: "ProjectFile",
    action,
    id: params.id,
    defaultVisible: true,
    redirect,
    warnWhenUnsavedChanges: false,
  });

  const form = formProps.form;

  const handleOnFinish = useCallback(
    async (values) => {
      const { file } = values;
      setLoading(true);
      setFileListForUpload(file); // Set the files for the modal
      setUploadProgressModalVisible(true); // Show the upload progress modal

      try {
        // We will handle the actual upload inside UploadProgressModal
      } catch (error) {
        console.error(`Error uploading files`, error);
        message.error("Failed to upload the file(s). Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [activeProject]
  );

  const handleBeforeUpload = () => {
    setUploadProgressModalVisible(false);
    return false;
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

      {uploadProgressModalVisible && (
        <UploadProgressModal
          fileList={fileListForUpload} // Pass file list for upload
          activeProject={activeProject}
          closeModal={() => setUploadProgressModalVisible(false)}
        />
      )}
    </Modal>
  );
};
