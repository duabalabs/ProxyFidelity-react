import { useEffect, useState } from "react";

import { message, Modal, Spin } from "antd";
import Parse from "parse";

import { ProjectFile } from "../lib";

type FilePreviewModalProps = {
  isVisible: boolean;
  file: ProjectFile;
  onClose: () => void;
};

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isVisible,
  file,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const name = file?.fileName ?? "File Content";

  const isUrlExpired = (expiryDate?: Date): boolean => {
    if (!expiryDate) return true;
    const now = new Date();
    return now >= new Date(expiryDate);
  };

  const fetchPresignedUrl = async () => {
    setLoading(true);

    // Check if presignedUrl exists and is not expired
    if (file.presignedUrl && !isUrlExpired(file.presignedUrlExpiry)) {
      setCurrentUrl(file.presignedUrl);
      setLoading(false);
    } else {
      try {
        // Generate a new presigned URL
        const response = await Parse.Cloud.run(
          "generateReadOnlyPresignedFileUrl",
          {
            filePath: file.filePath,
            fileType: file.fileType,
          }
        );
        const { presignedUrl, expirationDate } = response;

        // Update the file object with the new presignedUrl and expiry date
        file.presignedUrl = presignedUrl;
        file.presignedUrlExpiry = new Date(expirationDate);

        setCurrentUrl(presignedUrl);
        setLoading(false);
      } catch (error) {
        message.error("Failed to generate a download link.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchPresignedUrl();
    }
  }, [isVisible, file]);

  const isImage = /\.(jpg|jpeg|png|gif)(\?.*)?$/i.test(currentUrl);
  const isPdf = /\.(pdf)(\?.*)?$/i.test(currentUrl);
  const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(currentUrl);
  const isAudio = /\.(mp3|wav)(\?.*)?$/i.test(currentUrl);

  return (
    <Modal
      open={isVisible}
      title={name}
      onCancel={onClose}
      footer={null}
      width="80%"
    >
      {currentUrl ? (
        <>
          {isImage ? (
            <img
              src={currentUrl}
              alt="Uploaded File"
              style={{ width: "100%" }}
            />
          ) : isPdf ? (
            <iframe
              src={currentUrl}
              title="PDF File"
              style={{ width: "100%", height: "600px" }}
            />
          ) : isVideo ? (
            <video controls style={{ width: "100%" }}>
              <source src={currentUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : isAudio ? (
            <audio controls style={{ width: "100%" }}>
              <source src={currentUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p>
              <a href={currentUrl} target="_blank" rel="noopener noreferrer">
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
