import { type FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getValueFromEvent, useModalForm } from "@refinedev/antd";
import { type RedirectAction, useNavigation } from "@refinedev/core";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Progress, Spin, Upload } from "antd";

import { useAppData } from "@/dashboard/context/app-data";
import { ProjectFile } from "@/dashboard/lib/parse";

import { checkUnfinishedUploads, uploadMultipartFile } from "../helper";

type Props = {
  action: "create" | "edit";
  redirect?: RedirectAction;
  onCancel?: () => void;
  onMutationSuccess?: () => void;
  resuming?: boolean; // Add resuming flag
};

export const FilesFormModal: FC<Props> = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
  resuming = false, // Default to false if not provided
}) => {
  const params = useParams<{ id: string }>();
  const { list } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadRate, setUploadRate] = useState<number | null>(null);
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

      try {
        await Promise.all(
          file.map(async (item) => {
            const { name, type, originFileObj } = item;

            // Call upload logic, checking if resuming or new
            const { fileUrl, cdnUrl } = await uploadMultipartFile(
              originFileObj,
              name,
              type,
              activeProject.id,
              setUploadProgress,
              setUploadRate
            );

            // Save file info to Parse after completion
            const projectFile = new ProjectFile({
              url: fileUrl,
              cdnUrl,
              name,
              type,
              project: activeProject,
            } as any);

            await projectFile.save();
          })
        );
        message.success("File(s) uploaded successfully!");

        form.resetFields();
        close();
        list("files", "replace");
      } catch (error) {
        console.error(`Error uploading files`, error);
        message.error("Failed to upload the file(s). Please try again.");
      }
      setLoading(false);
    },
    [activeProject, resuming] // Include resuming as dependency
  );

  const handleBeforeUpload = () => {
    setUploadProgress(0);
    return false;
  };

  useEffect(() => {
    if (resuming) {
      // Preload unfinished uploads if resuming
      const unfinishedUploads = checkUnfinishedUploads();
      if (unfinishedUploads.length > 0) {
        const firstUpload = unfinishedUploads[0]; // Load the first unfinished upload
        form.setFieldsValue({ file: [firstUpload] }); // Set in form
      }
    }
  }, [resuming]);

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
      <Spin spinning={loading}>
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
              defaultFileList={resuming ? checkUnfinishedUploads() : []} // Set default files if resuming
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

          {uploadProgress > 0 && (
            <Form.Item label="Upload Progress">
              <Progress percent={uploadProgress} />
            </Form.Item>
          )}

          {uploadRate !== null && (
            <Form.Item label="Upload Rate">
              <div>{`${uploadRate.toFixed(2)} MB/s`}</div>
            </Form.Item>
          )}
        </Form>
      </Spin>
    </Modal>
  );
};
