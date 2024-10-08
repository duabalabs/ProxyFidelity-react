import { Modal, Spin } from "antd";
import Parse from "parse";

type FilePreviewModalProps = {
  isVisible: boolean;
  file: any; //NOTE change to Parse subclass
  onClose: () => void;
};

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isVisible,
  file,
  onClose,
}) => {
  const name = file?.name ?? "File Content";
  const url = file?.file?.url as unknown as string;
  return (
    <Modal
      open={isVisible}
      title={name}
      onCancel={onClose}
      footer={null}
      width="80%"
    >
      {url ? (
        <>
          {/* Conditionally render appropriate elements based on file type */}
          {url.endsWith(".jpg") ||
          url.endsWith(".jpeg") ||
          url.endsWith(".png") ||
          url.endsWith(".gif") ? (
            <img src={url} alt="Uploaded File" style={{ width: "100%" }} />
          ) : url.endsWith(".pdf") ? (
            <iframe
              src={url}
              title="PDF File"
              style={{ width: "100%", height: "600px" }}
            />
          ) : (
            <p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View or download the file here
              </a>
            </p>
          )}
        </>
      ) : (
        <Spin spinning={true}>Loading...</Spin>
      )}
    </Modal>
  );
};
