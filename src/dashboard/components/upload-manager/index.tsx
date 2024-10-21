import React from "react";

import {
  CloseOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  List,
  message,
  Modal,
  Progress,
  Row,
  theme,
  Typography,
  Upload,
} from "antd";

import { useUpload } from "@/dashboard/context";
import {
  hashFileFirstAndLastChunks,
  UploadDataProps,
} from "@/dashboard/routes/files/helper";

interface UploadManagerModalProps {
  visible: boolean;
  closeModal: () => void;
}

export const UploadManagerModal: React.FC<UploadManagerModalProps> = ({
  visible,
  closeModal,
}) => {
  const {
    fileQueue,
    currentFile,
    isUploading,
    uploadProgress,
    uploadRate,
    removeFile,
    setCurrentFile, // To handle file reselection
  } = useUpload();

  const { token } = theme.useToken();

  const handleFileSelect =
    (fileItem: UploadDataProps) =>
    async ({ file }) => {
      // Hash the reselected file and compare it with the stored hash
      const fileHash = await hashFileFirstAndLastChunks(file);

      if (fileHash === fileItem.fileHash) {
        // If the hashes match, set the file object and resume upload
        setCurrentFile({ ...fileItem, fileObject: file });
        message.success("File matched, resuming upload!");
      } else {
        message.error("The selected file does not match the original file!");
      }
    };

  return (
    <Modal
      title="Upload Manager"
      open={visible}
      onCancel={closeModal}
      footer={null}
      centered
      width={600}
      styles={{
        body: {
          padding: "20px",
          backgroundColor: token.colorBgContainer,
        },
      }}
    >
      <List
        dataSource={fileQueue}
        renderItem={(file: UploadDataProps) => (
          <List.Item
            key={file.fileName}
            style={{
              padding: "12px 16px",
              backgroundColor:
                file === currentFile ? token.colorPrimaryBg : undefined,
              borderRadius: "8px",
              marginBottom: "12px",
            }}
            actions={[
              <Button
                danger
                type="text"
                icon={
                  <CloseOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
                onClick={() => removeFile(file.fileName)}
                disabled={file === currentFile && isUploading}
              />,
              ...(!file.fileObject
                ? [
                    <Upload
                      customRequest={handleFileSelect(file)}
                      showUploadList={false}
                    >
                      <Button
                        icon={
                          <UploadOutlined
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        }
                        type="primary"
                        disabled={isUploading}
                      >
                        Reselect File
                      </Button>
                    </Upload>,
                  ]
                : []),
            ]}
          >
            <Row style={{ width: "100%" }} align="middle">
              <Col span={16}>
                <Typography.Text
                  strong
                  ellipsis
                  style={{
                    color:
                      file === currentFile ? token.colorPrimaryText : undefined,
                  }}
                >
                  {file.fileName}
                </Typography.Text>
              </Col>
              <Col span={8} style={{ textAlign: "right" }}>
                {file === currentFile ? (
                  <>
                    <Progress
                      percent={uploadProgress}
                      size="small"
                      strokeColor={token.colorPrimary}
                      style={{ marginBottom: 0 }}
                    />
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: "12px" }}
                    >
                      Uploading at {uploadRate.toFixed(2)} MB/s
                    </Typography.Text>
                  </>
                ) : file.fileObject ? (
                  <Typography.Text type="secondary">Queued</Typography.Text>
                ) : (
                  <Typography.Text type="danger">
                    <ExclamationCircleOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />{" "}
                    File Missing
                  </Typography.Text>
                )}
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography.Text strong>
          Total Files: {fileQueue.length}
        </Typography.Text>
      </div>
    </Modal>
  );
};
