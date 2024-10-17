import { useState } from "react";

import { Button, message, Modal, Progress } from "antd";

import { ProjectFile } from "@/dashboard/lib";

import { uploadMultipartFile } from "../helper";

export const UploadProgressModal = ({
  fileList,
  activeProject,
  closeModal,
}) => {
  // Track progress and rate for each file individually
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadRate, setUploadRate] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const updateProgress = (name, progress) => {
    setUploadProgress((prev) => ({
      ...prev,
      [name]: progress,
    }));
  };

  const updateRate = (name, rate) => {
    setUploadRate((prev) => ({
      ...prev,
      [name]: rate,
    }));
  };

  const resumeUpload = async (fileItem) => {
    const { name, type, originFileObj } = fileItem;

    try {
      setIsUploading(true);
      const { fileUrl, cdnUrl } = await uploadMultipartFile(
        originFileObj,
        name,
        type,
        activeProject.id,
        (progress) => updateProgress(name, progress),
        (rate) => updateRate(name, rate)
      );

      const projectFile = new ProjectFile({
        url: fileUrl,
        cdnUrl,
        name,
        type,
        project: activeProject,
      } as any);

      await projectFile.save();
      message.success(`${name} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading ${name}`, error);
      message.error(`Failed to upload ${name}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={!!fileList.length}
      title="Uploading Files"
      onCancel={closeModal}
      footer={null}
    >
      {fileList.map((fileItem) => (
        <div key={fileItem.name} style={{ marginBottom: "20px" }}>
          <p>{fileItem.name}</p>
          <Progress
            percent={uploadProgress[fileItem.name] || 0} // Display per-file progress
          />
          {isUploading ? (
            <span>Uploading at {uploadRate[fileItem.name] || 0} MB/s...</span>
          ) : (
            <Button
              onClick={() => resumeUpload(fileItem)}
              disabled={isUploading}
            >
              Resume Upload
            </Button>
          )}
        </div>
      ))}
    </Modal>
  );
};
