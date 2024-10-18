import React from "react";

import { Button, Progress, theme, Typography } from "antd";

import { useUpload } from "@/dashboard/context";

interface UploadFloatingActionButtonProps {
  openUploadManager: () => void;
}

export const UploadFloatingActionButton: React.FC<
  UploadFloatingActionButtonProps
> = ({ openUploadManager }) => {
  const { currentFile, fileQueue, uploadProgress, uploadRate } = useUpload();
  const { token } = theme.useToken(); // Get the current theme token for dark/light mode colors

  if (fileQueue?.length === 0) return null;

  // Handle file name trimming
  const fileName = !currentFile?.fileName
    ? "Upload Manager"
    : currentFile.fileName?.length > 15
    ? `${currentFile.fileName.slice(0, 12)}...${currentFile.fileName
        .split(".")
        .pop()}`
    : currentFile.fileName;

  return (
    <div
      onClick={openUploadManager}
      style={{
        position: "fixed",
        bottom: "50px",
        right: "50px",
        zIndex: 999,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", // Raised button effect
        borderRadius: "50%",
        background: token.colorBgContainer, // Use theme background color
        padding: "12px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "80px", // Larger width to accommodate the text inside the circle
          height: "80px",
        }}
      >
        {/* Progress circle */}
        <Progress
          type="circle"
          percent={uploadProgress}
          size={80}
          strokeColor={token.colorPrimary} // Dynamic progress color based on the theme
          format={() => (
            <Typography.Text
              style={{
                fontSize: "10px",
                color: token.colorText, // Dynamic text color based on theme
              }}
            >
              {fileName}
            </Typography.Text>
          )}
        />

        {/* Invisible button overlaid for interaction */}
        <Button
          shape="circle"
          onClick={openUploadManager}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80px",
            height: "80px",
            border: "none",
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none", // Disable interaction with the button to prevent interference with modal trigger
          }}
        >
          {/* Upload rate under the progress */}
          <Typography.Text
            style={{
              fontSize: "10px",
              color: token.colorTextSecondary, // Dynamic secondary text color
              marginTop: "4px",
              position: "absolute",
              bottom: "-20px", // Place the rate just below the button
              width: "100%",
              textAlign: "center",
            }}
          >
            {uploadRate.toFixed(2)} MB/s
          </Typography.Text>
        </Button>
      </div>
    </div>
  );
};
